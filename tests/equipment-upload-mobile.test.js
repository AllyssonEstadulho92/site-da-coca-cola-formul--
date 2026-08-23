'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const index = read('index.html');
const js = read('js/app-equipment-upload-hotfix.js');
const css = read('css/equipment-upload-hotfix.css');

assert.match(index, /js\/app-equipment-upload-hotfix\.js/, 'O index deve carregar o hotfix de upload mobile.');
assert.match(index, /css\/equipment-upload-hotfix\.css/, 'O index deve carregar os estilos do upload mobile.');
assert.match(js, /equipment-manual-placeholder/, 'A área sem imagem deve receber interação direta.');
assert.match(js, /equipment-manual-image-wrap\.is-card/, 'A fotografia existente deve permitir substituição direta.');
assert.match(js, /this\.pickEquipmentImage\(equipmentId\)/, 'O toque deve abrir o seletor de imagem.');
assert.match(js, /setAttribute\('role', 'button'\)/, 'A área clicável deve expor semântica de botão.');
assert.match(js, /setAttribute\('tabindex', '0'\)/, 'A área clicável deve ser acessível por teclado.');
assert.match(js, /event\.key !== 'Enter'/, 'O hotfix deve suportar ativação por Enter/Espaço.');
assert.match(js, /Toque na imagem para adicionar fotografia/, 'O cartão deve explicar a ação de upload.');
assert.match(css, /Toque para adicionar fotografia/, 'O affordance visual deve ficar explícito no cartão.');
assert.equal(/eval\s*\(|new\s+Function\s*\(/.test(js), false, 'O hotfix não deve executar código dinâmico.');

console.log('Equipment upload mobile tests: OK');
