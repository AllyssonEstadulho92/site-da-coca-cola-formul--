'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const manifest = JSON.parse(read('assets/equipment/catalog-manifest.json'));
const baseCatalog = require(path.join(root, 'js/equipment-data.js'));
const directoryJs = read('js/equipment-directory-v43.js');
const modelsUi = read('js/app-equipment-models-v43.js');
const css = read('css/equipment-models-v43.css');
const index = read('index.html');

assert.equal(manifest.schemaVersion, 2, 'O manifest do diretório deve estar no schema 2.');
assert.equal(manifest.total, 53, 'O diretório deve declarar 53 modelos específicos.');
const directoryItems = manifest.categories.flatMap(category => category.items.map(item => ({ ...item, category: category.id })));
assert.equal(directoryItems.length, 53, 'O manifest deve conter exatamente 53 entradas.');

const genericPrimaryNames = new Set([
  'Vitrine Vertical Compacta',
  'Vitrine Vertical',
  'Post-Mix',
  'Vending',
  'Coca-Cola Freestyle',
  'Monster Cooler',
]);
for (const item of directoryItems) {
  assert.ok(item.name && item.model, `Nome/modelo em falta: ${item.category}/${item.folder}`);
  assert.equal(genericPrimaryNames.has(item.name), false, `Nome principal genérico proibido: ${item.name}`);
}

for (const requiredName of [
  'PLUS 450','PLUS 900','ICOOL 300','ICOOL 450','ICOOL 900','FV 280 COCA-COLA','FV 1200','BGZ-1001P','V-544','V 545/8 COCA-COLA',
  'IC 300','IC 450','DN 3061','SC410','EASYREACH EXPRESS','RETRO','300 RAX COCA-COLA','RVC 400','BOTELLERO 1 M','LOOP XL Horizontal','VR-200 2P',
  'S-78 COCA-COLA','BC 80B COCA-COLA','S288','G-STYLE 1','ENERGIZE 3','ENERGIZE 3H','ENERGIZE 4','ENERGIZE 4 8P','ENERGIZE 5','ENERGIZE 5 10P',
  '3180 H PM','3180 H PM 1/2 6P','3180H PM 1/3 6P','3180H 5P 1/3 8P','RECOR 1/4 4P PM','RECOR 1/3 4P PM','RECOR 1/3 5P PM',
  'NUTI 3180H','APEXX 3H 6P PM','APEXX 6 AC 10P PM','MÓDULO M 5P PM','ACTIVATOR 500',
  '72 inch Stack Vending Machine','79 inch Stack Vending Machine','Small Glass Front Vender','Large Glass Front Vender','DN 5800 Vending',
  'Coca-Cola Freestyle 7100','Coca-Cola Freestyle 8100','Coca-Cola Freestyle 9100','G-10 Monster Cooler'
]) {
  assert.ok(directoryItems.some(item => item.name === requiredName), `Modelo específico em falta no diretório: ${requiredName}`);
}

// Executa apenas as camadas de dados/UI que alteram o catálogo; não renderiza DOM.
const context = {
  window: {
    EquipmentCatalogData: baseCatalog.map(item => ({ ...item })),
    App: { equipmentInspectorTabHtml() { return ''; } },
  },
};
vm.createContext(context);
vm.runInContext(directoryJs, context, { filename: 'equipment-directory-v43.js' });
vm.runInContext(modelsUi, context, { filename: 'app-equipment-models-v43.js' });
const runtimeCatalog = context.window.EquipmentCatalogData;
assert.equal(runtimeCatalog.length, 53, 'O catálogo visível deve corresponder aos 53 diretórios.');
assert.equal(new Set(runtimeCatalog.map(item => item.id)).size, 53, 'O catálogo visível não pode conter IDs duplicados.');
assert.equal(runtimeCatalog.some(item => item.id === 'cooler-gs15-neon'), false, 'GS 1.5 Neon não pertence aos 53 diretórios atuais.');
assert.equal(runtimeCatalog.some(item => item.id === 'cooler-countertop'), false, 'Countertop não pertence aos 53 diretórios atuais.');
const monster = runtimeCatalog.find(item => item.id === 'cooler-g10-monster');
assert.ok(monster, 'G-10 Monster deve existir no catálogo.');
assert.equal(monster.name, 'G-10 Monster Cooler');
assert.equal(monster.category, 'Monster');

for (const token of ['Manual do Equipamento Coca-Cola','directorySlug','PLUS 450','ENERGIZE 3H','RECOR 1/3 5P PM','EASYREACH EXPRESS']) {
  assert.ok(directoryJs.includes(token), `Diretório V4.5 sem token obrigatório: ${token}`);
}
for (const token of ['equipment-card-v43','equipment-card-photo-v43','Modelo:','Ver detalhes','Diretório do modelo','Monster','53 diretórios aprovados']) {
  assert.ok(modelsUi.includes(token), `UI V4.5 sem integração obrigatória: ${token}`);
}
for (const token of ['.equipment-card-v43','.equipment-card-photo-v43','.equipment-detail-button-v43','@media (max-width: 760px)']) {
  assert.ok(css.includes(token), `CSS V4.5 sem regra obrigatória: ${token}`);
}

const dataPos = index.indexOf('js/equipment-data.js');
const directoryPos = index.indexOf('js/equipment-directory-v43.js');
const catalogPos = index.indexOf('js/app-equipment-catalog.js');
const hotfixPos = index.indexOf('js/app-equipment-upload-hotfix.js');
const modelsPos = index.indexOf('js/app-equipment-models-v43.js');
assert.ok(dataPos >= 0 && directoryPos > dataPos && catalogPos > directoryPos, 'O diretório específico deve carregar depois dos dados-base e antes do catálogo.');
assert.ok(hotfixPos >= 0 && modelsPos > hotfixPos, 'A camada visual V4.5 deve carregar depois da lógica de imagens/upload.');
assert.match(index, /css\/equipment-models-v43\.css/, 'O index deve carregar o CSS V4.5.');
assert.match(index, /V4\.5 · 53 modelos específicos/, 'O build visível deve identificar a V4.5.');

console.log(`Equipment model names: OK (${runtimeCatalog.length} modelos específicos)`);
