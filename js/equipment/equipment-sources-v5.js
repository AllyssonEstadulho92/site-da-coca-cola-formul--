(() => {
  'use strict';

  window.EquipmentSourcesV5 = Object.freeze({
    'project-manual': {
      id: 'project-manual',
      title: 'MANUAL DO EQUIPAMENTO COCA COLA.pdf',
      organization: 'Fonte fornecida ao projeto',
      type: 'manual-tecnico-projeto',
      url: '',
      language: 'pt-PT',
      consultedAt: '2026-08-24',
      validationLevel: 'PROJECT_SOURCE',
      note: 'Documento fornecido ao projeto. Não é publicado automaticamente no repositório público. Os dados devem ser confirmados pela placa técnica e documentação autorizada da variante instalada.'
    },
    'cokesolutions-catalog': {
      id: 'cokesolutions-catalog',
      title: 'CokeSolutions — Equipment',
      organization: 'The Coca-Cola Company',
      type: 'catalogo-oficial',
      url: 'https://www.cokesolutions.com/equipment/',
      language: 'en-US',
      consultedAt: '2026-08-24',
      validationLevel: 'OFFICIAL_PUBLIC',
      note: 'Catálogo público predominantemente orientado ao mercado norte-americano. Não aplicar automaticamente alimentação elétrica, certificações ou instalação a equipamentos CCEP Portugal.'
    },
    'cokesolutions-freestyle': {
      id: 'cokesolutions-freestyle',
      title: 'Coca-Cola Freestyle — Equipment',
      organization: 'The Coca-Cola Company',
      type: 'catalogo-oficial',
      url: 'https://www.cokesolutions.com/equipment/coca-cola-freestyle',
      language: 'en-US',
      consultedAt: '2026-08-24',
      validationLevel: 'OFFICIAL_PUBLIC'
    },
    'cokesolutions-troubleshooting': {
      id: 'cokesolutions-troubleshooting',
      title: 'CokeSolutions — Self Help / Phone Fix',
      organization: 'The Coca-Cola Company',
      type: 'troubleshooting-oficial',
      url: 'https://www.cokesolutions.com/equipment/troubleshooting',
      language: 'en-US',
      consultedAt: '2026-08-24',
      validationLevel: 'OFFICIAL_PUBLIC',
      note: 'Fonte aplicável a sistemas fountain/Freestyle nos cenários explicitamente descritos. Não constitui diagnóstico automático de um modelo.'
    },
    'dixie-narco-glassfront': {
      id: 'dixie-narco-glassfront',
      title: 'Dixie-Narco Glass Front Beverage Vender — Operation / Service Manual',
      organization: 'Dixie-Narco / Crane',
      type: 'manual-servico-fabricante',
      url: 'https://rc.cranems.com/Uploads/2145-2054%20Manual%20770.01.PDF',
      language: 'en-US',
      consultedAt: '2026-08-24',
      validationLevel: 'MANUFACTURER_PUBLIC',
      note: 'Aplicar apenas quando fabricante/família forem compatíveis. Reparações internas permanecem reservadas a técnicos qualificados.'
    },
    'dixie-narco-siid': {
      id: 'dixie-narco-siid',
      title: 'Dixie-Narco SIID Electronic Venders — Programming / Troubleshooting Guide',
      organization: 'Dixie-Narco / Crane',
      type: 'manual-servico-fabricante',
      url: 'https://rc.cranems.com/Uploads/SIID%20Electronic%20Venders%20-%20Two%20Button%20Programming%20Guide%20803%2C902%2C510.31.PDF',
      language: 'en-US',
      consultedAt: '2026-08-24',
      validationLevel: 'MANUFACTURER_PUBLIC'
    },
    'royal-vendors-tech': {
      id: 'royal-vendors-tech',
      title: 'Royal Vendors — Technical Information',
      organization: 'Royal Vendors, Inc.',
      type: 'biblioteca-tecnica-fabricante',
      url: 'https://www.royalvendors.com/customer-service/technical-info/',
      language: 'en-US',
      consultedAt: '2026-08-24',
      validationLevel: 'MANUFACTURER_PUBLIC'
    }
  });
})();
