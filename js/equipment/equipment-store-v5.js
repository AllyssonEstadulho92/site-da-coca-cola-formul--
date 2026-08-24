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

  const symptomsFor = item => symptomLibrary.filter(symptom => {
    if (symptom.appliesToModels?.includes(item.slug)) return true;
    if (!symptom.appliesToCategories?.includes(item.category)) return false;
    if (symptom.manufacturerIncludes && !String(item.manufacturer || '').toLowerCase().includes(symptom.manufacturerIncludes.toLowerCase())) return false;
    return true;
  });

  const operationalGroupsFor = item => operationalMatrix?.groupsForCategory?.(item.category) || [];

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
      kind:'REFERENCE_GENERATED', src:'assets/equipment/reference-sprite-v5.jpg', tile:referenceIndex,
      copyrightStatus:'PROJECT_REFERENCE', source:'Imagem de referência gerada no projeto; não é fotografia oficial do fabricante.'
    } : null;
    return Object.freeze({
      ...item,
      aliases:[item.name,item.model,item.slug,item.code,item.manufacturer,item.subcategory].filter(Boolean),
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
    const manufacturer = filters.manufacturer || 'ALL';
    const photo = filters.photo || 'ALL';
    const documents = filters.documents || 'ALL';
    const symptoms = filters.symptoms || 'ALL';
    const validation = filters.validation || 'ALL';

    const filtered = items.filter(item => {
      const operationalText = item.operationalSymptomGroups.flatMap(group => group.items.map(entry => `${entry.code} ${entry.symptom}`)).join(' ');
      const haystack = normalize([item.name,item.model,item.code,item.manufacturer,item.category,item.subcategory,item.type,item.shortDescription,item.slug,...item.aliases,operationalText].join(' '));
      if (search && !haystack.includes(search)) return false;
      if (category !== 'ALL' && item.category !== category) return false;
      if (manufacturer !== 'ALL' && item.manufacturer !== manufacturer) return false;
      if (photo === 'USER' && !hasUserImage(item,userImages)) return false;
      if (photo === 'REFERENCE' && (hasUserImage(item,userImages) || !hasReferenceImage(item))) return false;
      if (photo === 'MISSING' && (hasUserImage(item,userImages) || hasReferenceImage(item))) return false;
      if (documents === 'WITH' && !hasDocuments(item)) return false;
      if (documents === 'WITHOUT' && hasDocuments(item)) return false;
      if (symptoms === 'DOCUMENTED' && !hasDocumentedSymptoms(item)) return false;
      if (symptoms === 'UNVALIDATED' && hasDocumentedSymptoms(item)) return false;
      if (validation !== 'ALL' && item.validationStatus !== validation) return false;
      return true;
    });

    const sort = filters.sort || 'name-asc';
    return [...filtered].sort((a,b) => {
      if (sort === 'name-desc') return b.name.localeCompare(a.name,'pt-PT',{numeric:true});
      if (sort === 'category') return a.category.localeCompare(b.category,'pt-PT') || a.name.localeCompare(b.name,'pt-PT',{numeric:true});
      if (sort === 'manufacturer') return (a.manufacturer || 'zz').localeCompare(b.manufacturer || 'zz','pt-PT') || a.name.localeCompare(b.name,'pt-PT',{numeric:true});
      if (sort === 'recent') return String(b.updatedAt).localeCompare(String(a.updatedAt)) || a.name.localeCompare(b.name,'pt-PT',{numeric:true});
      return a.name.localeCompare(b.name,'pt-PT',{numeric:true});
    });
  };

  window.EquipmentStoreV5 = Object.freeze({
    items,
    sources,
    symptoms:symptomLibrary,
    operationalMatrix,
    query,
    getById(id){return items.find(item=>item.id===id)||null;},
    manufacturers(){return [...new Set(items.map(item=>item.manufacturer).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-PT'));},
    categories(){return [...new Set(items.map(item=>item.category))];},
    counts(userImages={}){return {total:items.length,categories:new Set(items.map(item=>item.category)).size,withDocuments:items.filter(hasDocuments).length,withUserPhoto:items.filter(item=>hasUserImage(item,userImages)).length,withSymptoms:items.filter(hasDocumentedSymptoms).length};},
    hasUserImage,hasReferenceImage,hasDocuments,hasDocumentedSymptoms
  });
})();
