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
const sourceCss = read('css/equipment-sources-v5.css');

for (const ref of [
  'css/equipment-v5.css','css/equipment-sources-v5.css',
  'js/equipment/equipment-catalog-data-v5.js','js/equipment/equipment-sources-v5.js','js/equipment/equipment-symptoms-v5.js',
  'js/equipment/equipment-store-v5.js','js/equipment/equipment-components-v5.js','js/equipment/equipment-page-v5.js'
]) assert.ok(index.includes(ref), `index.html não carrega ${ref}`);

for (const obsolete of ['js/equipment-directory-v43.js','js/app-equipment-ui-v46.js','js/app-equipment-models-v43.js']) {
  assert.equal(index.includes(obsolete), false, `Camada técnica V4 antiga não deve continuar carregada: ${obsolete}`);
}

assert.match(index, /V5\.0 · fontes públicas verificáveis/, 'Identificação V5 baseada em fontes públicas em falta.');
assert.match(components, /Consulte rapidamente modelos, características, documentação e sintomas validados/);
assert.match(components, /Pesquisar nome, modelo, código, fabricante ou tipo/);
assert.match(components, /Com fotografia real/);
assert.match(components, /Com documentos/);
assert.match(components, /Com sintomas documentados/);
assert.match(components, /Validado por modelo/);
assert.match(components, /Nenhum equipamento corresponde aos filtros selecionados/);
for (const tab of ['Visão geral','Especificações','Sintomas','Documentação','Fotografias']) assert.ok(components.includes(tab), `Separador em falta: ${tab}`);
assert.match(components, /Possíveis causas documentadas — não são diagnóstico/);
assert.match(components, /Não validado para este modelo/);

assert.match(page, /Fontes desta secção/, 'Cada secção deve expor as suas fontes.');
assert.match(page, /Fonte: /, 'Cada cartão deve expor a origem principal.');
assert.match(page, /Sem fonte técnica pública confirmada/, 'Modelos sem evidência devem ser explícitos.');
assert.match(page, /referência visual do catálogo é uma imagem gerada no projeto/, 'A origem da referência visual deve ser explícita.');
assert.match(page, /event\.key==='Escape'/, 'Drawer deve fechar por Escape.');
assert.match(page, /data-eq5-open/, 'Ação Ver equipamento em falta.');
assert.match(page, /pickEquipmentImage/, 'Upload de fotografia real deve ser preservado.');

assert.match(css, /grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/, 'Grid desktop de 4 colunas em falta.');
assert.match(css, /@media\(max-width:1320px\).*repeat\(3,minmax\(0,1fr\)\)/s, 'Grid portátil de 3 colunas em falta.');
assert.match(css, /@media\(max-width:980px\).*repeat\(2,minmax\(0,1fr\)\)/s, 'Grid tablet de 2 colunas em falta.');
assert.match(css, /@media\(max-width:680px\).*grid-template-columns:1fr/s, 'Grid mobile de 1 coluna em falta.');
assert.match(css, /:focus-visible/, 'Focus visível em falta.');
assert.match(sourceCss, /\.eq5-section-source/, 'Estilos de fontes por secção em falta.');
assert.match(index, /Protótipo sem autenticação/, 'Aviso público deve permanecer.');

console.log('Equipment V5 source-aware UI tests: OK');
