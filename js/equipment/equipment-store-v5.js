(() => {
  'use strict';

  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-PT').trim();
  const sources = window.EquipmentSourcesV5 || {};
  const symptomLibrary = Array.isArray(window.EquipmentSymptomsV5) ? window.EquipmentSymptomsV5 : [];
  const operationalMatrix = window.EquipmentOperationalSymptomsV5 || null;
  const photoRegistry = window.EquipmentPhotoRegistryV5 || null;
  const baseItems = Array.isArray(window.EquipmentCatalogV5Base) ? window.EquipmentCatalogV5Base : [];

  const categoryDescriptions = Object.freeze({
    Vitrines: 'Equipamento refrigerado para conservação e exposição de bebidas embaladas no ponto de venda. A identificação exata do modelo deve ser confirmada pela placa do equipamento antes de utilizar valores técnicos específicos.',
    Postmix: 'Sistema de dispensing post-mix para preparação e serviço de bebidas a partir de água, CO2 e concentrado ou xarope. A configuração instalada deve ser confirmada antes de associar componentes ou especificações.',
    Vending: 'Máquina automática de venda de bebidas com seleção, canais de entrega e meios de pagamento. A configuração de pagamento, capacidade e fabricante pode variar entre unidades.',
    Freestyle: 'Sistema digital de dispensing multibebidas com seleção eletrónica e circuitos de água, CO2 e ingredientes. O modelo e a configuração instalada devem ser confirmados antes de qualquer intervenção.',
    Monster: 'Cooler refrigerado destinado à conservação e exposição de bebidas. O modelo físico deve ser confirmado pela identificação da unidade instalada.',
    Outros: 'Módulo auxiliar associado a sistemas de dispensing. A função exata depende da configuração instalada e deve ser confirmada pela identificação física do equipamento.'
  });

  const subcategoryDescriptions = Object.freeze({
    'Vitrine vertical': 'Vitrine refrigerada vertical para conservação e exposição de bebidas embaladas. Na triagem operacional são relevantes alimentação elétrica, frio, iluminação, ruído, porta/fecho, fugas e integridade física.',
    'Vitrine horizontal / arca': 'Equipamento refrigerado horizontal para conservação e exposição de bebidas. A triagem deve considerar alimentação, frio, ruído, tampa/fecho, fugas e integridade física.',
    'Frigorífico de apoio': 'Frigorífico de apoio destinado à conservação refrigerada de bebidas ou produto de serviço. A triagem deve considerar alimentação, frio, ruído, porta/fecho, fugas e integridade física.',
    'Post-mix': 'Equipamento de dispensing post-mix integrado num circuito de água, CO2 e concentrado/xarope. A triagem operacional deve seguir o sintoma observado e a configuração efetivamente instalada.',
    'Módulo / auxiliar': 'Módulo auxiliar de um sistema de dispensing. A função pode envolver água, CO2, produto, refrigeração ou componentes de apoio, conforme a instalação.',
    Vending: 'Máquina automática de venda de bebidas com seleção, canais de entrega e meios de pagamento. A triagem deve separar falhas de refrigeração, venda, pagamento, entrega e integridade física.',
    Freestyle: 'Dispensador digital multibebidas com seleção eletrónica e circuitos de água, CO2 e ingredientes. A triagem deve distinguir alimentação, refrigeração, ingredientes, seleção e saída de bebida.',
    'Cooler Monster': 'Cooler refrigerado para conservação e exposição de bebidas, sujeito às verificações operacionais de alimentação, frio, porta/fecho, ruído, fugas e integridade física.'
  });

  const genericInventoryDescription = /^Modelo presente no inventário do projeto\./i;

  function catalogDescription(item) {
    const specific = String(item.shortDescription || '').trim();
    if (specific && !genericInventoryDescription.test(specific)) return specific;
    return subcategoryDescriptions[item.subcategory]
      || categoryDescriptions[item.category]
      || 'Equipamento presente no inventário operacional. A identificação física da unidade deve ser confirmada antes de associar dados técnicos específicos.';
  }

  function descriptionOrigin(item) {
    const specific = String(item.shortDescription || '').trim();
    return specific && !genericInventoryDescription.test(specific) ? 'SOURCE_OR_MODEL' : 'OPERATIONAL_CATEGORY';
  }

  const symptomsFor = item => symptomLibrary.filter(symptom => {
    if (symptom.appliesToModels?.includes(item.slug)) return true;
    if (!symptom.appliesToCategories?.includes(item.category)) return false;
    if (symptom.manufacturerIncludes && !String(item.manufacturer || '').toLowerCase().includes(symptom.manufacturerIncludes.toLowerCase())) return false;
    return true;
  });

  const operationalGroupsFor = item => operationalMatrix?.groupsForItem?.(item) || operationalMatrix?.groupsForCategory?.(item.category) || [];

  const normalizedValidation = (item, symptoms) => {
    if (symptoms.some(value => value.validationLevel === 'MODEL_DOCUMENTED')) return 'MODEL_DOCUMENTED';
    if (symptoms.some(value => ['FAMILY_DOCUMENTED','FAMILY_OFFICIAL','MANUFACTURER_FAMILY'].includes(value.validationLevel))) return 'FAMILY_DOCUMENTED';
    if (/^MODEL_OFFICIAL/.test(item.validationStatus || '')) return 'MODEL_DOCUMENTED';
    if (/^FAMILY_OFFICIAL/.test(item.validationStatus || '')) return 'FAMILY_DOCUMENTED';
    if ((item.sourceIds || []).length) return 'SOURCE_IDENTIFIED';
    return 'UNVALIDATED';
  };

  const sourceDocuments = item => (item.sourceIds || [])
    .map(sourceId => ({ sourceId, source: sources[sourceId] }))
    .filter(entry => Boolean(entry.source))
    .map(({ sourceId, source }) => ({
      name:source.title,
      type:source.type || 'Fonte técnica',
      url:source.url || '',
      manufacturer:source.organization || '',
      model:item.model,
      language:source.language || '—',
      sourceId,
      date:source.consultedAt || '',
      validationLevel:source.validationLevel || '—'
    }));

  const normalizedItems = baseItems.map(item => {
    const symptoms = symptomsFor(item);
    const operationalSymptomGroups = operationalGroupsFor(item);
    const operationalSymptomCount = operationalSymptomGroups.reduce((total, group) => total + group.items.length, 0);
    return Object.freeze({
      ...item,
      aliases:[item.name,item.model,item.slug,item.code,item.manufacturer,item.subcategory].filter(Boolean),
      catalogDescription:catalogDescription(item),
      catalogDescriptionOrigin:descriptionOrigin(item),
      symptoms,
      operationalSymptomGroups,
      operationalSymptomCount,
      possibleCauses:symptoms.flatMap(value => value.possibleCauses || []),
      consequences:[],
      documents:sourceDocuments(item),
      validationStatus:normalizedValidation(item,symptoms),
      technicalFacts:Object.entries(item.specifications || {})
    });
  });

  const items = Object.freeze(normalizedItems);
  const hasUserImage = (item, userImages) => Boolean(userImages?.[item.id]?.dataUrl);
  const hasVerifiedRepoPhoto = item => Boolean(photoRegistry?.getForItem?.(item));
  const hasRealPhoto = (item, userImages) => hasUserImage(item, userImages) || hasVerifiedRepoPhoto(item);
  const hasDocuments = item => item.documents.some(document => Boolean(document.url));
  const hasDocumentedSymptoms = item => item.symptoms.length > 0;

  const query = (filters = {}, userImages = {}) => {
    const search = normalize(filters.search);
    const category = filters.category || 'ALL';
    const filtered = items.filter(item => {
      const operationalText = item.operationalSymptomGroups.flatMap(group => group.items.map(entry => `${entry.code} ${entry.symptom}`)).join(' ');
      const haystack = normalize([item.name,item.model,item.code,item.manufacturer,item.category,item.subcategory,item.type,item.catalogDescription,item.slug,...item.aliases,operationalText].join(' '));
      if (search && !haystack.includes(search)) return false;
      if (category !== 'ALL' && item.category !== category) return false;
      return true;
    });
    return [...filtered].sort((a,b) => a.name.localeCompare(b.name,'pt-PT',{numeric:true}));
  };

  window.EquipmentStoreV5 = Object.freeze({
    items,
    sources,
    symptoms:symptomLibrary,
    operationalMatrix,
    photoRegistry,
    query,
    getById(id){return items.find(item=>item.id===id)||null;},
    categories(){return [...new Set(items.map(item=>item.category))];},
    counts(userImages={}){return {
      total:items.length,
      categories:new Set(items.map(item=>item.category)).size,
      withDocuments:items.filter(hasDocuments).length,
      withUserPhoto:items.filter(item=>hasUserImage(item,userImages)).length,
      withRealPhoto:items.filter(item=>hasRealPhoto(item,userImages)).length,
      withSymptoms:items.filter(hasDocumentedSymptoms).length
    };},
    hasUserImage,hasVerifiedRepoPhoto,hasRealPhoto,hasDocuments,hasDocumentedSymptoms
  });
})();
