'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const context = vm.createContext({ window: {} });
const run = file => vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), context, { filename:file });

run('js/equipment-data.js');
run('js/equipment-directory-v43.js');
run('js/equipment/equipment-sources-v5.js');
run('js/equipment/equipment-symptoms-v5.js');
run('js/equipment/equipment-store-v5.js');

const store = context.window.EquipmentStoreV5;
assert.ok(store, 'EquipmentStoreV5 não foi criado.');
assert.equal(store.items.length, 53, 'A V5 deve preservar exatamente 53 equipamentos.');
assert.equal(new Set(store.items.map(item => item.id)).size, 53, 'IDs dos equipamentos devem ser únicos.');
assert.equal(new Set(store.items.map(item => item.slug)).size, 53, 'Slugs/diretórios devem ser únicos.');

for (const item of store.items) {
  assert.ok(item.name && item.model && item.category, `Dados mínimos em falta: ${item.id}`);
  assert.ok(item.code, `Código em falta: ${item.id}`);
  assert.ok(Array.isArray(item.symptoms), `Sintomas devem ser normalizados: ${item.id}`);
  assert.ok(Array.isArray(item.documents), `Documentos devem ser normalizados: ${item.id}`);
  assert.ok(Array.isArray(item.sourceIds), `Fontes devem ser normalizadas: ${item.id}`);
}

const plus = store.items.find(item => item.slug === 'plus-450');
assert.ok(plus, 'PLUS 450 em falta.');
assert.ok(plus.symptoms.some(symptom => symptom.name === 'Ligada mas sem frio'), 'PLUS 450 deve ter sintoma documentado pelo manual.');
assert.equal(plus.validationStatus, 'MODEL_DOCUMENTED');

const icool450 = store.items.find(item => item.slug === 'icool-450');
assert.ok(icool450.symptoms.some(symptom => /porta não fecha/i.test(symptom.name)), 'ICOOL 450 deve manter sintoma observável documentado.');

const freestyle = store.items.find(item => item.slug === 'freestyle-9100');
assert.ok(freestyle.symptoms.some(symptom => /ecrã bloqueado/i.test(symptom.name)), 'Freestyle deve receber sintomas oficiais ao nível da família.');
assert.equal(freestyle.validationStatus, 'FAMILY_DOCUMENTED');

const unvalidated = store.items.find(item => item.slug === '300-rax');
assert.ok(unvalidated, '300 RAX em falta.');
assert.equal(unvalidated.symptoms.length, 0, 'Não deve inventar sintomas para 300 RAX sem mapeamento documental migrado.');

const search = store.query({ search:'ENERGIZE 3', category:'Postmix', sort:'name-asc' }, {});
assert.ok(search.some(item => item.slug === 'energize-3'), 'Pesquisa por modelo/categoria deve funcionar.');
assert.ok(search.every(item => item.category === 'Postmix'), 'Filtro por categoria deve ser respeitado.');

const symptomFiltered = store.query({ symptoms:'DOCUMENTED' }, {});
assert.ok(symptomFiltered.length > 0 && symptomFiltered.length < 53, 'Filtro de sintomas documentados deve distinguir modelos validados e não validados.');

const sourceIds = Object.keys(context.window.EquipmentSourcesV5);
for (const required of ['project-manual','cokesolutions-troubleshooting','dixie-narco-glassfront']) assert.ok(sourceIds.includes(required), `Fonte em falta: ${required}`);

console.log(`Equipment V5 data tests: OK (${store.items.length} modelos, ${symptomFiltered.length} com sintomas documentados/família)`);
