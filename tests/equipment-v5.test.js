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
const photoRegistryJs = read('js/equipment/equipment-photo-registry-v5.js');
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
vm.runInContext(photoRegistryJs, context, { filename: 'equipment-photo-registry-v5.js' });
vm.runInContext(storeJs, context, { filename: 'equipment-store-v5.js' });
vm.runInContext(componentsJs, context, { filename: 'equipment-components-v5.js' });

const sources = context.window.EquipmentSourcesV5;
const matrix = context.window.EquipmentOperationalSymptomsV5;
const registry = context.window.EquipmentPhotoRegistryV5;
const store = context.window.EquipmentStoreV5;
const ui = context.window.EquipmentComponentsV5;

assert.equal(store.items.length, 53, 'O catálogo deve manter exatamente 53 equipamentos.');
assert.equal(new Set(store.items.map(item => item.slug)).size, 53, 'Os slugs devem ser únicos.');
assert.ok(Object.keys(sources).length >= 10, 'A base técnica externa deve permanecer preservada.');
assert.deepEqual(Array.from(registry.validate(store.items)), [], 'O registo de fotografias não pode conter associações inválidas.');

assert.equal(matrix.groups.VANDALISMO.items.length, 7, 'Vandalismo deve manter os 7 códigos fornecidos.');
assert.equal(matrix.groups.ESPECIFICO_DISPENSING.items.length, 19, 'Dispensing deve manter os 19 códigos fornecidos.');
assert.equal(matrix.groups.ESPECIFICO_VENDING.items.length, 7, 'Vending deve manter os 7 códigos fornecidos.');
assert.equal(matrix.groups.FUNCIONAMENTO_GERAL.items.length, 14, 'Funcionamento geral deve manter os 14 códigos fornecidos.');

const operationalEntries = Object.values(matrix.groups).flatMap(group => group.items);
assert.equal(new Set(operationalEntries.map(entry => entry.key)).size, operationalEntries.length, 'Cada sintoma operacional deve ter uma chave interna única por grupo.');
for (const entry of operationalEntries) assert.equal(entry.key, `${entry.groupId}:${entry.code}`);

for (const item of store.items) {
  assert.ok(item.catalogDescription && item.catalogDescription.length > 60, `Descrição operacional insuficiente: ${item.slug}`);
  assert.ok(item.operationalSymptomCount >= 18, `Equipamento sem matriz operacional funcional: ${item.slug}`);
  assert.equal('referenceImage' in item, false, `O modelo não deve depender de imagem de referência gerada: ${item.slug}`);
}

const postmix = store.items.find(item => item.category === 'Postmix');
const vending = store.items.find(item => item.category === 'Vending');
const vitrine = store.items.find(item => item.category === 'Vitrines');
const auxiliary = store.items.find(item => item.category === 'Outros');
assert.equal(postmix.operationalSymptomCount, 32, 'Postmix deve receber vandalismo + dispensing + funcionamento geral compatível.');
assert.equal(vending.operationalSymptomCount, 25, 'Vending deve receber vandalismo + vending + funcionamento geral compatível.');
assert.equal(vitrine.operationalSymptomCount, 18, 'Vitrines devem excluir sintomas de dispensing não aplicáveis.');
assert.equal(auxiliary.operationalSymptomCount, 32, 'Módulos auxiliares devem usar matriz funcional de dispensing.');
assert.equal(vitrine.operationalSymptomGroups.flatMap(group => group.items).some(entry => entry.code === '048'), false, 'Vitrines não devem receber “produto diferente do selecionado”.');
assert.equal(vitrine.operationalSymptomGroups.flatMap(group => group.items).some(entry => entry.code === '049'), false, 'Vitrines não devem receber “não para de sair produto”.');

const searchResult = store.query({ search:'não faz frio', category:'Vitrines' }, {});
assert.ok(searchResult.length > 0, 'A pesquisa deve encontrar equipamentos através dos sintomas operacionais.');

