'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const css = fs.readFileSync(path.join(root, 'css/equipment-v5.css'), 'utf8');

assert.match(css, /\.eq5-page\{[^}]*width:100%;[^}]*min-width:0;[^}]*overflow-x:clip/, 'A página deve limitar a largura ao content box e cortar overflow acidental.');
assert.match(css, /\.eq5-equipment-card\{[^}]*width:100%;[^}]*max-width:100%;[^}]*min-width:0/, 'Cada cartão deve poder encolher dentro do viewport.');
assert.match(css, /\.eq5-card-grid\{[^}]*width:100%;[^}]*min-width:0;[^}]*grid-template-columns:180px minmax\(0,1fr\)/, 'Desktop deve manter imagem à esquerda e conteúdo flexível à direita.');
assert.match(css, /\.eq5-card-content\{[^}]*min-width:0;[^}]*overflow:hidden/, 'O conteúdo não pode impor largura intrínseca ao cartão.');
assert.match(css, /overflow-wrap:anywhere/, 'Textos longos devem poder quebrar dentro da coluna de conteúdo.');
assert.match(css, /@media\(max-width:700px\)[\s\S]*?\.eq5-card-grid\{[^}]*grid-template-columns:minmax\(94px,28vw\) minmax\(0,1fr\)/, 'No smartphone a fotografia deve manter largura proporcional sem empurrar o conteúdo para fora do ecrã.');
assert.match(css, /@media\(max-width:430px\)[\s\S]*?\.eq5-card-grid\{[^}]*grid-template-columns:minmax\(86px,27vw\) minmax\(0,1fr\)/, 'Em iPhone estreito as duas secções devem continuar dentro do viewport.');
assert.match(css, /\.eq5-card-actions\{[^}]*min-width:0/, 'A zona de ações deve poder encolher.');
assert.match(css, /@media\(max-width:700px\)[\s\S]*?\.eq5-card-actions\{display:grid;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/, 'Os dois botões devem dividir a largura disponível sem overflow.');
assert.match(css, /\.eq5-card-actions \.btn\{[^}]*min-width:0/, 'Botões não podem impor largura mínima ao cartão.');
assert.match(css, /\.eq5-drawer\{[^}]*max-width:100vw/, 'A ficha lateral não pode exceder o viewport.');
assert.match(css, /@media\(max-width:700px\)[\s\S]*?\.eq5-drawer\{width:100vw;max-width:100vw\}/, 'A ficha mobile deve ocupar exatamente a largura do viewport.');
assert.equal(/reference-sprite-v46\.jpg/.test(css), false, 'O CSS não pode voltar a depender do sprite de referência gerado.');

console.log('Equipment mobile layout contract V5.2.0: OK');
