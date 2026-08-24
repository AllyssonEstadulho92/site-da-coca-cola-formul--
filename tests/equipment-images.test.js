'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const db = read('js/db.js');
const images = read('js/equipment/equipment-local-images-v5.js');
const registry = read('js/equipment/equipment-photo-registry-v5.js');
const components = read('js/equipment/equipment-components-v5.js');
const page = read('js/equipment/equipment-page-v5.js');
const index = read('index.html');

assert.match(db, /DB_VERSION\s*=\s*4/, 'IndexedDB deve permanecer na versão 4.');
assert.match(db, /createObjectStore\('equipmentImages',\s*\{\s*keyPath:\s*'equipmentId'/, 'Deve existir store equipmentImages por equipamento.');
assert.match(db, /getAll\('equipmentImages'\)/, 'O backup deve exportar fotografias locais.');
assert.match(db, /objectStore\('equipmentImages'\)\.put/, 'O restauro deve recuperar fotografias locais.');
assert.match(db, /schemaVersion:\s*4/, 'O schema de backup deve permanecer compatível na versão 4.');
assert.match(db, /appVersion:\s*'5\.2\.0'/, 'O backup deve indicar a V5.2.0.');

for (const token of ["AppDB.getAll('equipmentImages')","AppDB.put('equipmentImages'","AppDB.remove('equipmentImages'",'equipmentManualImage','pickEquipmentImage','compressEquipmentImage','removeEquipmentImage','MAX_INPUT_BYTES','TARGET_IMAGE_BYTES',"source: 'MANUAL'",'equipmentSlug','equipmentName','equipmentModel',"validationStatus: 'USER_SELECTED_FOR_EQUIPMENT'"]) {
  assert.ok(images.includes(token), `Módulo V5 de fotografias locais sem integração: ${token}`);
}
for (const token of ['data-equipment-image','data-equipment-image-remove','data-eq5-real-photo']) {
  assert.ok(components.includes(token) || page.includes(token), `UI V5 sem ação/controlo de fotografia: ${token}`);
}

assert.match(registry, /VERIFIED_STATUS\s*=\s*'VERIFIED_REAL'/, 'Fotografia versionada só pode ser tratada como real depois de validação explícita.');
assert.match(registry, /assets\\\/equipment\\\/photos/, 'O registo deve restringir fotografias à pasta dedicada.');
assert.match(components, /Fotografia pendente/, 'Sem fotografia validada deve existir estado pendente profissional.');
assert.match(components, /Fotografia real/, 'Fotografia validada deve ter etiqueta explícita.');
assert.equal(/Referência visual|reference-sprite-v46/.test(components), false, 'A UI não pode voltar a apresentar referência gerada como fotografia.');
assert.match(page, /bindEquipmentPhotoHealth/, 'Falha de carregamento da fotografia deve degradar para estado pendente sem quebrar a página.');

assert.match(images, /image\/jpeg,image\/png,image\/webp,image\/heic,image\/heif,image\/\*/, 'O seletor deve aceitar os formatos previstos.');
assert.match(images, /canvas\.toDataURL\('image\/jpeg'/, 'A fotografia deve ser otimizada antes de guardar.');
assert.match(index, /js\/equipment\/equipment-photo-registry-v5\.js/, 'O runtime deve carregar o registo de fotografias reais.');
assert.match(index, /js\/equipment\/equipment-local-images-v5\.js/, 'O runtime deve carregar o módulo de fotografias locais.');
assert.equal(index.includes('js/app-equipment-manual.js'), false, 'O módulo legado de imagens/manual não pode ser carregado no runtime.');
assert.match(index, /img-src 'self' data:/, 'A CSP deve permitir fotografias locais e assets do próprio site.');
assert.equal(/img-src[^;]*https?:/i.test(index), false, 'A aplicação não deve carregar imagens remotas diretamente.');

console.log('Equipment real/local image tests V5.2.0: OK');