const escape = value => String(value ?? '').replace(/[&<>\"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[ch]));
const appStub = {
  escape,
  escapeAttr(value) { return escape(value).replace(/'/g, '&#39;'); },
  equipmentManualImage() { return null; }
};
const catalogHtml = ui.grid(appStub, store.items);
assert.equal((catalogHtml.match(/class="eq5-equipment-card"/g) || []).length, 53, 'O renderer deve gerar os 53 cartões sem erro de runtime.');
assert.match(catalogHtml, /Sintomas operacionais/, 'Os cartões devem apresentar sintomas operacionais.');
assert.match(catalogHtml, /Fotografia pendente/, 'Sem fotografia real deve existir estado pendente visível.');
assert.equal(catalogHtml.includes('Referência visual'), false, 'O catálogo não deve voltar a usar referência gerada como fotografia.');

const rax = store.items.find(item => item.slug === '300-rax');
const realPhotoStub = { ...appStub, equipmentManualImage(id) { return id === rax.id ? { dataUrl:'data:image/jpeg;base64,AA==' } : null; } };
const realPhotoHtml = ui.imageHtml(realPhotoStub, rax, 'card');
assert.match(realPhotoHtml, /Fotografia real/, 'Uma fotografia local deve ser identificada como fotografia real.');
assert.match(realPhotoHtml, /data-eq5-real-photo/, 'Fotografias reais devem ser monitorizadas para falhas de carregamento.');

const drawerHtml = ui.drawer(appStub, store, rax);
assert.match(drawerHtml, /<h4>Descrição<\/h4>/, 'A ficha deve renderizar a descrição.');
assert.match(drawerHtml, /<h4>Sintomas<\/h4>/, 'A ficha deve renderizar os sintomas.');
assert.match(drawerHtml, /causa só deve ser registada após confirmação do técnico/i, 'A ficha deve separar sintoma de causa confirmada.');
assert.equal(drawerHtml.includes('Ficha técnica'), false, 'A ficha não deve voltar a apresentar Ficha técnica.');
assert.equal(drawerHtml.includes('Documentação'), false, 'A ficha não deve voltar a apresentar Documentação.');

for (const token of ['eq5-card-grid','eq5-card-media','eq5-card-content','equipmentV5Search','data-eq5-category','Ver ficha','Criar registo','Descrição','Sintomas','Fotografia pendente']) {
  assert.ok(componentsJs.includes(token), `UI de Equipamentos sem token obrigatório: ${token}`);
}
for (const forbidden of ['Fonte desta secção','Mais filtros','data-eq5-tab','Por validar','Sem sintomas específicos associados','Referência visual','reference-sprite-v46.jpg']) {
  assert.equal(componentsJs.includes(forbidden), false, `A UI não deve apresentar: ${forbidden}`);
}
assert.match(pageJs, /renderEquipmentRuntimeError/, 'A página deve apresentar recuperação visível em vez de ficar em branco.');
assert.match(pageJs, /EquipmentPhotoRegistryV5/, 'A página deve validar a dependência do registo de fotografias.');
assert.match(pageJs, /bindEquipmentPhotoHealth/, 'Falha de uma fotografia não pode quebrar a página.');
assert.match(pageJs, /event\.key\s*===\s*'Escape'/, 'A ficha deve continuar a fechar por Escape.');
assert.ok(imagesJs.includes('equipmentSlug') && imagesJs.includes('validationStatus'), 'Fotografias locais devem guardar a associação ao equipamento.');
assert.ok(actionsJs.includes('startRecordFromCatalog'), 'Criar registo a partir do catálogo deve permanecer funcional.');

assert.match(css, /\.eq5-grid\{width:100%;max-width:100%;min-width:0;display:grid;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/, 'O catálogo desktop deve manter dois cartões por linha sem largura intrínseca perigosa.');
assert.match(css, /@media\(max-width:1180px\)\{\.eq5-grid\{grid-template-columns:1fr\}/, 'Em portátil/tablet deve existir um cartão por linha.');

for (const file of ['equipment-sources-v5.js','equipment-symptoms-v5.js','equipment-operational-symptoms-v5.js','equipment-catalog-data-v5.js','equipment-photo-registry-v5.js','equipment-store-v5.js','equipment-local-images-v5.js','equipment-actions-v5.js','equipment-components-v5.js','equipment-page-v5.js']) {
  assert.ok(index.includes(`js/equipment/${file}`), `Runtime sem ${file}`);
  assert.ok(sw.includes(`./js/equipment/${file}`), `PWA sem ${file}`);
}
assert.ok(index.indexOf('equipment-photo-registry-v5.js') < index.indexOf('equipment-store-v5.js'), 'O registo de fotografias deve carregar antes do store.');
assert.ok(index.indexOf('equipment-operational-symptoms-v5.js') < index.indexOf('equipment-store-v5.js'), 'A matriz operacional deve carregar antes do store.');
assert.ok(index.indexOf('equipment-components-v5.js') < index.indexOf('equipment-page-v5.js'), 'Os componentes devem carregar antes da página.');

console.log(`Equipment V5.2.0 tests: OK (${store.items.length} equipamentos, fotografias reais + sintomas funcionais)`);
