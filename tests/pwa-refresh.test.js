'use strict';
const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');const root=path.resolve(__dirname,'..');const sw=fs.readFileSync(path.join(root,'service-worker.js'),'utf8');const refresh=fs.readFileSync(path.join(root,'js/app-sw-refresh.js'),'utf8');
assert.match(sw,/formularios-operacionais-v6\.2\.0/);assert.match(sw,/async function networkFirst/);assert.match(sw,/event\.request\.destination==='script'/);assert.match(sw,/event\.request\.destination==='style'/);assert.match(sw,/cache:'no-store'/);
for(const file of ['./js/app-form-designer.js','./js/app-statistics.js','./js/app-notifications.js','./css/form-designer.css','./css/coca-cola-ui.css','./css/attention.css'])assert.ok(sw.includes(file),`Recurso ausente do cache: ${file}`);
assert.equal(/js\/equipment\//.test(sw),false);assert.equal(/equipment-v5\.css/.test(sw),false);assert.match(refresh,/updateViaCache:'none'/);assert.match(refresh,/formulariosOperacionaisSwReloadedV620/);
console.log('PWA refresh tests V6.2.0: OK');
