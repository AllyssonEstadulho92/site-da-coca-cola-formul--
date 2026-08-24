'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const directory = read('js/equipment-directory-v43.js');
const refs = read('js/app-equipment-reference-images-v46.js');
const ui = read('js/app-equipment-ui-v46.js');
const css = read('css/equipment-v46.css');
const index = read('index.html');
const sprite = path.join(root, 'assets/equipment/reference-sprite-v46.jpg');

assert.ok(fs.existsSync(sprite), 'O sprite de referência dos equipamentos deve existir.');
assert.ok(fs.statSync(sprite).size > 5000, 'O sprite de referência parece vazio ou inválido.');

const tileBlock = refs.match(/const TILE_BY_SLUG = \{([\s\S]*?)\n  \};/);
assert.ok(tileBlock, 'Mapa de imagens de referência em falta.');
const tiles = [...tileBlock[1].matchAll(/'[^']+'\s*:\s*\d+/g)];
assert.equal(tiles.length, 53, 'Devem existir exatamente 53 referências visuais mapeadas.');

for (const required of ['plus-450','icool-900','energize-3','recor-1-3-5p-pm','freestyle-9100','g-10']) {
  assert.ok(refs.includes(`'${required}'`), `Referência visual em falta: ${required}`);
}

for (const forbidden of [
  'Não refrigera adequadamente.',
  'Temperatura instável.',
  'Não dispensa bebida.',
  'Bebida sem gás ou sem sabor.',
  'Equipamento não responde.',
  'Funcionamento intermitente.'
]) assert.equal(directory.includes(forbidden), false, `Sintoma genérico/inventado ainda presente: ${forbidden}`);

assert.match(directory, /symptoms:\s*\[\]/, 'Os modelos sem sintomas documentados devem manter lista vazia.');
assert.match(directory, /consequences:\s*\[\]/, 'Os modelos sem consequências documentadas devem manter lista vazia.');
assert.match(directory, /não documenta sintomas específicos/i, 'Deve existir mensagem explícita para sintomas não documentados.');
assert.match(directory, /não documenta consequências específicas/i, 'Deve existir mensagem explícita para consequências não documentadas.');

assert.match(refs, /equipmentDisplayImage/, 'A fotografia manual deve poder substituir a referência visual.');
assert.match(refs, /Imagem de referência gerada para o catálogo/, 'A imagem gerada deve ser identificada como referência, não fotografia real.');
assert.match(ui, /Não documentado na fonte disponível/, 'A UI deve comunicar ausência de evidência sem inventar conteúdo.');
assert.match(ui, /Adicionar fotografia real/, 'A UI deve permitir substituir a referência por fotografia real.');
assert.match(css, /reference-sprite-v46\.jpg/, 'O CSS deve usar o sprite local de referências.');
assert.match(index, /app-equipment-reference-images-v46\.js/, 'O index deve carregar o mapeamento visual V4.6.');
assert.match(index, /app-equipment-ui-v46\.js/, 'O index deve carregar a UI V4.6.');
assert.match(index, /equipment-v46\.css/, 'O index deve carregar os estilos V4.6.');
assert.ok(index.indexOf('app-equipment-reference-images-v46.js') < index.indexOf('app-equipment-ui-v46.js'), 'O mapeamento de imagens deve carregar antes da UI V4.6.');

console.log('Equipment reference/evidence tests: OK (53 modelos)');