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
  'data/equipment',
  'docs/V3.8_ACESSO.md',
  'assets/equipment/catalog-manifest.json',
  'assets/equipment/DIRECTORY_POLICY.md',
  'assets/equipment/STRUCTURE_VERSION',
  'assets/equipment/.directory-structure-ready'
];
for (const item of forbidden) assert.equal(exists(item), false, `Ficheiro/diretório legado ainda presente: ${item}`);

const cssFiles = fs.readdirSync(path.join(root, 'css')).sort();
assert.deepEqual(cssFiles, [
  'base.css','equipment-sources-v5.css','equipment-v5.css','features.css','styles.css','theme.css'
].sort(), 'A pasta css deve conter apenas estilos ativos.');

const rootEquipmentJs = fs.readdirSync(path.join(root, 'js'), { withFileTypes:true })
  .filter(entry => entry.isFile() && /equipment/i.test(entry.name))
  .map(entry => entry.name);
assert.deepEqual(rootEquipmentJs, [], 'Módulos de Equipamentos devem existir apenas em js/equipment/.');

const equipmentAssets = fs.readdirSync(path.join(root, 'assets/equipment')).sort();
assert.deepEqual(equipmentAssets, ['README.md','reference-sprite-v46.jpg'].sort(), 'assets/equipment deve conter apenas recursos ativos.');

console.log('Project cleanliness tests: OK');
