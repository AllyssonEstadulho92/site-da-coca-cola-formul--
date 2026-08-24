'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
for (const required of [
  'index.html','404.html','manifest.json','service-worker.js','build-info.json',
  'css/equipment-v5.css','js/equipment/equipment-page-v5.js','js/equipment/equipment-store-v5.js',
  'assets/equipment/reference-sprite-v46.jpg'
]) assert.equal(fs.existsSync(path.join(dist, required)), true, `Build em falta: ${required}`);

const index = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
assert.equal(/localhost|127\.0\.0\.1/.test(index), false, 'O build não pode depender de localhost.');
assert.match(index, /href="css\/equipment-v5\.css"/, 'CSS V5 deve usar caminho relativo compatível com GitHub Pages.');
assert.match(index, /src="js\/equipment\/equipment-page-v5\.js"/, 'JS V5 deve usar caminho relativo compatível com GitHub Pages.');

const sw = fs.readFileSync(path.join(dist, 'service-worker.js'), 'utf8');
assert.match(sw, /registo-avarias-v5\.0\.0/, 'Service Worker do build deve estar em V5.0.0.');

console.log('GitHub Pages static build tests: OK');
