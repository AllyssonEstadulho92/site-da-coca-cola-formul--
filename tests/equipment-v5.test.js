'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const sourcesJs = read('js/equipment/equipment-sources-v5.js');
const symptomsJs = read('js/equipment/equipment-symptoms-v5.js');
const catalogJs = read('js/equipment/equipment-catalog-data-v5.js');
const storeJs = read('js/equipment/equipment-store-v5.js');
const componentsJs = read('js/equipment/equipment-components-v5.js');
const pageJs = read('js/equipment/equipment-page-v5.js');
const css = read('css/equipment-v5.css');
const index = read('index.html');

for (const text of [sourcesJs, symptomsJs, catalogJs, storeJs, componentsJs, pageJs, index]) {
  assert.equal(/Manual do Equipamento Coca-Cola\s*[—-]\s*fornecido ao projeto/i.test(text), false, 'A V5 não pode usar o manual interno como fonte técnica.');
  assert.equal(/project-manual/.test(text), false, 'A V5 não pode referenciar project-manual.');
}

const context = { window: {} };
vm.createContext(context);
vm.runInContext(sourcesJs, context, { filename:'equipment-sources-v5.js' });
vm.runInContext(symptomsJs, context, { filename:'equipment-symptoms-v5.js' });
vm.runInContext(catalogJs, context, { filename:'equipment-catalog-data-v5.js' });
vm.runInContext(storeJs, context, { filename:'equipment-store-v5.js' });

const sources = context.window.EquipmentSourcesV5;
const symptoms = context.window.EquipmentSymptomsV5;
const store = context.window.EquipmentStoreV5;
assert.ok(sources && Object.keys(sources).length >= 10, 'Devem existir fontes externas suficientes para o catálogo.');
for (const [id, source] of Object.entries(sources)) {
  assert.ok(/^https:\/\//.test(source.url), `Fonte externa sem HTTPS: ${id}`);
  assert.ok(source.organization, `Fonte sem organização: ${id}`);
  assert.ok(source.validationLevel, `Fonte sem nível de validação: ${id}`);
}
assert.equal(store.items.length, 53, 'A V5 deve manter os 53 equipamentos do inventário aprovado.');
assert.equal(new Set(store.items.map(item=>item.slug)).size, 53, 'Os 53 equipamentos devem ter slugs únicos.');
assert.ok(store.items.some(item=>item.slug==='plus-450' && item.manufacturer==='Frigoglass'), 'PLUS 450 deve estar associado a fonte/fabricante externo validado.');
assert.ok(store.items.some(item=>item.slug==='energize-3' && /Cornelius/.test(item.manufacturer)), 'ENERGIZE 3 deve estar associado à Cornelius.');
assert.ok(store.items.some(item=>item.slug==='dn-5800' && item.documents.length), 'DN 5800 deve possuir documentação externa.');
assert.ok(store.items.some(item=>item.slug==='freestyle-7100' && item.documents.length), 'Freestyle 7100 deve possuir documentação Coca-Cola externa.');

for (const symptom of symptoms) {
  assert.ok(symptom.sourceId && sources[symptom.sourceId], `Sintoma sem fonte externa registada: ${symptom.id}`);
  assert.ok(symptom.name, `Sintoma sem nome: ${symptom.id}`);
  assert.ok(Array.isArray(symptom.possibleCauses), `Causas devem ser uma lista: ${symptom.id}`);
  assert.ok(Array.isArray(symptom.triageQuestions), `Perguntas de triagem devem ser uma lista: ${symptom.id}`);
}

const plus = store.items.find(item=>item.slug==='plus-450');
const unvalidated = store.items.find(item=>item.slug==='bgz-1001p');
assert.ok(plus.symptoms.length >= 3, 'PLUS 450 deve apresentar sintomas documentados pelo fabricante.');
assert.equal(unvalidated.sourceIds.length, 0, 'Modelo sem fonte externa específica não deve receber fonte inventada.');
assert.equal(unvalidated.symptoms.length, 0, 'Modelo sem documentação específica não deve receber sintomas inventados.');

const filtered = store.query({search:'freestyle 9100',category:'ALL',manufacturer:'ALL',photo:'ALL',documents:'ALL',symptoms:'ALL',validation:'ALL',sort:'name-asc'},{});
assert.equal(filtered.length, 1, 'A pesquisa deve encontrar Freestyle 9100 por nome/modelo.');
assert.equal(filtered[0].slug, 'freestyle-9100');
const postmix = store.query({search:'',category:'Postmix',manufacturer:'ALL',photo:'ALL',documents:'ALL',symptoms:'ALL',validation:'ALL',sort:'name-asc'},{});
assert.ok(postmix.length > 5 && postmix.every(item=>item.category==='Postmix'), 'Filtro de categoria Postmix inválido.');
const documented = store.query({search:'',category:'ALL',manufacturer:'ALL',photo:'ALL',documents:'WITH',symptoms:'ALL',validation:'ALL',sort:'name-asc'},{});
assert.ok(documented.length > 0 && documented.every(item=>item.documents.some(doc=>doc.url)), 'Filtro de documentação inválido.');

for (const token of ['equipmentV5Search','equipmentV5Manufacturer','equipmentV5Photo','equipmentV5Documents','equipmentV5Symptoms','equipmentV5Validation','equipmentV5Sort','data-eq5-clear']) assert.ok(componentsJs.includes(token), `Toolbar V5 sem ${token}`);
for (const token of ['Visão geral','Especificações','Sintomas','Documentação','Fotografias']) assert.ok(componentsJs.includes(token), `Detalhe V5 sem separador ${token}`);
for (const token of ['Fonte principal','Possíveis causas documentadas — não são diagnóstico','Não validado para este modelo']) assert.ok(componentsJs.includes(token), `UI de evidência V5 sem: ${token}`);
assert.ok(pageJs.includes('Protótipo sem autenticação'), 'Aviso público deve permanecer visível.');
assert.ok(pageJs.includes('equipmentV5SourceHtml'), 'Cada secção deve receber a sua fonte/estado de validação.');

assert.match(css, /\.eq5-grid\s*\{[^}]*grid-template-columns/s, 'O catálogo deve usar CSS Grid.');
assert.match(css, /@media\s*\(max-width:\s*680px\)/, 'A V5 deve ter breakpoint específico de smartphone.');
assert.match(css, /@media\s*\(max-width:\s*680px\)[\s\S]*?\.eq5-grid\{grid-template-columns:1fr/, 'No smartphone a grelha deve ter uma coluna.');
assert.match(css, /:focus-visible/, 'A V5 deve ter focus visível.');
assert.match(index, /css\/equipment-v5\.css/, 'Index deve carregar o CSS V5.');
assert.match(index, /js\/equipment\/equipment-page-v5\.js/, 'Index deve carregar a página V5.');
for (const forbidden of ['equipment-directory-v43.js','app-equipment-catalog-v4.js','app-equipment-reference-images-v46.js','app-equipment-models-v43.js','app-equipment-ui-v46.js','equipment-v46.css']) {
  assert.equal(index.includes(forbidden), false, `Camada V4 antiga ainda carregada no runtime: ${forbidden}`);
}

console.log(`Equipment V5 tests: OK (${store.items.length} equipamentos, ${Object.keys(sources).length} fontes externas, ${symptoms.length} relações de sintomas)`);