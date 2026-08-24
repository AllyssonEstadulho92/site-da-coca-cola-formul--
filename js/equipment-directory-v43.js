(() => {
  'use strict';

  const base = Array.isArray(window.EquipmentCatalogData) ? window.EquipmentCatalogData : [];
  const manualSource = 'Manual do Equipamento Coca-Cola — fornecido ao projeto';
  const manualNote = 'Dados estruturados a partir do manual fornecido ao projeto. Confirmar sempre a placa técnica e a variante instalada antes de qualquer intervenção.';
  const notDocumentedSymptoms = 'A fonte disponível no projeto não documenta sintomas específicos deste modelo. Registe apenas o sintoma relatado pelo cliente e valide-o na documentação técnica autorizada.';
  const notDocumentedConsequences = 'A fonte disponível no projeto não documenta consequências específicas deste modelo. Não inferir danos sem diagnóstico técnico ou documentação autorizada.';

  // slug | nome | modelo | categoria app | visual | categoria na fonte | potência | facto 2 | valor 2 | peso
  const rows = `
plus-450|PLUS 450|PLUS 450|Vitrines|single-cooler|Vitrine vertical|350 W|Volume|398 L|75 kg
retro|RETRO|RETRO|Vitrines|chest|Vitrine de tampa (horizontal)|260 W|Volume|233 L|75 kg
300-rax|300 RAX COCA-COLA|300 RAX|Vitrines|chest|Vitrine de tampa (horizontal)|200 W|Volume|296 L|46 kg
icool-300|ICOOL 300|ICOOL 300|Vitrines|single-cooler|Vitrine vertical|450 W|Volume|300 L|85 kg
icool-450|ICOOL 450|ICOOL 450|Vitrines|single-cooler|Vitrine vertical|480 W|Volume|450 L|95 kg
icool-900|ICOOL 900|ICOOL 900|Vitrines|double-cooler|Vitrine vertical de grande capacidade|505 W|Volume|897 L|165 kg
fv-280|FV 280 COCA-COLA|FV 280|Vitrines|single-cooler|Vitrine vertical|230 W|Volume|280 L|65 kg
bgz-1001p|BGZ-1001P|BGZ-1001P|Vitrines|double-cooler|Vitrine frigorífica vertical|550 W|Volume|1000 L|180 kg
plus-900|PLUS 900|PLUS 900|Vitrines|double-cooler|Vitrine vertical de alta capacidade|700 W|Volume|900 L|170 kg
rvc-400|RVC 400|RVC 400|Vitrines|chest|Vitrine horizontal com tampas deslizantes|360 W|Volume|400 L|68 kg
s288|S288|S288|Vitrines|single-cooler|Frigorífico de apoio (porta opaca)|200 W|Volume|90 L|42 kg
v-544|V-544|V-544|Vitrines|single-cooler|Vitrine vertical|520 W|Volume|450 L|95 kg
ic-300|IC 300|IC 300|Vitrines|single-cooler|Vitrine vertical compacta|450 W|Volume|300 L|85 kg
ic-450|IC 450|IC 450|Vitrines|single-cooler|Vitrine vertical compacta|480 W|Volume|450 L|95 kg
dn-3061|DN 3061|DN 3061|Vitrines|single-cooler|Vitrine vertical com porta de vidro|480 W|Volume|350 L|90 kg
sc410|SC410|SC410|Vitrines|single-cooler|Vitrine vertical profissional|520 W|Volume|410 L|100 kg
botellero-1m|BOTELLERO 1 M|BOTELLERO 1 M|Vitrines|chest|Arca refrigerada de bar (horizontal)|280 W|Volume|340 L|65 kg
v-545-8|V 545/8 COCA-COLA|V 545/8|Vitrines|single-cooler|Vitrine vertical profissional|600 W|Volume|545 L|110 kg
fv-1200|FV 1200|FV 1200|Vitrines|double-cooler|Vitrine vertical dupla porta|800 W|Volume|1200 L|195 kg
loop-xl-horizontal|LOOP XL Horizontal|LOOP XL|Vitrines|chest|Vitrine horizontal|360 W|Volume|468 L|72 kg
s-78|S-78 COCA-COLA|S-78|Vitrines|single-cooler|Frigorífico vertical de apoio|240 W|Volume|160 L|60 kg
bc-80b|BC 80B COCA-COLA|BC 80B|Vitrines|single-cooler|Frigorífico de bebidas (apoio)|210 W|Volume|85 L|45 kg
g-style-1|G-STYLE 1|G-STYLE 1|Vitrines|single-cooler|Frigorífico vertical de apoio estético|260 W|Volume|180 L|60 kg
vr-200-2p|VR-200 2P|VR-200 2P|Vitrines|chest|Arca horizontal dupla|300 W|Volume|400 L|85 kg
easyreach-express|EASYREACH EXPRESS|EASYREACH EXPRESS|Vitrines|open-cooler|Vitrine vertical semi aberta|700 W|Volume|480 L|105 kg
energize-3|ENERGIZE 3|ENERGIZE 3|Postmix|postmix|Post-Mix (3 sabores)|400 W|Capacidade|3 válvulas|120 kg
energize-3h|ENERGIZE 3H|ENERGIZE 3H|Postmix|postmix|Post-Mix horizontal|400 W|Capacidade|3 válvulas|115 kg
energize-4|ENERGIZE 4|ENERGIZE 4|Postmix|postmix|Post-Mix (bebidas ao copo)|420 W|Capacidade|4 sabores|134 kg
energize-4-8p|ENERGIZE 4 8P|ENERGIZE 4 8P|Postmix|postmix|Post-Mix (8 produtos)|630 W|Capacidade|8 válvulas|160 kg
energize-5|ENERGIZE 5|ENERGIZE 5|Postmix|postmix|Post-Mix de grande capacidade|650 W|Capacidade|até 10 saídas|170 kg
energize-5-10p|ENERGIZE 5 10P|ENERGIZE 5 10P|Postmix|postmix|Post-Mix profissional|650 W|Capacidade|10 válvulas|170 kg
loop-xl-postmix|LOOP XL Post-Mix|LOOP XL|Postmix|postmix|Post-Mix de grande porte|600 W|Capacidade|até 6 válvulas|145 kg
3180-h-pm|3180 H PM|3180 H PM|Postmix|postmix|Post-Mix horizontal base|600 W|Capacidade|até 6 produtos|145 kg
3180-h-pm-1-2-6p|3180 H PM 1/2 6P|3180 H PM 1/2 6P|Postmix|postmix|Post-Mix horizontal|600 W|Capacidade|6 válvulas|145 kg
3180h-pm-1-3-6p|3180H PM 1/3 6P|3180H PM 1/3 6P|Postmix|postmix|Post-Mix horizontal|620 W|Capacidade|6 válvulas|150 kg
3180h-5p-1-3-8p|3180H 5P 1/3 8P|3180H 5P 1/3 8P|Postmix|postmix|Post-Mix horizontal|650 W|Capacidade|8 válvulas|165 kg
recor-1-4-4p-pm|RECOR 1/4 4P PM|RECOR 1/4 4P PM|Postmix|postmix|Post-Mix compacto|420 W|Capacidade|4 válvulas|120 kg
recor-1-3-4p-pm|RECOR 1/3 4P PM|RECOR 1/3 4P PM|Postmix|postmix|Post-Mix horizontal|450 W|Capacidade|4 válvulas|125 kg
recor-1-3-5p-pm|RECOR 1/3 5P PM|RECOR 1/3 5P PM|Postmix|postmix|Post-Mix horizontal|460 W|Capacidade|5 válvulas|135 kg
apexx-3h-6p-pm|APEXX 3H 6P PM|APEXX 3H 6P PM|Postmix|postmix|Post-Mix horizontal|640 W|Capacidade|6 válvulas|160 kg
apexx-6-ac-10p-pm|APEXX 6 AC 10P (PM)|APEXX 6 AC 10P|Postmix|postmix|Post-Mix com painel automático|680 W|Capacidade|10 válvulas|180 kg
nuti-3180h|NUTI 3180H|NUTI 3180H|Postmix|postmix|Post-Mix horizontal profissional|620 W|Capacidade|até 6 válvulas|150 kg
modulo-m-5p-pm|MÓDULO M 5P PM|MÓDULO M 5P PM|Outros|postmix|Módulo refrigerado para Post-Mix|550 W|Capacidade|5 produtos|100 kg
activator-500|ACTIVATOR 500|ACTIVATOR 500|Outros|postmix|Equipamento auxiliar não refrigerado|—|Função|Dispensação automática de copos|—
`.trim().split('\n').map(line => line.split('|'));

  const codeFor = (category, model) => {
    const prefix = category === 'Postmix' ? 'PM' : category === 'Outros' ? 'AUX' : 'VIT';
    return `${prefix}-${model.toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-|-$/g, '')}`.slice(0, 28);
  };

  const manualItems = rows.map(([slug,name,model,category,visual,manualCategory,power,factLabel,factValue,weight]) => ({
    id: `manual-${slug}`,
    assetCode: codeFor(category, model),
    directorySlug: slug,
    category,
    visual,
    formType: category === 'Postmix' ? 'Dispensador' : category === 'Outros' ? 'Máquina' : 'Equipamento de frio',
    name,
    officialName: name,
    model,
    manufacturer: 'Por confirmar na placa técnica',
    aliases: [name.toLowerCase(), model.toLowerCase(), slug.replace(/-/g,' ')],
    description: `${name}. Classificação na fonte do projeto: ${manualCategory}.`,
    technicalFacts: [['Categoria na fonte',manualCategory],['Potência',power],[factLabel,factValue],['Peso',weight]],
    symptoms: [],
    causes: [],
    consequences: [],
    documents: [],
    sourceLabel: manualSource,
    sourceUrl: '',
    verification: 'PROJECT_MANUAL',
    regionalNote: manualNote,
    symptomsNote: notDocumentedSymptoms,
    consequencesNote: notDocumentedConsequences,
    evidenceStatus: 'SOURCE_LIMITED',
    manualReference: name,
  }));

  const publicNames = {
    'cooler-gs15-neon':['GS 1.5 Neon','gs-1-5-neon'],
    'cooler-countertop':['Countertop Cooler','countertop'],
    'vending-stack-72':['72" Stack Vending Machine','stack-72'],
    'vending-stack-79':['79" Stack Vending Machine','stack-79'],
    'vending-glassfront-small':['Small Glass Front Vender','glass-front-small'],
    'vending-glassfront-large':['Large Glass Front Vender','glass-front-large'],
    'vending-dn5800':['DN 5800 Vending','dn-5800'],
    'freestyle-7100':['Coca-Cola Freestyle 7100','freestyle-7100'],
    'freestyle-8100':['Coca-Cola Freestyle 8100','freestyle-8100'],
    'freestyle-9100':['Coca-Cola Freestyle 9100','freestyle-9100'],
    'cooler-g10-monster':['G-10 Monster Cooler','g-10'],
  };

  const publicItems = base.filter(item => publicNames[item.id]).map(item => {
    const [name, directorySlug] = publicNames[item.id];
    return {
      ...item,
      name,
      officialName: name,
      directorySlug,
      description: `${name}. Modelo/família identificado no catálogo do projeto; confirme a documentação técnica específica antes de orientar uma intervenção.`,
      symptoms: [],
      causes: [],
      consequences: [],
      symptomsNote: notDocumentedSymptoms,
      consequencesNote: notDocumentedConsequences,
      evidenceStatus: 'SOURCE_LIMITED',
      imageStatus: 'REFERENCE_AND_MANUAL',
      photo: '',
      photoSourceUrl: '',
    };
  });

  window.EquipmentCatalogData = [...manualItems, ...publicItems];
})();
