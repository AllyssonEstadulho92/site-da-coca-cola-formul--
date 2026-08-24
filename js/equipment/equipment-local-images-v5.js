(() => {
  'use strict';

  if (!window.App || !window.AppDB) return;

  const baseLoadData = window.App.loadData;
  const MAX_INPUT_BYTES = 10 * 1024 * 1024;
  const TARGET_IMAGE_BYTES = 2 * 1024 * 1024;

  function dataUrlBytes(dataUrl) {
    const comma = String(dataUrl || '').indexOf(',');
    if (comma < 0) return 0;
    return Math.ceil((dataUrl.length - comma - 1) * 3 / 4);
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(reader.error || new Error('Não foi possível ler a imagem.'));
      reader.readAsDataURL(file);
    });
  }

  function decodeImage(dataUrl) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('O navegador não conseguiu abrir esta imagem.'));
      image.src = dataUrl;
    });
  }

  function findEquipment(app, equipmentId) {
    const items = typeof app.equipmentCatalogItems === 'function'
      ? app.equipmentCatalogItems()
      : (window.EquipmentStoreV5?.items || []);
    return items.find(item => item.id === equipmentId) || null;
  }

  Object.assign(window.App, {
    async loadData() {
      await baseLoadData.call(this);
      const images = await AppDB.getAll('equipmentImages').catch(() => []);
      this.state.equipmentImages = Object.fromEntries(images.map(item => [item.equipmentId, item]));
    },

    equipmentManualImage(itemOrId) {
      const id = typeof itemOrId === 'string' ? itemOrId : itemOrId?.id;
      return this.state.equipmentImages?.[id] || null;
    },

    pickEquipmentImage(equipmentId) {
      const item = findEquipment(this, equipmentId);
      if (!item) return this.toast('Equipamento não encontrado.', 'error');

      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/jpeg,image/png,image/webp,image/heic,image/heif,image/*';
      input.setAttribute('aria-label', `Selecionar imagem de ${item.name}`);
      input.addEventListener('change', async () => {
        const file = input.files?.[0];
        if (!file) return;
        if (!String(file.type || '').startsWith('image/')) return this.toast('Selecione um ficheiro de imagem.', 'error');
        if (file.size > MAX_INPUT_BYTES) return this.toast('A imagem não pode exceder 10 MB.', 'error');

        try {
          this.setSaveState('A preparar imagem…', 'pending');
          const dataUrl = await this.compressEquipmentImage(file);
          const record = {
            equipmentId,
            dataUrl,
            fileName: String(file.name || 'imagem-equipamento').slice(0, 120),
            mimeType: 'image/jpeg',
            originalType: String(file.type || ''),
            originalSize: Number(file.size || 0),
            storedSize: dataUrlBytes(dataUrl),
            updatedAt: new Date().toISOString(),
            source: 'MANUAL'
          };

          await AppDB.put('equipmentImages', record);
          if (!this.state.equipmentImages) this.state.equipmentImages = {};
          this.state.equipmentImages[equipmentId] = record;
          this.setSaveState('Imagem guardada');
          this.renderEquipmentCatalog();
          this.toast(`Imagem de “${item.name}” guardada neste dispositivo.`, 'success');
        } catch (error) {
          console.error('Imagem do equipamento:', error);
          this.setSaveState('Erro ao guardar imagem', 'error');
          this.toast(error?.message || 'Não foi possível guardar a imagem.', 'error');
        }
      }, { once: true });
      input.click();
    },

    async compressEquipmentImage(file) {
      const source = await readFileAsDataUrl(file);
      const image = await decodeImage(source);
      if (!image.naturalWidth || !image.naturalHeight) throw new Error('Imagem sem dimensões válidas.');

      const render = (maxDimension, quality) => {
        const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
        const width = Math.max(1, Math.round(image.naturalWidth * scale));
        const height = Math.max(1, Math.round(image.naturalHeight * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Não foi possível processar a imagem neste navegador.');
        context.fillStyle = '#fff';
        context.fillRect(0, 0, width, height);
        context.drawImage(image, 0, 0, width, height);
        return canvas.toDataURL('image/jpeg', quality);
      };

      let maxDimension = 1400;
      let quality = 0.86;
      let result = render(maxDimension, quality);
      while (dataUrlBytes(result) > TARGET_IMAGE_BYTES && quality > 0.58) {
        quality -= 0.08;
        result = render(maxDimension, quality);
      }
      if (dataUrlBytes(result) > TARGET_IMAGE_BYTES) {
        maxDimension = 1000;
        result = render(maxDimension, 0.72);
      }
      if (dataUrlBytes(result) > TARGET_IMAGE_BYTES * 1.35) {
        throw new Error('A imagem continua demasiado grande depois da otimização.');
      }
      return result;
    },

    removeEquipmentImage(equipmentId) {
      const item = findEquipment(this, equipmentId);
      if (!item || !this.equipmentManualImage(equipmentId)) return;
      this.confirm('Remover imagem?', `A imagem manual de “${item.name}” será eliminada deste dispositivo.`, async () => {
        await AppDB.remove('equipmentImages', equipmentId);
        delete this.state.equipmentImages[equipmentId];
        this.renderEquipmentCatalog();
        this.toast('Imagem manual removida.', 'success');
      });
    }
  });
})();
