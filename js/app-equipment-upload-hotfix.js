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
        const isDefaultImage = node.dataset.defaultImage === 'true';
        node.setAttribute('role', 'button');
        node.setAttribute('tabindex', '0');
        node.setAttribute('aria-label', isDefaultImage
          ? 'Adicionar fotografia real deste equipamento'
          : (node.classList.contains('equipment-manual-placeholder') ? 'Adicionar fotografia deste equipamento' : 'Alterar fotografia deste equipamento'));
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
        const isDefaultImage = imageArea.dataset.defaultImage === 'true';
        const hasManualImage = imageArea.classList.contains('equipment-manual-image-wrap') && !isDefaultImage;
        status.textContent = hasManualImage
          ? 'Fotografia manual · toque para alterar'
          : (isDefaultImage ? 'Ilustração local · toque para adicionar fotografia real' : 'Toque na imagem para adicionar fotografia');
      });

      const info = document.querySelector('.equipment-manual-info');
      if (info) {
        const count = info.querySelector('div span');
        if (count) count.textContent = `${count.textContent} · 24 ilustrações locais disponíveis.`;
        const note = info.querySelector('p');
        if (note) note.textContent = 'O catálogo apresenta ilustrações locais por defeito. Toque na imagem para escolher uma fotografia real da galeria ou da câmara; a fotografia manual passa a ter prioridade e entra no backup.';
      }
    },
  });
})();