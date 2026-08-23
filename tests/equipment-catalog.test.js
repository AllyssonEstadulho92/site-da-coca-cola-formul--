'use strict';
const fs = require('node:fs');
const assert = require('node:assert/strict');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const catalog = require(path.resolve(root, 'js/equipment-data.js'));

assert.equal(Array.isArray(catalog), true, 'O catálogo deve ser uma lista.');
assert.equal(catalog.length, 24, 'A V4 deve conter 24 referências técnicas públicas normalizadas.');

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
  assert.match(item.sourceUrl, /^https:\/\/www\.cokesolutions\.com\//, `${item.id}: fonte deve ser CokeSolutions HTTPS.`);
  for (const document of item.documents) assert.match(document.url, /^https:\/\/www\.cokesolutions\.com\//, `${item.id}: documento fora de CokeSolutions.`);

  if (item.imageStatus === 'DIRECT_OFFICIAL') {
    assert.match(item.photo, /^https:\/\/www\.cokesolutions\.com\/content\/cokesolutions\/machines\//, `${item.id}: fotografia direta não corresponde ao repositório oficial de máquinas.`);
    assert.match(item.photoSourceUrl, /^https:\/\/www\.cokesolutions\.com\//, `${item.id}: origem da fotografia em falta.`);
  } else {
    assert.equal(item.imageStatus, 'OFFICIAL_DOCUMENT_ONLY', `${item.id}: estado da imagem inválido.`);
    assert.equal(item.photo, '', `${item.id}: não deve inventar/associar fotografia quando o ativo direto não foi confirmado.`);
  }
}

for (const id of [
  'cooler-gs15-neon','cooler-countertop','cooler-single-small','cooler-single-medium','cooler-single-large',
  'cooler-double-small','cooler-double-medium','cooler-double-large','cooler-g10-monster','cooler-fg-ret240',
  'vending-stack-72','vending-stack-79','vending-glassfront-small','vending-glassfront-large','vending-dn5800',
  'postmix-counter-6','postmix-counter-8','postmix-dropin-6','postmix-dropin-8','postmix-icebev-6','postmix-icebev-8',
  'freestyle-7100','freestyle-8100','freestyle-9100'
]) assert.ok(ids.has(id), `Equipamento obrigatório em falta: ${id}`);

for (const id of ['cooler-countertop','freestyle-7100','freestyle-8100','freestyle-9100']) {
  const item = catalog.find(value => value.id === id);
  assert.equal(item.imageStatus, 'DIRECT_OFFICIAL', `${id}: fotografia oficial direta deveria estar validada.`);
}

const monster = catalog.find(item => item.id === 'cooler-g10-monster');
assert.equal(monster.model, 'G-10');
assert.equal(monster.manufacturer, 'IDW');
assert.ok(monster.aliases.includes('monster'));

const ui = fs.readFileSync(path.resolve(root, 'js/app-equipment-catalog.js'), 'utf8');
const uiV4 = fs.readFileSync(path.resolve(root, 'js/app-equipment-catalog-v4.js'), 'utf8');
const css = fs.readFileSync(path.resolve(root, 'css/equipment-catalog.css'), 'utf8');
const imageCss = fs.readFileSync(path.resolve(root, 'css/equipment-images-v41.css'), 'utf8');
const index = fs.readFileSync(path.resolve(root, 'index.html'), 'utf8');

for (const required of ['equipment-shell-v33','equipmentInspectorHtml','data-equipment-tab','data-equipment-view','data-equipment-new','renderRegisteredEquipmentView']) {
  assert.ok(ui.includes(required), `UI base do catálogo sem integração obrigatória: ${required}`);
}
for (const required of ['equipmentOfficialPreview','equipmentOfficialPreviewHtml','equipment-official-frame','PDF_OVERRIDES','Fotografia oficial direta','Ficha oficial com imagem do modelo']) {
  assert.ok(uiV4.includes(required), `Extensão V4.1 sem integração visual obrigatória: ${required}`);
}
for (const id of ['postmix-counter-6','postmix-counter-8','postmix-dropin-6']) {
  assert.ok(uiV4.includes(`'${id}'`), `${id}: falta URL PDF oficial de pré-visualização.`);
}
for (const item of catalog) {
  const hasDirectPhoto = item.imageStatus === 'DIRECT_OFFICIAL' && Boolean(item.photo);
  const hasPdfDocument = item.documents.some(document => /\.pdf(?:$|[?#])/i.test(document.url)) || /\.pdf(?:$|[?#])/i.test(item.sourceUrl);
  const hasOverride = ['postmix-counter-6','postmix-counter-8','postmix-dropin-6'].includes(item.id);
  assert.ok(hasDirectPhoto || hasPdfDocument || hasOverride, `${item.id}: equipamento sem referência visual oficial utilizável.`);
}
for (const required of ['.equipment-shell-v33','.equipment-inspector-pane','.equipment-category-grid','.equipment-inspector-tabs','@media(max-width:620px)']) {
  assert.ok(css.includes(required), `CSS do catálogo sem regra obrigatória: ${required}`);
}
for (const required of ['.equipment-official-frame','.equipment-official-preview-panel','.equipment-card-hit']) {
  assert.ok(imageCss.includes(required), `CSS V4.1 sem regra visual obrigatória: ${required}`);
}
assert.match(index, /js\/app-equipment-catalog-v4\.js/, 'index.html deve carregar extensão V4.');
assert.match(index, /css\/equipment-images-v41\.css/, 'index.html deve carregar estilos V4.1 das imagens.');
assert.match(index, /img-src 'self' data: https:\/\/www\.cokesolutions\.com/, 'CSP deve autorizar o host oficial das fotografias remotas.');
assert.match(index, /frame-src https:\/\/www\.cokesolutions\.com https:\/\/d110qkvvq2aow9\.cloudfront\.net/, 'CSP deve limitar as fichas incorporadas aos hosts oficiais usados pelo CokeSolutions.');
assert.equal(/window\.open\s*\(/.test(ui + uiV4), false, 'O catálogo não deve abrir janelas por JavaScript.');
assert.equal(/\beval\s*\(|new\s+Function\s*\(/.test(ui + uiV4), false, 'O catálogo não deve executar código dinâmico por eval/Function.');

console.log(`Equipment catalog tests: OK (${catalog.length} equipamentos com referência visual oficial)`);
