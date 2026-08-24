(() => {
  'use strict';

  const D = (id, label, model, type, sourceId, url, language = 'EN') => ({
    id, label, model, type, sourceId, url, language
  });

  window.EquipmentDocumentsV5 = Object.freeze([
    D('doc-project-manual','Manual do Equipamento Coca-Cola — fonte do projeto','Vários modelos','manual técnico / catálogo interno','project-manual','', 'PT'),
    D('doc-vending-page','CokeSolutions — Vending Machines','Família Vending','catálogo oficial','cokesolutions-vending','https://www.cokesolutions.com/equipment/vending-machines'),
    D('doc-stack72','72 inch Stack Vending — Spec Sheet','72 inch Stack Vending Machine','ficha técnica','cokesolutions-stack72','https://www.cokesolutions.com/content/dam/cokesolutions/us/documents/cokesolutions/Equipment/Equipment-Vending-72Stack.pdf'),
    D('doc-gfv-small','Small Glass Front Vender — Spec Sheet','Small Glass Front Vender','ficha técnica','cokesolutions-gfv-small','https://www.cokesolutions.com/content/dam/cokesolutions/us/documents/cokesolutions/Equipment/Equipment-Vending-Small-Glass-Front.pdf'),
    D('doc-gfv-large','Large Glass Front Vender — Spec Sheet','Large Glass Front Vender','ficha técnica','cokesolutions-gfv-large','https://www.cokesolutions.com/content/dam/cokesolutions/us/documents/cokesolutions/Equipment/Equipment-Vending-Large-Glass-Front.pdf'),
    D('doc-dixie-glassfront','Dixie-Narco Glassfront Beverage Vender — Service/Parts/Troubleshooting','Família Dixie-Narco Glassfront','manual de serviço / troubleshooting','dixie-glassfront-service','https://rc.cranems.com/Uploads/5500%20Glassfront%20Beverage%20Vender-Service-Parts%20Manual.pdf'),
    D('doc-dixie-bevmax4','Dixie-Narco BevMax 4 Coke — Service/Parts Manual','Família BevMax 4','manual de serviço / códigos de erro','dixie-bevmax4','https://rc.cranems.com/Uploads/DN%20BevMax%204%20Coke%20Service-Parts%20Manual%20660.21.pdf'),
    D('doc-freestyle-page','CokeSolutions — Coca-Cola Freestyle','7100 / 8100 / 9100','catálogo oficial','cokesolutions-freestyle','https://www.cokesolutions.com/equipment/coca-cola-freestyle'),
    D('doc-freestyle-7100','Coca-Cola Freestyle 7100 — Spec Sheet','7100','ficha técnica','cokesolutions-freestyle-7100','https://www.cokesolutions.com/coca-cola-freestyle/pdfs/CCFS_7100_specsheet.pdf'),
    D('doc-freestyle-help','CokeSolutions — Phone Fix / Self Help','Coca-Cola Freestyle / Fountain','troubleshooting operacional','cokesolutions-self-help','https://www.cokesolutions.com/equipment/troubleshooting'),
    D('doc-freestyle-quality','CokeSolutions — Foodservice Quality','Coca-Cola Freestyle / Fountain','limpeza / operação','cokesolutions-quality','https://www.cokesolutions.com/coca-cola-freestyle/staff-training/foodservice-quality.html'),
    D('doc-g10','G-10 Monster — Spec Sheet','G-10','ficha técnica','cokesolutions-g10','https://www.cokesolutions.com/content/dam/cokesolutions/us/documents/gameplan/G10_Monster.pdf')
  ]);
})();