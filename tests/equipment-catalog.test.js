'use strict';
const fs = require('node:fs');
const assert = require('node:assert/strict');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const catalog = require(path.resolve(root, 'js/equipment-data.js'));

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

const ui = fs.readFileSync(path.resolve(root, 'js/app-equipment-catalog.js'), 'utf8');
const css = fs.readFileSync(path.resolve(root, 'css/equipment-catalog.css'), 'utf8');

for (const required of [
  'equipment-shell-v33',
  'equipmentInspectorHtml',
  'equipmentInspectorTabHtml',
  'data-equipment-tab',
  'data-equipment-view',
  'data-equipment-new',
  'renderRegisteredEquipmentView',
  'equipmentCatalogSelection',
]) {
  assert.equal(ui.includes(required), true, `UI do catálogo sem integração obrigatória: ${required}`);
}

for (const required of [
  '.equipment-shell-v33',
  '.equipment-inspector-pane',
  '.equipment-category-grid',
  '.equipment-inspector-tabs',
  '@media(max-width:620px)',
]) {
  assert.equal(css.includes(required), true, `CSS do catálogo sem regra obrigatória: ${required}`);
}

assert.equal(/window\.open\s*\(/.test(ui), false, 'O catálogo não deve abrir janelas por JavaScript.');
assert.equal(/innerHTML\s*=\s*[^`'\"]/.test(ui), false, 'Rever atribuições innerHTML não literais no catálogo.');

console.log(`Equipment catalog tests: OK (${catalog.length} equipamentos + UI V3.3)`);
