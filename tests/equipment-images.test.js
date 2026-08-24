'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const db = read('js/db.js');
const ui = read('js/app-equipment-manual.js');
const index = read('index.html');

assert.match(db, /DB_VERSION\s*=\s*4/, 'IndexedDB deve estar na versão 4.');
assert.match(db, /createObjectStore\('equipmentImages',\s*\{\s*keyPath:\s*'equipmentId'/, 'Deve existir store equipmentImages por equipamento.');
assert.match(db, /getAll\('equipmentImages'\)/, 'O backup deve exportar imagens manuais.');
assert.match(db, /objectStore\('equipmentImages'\)\.put/, 'O restauro deve recuperar imagens manuais.');
assert.match(db, /schemaVersion:\s*4/, 'O schema de backup deve estar na versão 4.');
assert.match(db, /appVersion:\s*'4\.6\.0'/, 'O backup deve indicar a V4.6.0.');

for (const token of [
  "AppDB.getAll('equipmentImages')",
  "AppDB.put('equipmentImages'",
  "AppDB.remove('equipmentImages'",
  'pickEquipmentImage',
  'compressEquipmentImage',
  'data-equipment-image',
  'data-equipment-image-remove',
  'MAX_INPUT_BYTES',
  'TARGET_IMAGE_BYTES',
  "source: 'MANUAL'",
]) assert.ok(ui.includes(token), `Módulo de imagens manuais sem integração: ${token}`);

assert.match(ui, /image\/jpeg,image\/png,image\/webp,image\/heic,image\/heif,image\/\*/, 'O seletor deve aceitar os formatos de imagem previstos.');
assert.match(ui, /canvas\.toDataURL\('image\/jpeg'/, 'A imagem deve ser otimizada antes de guardar.');
assert.match(index, /img-src 'self' data:/, 'A CSP deve permitir data URLs de imagens locais.');
assert.equal(/img-src[^;]*https?:/i.test(index), false, 'A CSP não deve depender de imagens remotas.');

console.log('Equipment manual images tests: OK');