'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const sourcesJs = read('js/equipment/equipment-sources-v5.js');
const symptomsJs = read('js/equipment/equipment-symptoms-v5.js');
const operationalJs = read('js/equipment/equipment-operational-symptoms-v5.js');
const catalogJs = read('js/equipment/equipment-catalog-data-v5.js');
const storeJs = read('js/equipment/equipment-store-v5.js');
const imagesJs = read('js/equipment/equipment-local-images-v5.js');
const actionsJs = read('js/equipment/equipment-actions-v5.js');
const componentsJs = read('js/equipment/equipment-components-v5.js');
const pageJs = read('js/equipment/equipment-page-v5.js');
const css = read('css/equipment-v5.css');
const index = read('index.html');
const sw = read('service-worker.js');

const context = { window: {} };
vm.createContext(context);
vm.runInContext(sourcesJs, context, { filename: 'equipment-sources-v5.js' });
vm.runInContext(symptomsJs, context, { filename: 'equipment-symptoms-v5.js' });
vm.runInContext(operationalJs, context, { filename: 'equipment-operational-symptoms-v5.js' });
vm.runInContext(catalogJs, context, { filename: 'equipment-catalog-data-v5.js' });
vm.runInContext(storeJs, context, { filename: 'equipment-store-v5.js' });
vm.runInContext(componentsJs, context, { filename: 'equipment-components-v5.js' });

const sources = context.window.EquipmentSourcesV5;
const symptoms = context.window.EquipmentSymptomsV5;
const matrix = context.window.EquipmentOperationalSymptomsV5;
const store = context.window.EquipmentStoreV5;
const ui = context.window.EquipmentComponentsV5;

assert.equal(store.items.length, 53, 'O catálogo deve manter exatamente 53 equipamentos.');
assert.equal(new Set(store.items.map(item => item.slug)).size, 53, 'Os slugs devem ser únicos.');
assert.ok(Object.keys(sources).length >= 10, 'A base técnica externa deve permanecer preservada.');
assert.ok(matrix?.groups?.VANDALISMO && matrix?.groups?.FUNCIONAMENTO_GERAL, 'A matriz operacional deve estar disponível.');
assert.equal(matrix.groups.VANDALISMO.items.length, 7, 'Vandalismo deve manter os 7 códigos fornecidos.');
assert.equal(matrix.groups.ESPECIFICO_DISPENSING.items.length, 19, 'Dispensing deve manter os 19 códigos fornecidos.');
assert.equal(matrix.groups.ESPECIFICO_VENDING.items.length, 7, 'Vending deve manter os 7 códigos fornecidos.');
assert.equal(matrix.groups.FUNCIONAMENTO_GERAL.items.length, 14, 'Funcionamento geral deve manter os 14 códigos fornecidos.');

const operationalEntries = Object.values(matrix.groups).flatMap(group => group.items);
assert.equal(new Set(operationalEntries.map(entry => entry.key)).size, operationalEntries.length, 'Cada sintoma operacional deve ter uma chave interna única por grupo.');
for (const entry of operationalEntries) {
  assert.equal(entry.key, `${entry.groupId}:${entry.code}`, `Chave operacional inválida para ${entry.code}.`);
}
const codeCounts = operationalEntries.reduce((map, entry) => map.set(entry.code, (map.get(entry.code) || 0) + 1), new Map());
assert.ok((codeCounts.get('020') || 0) > 1, 'O teste deve cobrir códigos visuais repetidos entre grupos.');
assert.ok((codeCounts.get('066') || 0) > 1, 'O teste deve cobrir códigos contextuais repetidos sem colisão interna.');

for (const item of store.items) {
  assert.ok(item.catalogDescription && item.catalogDescription.length > 80, `Descrição operacional insuficiente: ${item.slug}`);
  assert.ok(item.operationalSymptomCount >= 21, `Equipamento sem matriz operacional completa: ${item.slug}`);
}
const postmix = store.items.find(item => item.category === 'Postmix');
const vending = store.items.find(item => item.category === 'Vending');
const vitrine = store.items.find(item => item.category === 'Vitrines');
const auxiliary = store.items.find(item => item.category === 'Outros');
assert.equal(postmix.operationalSymptomCount, 40, 'Postmix deve receber vandalismo + dispensing + geral.');
assert.equal(vending.operationalSymptomCount, 28, 'Vending deve receber vandalismo + vending + geral.');
assert.equal(vitrine.operationalSymptomCount, 21, 'Vitrines devem receber vandalismo + geral.');
assert.equal(auxiliary.operationalSymptomCount, 40, 'Módulos auxiliares devem receber matriz de dispensing.');

const searchResult = store.query({ search:'não faz frio', category:'Vitrines' }, {});
assert.ok(searchResult.length > 0, 'A pesquisa deve encontrar equipamentos através dos sintomas operacionais.');

