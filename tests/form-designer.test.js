'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const base = read('js/app-base.js');
const shell = read('js/app-shell.js');
const designer = read('js/app-form-designer.js');
const view = read('js/app-form-view.js');
const logic = read('js/app-form-logic.js');
const utils = read('js/app-utils.js');
const css = read('css/form-designer.css');
const index = read('index.html');
const db = read('js/db.js');
const sw = read('service-worker.js');

assert.match(base, /id:\s*'designer'/, 'A navegação deve expor o Designer de Formulário.');
assert.equal(/id:\s*'equipment'/.test(base), false, 'A navegação não pode manter a área Equipamentos.');
assert.match(base, /formDesign:\s*\{/, 'As configurações devem conter o design do formulário.');
assert.match(base, /sectionOrder:\s*\['identity',\s*'location',\s*'incident',\s*'routing',\s*'status'\]/, 'A ordem padrão das secções deve ser explícita.');
assert.match(shell, /designer:\s*\(\)\s*=>\s*this\.renderFormDesigner\(\)/, 'A rota Designer deve possuir renderer.');
assert.equal(/equipment:\s*\(\)/.test(shell), false, 'O shell não pode manter renderer de Equipamentos.');

for (const token of ['renderFormDesigner','renderFormDesignerPreview','saveFormDesigner','resetFormDesigner','hiddenOptionalFields','sectionTitles','showSummary']) {
  assert.ok(designer.includes(token), `Designer sem capacidade obrigatória: ${token}`);
}
assert.match(designer, /Obrigatório · sempre visível/, 'Campos obrigatórios devem estar protegidos contra ocultação.');
assert.match(view, /Personalizar formulário/, 'O formulário real deve disponibilizar acesso direto ao Designer.');
assert.match(view, /design\.sectionOrder\.map/, 'O formulário deve respeitar a ordem configurada.');
assert.match(view, /design\.showSummary/, 'O resumo lateral deve ser configurável.');
assert.match(view, /isFormFieldVisible/, 'Campos opcionais devem obedecer ao Designer.');
assert.match(logic, /if \(data\.has\(key\)\)/, 'Campos ocultos não podem apagar valores existentes.');
assert.match(utils, /designer:/, 'A navegação deve possuir ícone próprio para o Designer.');
assert.equal(/equipment:/.test(utils), false, 'O ícone dedicado da antiga área Equipamentos deve ser removido.');

for (const token of ['designer-workspace','designer-section-card','designer-preview-window','form-design','density-compact','width-wide','accent-graphite','@media(max-width:820px)']) {
  assert.ok(css.includes(token), `CSS do protótipo sem contrato: ${token}`);
}
assert.match(index, /css\/form-designer\.css/, 'O protótipo deve carregar o CSS do Designer.');
assert.match(index, /js\/app-form-designer\.js/, 'O protótipo deve carregar o módulo do Designer.');
assert.equal(/js\/equipment\//.test(index), false, 'O HTML não pode carregar módulos de Equipamentos.');
assert.equal(/equipment-v5\.css/.test(index), false, 'O HTML não pode carregar CSS de Equipamentos.');

assert.match(db, /DB_VERSION\s*=\s*5/, 'A migração de limpeza deve usar schema local 5.');
assert.match(db, /deleteObjectStore\('equipmentImages'\)/, 'A migração deve remover a store dedicada à área eliminada.');
assert.equal(/getAll\('equipmentImages'\)/.test(db), false, 'Backups V6 não podem exportar imagens da área removida.');
assert.match(db, /appVersion:\s*'6\.0\.0'/, 'Backups devem identificar V6.0.0.');
assert.match(sw, /formularios-operacionais-v6\.0\.0/, 'O cache PWA deve estar isolado na V6.0.0.');
assert.equal(/js\/equipment\//.test(sw), false, 'O Service Worker não pode manter módulos de Equipamentos.');
assert.ok(sw.includes('./js/app-form-designer.js') && sw.includes('./css/form-designer.css'), 'Designer deve funcionar offline após cache inicial.');

console.log('Form Designer V6 tests: OK');
