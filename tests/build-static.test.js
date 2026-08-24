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
  'css/styles.css','css/base.css','css/features.css','css/theme.css','css/equipment-v5.css',
  'js/equipment/equipment-sources-v5.js','js/equipment/equipment-symptoms-v5.js','js/equipment/equipment-operational-symptoms-v5.js','js/equipment/equipment-catalog-data-v5.js','js/equipment/equipment-photo-registry-v5.js','js/equipment/equipment-store-v5.js','js/equipment/equipment-local-images-v5.js','js/equipment/equipment-actions-v5.js','js/equipment/equipment-components-v5.js','js/equipment/equipment-page-v5.js',
  'assets/app-icon.svg'
]) assert.equal(fs.existsSync(path.join(dist,file)), true, `Build sem recurso obrigatório: ${file}`);

for (const forbidden of [
  'docs','data','tests','scripts',
  'js/app-equipment-catalog.js','js/app-equipment-manual.js','js/equipment-data.js',
  'css/equipment-catalog.css','css/equipment-v46.css','css/equipment-sources-v5.css',
  'assets/equipment/README.md','assets/equipment/reference-sprite-v46.jpg'
]) assert.equal(fs.existsSync(path.join(dist,forbidden)), false, `Build publicou conteúdo não-runtime: ${forbidden}`);

const index = fs.readFileSync(path.join(dist,'index.html'),'utf8');
assert.match(index,/V5\.2\.0 · catálogo operacional/,'Build deve identificar a V5.2.0.');
assert.equal(/localhost|127\.0\.0\.1/.test(index), false, 'O build não pode depender de localhost.');
assert.match(index,/href="css\/equipment-v5\.css"/,'CSS de Equipamentos deve manter caminho relativo compatível com GitHub Pages.');
assert.match(index,/src="js\/equipment\/equipment-photo-registry-v5\.js"/,'O registo de fotografias reais deve ser publicado.');
assert.match(index,/src="js\/equipment\/equipment-page-v5\.js"/,'JS V5 deve manter caminho relativo compatível com GitHub Pages.');
assert.ok(index.indexOf('equipment-operational-symptoms-v5.js') < index.indexOf('equipment-store-v5.js'), 'A matriz operacional deve carregar antes do store no HTML publicado.');
assert.ok(index.indexOf('equipment-photo-registry-v5.js') < index.indexOf('equipment-store-v5.js'), 'O registo de fotografias deve carregar antes do store no HTML publicado.');
assert.ok(index.indexOf('equipment-components-v5.js') < index.indexOf('equipment-page-v5.js'), 'Os componentes devem carregar antes da página de Equipamentos.');

const sw = fs.readFileSync(path.join(dist,'service-worker.js'),'utf8');
assert.match(sw,/registo-avarias-v5\.2\.0/,'Service Worker publicado deve corresponder à V5.2.0.');
assert.ok(sw.includes('./js/equipment/equipment-photo-registry-v5.js'), 'Service Worker deve publicar o registo de fotografias.');
assert.equal(sw.includes('reference-sprite-v46.jpg'), false, 'Service Worker não deve publicar o sprite gerado antigo.');

const buildScript = fs.readFileSync(path.join(root,'scripts/build-static.js'),'utf8');
assert.match(buildScript,/photoRegistry\.matchAll/, 'O build deve recolher automaticamente fotografias reais declaradas no registo.');
assert.match(buildScript,/assets\\\/equipment\\\/photos/, 'O build deve limitar fotografias versionadas à pasta autorizada.');

const info = JSON.parse(fs.readFileSync(path.join(dist,'build-info.json'),'utf8'));
assert.equal(info.build,'equipment-catalog-v5');
assert.ok(Array.isArray(info.runtimeFiles) && info.runtimeFiles.includes('js/equipment/equipment-photo-registry-v5.js'));
assert.equal(info.runtimeFiles.some(file => /reference-sprite-v46/.test(file)), false, 'Allowlist do build não pode conter a referência gerada antiga.');
assert.equal(info.runtimeFiles.some(file => /app-equipment-(?:catalog|manual)/.test(file)), false, 'Allowlist do build não pode conter runtime legado.');
assert.equal(info.runtimeFiles.some(file => /^(?:docs|data|tests|scripts)\//.test(file)), false, 'Allowlist do build não pode publicar conteúdo de desenvolvimento.');

console.log('Static GitHub Pages build V5.2.0: OK');
