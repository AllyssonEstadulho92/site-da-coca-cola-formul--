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

  const normalize = value => String(value || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-PT').trim();

  const factsToObject = facts => Object.fromEntries((Array.isArray(facts) ? facts : [])
    .filter(entry => Array.isArray(entry) && entry.length >= 2 && entry[1] && entry[1] !== '—')
    .map(([key, value]) => [String(key), String(value)]));

  const categoryType = item => {
    const facts = factsToObject(item.technicalFacts);
    return facts['Categoria na fonte'] || facts.Tipo || item.formType || item.category || 'Por confirmar';
  };

  const sourceIdsFor = item => {
    const ids = new Set();
    if (item.verification === 'PROJECT_MANUAL' || String(item.sourceLabel || '').includes('Manual do Equipamento')) ids.add('project-manual');
    if (item.category === 'Freestyle') ids.add('cokesolutions-freestyle');
    if (item.category === 'Vending') {
      const manufacturer = String(item.manufacturer || '');
      if (/Dixie Narco/i.test(manufacturer) || /DN\s*5800/i.test(item.model || '')) ids.add('dixie-narco-glassfront');
      if (/Royal/i.test(manufacturer)) ids.add('royal-vendors-tech');
    }
    if (item.verification === 'PUBLIC_REFERENCE') ids.add('cokesolutions-catalog');
    return [...ids];
  };

  const symptomsFor = item => {
    const library = Array.isArray(window.EquipmentSymptomsV5) ? window.EquipmentSymptomsV5 : [];
    const slug = item.directorySlug || '';
    const manufacturer = String(item.manufacturer || '');
    return library.filter(symptom => {
      if (symptom.appliesToModels?.includes(slug)) return true;
      if (!symptom.appliesToCategories?.includes(item.category)) return false;
      if (symptom.manufacturerIncludes && !manufacturer.toLowerCase().includes(symptom.manufacturerIncludes.toLowerCase())) return false;
      return true;
    });
  };

  const validationStatus = (item, symptoms) => {
    if (symptoms.some(value => value.validationLevel === 'MODEL_DOCUMENTED')) return 'MODEL_DOCUMENTED';
    if (symptoms.some(value => ['FAMILY_OFFICIAL','MANUFACTURER_FAMILY'].includes(value.validationLevel))) return 'FAMILY_DOCUMENTED';
    if (item.verification === 'PUBLIC_REFERENCE' || item.verification === 'PROJECT_MANUAL') return 'SOURCE_IDENTIFIED';
    return 'UNVALIDATED';
  };

  const normalizeItem = item => {
    const symptoms = symptomsFor(item);
    const sources = sourceIdsFor(item);
    const specifications = factsToObject(item.technicalFacts);
    const documents = (Array.isArray(item.documents) ? item.documents : []).map(document => ({
      name: document.label || 'Documento técnico',
      type: document.kind || 'Documento',
      url: document.url || '',
      manufacturer: item.manufacturer || '',
      model: item.model || '',
      language: '—',
      sourceId: sources[0] || '',
      date: ''
    }));
    if (!documents.length && item.sourceUrl) {
      documents.push({ name: 'Fonte principal do modelo', type: 'Referência', url: item.sourceUrl, manufacturer: item.manufacturer || '', model: item.model || '', language: '—', sourceId: sources[0] || '', date: '' });
    }

    const referenceIndex = TILE_BY_SLUG[item.directorySlug];
    const referenceImage = Number.isInteger(referenceIndex) ? {
      kind: 'REFERENCE_GENERATED',
      src: 'assets/equipment/reference-sprite-v46.jpg',
      tile: referenceIndex,
      copyrightStatus: 'PROJECT_REFERENCE',
      source: 'Imagem de referência gerada para identificação visual; confirmar com fotografia real.'
    } : null;

    const code = item.assetCode || String(item.model || item.id || 'EQ').toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 28);
    const manufacturer = String(item.manufacturer || '').trim();
    const manufacturerConfirmed = manufacturer && !/por confirmar/i.test(manufacturer);

    return Object.freeze({
      id: item.id,
      slug: item.directorySlug || item.id,
      category: item.category || 'Outros',
      subcategory: categoryType(item),
      brand: item.category === 'Monster' ? 'Monster' : 'Coca-Cola',
      manufacturer: manufacturerConfirmed ? manufacturer : '',
      manufacturerRaw: manufacturer,
      name: item.name || item.model || item.id,
      model: item.model || item.name || '',
      variant: item.officialName && item.officialName !== item.name ? item.officialName : '',
      type: categoryType(item),
      function: item.formType || categoryType(item),
      shortDescription: item.description || 'Não validado para este modelo.',
      code,
      aliases: item.aliases || [],
      referenceImage,
      specifications,
      technicalFacts: item.technicalFacts || [],
      symptoms,
      possibleCauses: symptoms.flatMap(value => value.possibleCauses || []),
      consequences: Array.isArray(item.consequences) ? item.consequences : [],
      documents,
      sourceIds: sources,
      sourceLabel: item.sourceLabel || '',
      sourceUrl: item.sourceUrl || '',
      validationStatus: validationStatus(item, symptoms),
      validationNote: item.regionalNote || item.symptomsNote || 'Não validado para este modelo.',
      imageCopyrightStatus: referenceImage?.copyrightStatus || 'NONE',
      updatedAt: '2026-08-24'
    });
  };

  const rawItems = (Array.isArray(window.EquipmentCatalogData) ? window.EquipmentCatalogData : [])
    .filter(item => !['cooler-gs15-neon','cooler-countertop'].includes(item.id))
    .map(item => item.id === 'cooler-g10-monster' ? { ...item, category:'Monster' } : item);

  const items = Object.freeze(rawItems.map(normalizeItem));

  const hasUserImage = (item, userImages) => Boolean(userImages?.[item.id]?.dataUrl);
  const hasReferenceImage = item => Boolean(item.referenceImage);
  const hasDocuments = item => item.documents.length > 0;
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
      const haystack = normalize([
        item.name,item.model,item.code,item.manufacturer,item.manufacturerRaw,item.category,item.subcategory,item.type,item.shortDescription,item.slug,...item.aliases
      ].join(' '));
      if (search && !haystack.includes(search)) return false;
      if (category !== 'ALL' && item.category !== category) return false;
      if (manufacturer !== 'ALL' && item.manufacturer !== manufacturer) return false;
      if (photo === 'USER' && !hasUserImage(item, userImages)) return false;
      if (photo === 'REFERENCE' && (hasUserImage(item, userImages) || !hasReferenceImage(item))) return false;
      if (photo === 'MISSING' && (hasUserImage(item, userImages) || hasReferenceImage(item))) return false;
      if (documents === 'WITH' && !hasDocuments(item)) return false;
      if (documents === 'WITHOUT' && hasDocuments(item)) return false;
      if (symptoms === 'DOCUMENTED' && !hasDocumentedSymptoms(item)) return false;
      if (symptoms === 'UNVALIDATED' && hasDocumentedSymptoms(item)) return false;
      if (validation !== 'ALL' && item.validationStatus !== validation) return false;
      return true;
    });

    const sort = filters.sort || 'name-asc';
    return [...filtered].sort((a, b) => {
      if (sort === 'name-desc') return b.name.localeCompare(a.name, 'pt-PT', { numeric:true });
      if (sort === 'category') return a.category.localeCompare(b.category, 'pt-PT') || a.name.localeCompare(b.name, 'pt-PT', { numeric:true });
      if (sort === 'manufacturer') return (a.manufacturer || 'zz').localeCompare(b.manufacturer || 'zz', 'pt-PT') || a.name.localeCompare(b.name, 'pt-PT', { numeric:true });
      if (sort === 'recent') return String(b.updatedAt).localeCompare(String(a.updatedAt)) || a.name.localeCompare(b.name, 'pt-PT', { numeric:true });
      return a.name.localeCompare(b.name, 'pt-PT', { numeric:true });
    });
  };

  window.EquipmentStoreV5 = Object.freeze({
    items,
    sources: window.EquipmentSourcesV5 || {},
    symptoms: window.EquipmentSymptomsV5 || [],
    query,
    getById(id) { return items.find(item => item.id === id) || null; },
    manufacturers() { return [...new Set(items.map(item => item.manufacturer).filter(Boolean))].sort((a,b) => a.localeCompare(b,'pt-PT')); },
    categories() { return [...new Set(items.map(item => item.category))]; },
    counts(userImages = {}) {
      return {
        total: items.length,
        categories: new Set(items.map(item => item.category)).size,
        withDocuments: items.filter(hasDocuments).length,
        withUserPhoto: items.filter(item => hasUserImage(item, userImages)).length,
        withSymptoms: items.filter(hasDocumentedSymptoms).length
      };
    },
    hasUserImage,
    hasReferenceImage,
    hasDocuments,
    hasDocumentedSymptoms
  });
})();
