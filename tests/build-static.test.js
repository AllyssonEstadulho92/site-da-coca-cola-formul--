'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
execFileSync(process.execPath, ['scripts/build-static.js'], { cwd: root, stdio: 'inherit' });
const dist = path.join(root, 'dist');
for (const file of [
  'index.html','404.html','manifest.json','service-worker.js','build-info.json',
  'css/styles.css','css/equipment-v5.css','css/equipment-sources-v5.css',
  'js/equipment/equipment-sources-v5.js','js/equipment/equipment-symptoms-v5.js','js/equipment/equipment-catalog-data-v5.js','js/equipment/equipment-store-v5.js','js/equipment/equipment-local-images-v5.js','js/equipment/equipment-actions-v5.js','js/equipment/equipment-components-v5.js','js/equipment/equipment-page-v5.js',
  'assets/equipment/reference-sprite-v46.jpg'
]) assert.equal(fs.existsSync(path.join(dist,file)), true, `Build sem recurso obrigatório: ${file}`);

const index = fs.readFileSync(path.join(dist,'index.html'),'utf8');
assert.match(index,/V5\.0\.1 · catálogo técnico operacional/,'Build deve identificar a V5.0.1.');
for (const forbidden of ['equipment-directory-v43.js','js/app-equipment-catalog.js','js/app-equipment-manual.js']) {
  assert.equal(index.includes(forbidden),false,`Build não pode carregar camada antiga: ${forbidden}`);
}
const info = JSON.parse(fs.readFileSync(path.join(dist,'build-info.json'),'utf8'));
assert.equal(info.build,'equipment-catalog-v5');

console.log('Static GitHub Pages build V5.0.1: OK');
