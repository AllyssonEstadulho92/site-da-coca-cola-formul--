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
  'css/styles.css','css/base.css','css/features.css','css/theme.css','css/form-designer.css',
  'js/core.js','js/db.js','js/app-base.js','js/app-utils.js','js/app-shell.js','js/app-sw-refresh.js',
  'js/app-dashboard.js','js/app-form-view.js','js/app-form-designer.js','js/app-form-logic.js','js/app-form-save.js',
  'js/app-records.js','js/app-record-detail.js','js/app-record-archive.js','js/app-directories.js','js/app-routing-views.js',
  'js/app-activity-productivity.js','js/app-settings.js','js/app-backup.js','js/app-profile-help.js','js/app-demo.js','js/app.js',
  'assets/app-icon.svg'
]) assert.equal(fs.existsSync(path.join(dist,file)), true, `Build sem recurso obrigatório: ${file}`);

for (const forbidden of [
  'docs','data','tests','scripts','js/equipment','assets/equipment','css/equipment-v5.css',
  'js/app-equipment-catalog.js','js/app-equipment-manual.js','js/equipment-data.js'
]) assert.equal(fs.existsSync(path.join(dist,forbidden)), false, `Build publicou conteúdo não-runtime: ${forbidden}`);

const index = fs.readFileSync(path.join(dist,'index.html'),'utf8');
assert.match(index,/V6\.0\.0 · forms designer/,'Build deve identificar a V6.0.0.');
assert.equal(/localhost|127\.0\.0\.1/.test(index), false, 'O build não pode depender de localhost.');
assert.match(index,/href="css\/form-designer\.css"/,'CSS do Designer deve manter caminho relativo compatível com GitHub Pages.');
assert.match(index,/src="js\/app-form-designer\.js"/,'Módulo do Designer deve ser publicado.');
assert.equal(/js\/equipment\//.test(index), false, 'O HTML publicado não pode carregar a área Equipamentos removida.');

const sw = fs.readFileSync(path.join(dist,'service-worker.js'),'utf8');
assert.match(sw,/formularios-operacionais-v6\.0\.0/,'Service Worker publicado deve corresponder à V6.0.0.');
assert.ok(sw.includes('./js/app-form-designer.js'), 'Service Worker deve publicar o Designer.');
assert.ok(sw.includes('./css/form-designer.css'), 'Service Worker deve publicar o CSS do Designer.');
assert.equal(/js\/equipment\//.test(sw), false, 'Service Worker não pode publicar módulos removidos.');

const buildScript = fs.readFileSync(path.join(root,'scripts/build-static.js'),'utf8');
assert.equal(/photoRegistry|assets\\\/equipment\\\/photos/.test(buildScript), false, 'O build não deve manter lógica específica da área Equipamentos.');

const info = JSON.parse(fs.readFileSync(path.join(dist,'build-info.json'),'utf8'));
assert.equal(info.build,'forms-designer-v6');
assert.ok(Array.isArray(info.runtimeFiles) && info.runtimeFiles.includes('js/app-form-designer.js'));
assert.ok(info.runtimeFiles.includes('css/form-designer.css'));
assert.equal(info.runtimeFiles.some(file => /equipment-v5|js\/equipment/.test(file)), false, 'Allowlist do build não pode conter a área Equipamentos.');
assert.equal(info.runtimeFiles.some(file => /^(?:docs|data|tests|scripts)\//.test(file)), false, 'Allowlist do build não pode publicar conteúdo de desenvolvimento.');

console.log('Static GitHub Pages build V6.0.0: OK');
