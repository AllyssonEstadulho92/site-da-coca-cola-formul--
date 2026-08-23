'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const sw = fs.readFileSync(path.join(root, 'service-worker.js'), 'utf8');
const refresh = fs.readFileSync(path.join(root, 'js/app-sw-refresh.js'), 'utf8');

assert.match(sw, /registo-avarias-v4\.2\.1/, 'O cache deve estar na V4.2.1.');
assert.match(sw, /async function networkFirst/, 'Deve existir estratégia network-first reutilizável.');
assert.match(sw, /event\.request\.destination === 'script'/, 'Scripts devem procurar primeiro a rede quando online.');
assert.match(sw, /event\.request\.destination === 'style'/, 'CSS deve procurar primeiro a rede quando online.');
assert.match(sw, /cache:\s*'no-store'/, 'Recursos críticos devem ignorar cache HTTP durante atualização online.');
assert.match(sw, /\.\/js\/app-equipment-manual\.js/, 'O módulo V4.2 de imagens manuais deve estar no cache local.');
assert.match(sw, /\.\/js\/app-equipment-upload-hotfix\.js/, 'O hotfix de upload direto deve estar no cache local.');
assert.match(sw, /\.\/css\/equipment-manual-v42\.css/, 'Os estilos V4.2 devem estar no cache local.');
assert.match(sw, /\.\/css\/equipment-upload-hotfix\.css/, 'Os estilos do upload direto devem estar no cache local.');
assert.match(refresh, /updateViaCache:\s*'none'/, 'O registo do Service Worker deve forçar verificação sem cache.');
assert.match(refresh, /registoAvariasSwReloadedV421/, 'A recarga automática deve estar alinhada com V4.2.1.');

console.log('PWA refresh tests: OK');
