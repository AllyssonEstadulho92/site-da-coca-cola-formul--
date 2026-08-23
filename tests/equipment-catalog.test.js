'use strict';
const assert = require('node:assert/strict');
const path = require('node:path');

const catalog = require(path.resolve(__dirname, '../js/equipment-data.js'));

assert.equal(Array.isArray(catalog), true, 'O catálogo deve ser uma lista.');
assert.equal(catalog.length >= 10, true, 'O catálogo deve conter uma base mínima de equipamentos.');

const ids = new Set();
for (const item of catalog) {
  assert.equal(Boolean(item.id), true, 'Equipamento sem id.');
  assert.equal(ids.has(item.id), false, `ID duplicado: ${item.id}`);
  ids.add(item.id);
  assert.equal(Boolean(item.name), true, `${item.id}: nome em falta.`);
  assert.equal(Boolean(item.category), true, `${item.id}: categoria em falta.`);
  assert.equal(Boolean(item.description), true, `${item.id}: descrição em falta.`);
  assert.equal(Array.isArray(item.technicalFacts) && item.technicalFacts.length > 0, true, `${item.id}: ficha técnica vazia.`);
  assert.equal(Array.isArray(item.symptoms) && item.symptoms.length > 0, true, `${item.id}: sintomas vazios.`);
  assert.equal(Array.isArray(item.consequences) && item.consequences.length > 0, true, `${item.id}: consequências vazias.`);
  assert.equal(Boolean(item.regionalNote), true, `${item.id}: nota regional em falta.`);
  if (item.verification === 'PUBLIC_REFERENCE') {
    assert.match(item.sourceUrl, /^https:\/\//, `${item.id}: referência pública sem URL HTTPS.`);
  }
  if (item.photo) {
    assert.match(item.photo, /^assets\/equipment\//, `${item.id}: fotografias devem ser locais e autorizadas.`);
  }
}

for (const id of ['freestyle-7100','freestyle-8100','freestyle-9100','postmix-counter-6','vending-glassfront-small','cooler-countertop']) {
  assert.equal(ids.has(id), true, `Equipamento essencial em falta: ${id}`);
}

console.log(`Equipment catalog tests: OK (${catalog.length} equipamentos)`);
