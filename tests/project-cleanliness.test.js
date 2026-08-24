'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const exists = value => fs.existsSync(path.join(root, value));

const forbidden = [
  'js/app-equipment-catalog-v4.js',
  'js/app-equipment-catalog.js',
  'js/app-equipment-default-images.js',
  'js/app-equipment-manual.js',
  'js/app-equipment-models-v43.js',
  'js/app-equipment-reference-images-v46.js',
  'js/app-equipment-ui-v46.js',
  'js/app-equipment-upload-hotfix.js',
  'js/equipment-data.js',
  'js/equipment-directory-v43.js',
  'css/equipment-catalog.css',
  'css/equipment-images-v41.css',
  'css/equipment-manual-v42.css',
  'css/equipment-models-v43.css',
  'css/equipment-upload-hotfix.css',
  'css/equipment-v46.css',
  'css/equipment-sources-v5.css',
  'data/equipment',
  'docs/V3.8_ACESSO.md',
  'assets/equipment/catalog-manifest.json',
  'assets/equipment/DIRECTORY_POLICY.md',
  'assets/equipment/STRUCTURE_VERSION',
  'assets/equipment/.directory-structure-ready',
  'tests/equipment-catalog.test.js',
  'tests/equipment-default-images.test.js',
  'tests/equipment-directories.test.js',
  'tests/equipment-model-names.test.js',
  'tests/equipment-reference-v46.test.js',
  'tests/equipment-upload-mobile.test.js',
  'tests/equipment-v5-ui.test.js',
  'tests/pages-build.test.js'
];
for (const item of forbidden) assert.equal(exists(item), false, `Ficheiro/diretório legado ainda presente: ${item}`);

const cssFiles = fs.readdirSync(path.join(root, 'css')).sort();
assert.deepEqual(cssFiles, [
  'base.css','equipment-v5.css','features.css','styles.css','theme.css'
].sort(), 'A pasta css deve conter apenas estilos ativos.');

const rootEquipmentJs = fs.readdirSync(path.join(root, 'js'), { withFileTypes:true })
  .filter(entry => entry.isFile() && /equipment/i.test(entry.name))
  .map(entry => entry.name);
assert.deepEqual(rootEquipmentJs, [], 'Módulos de Equipamentos devem existir apenas em js/equipment/.');

const equipmentAssets = fs.readdirSync(path.join(root, 'assets/equipment')).sort();
assert.deepEqual(equipmentAssets, ['README.md','reference-sprite-v46.jpg'].sort(), 'assets/equipment deve conter apenas recursos ativos.');

const expectedTests = [
  'build-static.test.js',
  'core.test.js',
  'equipment-images.test.js',
  'equipment-v5.test.js',
  'integrity.test.js',
  'no-auth.test.js',
  'project-cleanliness.test.js',
  'public-safety.test.js',
  'pwa-refresh.test.js',
  'syntax.test.js'
].sort();
const actualTests = fs.readdirSync(path.join(root, 'tests')).filter(name => name.endsWith('.test.js')).sort();
assert.deepEqual(actualTests, expectedTests, 'A pasta tests deve conter apenas a suite ativa declarada para V5.1.1.');

const clutterPatterns = [
  /^\.DS_Store$/,
  /^Thumbs\.db$/i,
  /~$/,
  /\.(?:bak|tmp|old|orig|rej)$/i
];
function scan(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes:true })) {
    if (['.git','node_modules','dist'].includes(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) scan(fullPath);
    else for (const pattern of clutterPatterns) assert.equal(pattern.test(entry.name), false, `Ficheiro temporário/residual proibido: ${path.relative(root, fullPath)}`);
  }
}
scan(root);

console.log('Project cleanliness tests V5.1.1: OK');
