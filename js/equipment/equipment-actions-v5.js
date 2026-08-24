(() => {
  'use strict';

  if (!window.App) return;

  function catalogItems(app) {
    if (window.EquipmentStoreV5?.items) return window.EquipmentStoreV5.items;
    if (typeof app.equipmentCatalogItems === 'function') return app.equipmentCatalogItems();
    return [];
  }

  Object.assign(window.App, {
    startRecordFromCatalog(id) {
      const item = catalogItems(this).find(entry => entry.id === id);
      if (!item) return this.toast?.('Equipamento não encontrado.', 'error');

      sessionStorage.setItem('equipmentCatalogSelection', JSON.stringify({
        id: item.id,
        name: item.name,
        model: item.model,
        formType: item.formType || ''
      }));
      this.navigate('new');
    }
  });
})();
