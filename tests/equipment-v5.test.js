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
const imagesJs = read('js/equipment/equipment-local-images-v5.js');
const actionsJs = read('js/equipment/equipment-actions-v5.js');
const componentsJs = read('js/equipment/equipment-components-v5.js');
const pageJs = read('js/equipment/equipment-page-v5.js');
const css = read('css/equipment-v5.css');
const index = read('index.html');
const sw = read('service-worker.js');

const context = { window: {} };
vm.createContext(context);
vm.runInContext(sourcesJs, context, { filename: 'equipment-sources-v5.js' });
vm.runInContext(symptomsJs, context, { filename: 'equipment-symptoms-v5.js' });
vm.runInContext(catalogJs, context, { filename: 'equipment-catalog-data-v5.js' });
vm.runInContext(storeJs, context, { filename: 'equipment-store-v5.js' });

const sources = context.window.EquipmentSourcesV5;
const symptoms = context.window.EquipmentSymptomsV5;
const store = context.window.EquipmentStoreV5;

assert.equal(store.items.length, 53, 'O catálogo deve manter exatamente 53 equipamentos.');
assert.equal(new Set(store.items.map(item => item.slug)).size, 53, 'Os slugs devem ser únicos.');
assert.ok(Object.keys(sources).length >= 10, 'A base de fontes externas deve permanecer disponível.');
for (const [id, source] of Object.entries(sources)) {
  assert.ok(source.organization, `Fonte sem organização: ${id}`);
  assert.ok(/^https:\/\//.test(source.url), `Fonte sem HTTPS: ${id}`);
}
for (const symptom of symptoms) {
  assert.ok(symptom.name, `Sintoma sem nome: ${symptom.id}`);
  assert.ok(symptom.sourceId && sources[symptom.sourceId], `Sintoma sem fonte registada: ${symptom.id}`);
}

const searchResult = store.query({ search:'freestyle 9100', category:'ALL', manufacturer:'ALL', photo:'ALL', documents:'ALL', symptoms:'ALL', validation:'ALL', sort:'name-asc' }, {});
assert.equal(searchResult.length, 1, 'A pesquisa deve encontrar Freestyle 9100.');
assert.equal(searchResult[0].slug, 'freestyle-9100');

for (const token of [
  'eq5-card-grid',
  'eq5-card-media',
  'eq5-card-content',
  'equipmentV5Search',
  'data-eq5-category',
  'Ver ficha',
  'Criar registo',
  'Ficha técnica',
  'Sintomas',
  'Documentação',
  'Sem sintomas específicos associados'
]) assert.ok(componentsJs.includes(token), `Nova UI de Equipamentos sem token obrigatório: ${token}`);

assert.equal(componentsJs.includes('Fonte desta secção'), false, 'A nova UI não deve voltar a introduzir blocos "Fonte desta secção".');
assert.equal(componentsJs.includes('Mais filtros'), false, 'A nova base deve permanecer simples, sem painel de filtros avançados.');
assert.equal(componentsJs.includes('data-eq5-tab'), false, 'A ficha reconstruída não deve usar tabs antigas.');
assert.equal(pageJs.includes('decorateEquipmentV5Sources'), false, 'A página não deve depender da decoração antiga de fontes.');
assert.equal(pageJs.includes('equipmentV5Tab'), false, 'A página não deve manter estado de tabs antigas.');
assert.match(pageJs, /event\.key\s*===\s*'Escape'/, 'A ficha deve continuar a fechar por Escape.');
assert.ok(imagesJs.includes('equipmentManualImage') && imagesJs.includes('pickEquipmentImage'), 'Fotografias locais devem continuar funcionais.');
assert.ok(actionsJs.includes('startRecordFromCatalog'), 'Criar registo a partir do catálogo deve permanecer funcional.');

assert.match(css, /\.eq5-grid\{display:grid;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/, 'O catálogo desktop deve ter dois cartões por linha.');
assert.match(css, /\.eq5-card-grid\{display:grid;grid-template-columns:170px minmax\(0,1fr\)/, 'Cada cartão deve ter imagem à esquerda e conteúdo à direita.');
assert.match(css, /@media\(max-width:1180px\)\{\.eq5-grid\{grid-template-columns:1fr\}/, 'Em portátil/tablet deve existir um cartão por linha.');
assert.match(css, /@media\(max-width:700px\)[\s\S]*?\.eq5-card-grid\{grid-template-columns:118px minmax\(0,1fr\)/, 'No smartphone o cartão deve preservar as duas secções.');
assert.match(css, /@media\(max-width:420px\)[\s\S]*?\.eq5-card-grid\{grid-template-columns:100px minmax\(0,1fr\)/, 'Em smartphone estreito a imagem deve reduzir sem mudar de lado.');

assert.match(index, /css\/equipment-v5\.css/, 'Index deve carregar o único CSS específico de Equipamentos.');
assert.equal(index.includes('equipment-sources-v5.css'), false, 'Index não deve carregar CSS antigo de fontes.');
assert.equal(sw.includes('equipment-sources-v5.css'), false, 'Service Worker não deve precachear CSS antigo de fontes.');
for (const file of ['equipment-sources-v5.js','equipment-symptoms-v5.js','equipment-catalog-data-v5.js','equipment-store-v5.js','equipment-local-images-v5.js','equipment-actions-v5.js','equipment-components-v5.js','equipment-page-v5.js']) {
  assert.ok(index.includes(`js/equipment/${file}`), `Runtime sem ${file}`);
  assert.ok(sw.includes(`./js/equipment/${file}`), `PWA sem ${file}`);
}

console.log(`Equipment layout tests: OK (${store.items.length} equipamentos, base horizontal em duas secções)`);
