'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const sw = fs.readFileSync(path.join(root, 'service-worker.js'), 'utf8');
const refresh = fs.readFileSync(path.join(root, 'js/app-sw-refresh.js'), 'utf8');

assert.match(sw, /registo-avarias-v5\.2\.0/, 'O cache deve estar na V5.2.0.');
assert.match(sw, /async function networkFirst/, 'Deve existir estratégia network-first reutilizável.');
assert.match(sw, /event\.request\.destination === 'script'/, 'Scripts devem procurar primeiro a rede quando online.');
assert.match(sw, /event\.request\.destination === 'style'/, 'CSS deve procurar primeiro a rede quando online.');
assert.match(sw, /cache:\s*'no-store'/, 'Recursos críticos devem ignorar cache HTTP durante atualização online.');
assert.equal(/reference-sprite-v46\.jpg/.test(sw), false, 'O cache não deve voltar a incluir a referência visual gerada.');
for (const file of ['equipment-sources-v5','equipment-symptoms-v5','equipment-operational-symptoms-v5','equipment-catalog-data-v5','equipment-photo-registry-v5','equipment-store-v5','equipment-local-images-v5','equipment-actions-v5','equipment-components-v5','equipment-page-v5']) {
  assert.ok(sw.includes(`./js/equipment/${file}.js`), `Módulo V5 ausente do cache: ${file}`);
}
assert.match(sw, /\.\/css\/equipment-v5\.css/, 'Os estilos V5 devem estar no cache local.');
assert.match(refresh, /updateViaCache:\s*'none'/, 'O registo do Service Worker deve forçar verificação sem cache.');
assert.match(refresh, /registoAvariasSwReloadedV520/, 'A recarga automática deve estar alinhada com V5.2.0.');

console.log('PWA refresh tests V5.2.0: OK');
