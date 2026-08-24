(() => {
  'use strict';

  const consultedAt = '2026-08-24';

  window.EquipmentSourcesV5 = Object.freeze({
    'project-manual': {
      id: 'project-manual',
      label: 'Manual do Equipamento Coca-Cola — fornecido ao projeto',
      organization: 'Fonte fornecida pelo projeto',
      type: 'project_manual',
      url: '',
      consultedAt,
      validation: 'PROJECT_SOURCE',
      note: 'O documento fornecido ao projeto é a fonte primária para os modelos internos do catálogo. Não é apresentado como manual oficial do fabricante sem confirmação adicional.'
    },
    'cokesolutions-vending': {
      id: 'cokesolutions-vending',
      label: 'CokeSolutions — Vending Machines',
      organization: 'The Coca-Cola Company',
      type: 'official_catalog',
      url: 'https://www.cokesolutions.com/equipment/vending-machines',
      consultedAt,
      validation: 'OFFICIAL_PUBLIC',
      note: 'Catálogo público, predominantemente orientado ao mercado norte-americano.'
    },
    'cokesolutions-freestyle': {
      id: 'cokesolutions-freestyle',
      label: 'CokeSolutions — Coca-Cola Freestyle',
      organization: 'The Coca-Cola Company',
      type: 'official_catalog',
      url: 'https://www.cokesolutions.com/equipment/coca-cola-freestyle',
      consultedAt,
      validation: 'OFFICIAL_PUBLIC',
      note: 'Página oficial pública com modelos e especificações de referência.'
    },
    'cokesolutions-freestyle-7100': {
      id: 'cokesolutions-freestyle-7100',
      label: 'Coca-Cola Freestyle 7100 — Spec Sheet',
      organization: 'The Coca-Cola Company',
      type: 'official_spec_sheet',
      url: 'https://www.cokesolutions.com/coca-cola-freestyle/pdfs/CCFS_7100_specsheet.pdf',
      consultedAt,
      validation: 'OFFICIAL_PUBLIC'
    },
    'cokesolutions-self-help': {
      id: 'cokesolutions-self-help',
      label: 'CokeSolutions — Equipment Self Help / Phone Fix',
      organization: 'The Coca-Cola Company',
      type: 'official_troubleshooting',
      url: 'https://www.cokesolutions.com/equipment/troubleshooting',
      consultedAt,
      validation: 'OFFICIAL_PUBLIC',
      note: 'Apenas verificações simples e seguras são reproduzidas na aplicação; operações técnicas ficam para assistência qualificada.'
    },
    'cokesolutions-quality': {
      id: 'cokesolutions-quality',
      label: 'CokeSolutions — Foodservice Quality',
      organization: 'The Coca-Cola Company',
      type: 'official_operation_guide',
      url: 'https://www.cokesolutions.com/coca-cola-freestyle/staff-training/foodservice-quality.html',
      consultedAt,
      validation: 'OFFICIAL_PUBLIC'
    },
    'cokesolutions-g10': {
      id: 'cokesolutions-g10',
      label: 'CokeSolutions — G-10 Monster',
      organization: 'The Coca-Cola Company / IDW',
      type: 'official_spec_sheet',
      url: 'https://www.cokesolutions.com/content/dam/cokesolutions/us/documents/gameplan/G10_Monster.pdf',
      consultedAt,
      validation: 'OFFICIAL_PUBLIC'
    },
    'cokesolutions-stack72': {
      id: 'cokesolutions-stack72',
      label: 'CokeSolutions — 72 inch Stack Vending',
      organization: 'The Coca-Cola Company',
      type: 'official_spec_sheet',
      url: 'https://www.cokesolutions.com/content/dam/cokesolutions/us/documents/cokesolutions/Equipment/Equipment-Vending-72Stack.pdf',
      consultedAt,
      validation: 'OFFICIAL_PUBLIC'
    },
    'cokesolutions-gfv-small': {
      id: 'cokesolutions-gfv-small',
      label: 'CokeSolutions — Small Glass Front Vender',
      organization: 'The Coca-Cola Company',
      type: 'official_spec_sheet',
      url: 'https://www.cokesolutions.com/content/dam/cokesolutions/us/documents/cokesolutions/Equipment/Equipment-Vending-Small-Glass-Front.pdf',
      consultedAt,
      validation: 'OFFICIAL_PUBLIC'
    },
    'cokesolutions-gfv-large': {
      id: 'cokesolutions-gfv-large',
      label: 'CokeSolutions — Large Glass Front Vender',
      organization: 'The Coca-Cola Company',
      type: 'official_spec_sheet',
      url: 'https://www.cokesolutions.com/content/dam/cokesolutions/us/documents/cokesolutions/Equipment/Equipment-Vending-Large-Glass-Front.pdf',
      consultedAt,
      validation: 'OFFICIAL_PUBLIC'
    },
    'dixie-glassfront-service': {
      id: 'dixie-glassfront-service',
      label: 'Dixie-Narco — Glassfront Beverage Vender Service Manual',
      organization: 'Dixie-Narco / Crane Merchandising Systems',
      type: 'manufacturer_service_manual',
      url: 'https://rc.cranems.com/Uploads/5500%20Glassfront%20Beverage%20Vender-Service-Parts%20Manual.pdf',
      consultedAt,
      validation: 'MANUFACTURER_PUBLIC',
      note: 'Manual de serviço de família/modelos Dixie-Narco. Não deve ser generalizado a equipamentos de outro fabricante.'
    },
    'dixie-bevmax4': {
      id: 'dixie-bevmax4',
      label: 'Dixie-Narco — BevMax 4 Coke Service/Parts Manual',
      organization: 'Dixie-Narco / Crane Merchandising Systems',
      type: 'manufacturer_service_manual',
      url: 'https://rc.cranems.com/Uploads/DN%20BevMax%204%20Coke%20Service-Parts%20Manual%20660.21.pdf',
      consultedAt,
      validation: 'MANUFACTURER_PUBLIC'
    },
    'royal-service': {
      id: 'royal-service',
      label: 'Royal Vendors — Service documentation',
      organization: 'Royal Vendors',
      type: 'manufacturer_support',
      url: 'https://www.royalvendors.com/',
      consultedAt,
      validation: 'MANUFACTURER_PUBLIC',
      note: 'Fonte de fabricante para variantes Royal; associação exata a cada unidade deve ser confirmada pelo modelo/placa.'
    }
  });
})();