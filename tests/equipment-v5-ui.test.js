'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const index = read('index.html');
const components = read('js/equipment/equipment-components-v5.js');
const page = read('js/equipment/equipment-page-v5.js');
const css = read('css/equipment-v5.css');

for (const ref of [
  'css/equipment-v5.css',
  'js/equipment/equipment-sources-v5.js',
  'js/equipment/equipment-symptoms-v5.js',
  'js/equipment/equipment-store-v5.js',
  'js/equipment/equipment-components-v5.js',
  'js/equipment/equipment-page-v5.js'
]) assert.ok(index.includes(ref), `index.html não carrega ${ref}`);

assert.ok(index.indexOf('app-equipment-ui-v46.js') < index.indexOf('equipment-page-v5.js'), 'A V5 deve ser a camada final/autoridade de renderização.');
assert.match(components, /Consulte rapidamente modelos, características, documentação e sintomas validados/, 'Cabeçalho operacional em falta.');
assert.match(components, /Pesquisar nome, modelo, código, fabricante ou tipo/, 'Pesquisa multicanal em falta.');
assert.match(components, /Com fotografia real/, 'Filtro de fotografia em falta.');
assert.match(components, /Com documentos/, 'Filtro de documentos em falta.');
assert.match(components, /Com sintomas documentados/, 'Filtro de sintomas em falta.');
assert.match(components, /Validado por modelo/, 'Estado de validação por modelo em falta.');
assert.match(components, /Nenhum equipamento corresponde aos filtros selecionados/, 'Empty state em falta.');
assert.match(components, /Visão geral/, 'Separador Visão geral em falta.');
assert.match(components, /Especificações/, 'Separador Especificações em falta.');
assert.match(components, /Sintomas/, 'Separador Sintomas em falta.');
assert.match(components, /Documentação/, 'Separador Documentação em falta.');
assert.match(components, /Fotografias/, 'Separador Fotografias em falta.');
assert.match(components, /Possíveis causas documentadas — não são diagnóstico/, 'Separação entre causa possível e diagnóstico em falta.');
assert.match(components, /Não validado para este modelo/, 'Estado explícito sem evidência em falta.');
assert.match(page, /event\.key === 'Escape'/, 'Drawer deve fechar por Escape.');
assert.match(page, /data-eq5-open/, 'Ação Ver equipamento em falta.');
assert.match(page, /pickEquipmentImage/, 'Upload de fotografia real deve ser preservado.');
assert.match(css, /grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/, 'Grid desktop de 4 colunas em falta.');
assert.match(css, /@media\(max-width:1320px\).*repeat\(3,minmax\(0,1fr\)\)/s, 'Grid portátil de 3 colunas em falta.');
assert.match(css, /@media\(max-width:980px\).*repeat\(2,minmax\(0,1fr\)\)/s, 'Grid tablet de 2 colunas em falta.');
assert.match(css, /@media\(max-width:680px\).*grid-template-columns:1fr/s, 'Grid mobile de 1 coluna em falta.');
assert.match(css, /:focus-visible/, 'Estados de focus visível em falta.');
assert.match(index, /Protótipo sem autenticação/, 'Aviso público sem autenticação deve permanecer.');

console.log('Equipment V5 UI tests: OK');
