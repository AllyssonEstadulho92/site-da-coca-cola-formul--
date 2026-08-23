(() => {
  'use strict';

  if (!window.App) return;

  const baseBind = window.App.bindEquipmentCatalogActions;

  function equipmentIdFromNode(node) {
    return node?.closest?.('[data-equipment-card]')?.dataset?.equipmentCard || '';
  }

  Object.assign(window.App, {
    bindEquipmentCatalogActions() {
      baseBind.call(this);

      const activateImagePicker = (node, event) => {
        const equipmentId = equipmentIdFromNode(node);
        if (!equipmentId) return;
        event?.preventDefault?.();
        event?.stopPropagation?.();
        this.pickEquipmentImage(equipmentId);
      };

      document.querySelectorAll('.equipment-manual-placeholder, .equipment-manual-image-wrap.is-card').forEach(node => {
        node.setAttribute('role', 'button');
        node.setAttribute('tabindex', '0');
        node.setAttribute('aria-label', node.classList.contains('equipment-manual-placeholder')
          ? 'Adicionar fotografia deste equipamento'
          : 'Alterar fotografia deste equipamento');
        node.classList.add('equipment-image-direct-action');

        node.addEventListener('click', event => activateImagePicker(node, event));
        node.addEventListener('keydown', event => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          activateImagePicker(node, event);
        });
      });

      document.querySelectorAll('.equipment-card-v42').forEach(card => {
        const imageArea = card.querySelector('.equipment-manual-placeholder, .equipment-manual-image-wrap.is-card');
        const status = card.querySelector('.equipment-card-copy-v33 small');
        if (!status || !imageArea) return;
        const hasImage = imageArea.classList.contains('equipment-manual-image-wrap');
        status.textContent = hasImage ? 'Toque na fotografia para alterar' : 'Toque na imagem para adicionar fotografia';
      });

      const note = document.querySelector('.equipment-manual-info p');
      if (note) note.textContent = 'Toque diretamente na área da imagem (+) para escolher uma fotografia da galeria ou da câmara. A fotografia fica guardada neste dispositivo e entra no backup.';
    },
  });
})();
