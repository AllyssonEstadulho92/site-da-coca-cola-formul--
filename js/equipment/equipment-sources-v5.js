(() => {
  'use strict';

  const source = value => Object.freeze({
    language: 'en',
    consultedAt: '2026-08-24',
    validationLevel: 'OFFICIAL_PUBLIC',
    ...value
  });

  window.EquipmentSourcesV5 = Object.freeze({
    'frigoglass-plus-450': source({
      id:'frigoglass-plus-450', title:'Plus-450 [R290] — User Manual', organization:'Frigoglass S.A.I.C.', type:'manual-utilizador-fabricante',
      url:'https://www.frigoglass-saic.com/wp-content/uploads/2020/02/Plus-450-User-Manual.pdf', language:'multi',
      note:'Manual público do fabricante. Inclui especificações, instalação, utilização segura e troubleshooting. A variante da placa do equipamento instalado deve ser confirmada.'
    }),
    'frigoglass-plus-450-900': source({
      id:'frigoglass-plus-450-900', title:'Plus-450 & Plus-900 [R290] — User Manual', organization:'Frigoglass S.A.I.C.', type:'manual-utilizador-fabricante',
      url:'https://www.frigoglass-saic.com/wp-content/uploads/2021/11/Plus-450-900-R290_Group-3.pdf', language:'multi',
      note:'Manual público do fabricante para Plus-450/Plus-900. Confirmar sufixo/variante na placa técnica.'
    }),
    'frigoglass-icool': source({
      id:'frigoglass-icool', title:'ICOOL Series — User Manual', organization:'Frigoglass S.A.I.C.', type:'manual-utilizador-fabricante',
      url:'https://www.frigoglass-saic.com/wp-content/uploads/2020/02/ICOOL-User-Manual.pdf', language:'multi',
      note:'Abrange, entre outros, ICOOL-300, ICOOL-450 e ICOOL-900L. Inclui especificações e tabela de troubleshooting.'
    }),
    'frigoglass-fv280': source({
      id:'frigoglass-fv280', title:'FV-280 [R600a]', organization:'Frigoglass S.A.I.C.', type:'ficha-produto-fabricante',
      url:'https://www.frigoglass-saic.com/cooler/fv-280-r600a/',
      note:'Página pública do fabricante com capacidade, dimensões, configuração de cabine e características.'
    }),
    'frigoglass-fv1200': source({
      id:'frigoglass-fv1200', title:'FV-1200 [R290]', organization:'Frigoglass S.A.I.C.', type:'ficha-produto-fabricante',
      url:'https://www.frigoglass-saic.com/cooler/fv-1200-r134a/',
      note:'Página pública do fabricante. Confirmar refrigerante/variante na placa técnica.'
    }),
    'frigoglass-retro': source({
      id:'frigoglass-retro', title:'Retro [R290] LC — User Manual', organization:'Frigoglass S.A.I.C.', type:'manual-utilizador-fabricante',
      url:'https://www.frigoglass-saic.com/wp-content/uploads/2019/05/Retro-LC-user-manual.pdf', language:'multi'
    }),
    'frigoglass-easyreach': source({
      id:'frigoglass-easyreach', title:'Easyreach Express — User Manual', organization:'Frigoglass S.A.I.C.', type:'manual-utilizador-fabricante',
      url:'https://www.frigoglass-saic.com/wp-content/uploads/2019/05/Easyreach-Express-user-manual.pdf', language:'multi'
    }),
    'frigoglass-easyreach-2': source({
      id:'frigoglass-easyreach-2', title:'Easyreach Express 2.0 [R290]', organization:'Frigoglass S.A.I.C.', type:'ficha-produto-fabricante',
      url:'https://www.frigoglass-saic.com/cooler/easyreach-express-2-0-r290/'
    }),
    'eu-eprel-plus450': source({
      id:'eu-eprel-plus450', title:'EPREL Product Information Sheet — Plus-450 [R290] B', organization:'European Commission / EPREL', type:'ficha-regulamentar',
      url:'https://eprel.ec.europa.eu/fiches/refrigeratingappliancesdirectsalesfunction/Fiche_1764035_EN.pdf',
      note:'Ficha regulamentar europeia que identifica FRIGOGLASS como fornecedor e o modelo Plus-450 [R290] B.'
    }),
    'cornelius-energize3': source({
      id:'cornelius-energize3', title:'Energize 3', organization:'Cornelius / Marmon Foodservice', type:'ficha-produto-fabricante',
      url:'https://cornelius-emea.com/product/energize-3/',
      note:'Página oficial EMEA com especificações do Energize 3 e acesso a manuais.'
    }),
    'cornelius-energize-range': source({
      id:'cornelius-energize-range', title:'Energize Range — Installation & User Manual', organization:'Cornelius / Marmon Foodservice', type:'manual-fabricante',
      url:'https://www.corneliusmcd.com/pdf/Energize4/operation-manuals/Energize4-range-Installation-User-Manual-Version-J-english.pdf',
      note:'Manual público da gama Energize 2–5. Dados de variante devem ser associados apenas quando o modelo/part number é compatível.'
    }),
    'cornelius-loop-xl': source({
      id:'cornelius-loop-xl', title:'LOOP / LOOP XL — Operating Instructions', organization:'Cornelius EMEA', type:'manual-fabricante',
      url:'https://preview.cornelius-emea.com/assets/downloads/soft/oce/loop/td1016600-gebrauchsanweisung-loop-serie-de.pdf', language:'de',
      note:'Documentação oficial da série LOOP, incluindo LOOP XL Postmix e dados técnicos.'
    }),
    'cokesolutions-freestyle': source({
      id:'cokesolutions-freestyle', title:'Coca-Cola Freestyle — Equipment', organization:'The Coca-Cola Company', type:'catalogo-oficial',
      url:'https://www.cokesolutions.com/equipment/coca-cola-freestyle', language:'en-US',
      note:'Fonte oficial para 7100, 8100/Crew-Serve e 9100; especificações são do mercado publicado pela Coca-Cola e devem ser contextualizadas antes de uso regional.'
    }),
    'cokesolutions-troubleshooting': source({
      id:'cokesolutions-troubleshooting', title:'CokeSolutions — Equipment Troubleshooting', organization:'The Coca-Cola Company', type:'troubleshooting-oficial',
      url:'https://www.cokesolutions.com/equipment/troubleshooting', language:'en-US',
      note:'Usar apenas para sintomas/cenários explicitamente cobertos pela fonte; não converte hipótese em diagnóstico.'
    }),
    'cokesolutions-vending': source({
      id:'cokesolutions-vending', title:'CokeSolutions — Vending Machines', organization:'The Coca-Cola Company', type:'catalogo-oficial',
      url:'https://www.cokesolutions.com/equipment/vending-machines', language:'en-US',
      note:'Fonte oficial para famílias Stack e Glass Front, com fabricantes e intervalos de especificações.'
    }),
    'cokesolutions-gfv-small': source({
      id:'cokesolutions-gfv-small', title:'Small Glass Front Vender', organization:'The Coca-Cola Company', type:'ficha-equipamento-oficial',
      url:'https://www.cokesolutions.com/content/dam/cokesolutions/us/documents/cokesolutions/Equipment/Equipment-Vending-Small-Glass-Front.pdf', language:'en-US'
    }),
    'cokesolutions-gfv-large': source({
      id:'cokesolutions-gfv-large', title:'Large Glass Front Vender', organization:'The Coca-Cola Company', type:'ficha-equipamento-oficial',
      url:'https://www.cokesolutions.com/content/dam/cokesolutions/us/documents/cokesolutions/Equipment/Equipment-Vending-Large-Glass-Front.pdf', language:'en-US'
    }),
    'cokesolutions-dn5800': source({
      id:'cokesolutions-dn5800', title:'DN-5800 — Equipment Sheet', organization:'The Coca-Cola Company', type:'ficha-equipamento-oficial',
      url:'https://www.cokesolutions.com/content/dam/cokesolutions/us/documents/gameplan/Equipment/DN5800_KO.pdf', language:'en-US'
    }),
    'crane-dn5800': source({
      id:'crane-dn5800', title:'Glassfront Bev-Max 2 Vender DN5800 — Operation / Service / Troubleshooting Manual', organization:'Dixie-Narco / Crane Merchandising Systems', type:'manual-servico-fabricante',
      url:'https://rc.cranems.com/Uploads/BevMax%202%20Pepsi%20Cola%20Service-Parts%20Manual%20803%2C904%2C050.21.pdf', language:'en-US', validationLevel:'MANUFACTURER_PUBLIC',
      note:'A própria documentação restringe reparações internas a técnicos qualificados.'
    }),
    'crane-bevmax4': source({
      id:'crane-bevmax4', title:'DN BevMax 4 — Coke Service/Parts Manual', organization:'Dixie-Narco / Crane Merchandising Systems', type:'manual-servico-fabricante',
      url:'https://rc.cranems.com/Uploads/DN%20BevMax%204%20Coke%20Service-Parts%20Manual%20660.21.pdf', language:'en-US', validationLevel:'MANUFACTURER_PUBLIC'
    }),
    'royal-vendors-tech': source({
      id:'royal-vendors-tech', title:'Royal Vendors — Technical Information', organization:'Royal Vendors, Inc.', type:'biblioteca-tecnica-fabricante',
      url:'https://www.royalvendors.com/customer-service/technical-info/', language:'en-US', validationLevel:'MANUFACTURER_PUBLIC'
    })
  });
})();
