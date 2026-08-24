(() => {
  'use strict';

  const categoryMap = {
    'vitrines-verticais':['Vitrines','Vitrine vertical'],
    'vitrines-horizontais-arcas':['Vitrines','Vitrine horizontal / arca'],
    'frigorificos-apoio':['Vitrines','Frigorífico de apoio'],
    'postmix':['Postmix','Post-mix'],
    'modulos-auxiliares':['Outros','Módulo / auxiliar'],
    'vending':['Vending','Vending'],
    'freestyle':['Freestyle','Freestyle'],
    'monster':['Monster','Cooler Monster']
  };

  const inventory = [
    ['vitrines-verticais','plus-450','PLUS 450','PLUS 450'],['vitrines-verticais','plus-900','PLUS 900','PLUS 900'],['vitrines-verticais','icool-300','ICOOL 300','ICOOL 300'],['vitrines-verticais','icool-450','ICOOL 450','ICOOL 450'],['vitrines-verticais','icool-900','ICOOL 900','ICOOL 900'],['vitrines-verticais','fv-280','FV 280 COCA-COLA','FV 280'],['vitrines-verticais','fv-1200','FV 1200','FV 1200'],['vitrines-verticais','bgz-1001p','BGZ-1001P','BGZ-1001P'],['vitrines-verticais','v-544','V-544','V-544'],['vitrines-verticais','v-545-8','V 545/8 COCA-COLA','V 545/8'],['vitrines-verticais','ic-300','IC 300','IC 300'],['vitrines-verticais','ic-450','IC 450','IC 450'],['vitrines-verticais','dn-3061','DN 3061','DN 3061'],['vitrines-verticais','sc410','SC410','SC410'],['vitrines-verticais','easyreach-express','EASYREACH EXPRESS','EASYREACH EXPRESS'],
    ['vitrines-horizontais-arcas','retro','RETRO','RETRO'],['vitrines-horizontais-arcas','300-rax','300 RAX COCA-COLA','300 RAX'],['vitrines-horizontais-arcas','rvc-400','RVC 400','RVC 400'],['vitrines-horizontais-arcas','botellero-1m','BOTELLERO 1 M','BOTELLERO 1 M'],['vitrines-horizontais-arcas','loop-xl-horizontal','LOOP XL Horizontal','LOOP XL'],['vitrines-horizontais-arcas','vr-200-2p','VR-200 2P','VR-200 2P'],
    ['frigorificos-apoio','s-78','S-78 COCA-COLA','S-78'],['frigorificos-apoio','bc-80b','BC 80B COCA-COLA','BC 80B'],['frigorificos-apoio','s288','S288','S288'],['frigorificos-apoio','g-style-1','G-STYLE 1','G-STYLE 1'],
    ['postmix','energize-3','ENERGIZE 3','ENERGIZE 3'],['postmix','energize-3h','ENERGIZE 3H','ENERGIZE 3H'],['postmix','energize-4','ENERGIZE 4','ENERGIZE 4'],['postmix','energize-4-8p','ENERGIZE 4 8P','ENERGIZE 4 8P'],['postmix','energize-5','ENERGIZE 5','ENERGIZE 5'],['postmix','energize-5-10p','ENERGIZE 5 10P','ENERGIZE 5 10P'],['postmix','loop-xl-postmix','LOOP XL Post-Mix','LOOP XL'],['postmix','3180-h-pm','3180 H PM','3180 H PM'],['postmix','3180-h-pm-1-2-6p','3180 H PM 1/2 6P','3180 H PM 1/2 6P'],['postmix','3180h-pm-1-3-6p','3180H PM 1/3 6P','3180H PM 1/3 6P'],['postmix','3180h-5p-1-3-8p','3180H 5P 1/3 8P','3180H 5P 1/3 8P'],['postmix','recor-1-4-4p-pm','RECOR 1/4 4P PM','RECOR 1/4 4P PM'],['postmix','recor-1-3-4p-pm','RECOR 1/3 4P PM','RECOR 1/3 4P PM'],['postmix','recor-1-3-5p-pm','RECOR 1/3 5P PM','RECOR 1/3 5P PM'],['postmix','nuti-3180h','NUTI 3180H','NUTI 3180H'],['postmix','apexx-3h-6p-pm','APEXX 3H 6P PM','APEXX 3H 6P PM'],['postmix','apexx-6-ac-10p-pm','APEXX 6 AC 10P PM','APEXX 6 AC 10P PM'],
    ['modulos-auxiliares','modulo-m-5p-pm','MÓDULO M 5P PM','MÓDULO M 5P PM'],['modulos-auxiliares','activator-500','ACTIVATOR 500','ACTIVATOR 500'],
    ['vending','stack-72','72 inch Stack Vending Machine','72 inch'],['vending','stack-79','79 inch Stack Vending Machine','79 inch'],['vending','glass-front-small','Small Glass Front Vender','Glass Front Small'],['vending','glass-front-large','Large Glass Front Vender','Glass Front Large'],['vending','dn-5800','DN 5800 Vending','DN 5800'],
    ['freestyle','freestyle-7100','Coca-Cola Freestyle 7100','7100'],['freestyle','freestyle-8100','Coca-Cola Freestyle 8100','8100'],['freestyle','freestyle-9100','Coca-Cola Freestyle 9100','9100'],
    ['monster','g-10','G-10 Monster Cooler','G-10']
  ];

  const validated = {
    'plus-450': { manufacturer:'Frigoglass', sources:['frigoglass-plus-450','eu-eprel-plus450'], validation:'MODEL_OFFICIAL', description:'Expositor refrigerado Frigoglass Plus-450 [R290]. A correspondência deve ser confirmada pela placa, porque existem variantes B/C e anos de produção diferentes.', specs:{'Tensão nominal':'220–240 V / 50 Hz','Descongelação':'Automática','Dimensões':'595 × 639 × 2012 mm','Volume bruto':'472 L','Peso líquido':'100 kg'} },
    'plus-900': { manufacturer:'Frigoglass', sources:['frigoglass-plus-450-900'], validation:'MODEL_OFFICIAL', description:'Expositor refrigerado Frigoglass Plus-900 [R290]. Confirmar a variante instalada antes de utilizar valores técnicos.', specs:{'Tensão nominal':'220–240 V / 50 Hz','Descongelação':'Automática','Dimensões (variante C)':'895 × 770 × 2012 mm','Volume bruto':'887 L','Peso líquido':'156 kg'} },
    'icool-300': { manufacturer:'Frigoglass', sources:['frigoglass-icool'], validation:'MODEL_OFFICIAL', description:'Expositor refrigerado da série Frigoglass ICOOL. O manual público inclui ICOOL-300 [R290] e variantes Retro/Platinum.', specs:{'Tensão nominal':'220–240 V / 50 Hz','Descongelação':'Automática','Dimensões':'495 × 650 × 1619 mm','Volume':'258 L','Peso líquido':'85–90 kg'} },
    'icool-450': { manufacturer:'Frigoglass', sources:['frigoglass-icool'], validation:'MODEL_OFFICIAL', description:'Expositor refrigerado Frigoglass ICOOL-450 [R290], incluído no manual público da série ICOOL.', specs:{'Tensão nominal':'220–240 V / 50 Hz','Descongelação':'Automática','Dimensões':'596 × 649 × 2014 mm','Volume':'437 L','Peso líquido':'110 kg'} },
    'icool-900': { manufacturer:'Frigoglass', sources:['frigoglass-icool'], validation:'FAMILY_OFFICIAL', description:'O fabricante documenta ICOOL-900L HD/SD [R290]. Confirmar na placa se o equipamento do inventário “ICOOL 900” corresponde a uma dessas variantes.', specs:{'Família pública correspondente':'ICOOL-900L HD/SD [R290]','Tensão nominal':'220–240 V / 50 Hz','Descongelação':'Automática'} },
    'fv-280': { manufacturer:'Frigoglass', sources:['frigoglass-fv280'], validation:'MODEL_OFFICIAL', description:'Frigoglass FV-280 [R600a], cooler de uma porta para merchandising de bebidas.', specs:{'Capacidade':'265 L','Dimensões externas':'49,5 × 61,0 × 161,2 cm','Facings':'6','Cabine':'1 porta'} },
    'fv-1200': { manufacturer:'Frigoglass', sources:['frigoglass-fv1200'], validation:'MODEL_OFFICIAL', description:'Frigoglass FV-1200 [R290], expositor de grande capacidade. Confirmar variante/refrigerante pela placa.', specs:{'Capacidade':'1120 L','Dimensões externas':'129,5 × 75,0 × 203,0 cm','Facings':'16','Cabine':'2/3 portas'} },
    'retro': { manufacturer:'Frigoglass', sources:['frigoglass-retro'], validation:'MODEL_OFFICIAL_WITH_INVENTORY_CONFLICT', description:'Existe documentação pública Frigoglass para Retro [R290] LC. A geometria documentada deve ser comparada com a fotografia/placa porque a classificação histórica do inventário pode não corresponder à mesma variante.', specs:{'Tensão/Frequência':'220–240 V / 50 ou 60 Hz','Descongelação':'Automática','Volume bruto':'282 L','Peso':'108 kg'} },
    'easyreach-express': { manufacturer:'Frigoglass', sources:['frigoglass-easyreach','frigoglass-easyreach-2'], validation:'MODEL_OFFICIAL', description:'Vitrine open-front Frigoglass Easyreach Express. A fonte pública inclui versões Easyreach Express e 2.0; confirmar a variante instalada.', specs:{'Tipo':'Open front','Volume (manual Easyreach Express HC)':'214 L','Dimensões (manual)':'654 × 710 × 1429 mm','Peso (manual)':'104 kg'} },
    'energize-3': { manufacturer:'Cornelius / Marmon Foodservice', sources:['cornelius-energize3','cornelius-energize-range'], validation:'MODEL_OFFICIAL', description:'Undercounter soda circuit cooler Cornelius Energize 3 para sistemas de bebidas post-mix.', specs:{'Refrigerante':'R290 (150 g)','Banco de gelo':'18 kg','Banho de água':'48 L','Bomba carbonatadora':'280 L/h','Dimensões':'605 × 850 × 470 mm','Requisitos elétricos':'230 V / 50 Hz','Entrada máxima':'1150 W','Peso seco':'80 kg'} },
    'energize-4': { manufacturer:'Cornelius / Marmon Foodservice', sources:['cornelius-energize-range'], validation:'MODEL_OFFICIAL', description:'Modelo Energize 4 da gama Cornelius de coolers undercounter para bebidas post-mix.', specs:{'Alimentação':'230 V / 50 Hz','Banco de gelo (R290)':'27,5 kg','Dimensões (R290)':'660 × 950 × 515 mm','Peso de expedição':'110 kg','Bobinas de xarope':'8'} },
    'energize-5': { manufacturer:'Cornelius / Marmon Foodservice', sources:['cornelius-energize-range'], validation:'MODEL_OFFICIAL', description:'Modelo Energize 5 da gama Cornelius de coolers undercounter para bebidas post-mix.', specs:{'Alimentação':'230 V / 50 Hz','Banco de gelo (R290)':'63,5 kg','Dimensões (R290)':'810 × 1080 × 690 mm','Peso de expedição':'115 kg','Bobinas de xarope':'8'} },
    'loop-xl-postmix': { manufacturer:'Cornelius EMEA', sources:['cornelius-loop-xl'], validation:'MODEL_OFFICIAL', description:'LOOP XL documentado pela Cornelius para configurações Premix e Postmix. Esta ficha refere apenas a configuração Postmix quando explicitamente indicada.', specs:{'Alimentação':'230 V / 50 Hz','Potência':'500 W (PEM) / 600 W (POM)','Dimensões':'550 × 415 × 660 mm','Peso de expedição':'46 kg (PEM) / 50 kg (POM)','Configuração documentada':'LOOP XL 6 válvulas Postmix'} },
    'stack-72': { manufacturer:'Royal / Crane / Dixie-Narco (conforme unidade)', sources:['cokesolutions-vending','royal-vendors-tech'], validation:'FAMILY_OFFICIAL', description:'Família Coca-Cola 72-inch Stack Vending. O fabricante exato varia por unidade e deve ser confirmado na placa.', specs:{'Tipo':'Stack','Altura':'72 in','Largura':'28–37 in','Profundidade':'33,5–37 in','Capacidade latas':'448–720','Capacidade garrafas 20 oz':'196–320','Fabricantes publicados':'Royal, Crane, Dixie Narco'} },
    'stack-79': { manufacturer:'Royal Vendors (fonte Coca-Cola)', sources:['cokesolutions-vending','royal-vendors-tech'], validation:'FAMILY_OFFICIAL', description:'Família Coca-Cola 79-inch Stack Vending publicada no catálogo CokeSolutions.', specs:{'Tipo':'Stack','Altura':'79 in','Largura':'37 in','Profundidade':'33,5 in','Capacidade latas':'804','Capacidade garrafas 20 oz':'360','Fabricante publicado':'Royal'} },
    'glass-front-small': { manufacturer:'Dixie-Narco / Royal (conforme unidade)', sources:['cokesolutions-gfv-small','cokesolutions-vending'], validation:'FAMILY_OFFICIAL', description:'Small Glass Front Vender publicado pela Coca-Cola. O fabricante pode ser Dixie-Narco ou Royal conforme a unidade.', specs:{'Tipo':'GFV Slim','Altura':'72 in','Largura':'37–42 in','Profundidade':'32–35 in','Capacidade latas':'270–320','Capacidade garrafas 20 oz':'240–280'} },
    'glass-front-large': { manufacturer:'Dixie-Narco', sources:['cokesolutions-gfv-large','cokesolutions-vending'], validation:'FAMILY_OFFICIAL', description:'Large Glass Front Vender publicado pela Coca-Cola para a família GFV.', specs:{'Tipo':'GFV','Altura':'72 in','Largura':'47–52 in','Profundidade':'32–35 in','Capacidade latas':'405','Capacidade garrafas 20 oz':'360'} },
    'dn-5800': { manufacturer:'Dixie-Narco / Crane Merchandising Systems', sources:['cokesolutions-dn5800','crane-dn5800','crane-bevmax4'], validation:'MODEL_OFFICIAL', description:'Vending glass-front DN-5800 / BevMax da Dixie-Narco, com ficha Coca-Cola e documentação de serviço do fabricante.', specs:{'Tipo':'GFV','Dimensões Coca-Cola':'72 × 46,5 × 34 in','Capacidade latas':'405','Capacidade garrafas 20 oz':'360','Peso':'764 lb','Facings':'45'} },
    'freestyle-7100': { manufacturer:'The Coca-Cola Company / sistema Freestyle', sources:['cokesolutions-freestyle'], validation:'MODEL_OFFICIAL', description:'Coca-Cola Freestyle 7100 Self-Serve, sistema de dispensação de bebidas com interface digital.', specs:{'Tipo':'Self-Serve','Modelo':'7100','Instalação':'Above countertop','Drinks/day':'40','Dimensões':'H 39–43 × W 30 × D 33,4–35,7 in','Amperagem':'20 A','Peso':'625 lb','Capacidade de gelo':'220 lb'} },
    'freestyle-8100': { manufacturer:'The Coca-Cola Company / sistema Freestyle', sources:['cokesolutions-freestyle'], validation:'MODEL_OFFICIAL', description:'Coca-Cola Freestyle 8100 Crew-Serve, configuração destinada a operação por equipa.', specs:{'Tipo':'Crew-Serve','Dimensões':'H 72 × W 25 × D 33 in','Drinks/day':'100','Peso de expedição':'620 lb','Capacidade de gelo':'100 lb'} },
    'freestyle-9100': { manufacturer:'The Coca-Cola Company / sistema Freestyle', sources:['cokesolutions-freestyle'], validation:'MODEL_OFFICIAL', description:'Coca-Cola Freestyle 9100 Self-Serve, sistema de alta capacidade para dispensação de bebidas.', specs:{'Tipo':'Self-Serve','Modelo':'9100','Drinks/day':'100','Dimensões':'H 73,75 × W 25,5 × D 35,5 in','Peso de expedição':'963 lb','Capacidade de gelo':'235 lb'} }
  };

  const codePrefix = category => category === 'Postmix' ? 'PM' : category === 'Vending' ? 'VEN' : category === 'Freestyle' ? 'FS' : category === 'Monster' ? 'MON' : category === 'Outros' ? 'AUX' : 'VIT';
  const code = (category, model) => `${codePrefix(category)}-${model.toUpperCase().replace(/[^A-Z0-9]+/g,'-').replace(/^-|-$/g,'')}`.slice(0,30);

  window.EquipmentCatalogV5Base = Object.freeze(inventory.map(([inventoryCategory,slug,name,model]) => {
    const [category,subCategory] = categoryMap[inventoryCategory];
    const evidence = validated[slug] || {};
    return Object.freeze({
      id:`eq-${slug}`,
      slug,
      directorySlug:slug,
      category,
      subcategory:subCategory,
      brand: category === 'Monster' ? 'Monster' : 'Coca-Cola / operação de bebidas',
      manufacturer:evidence.manufacturer || '',
      name,
      model,
      formType: category === 'Postmix' ? 'Dispensador' : category === 'Vending' ? 'Vending' : category === 'Freestyle' ? 'Freestyle' : category === 'Outros' ? 'Auxiliar' : 'Equipamento de frio',
      type:subCategory,
      function: evidence.description || 'Função técnica não validada para este modelo em fonte pública confirmada.',
      shortDescription:evidence.description || 'Modelo presente no inventário do projeto. Dados técnicos ainda não validados por uma fonte pública identificável para este modelo.',
      code:code(category,model),
      specifications:evidence.specs || {},
      sourceIds:evidence.sources || [],
      validationStatus:evidence.validation || 'UNVALIDATED',
      validationNote:evidence.sources?.length ? 'Dados apresentados apenas dentro do âmbito explicitamente suportado pelas fontes públicas associadas.' : 'Não foi localizada uma fonte técnica pública suficientemente específica para este modelo. Não inferir especificações, sintomas ou causas.',
      updatedAt:'2026-08-24'
    });
  }));
})();