const escape = value => String(value ?? '').replace(/[&<>\"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[ch]));
const appStub = {
  escape,
  escapeAttr(value) { return escape(value).replace(/'/g, '&#39;'); },
  equipmentManualImage() { return null; }
};
const catalogHtml = ui.grid(appStub, store.items);
assert.equal((catalogHtml.match(/class="eq5-equipment-card"/g) || []).length, 53, 'O renderer deve conseguir gerar os 53 cartões sem erro de runtime.');
assert.match(catalogHtml, /Sintomas aplicáveis/, 'Os cartões renderizados devem apresentar sintomas.');
const rax = store.items.find(item => item.slug === '300-rax');
const drawerHtml = ui.drawer(appStub, store, rax);
assert.match(drawerHtml, /<h4>Descrição<\/h4>/, 'A ficha deve renderizar a descrição.');
assert.match(drawerHtml, /<h4>Sintomas<\/h4>/, 'A ficha deve renderizar os sintomas.');
assert.equal(drawerHtml.includes('Ficha técnica'), false, 'A ficha não deve voltar a apresentar Ficha técnica.');
assert.equal(drawerHtml.includes('Documentação'), false, 'A ficha não deve voltar a apresentar Documentação.');

for (const token of [
  'eq5-card-grid','eq5-card-media','eq5-card-content','equipmentV5Search','data-eq5-category',
  'Ver ficha','Criar registo','Descrição','Sintomas','Sintomas aplicáveis','códigos operacionais'
]) assert.ok(componentsJs.includes(token), `UI de Equipamentos sem token obrigatório: ${token}`);

for (const forbidden of ['Ficha técnica','Documentação','Fonte desta secção','Mais filtros','data-eq5-tab','Por validar','Sem sintomas específicos associados']) {
  assert.equal(componentsJs.includes(forbidden), false, `A UI não deve apresentar: ${forbidden}`);
}
assert.equal(pageJs.includes('equipmentV5Tab'), false, 'A página não deve manter estado de tabs antigas.');
assert.match(pageJs, /defaultFilters\s*=\s*\(\)\s*=>\s*\(\{\s*search:\s*'',\s*category:\s*'ALL'/, 'A página deve manter apenas pesquisa e categoria no estado visível.');
assert.match(pageJs, /renderEquipmentRuntimeError/, 'A página deve apresentar recuperação visível em vez de ficar em branco após erro de runtime.');
assert.match(pageJs, /dependenciesReady/, 'A página deve validar dependências antes de instalar o renderer.');
assert.match(pageJs, /event\.key\s*===\s*'Escape'/, 'A ficha deve continuar a fechar por Escape.');
assert.ok(imagesJs.includes('equipmentManualImage') && imagesJs.includes('pickEquipmentImage'), 'Fotografias locais devem continuar funcionais.');
assert.ok(actionsJs.includes('startRecordFromCatalog'), 'Criar registo a partir do catálogo deve permanecer funcional.');

assert.match(css, /\.eq5-grid\{display:grid;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/, 'O catálogo desktop deve ter dois cartões por linha.');
assert.match(css, /\.eq5-card-grid\{display:grid;grid-template-columns:180px minmax\(0,1fr\)/, 'Cada cartão deve manter imagem à esquerda e conteúdo à direita.');
assert.match(css, /@media\(max-width:1180px\)\{\.eq5-grid\{grid-template-columns:1fr\}/, 'Em portátil/tablet deve existir um cartão por linha.');
assert.match(css, /@media\(max-width:700px\)[\s\S]*?\.eq5-card-grid\{grid-template-columns:122px minmax\(0,1fr\)/, 'No smartphone o cartão deve preservar as duas secções.');
assert.match(css, /@media\(max-width:420px\)[\s\S]*?\.eq5-card-grid\{grid-template-columns:104px minmax\(0,1fr\)/, 'Em smartphone estreito a imagem deve reduzir sem mudar de lado.');

for (const file of ['equipment-sources-v5.js','equipment-symptoms-v5.js','equipment-operational-symptoms-v5.js','equipment-catalog-data-v5.js','equipment-store-v5.js','equipment-local-images-v5.js','equipment-actions-v5.js','equipment-components-v5.js','equipment-page-v5.js']) {
  assert.ok(index.includes(`js/equipment/${file}`), `Runtime sem ${file}`);
  assert.ok(sw.includes(`./js/equipment/${file}`), `PWA sem ${file}`);
}
assert.ok(index.indexOf('equipment-operational-symptoms-v5.js') < index.indexOf('equipment-store-v5.js'), 'A matriz operacional deve carregar antes do store.');
assert.ok(index.indexOf('equipment-components-v5.js') < index.indexOf('equipment-page-v5.js'), 'Os componentes devem carregar antes da página.');

console.log(`Equipment V5.1.1 tests: OK (${store.items.length} equipamentos, runtime + códigos contextuais)`);
