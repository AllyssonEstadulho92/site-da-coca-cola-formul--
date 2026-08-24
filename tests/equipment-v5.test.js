'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const context = vm.createContext({ window: {} });
const run = file => vm.runInContext(read(file), context, { filename:file });

run('js/equipment/equipment-catalog-data-v5.js');
run('js/equipment/equipment-sources-v5.js');
run('js/equipment/equipment-symptoms-v5.js');
run('js/equipment/equipment-store-v5.js');

const store = context.window.EquipmentStoreV5;
assert.ok(store, 'EquipmentStoreV5 não foi criado.');
assert.equal(store.items.length, 53, 'A V5 deve preservar exatamente 53 equipamentos.');
assert.equal(new Set(store.items.map(item => item.id)).size, 53, 'IDs devem ser únicos.');
assert.equal(new Set(store.items.map(item => item.slug)).size, 53, 'Slugs devem ser únicos.');

const forbiddenSourceText = /MANUAL DO EQUIPAMENTO COCA COLA|Manual do Equipamento Coca-Cola|project-manual/i;
for (const file of ['js/equipment/equipment-catalog-data-v5.js','js/equipment/equipment-sources-v5.js','js/equipment/equipment-symptoms-v5.js','js/equipment/equipment-store-v5.js']) {
  assert.equal(forbiddenSourceText.test(read(file)), false, `Fonte interna proibida ainda presente em ${file}`);
}

for (const item of store.items) {
  assert.ok(item.name && item.model && item.category && item.code, `Dados mínimos em falta: ${item.id}`);
  assert.ok(Array.isArray(item.symptoms) && Array.isArray(item.documents) && Array.isArray(item.sourceIds), `Estrutura inválida: ${item.id}`);
  for (const sourceId of item.sourceIds) assert.ok(store.sources[sourceId], `Fonte não resolvida em ${item.slug}: ${sourceId}`);
  for (const symptom of item.symptoms) assert.ok(store.sources[symptom.sourceId], `Sintoma sem fonte pública resolvida: ${symptom.id}`);
}

const plus = store.items.find(item => item.slug === 'plus-450');
assert.equal(plus.manufacturer, 'Frigoglass');
assert.ok(plus.sourceIds.includes('frigoglass-plus-450'));
assert.ok(plus.sourceIds.includes('eu-eprel-plus450'));
assert.ok(plus.symptoms.some(symptom => /não arrefece/i.test(symptom.name)), 'PLUS 450 deve usar troubleshooting público Frigoglass.');
assert.equal(plus.validationStatus, 'MODEL_DOCUMENTED');

const icool = store.items.find(item => item.slug === 'icool-450');
assert.ok(icool.sourceIds.includes('frigoglass-icool'));
assert.ok(icool.symptoms.some(symptom => /não arrefece/i.test(symptom.name)), 'ICOOL deve usar troubleshooting da série Frigoglass.');

const energize = store.items.find(item => item.slug === 'energize-3');
assert.ok(energize.sourceIds.includes('cornelius-energize3'));
assert.ok(energize.symptoms.some(symptom => /não dispensa/i.test(symptom.name)), 'Energize deve usar troubleshooting Cornelius.');

const freestyle = store.items.find(item => item.slug === 'freestyle-9100');
assert.ok(freestyle.sourceIds.includes('cokesolutions-freestyle'));
assert.ok(freestyle.symptoms.some(symptom => /ecrã bloqueado/i.test(symptom.name)));
assert.equal(freestyle.validationStatus, 'FAMILY_DOCUMENTED');

const dn5800 = store.items.find(item => item.slug === 'dn-5800');
assert.ok(dn5800.sourceIds.includes('cokesolutions-dn5800'));
assert.ok(dn5800.sourceIds.includes('crane-dn5800'));

const unvalidated = store.items.find(item => item.slug === '300-rax');
assert.ok(unvalidated);
assert.equal(Object.keys(unvalidated.specifications).length, 0, '300 RAX não deve receber especificações sem fonte pública específica.');
assert.equal(unvalidated.symptoms.length, 0, '300 RAX não deve receber sintomas sem fonte pública específica.');
assert.equal(unvalidated.validationStatus, 'UNVALIDATED');

const filtered = store.query({ search:'ENERGIZE 3', category:'Postmix', sort:'name-asc' }, {});
assert.ok(filtered.some(item => item.slug === 'energize-3'));
assert.ok(filtered.every(item => item.category === 'Postmix'));
assert.ok(store.query({ symptoms:'DOCUMENTED' }, {}).length < 53, 'O filtro deve distinguir modelos documentados e não documentados.');
assert.ok(store.query({ documents:'WITH' }, {}).length > 0, 'Deve existir filtro por documentação pública.');

for (const required of ['frigoglass-plus-450','frigoglass-icool','cornelius-energize-range','cokesolutions-freestyle','cokesolutions-dn5800','crane-dn5800','eu-eprel-plus450']) {
  const source = store.sources[required];
  assert.ok(source, `Fonte pública obrigatória em falta: ${required}`);
  assert.match(source.url, /^https:\/\//, `Fonte deve ter URL pública: ${required}`);
}

console.log(`Equipment V5 public-source tests: OK (${store.items.length} modelos)`);
