'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const sw = fs.readFileSync(path.join(root, 'service-worker.js'), 'utf8');
const refresh = fs.readFileSync(path.join(root, 'js/app-sw-refresh.js'), 'utf8');

assert.match(sw, /formularios-operacionais-v6\.0\.0/, 'O cache deve estar na V6.0.0.');
assert.match(sw, /async function networkFirst/, 'Deve existir estratégia network-first reutilizável.');
assert.match(sw, /event\.request\.destination === 'script'/, 'Scripts devem procurar primeiro a rede quando online.');
assert.match(sw, /event\.request\.destination === 'style'/, 'CSS deve procurar primeiro a rede quando online.');
assert.match(sw, /cache:\s*'no-store'/, 'Recursos críticos devem ignorar cache HTTP durante atualização online.');
assert.ok(sw.includes('./js/app-form-designer.js'), 'O Designer deve estar disponível no cache offline.');
assert.ok(sw.includes('./css/form-designer.css'), 'Os estilos do Designer devem estar disponíveis no cache offline.');
assert.equal(/js\/equipment\//.test(sw), false, 'O cache não pode manter módulos da área Equipamentos removida.');
assert.equal(/equipment-v5\.css/.test(sw), false, 'O cache não pode manter CSS da área Equipamentos removida.');
assert.match(refresh, /updateViaCache:\s*'none'/, 'O registo do Service Worker deve forçar verificação sem cache.');
assert.match(refresh, /formulariosOperacionaisSwReloadedV600/, 'A recarga automática deve estar alinhada com V6.0.0.');

console.log('PWA refresh tests V6.0.0: OK');
