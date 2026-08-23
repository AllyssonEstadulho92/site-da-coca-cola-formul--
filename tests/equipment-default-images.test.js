'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const js = read('js/app-equipment-default-images.js');
const index = read('index.html');
const sw = read('service-worker.js');

const ids = [
  'cooler-gs15-neon','cooler-countertop','cooler-single-small','cooler-single-medium','cooler-single-large',
  'cooler-double-small','cooler-double-medium','cooler-double-large','cooler-g10-monster','cooler-fg-ret240',
  'postmix-counter-6','postmix-counter-8','postmix-dropin-6','postmix-dropin-8','postmix-icebev-6','postmix-icebev-8',
  'vending-stack-72','vending-stack-79','vending-glassfront-small','vending-glassfront-large','vending-dn5800',
  'freestyle-7100','freestyle-8100','freestyle-9100'
];

for (const id of ids) assert.ok(js.includes(`'${id}'`), `Imagem local em falta para ${id}`);
assert.match(js, /data:image\/svg\+xml/, 'As ilustrações devem ser locais em data SVG.');
assert.match(js, /data-default-image="true"/, 'A imagem padrão deve ser identificável como ilustração local.');
assert.match(js, /Ilustração local/, 'A interface deve distinguir ilustração de fotografia real.');
assert.match(js, /if \(manual\?\.dataUrl\) return baseManualImageHtml/, 'A fotografia manual deve continuar a ter prioridade absoluta.');
assert.match(index, /js\/app-equipment-default-images\.js/, 'O index deve carregar as imagens padrão.');
assert.ok(index.indexOf('app-equipment-default-images.js') < index.indexOf('app-equipment-upload-hotfix.js'), 'As imagens padrão devem carregar antes do hotfix de interação.');
assert.match(index, /img-src 'self' data:/, 'A CSP deve permitir as ilustrações SVG locais em data URL.');
assert.match(sw, /\.\/js\/app-equipment-default-images\.js/, 'O módulo de imagens padrão deve existir no cache PWA.');
assert.equal(/https?:\/\//.test(js), false, 'As imagens padrão não devem depender de hosts externos.');
assert.equal(/eval\s*\(|new\s+Function\s*\(/.test(js), false, 'O módulo não deve executar código dinâmico.');

console.log(`Equipment default images tests: OK (${ids.length} ilustrações locais)`);