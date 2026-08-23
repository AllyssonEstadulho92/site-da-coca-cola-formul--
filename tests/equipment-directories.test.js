'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const equipmentRoot = path.join(root, 'assets', 'equipment');
const manifest = JSON.parse(fs.readFileSync(path.join(equipmentRoot, 'catalog-manifest.json'), 'utf8'));

const items = manifest.categories.flatMap(category => category.items.map(item => ({ ...item, category: category.id })));
assert.equal(items.length, 53, 'O diretório deve conter 53 referências de equipamento.');

const unique = new Set();
for (const item of items) {
  const key = `${item.category}/${item.folder}`;
  assert.equal(unique.has(key), false, `Diretório duplicado: ${key}`);
  unique.add(key);
  const folder = path.join(equipmentRoot, item.category, item.folder);
  assert.equal(fs.existsSync(folder), true, `Diretório em falta: ${key}`);
  assert.equal(fs.existsSync(path.join(folder, '.gitkeep')), true, `.gitkeep em falta: ${key}`);
  assert.ok(item.name && item.model, `Nome/modelo em falta: ${key}`);
}

for (const category of ['vitrines-verticais','vitrines-horizontais-arcas','frigorificos-apoio','postmix','modulos-auxiliares','vending','freestyle','monster']) {
  assert.ok(manifest.categories.some(entry => entry.id === category), `Categoria em falta: ${category}`);
}

console.log(`Equipment directories: OK (${items.length} diretórios)`);
