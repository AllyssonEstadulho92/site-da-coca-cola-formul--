(() => {
  'use strict';

  const TILE_BY_SLUG = Object.freeze({
    'plus-450':2,'icool-300':3,'icool-450':4,'icool-900':5,'fv-280':6,'bgz-1001p':7,'plus-900':8,
    'retro':9,'300-rax':10,'rvc-400':11,'v-544':12,'v-545-8':13,'ic-300':14,'ic-450':15,'dn-3061':16,
    'sc410':17,'botellero-1m':18,'fv-1200':19,'loop-xl-horizontal':20,'s-78':21,'bc-80b':22,'s288':23,
    'g-style-1':24,'vr-200-2p':25,'easyreach-express':26,'energize-3':27,'energize-3h':28,'energize-4':29,
    'energize-4-8p':30,'energize-5':31,'energize-5-10p':32,'loop-xl-postmix':33,'3180-h-pm':34,
    '3180-h-pm-1-2-6p':35,'3180h-pm-1-3-6p':36,'3180h-5p-1-3-8p':37,'recor-1-4-4p-pm':38,
    'recor-1-3-4p-pm':39,'recor-1-3-5p-pm':40,'nuti-3180h':41,'apexx-3h-6p-pm':42,
    'apexx-6-ac-10p-pm':43,'modulo-m-5p-pm':44,'activator-500':45,'stack-72':46,'stack-79':47,
    'glass-front-small':48,'glass-front-large':49,'dn-5800':50,'freestyle-7100':51,'freestyle-8100':52,
    'freestyle-9100':53,'g-10':54
  });

  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-PT').trim();
  const sources = window.EquipmentSourcesV5 || {};
  const symptomLibrary = Array.isArray(window.EquipmentSymptomsV5) ? window.EquipmentSymptomsV5 : [];
  const operationalMatrix = window.EquipmentOperationalSymptomsV5 || null;
  const baseItems = Array.isArray(window.EquipmentCatalogV5Base) ? window.EquipmentCatalogV5Base : [];

  const categoryDescriptions = Object.freeze({
    Vitrines: 'Equipamento refrigerado para conservação e exposição de bebidas embaladas no ponto de venda. Na triagem operacional devem ser observados alimentação elétrica, capacidade de frio, iluminação, ruído, portas ou fechos, fugas e integridade física.',
    Postmix: 'Sistema de dispensing post-mix para preparação e serviço de bebidas a partir de água, CO2 e concentrado ou xarope. A ocorrência pode envolver alimentação, refrigeração, carbonatação, água, xarope, espuma, fugas, válvulas ou torneiras e saída de produto, conforme a configuração instalada.',
    Vending: 'Máquina automática de venda de bebidas com seleção, canais de entrega e meios de pagamento. A triagem inclui alimentação, refrigeração, iluminação, canais encravados, rejeição ou retenção de moedas/notas, troco, saída de produto, telemetria e integridade física.',
    Freestyle: 'Sistema digital de dispensing multibebidas com seleção eletrónica e circuitos de água, CO2 e ingredientes. A triagem deve considerar alimentação, refrigeração, água, xarope, carbonatação, espuma, fugas, seleção e dispensação, além da integridade física do equipamento.',
    Monster: 'Cooler refrigerado para conservação e exposição de bebidas. A triagem operacional segue as verificações de funcionamento geral de equipamentos de frio e de integridade física.',
    Outros: 'Módulo auxiliar associado a sistemas de dispensing. A triagem operacional considera alimentação, água, CO2, xarope ou produto, fugas, frio e funcionamento dos componentes associados, de acordo com a instalação.'
  });

  const genericInventoryDescription = /^Modelo presente no inventário do projeto\./i;

  function catalogDescription(item) {
    const operational = categoryDescriptions[item.category] || 'Equipamento presente no inventário operacional. A triagem deve ser feita de acordo com a categoria, o sintoma reportado e a identificação física da unidade instalada.';
    const specific = String(item.shortDescription || '').trim();
    if (!specific || genericInventoryDescription.test(specific)) return operational;
    return `${specific} ${operational}`;
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
    const referenceIndex = TILE_BY_SLUG[item.slug];
    const referenceImage = Number.isInteger(referenceIndex) ? {
      kind:'REFERENCE_GENERATED', src:'assets/equipment/reference-sprite-v46.jpg', tile:referenceIndex,
      copyrightStatus:'PROJECT_REFERENCE', source:'Imagem de referência gerada no projeto; não é fotografia oficial do fabricante.'
    } : null;
    return Object.freeze({
      ...item,
      aliases:[item.name,item.model,item.slug,item.code,item.manufacturer,item.subcategory].filter(Boolean),
      catalogDescription:catalogDescription(item),
      referenceImage,
      symptoms,
      operationalSymptomGroups,
      operationalSymptomCount,
      possibleCauses:symptoms.flatMap(value => value.possibleCauses || []),
      consequences:[],
      documents:sourceDocuments(item),
      validationStatus:normalizedValidation(item,symptoms),
      technicalFacts:Object.entries(item.specifications || {}),
      imageCopyrightStatus:referenceImage?.copyrightStatus || 'NONE'
    });
  });

  const items = Object.freeze(normalizedItems);
  const hasUserImage = (item, userImages) => Boolean(userImages?.[item.id]?.dataUrl);
  const hasReferenceImage = item => Boolean(item.referenceImage);
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
    query,
    getById(id){return items.find(item=>item.id===id)||null;},
    categories(){return [...new Set(items.map(item=>item.category))];},
    counts(userImages={}){return {total:items.length,categories:new Set(items.map(item=>item.category)).size,withDocuments:items.filter(hasDocuments).length,withUserPhoto:items.filter(item=>hasUserImage(item,userImages)).length,withSymptoms:items.filter(hasDocumentedSymptoms).length};},
    hasUserImage,hasReferenceImage,hasDocuments,hasDocumentedSymptoms
  });
})();
