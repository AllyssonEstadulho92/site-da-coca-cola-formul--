'use strict';
const fs = require('node:fs');
const assert = require('node:assert/strict');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const catalog = require(path.resolve(root, 'js/equipment-data.js'));

assert.equal(Array.isArray(catalog), true, 'O catálogo deve ser uma lista.');
assert.equal(catalog.length, 24, 'A V4 deve manter 24 referências técnicas normalizadas.');

const ids = new Set();
for (const item of catalog) {
  assert.ok(item.id, 'Equipamento sem id.');
  assert.equal(ids.has(item.id), false, `ID duplicado: ${item.id}`);
  ids.add(item.id);
  for (const key of ['name','officialName','model','manufacturer','category','description','sourceUrl','regionalNote','symptomsNote','assetCode']) {
    assert.ok(item[key], `${item.id}: ${key} em falta.`);
  }
  assert.ok(Array.isArray(item.technicalFacts) && item.technicalFacts.length > 0, `${item.id}: ficha técnica vazia.`);
  assert.ok(Array.isArray(item.symptoms) && item.symptoms.length > 0, `${item.id}: sintomas vazios.`);
  assert.ok(Array.isArray(item.consequences) && item.consequences.length > 0, `${item.id}: consequências vazias.`);
  assert.ok(Array.isArray(item.documents) && item.documents.length > 0, `${item.id}: documentos vazios.`);
}

for (const id of [
  'cooler-gs15-neon','cooler-countertop','cooler-single-small','cooler-single-medium','cooler-single-large',
  'cooler-double-small','cooler-double-medium','cooler-double-large','cooler-g10-monster','cooler-fg-ret240',
  'vending-stack-72','vending-stack-79','vending-glassfront-small','vending-glassfront-large','vending-dn5800',
  'postmix-counter-6','postmix-counter-8','postmix-dropin-6','postmix-dropin-8','postmix-icebev-6','postmix-icebev-8',
  'freestyle-7100','freestyle-8100','freestyle-9100'
]) assert.ok(ids.has(id), `Equipamento obrigatório em falta: ${id}`);

const monster = catalog.find(item => item.id === 'cooler-g10-monster');
assert.equal(monster.model, 'G-10');
assert.equal(monster.manufacturer, 'IDW');
assert.ok(monster.aliases.includes('monster'));

const ui = fs.readFileSync(path.resolve(root, 'js/app-equipment-catalog.js'), 'utf8');
const manualUi = fs.readFileSync(path.resolve(root, 'js/app-equipment-manual.js'), 'utf8');
const css = fs.readFileSync(path.resolve(root, 'css/equipment-catalog.css'), 'utf8');
const manualCss = fs.readFileSync(path.resolve(root, 'css/equipment-manual-v42.css'), 'utf8');
const index = fs.readFileSync(path.resolve(root, 'index.html'), 'utf8');

for (const required of ['equipment-shell-v33','equipmentInspectorHtml','data-equipment-tab','data-equipment-view','data-equipment-new','renderRegisteredEquipmentView']) {
  assert.ok(ui.includes(required), `UI base do catálogo sem integração obrigatória: ${required}`);
}
for (const required of ['equipment-shell-v42','equipmentManualImageHtml','pickEquipmentImage','compressEquipmentImage','data-equipment-image','data-equipment-category-chip','Imagem manual']) {
  assert.ok(manualUi.includes(required), `Catálogo manual V4.2 sem integração obrigatória: ${required}`);
}
for (const required of ['.equipment-shell-v42','.equipment-category-chips','.equipment-card-v42','.equipment-manual-placeholder','.equipment-inspector-v42','@media(max-width:620px)']) {
  assert.ok(manualCss.includes(required), `CSS manual V4.2 sem regra obrigatória: ${required}`);
}
for (const required of ['.equipment-shell-v33','.equipment-inspector-pane','.equipment-category-grid','.equipment-inspector-tabs']) {
  assert.ok(css.includes(required), `CSS base do catálogo sem regra obrigatória: ${required}`);
}

assert.match(index, /js\/app-equipment-manual\.js/, 'index.html deve carregar o módulo de imagens manuais.');
assert.match(index, /css\/equipment-manual-v42\.css/, 'index.html deve carregar os estilos V4.2.');
assert.match(index, /img-src 'self' data:/, 'A CSP deve permitir imagens locais/data URL.');
assert.equal(/img-src[^;]*cokesolutions/i.test(index), false, 'A V4.2 não deve depender de imagens remotas CokeSolutions.');
assert.equal(/frame-src/i.test(index), false, 'A V4.2 não deve incorporar PDFs remotos em iframe.');
assert.equal(/window\.open\s*\(/.test(ui + manualUi), false, 'O catálogo não deve abrir janelas por JavaScript.');
assert.equal(/\beval\s*\(|new\s+Function\s*\(/.test(ui + manualUi), false, 'O catálogo não deve executar código dinâmico por eval/Function.');

console.log(`Equipment catalog tests: OK (${catalog.length} equipamentos + imagens manuais V4.2)`);
