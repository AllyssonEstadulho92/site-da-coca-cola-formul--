(() => {
  'use strict';

  if (!window.App) return;

  const SPRITE = './assets/equipment/reference-sprite-v46.jpg';
  const TILE_BY_SLUG = {
    'plus-450':2,'icool-300':3,'icool-450':4,'icool-900':5,'fv-280':6,'bgz-1001p':7,'plus-900':8,
    'retro':9,'300-rax':10,'rvc-400':11,'v-544':12,'v-545-8':13,'ic-300':14,'ic-450':15,'dn-3061':16,
    'sc410':17,'botellero-1m':18,'fv-1200':19,'loop-xl-horizontal':20,'s-78':21,'bc-80b':22,'s288':23,
    'g-style-1':24,'vr-200-2p':25,'easyreach-express':26,'energize-3':27,'energize-3h':28,'energize-4':29,
    'energize-4-8p':30,'energize-5':31,'energize-5-10p':32,'loop-xl-postmix':33,'3180-h-pm':34,
    '3180-h-pm-1-2-6p':35,'3180h-pm-1-3-6p':36,'3180h-5p-1-3-8p':37,'recor-1-4-4p-pm':38,
    'recor-1-3-4p-pm':39,'recor-1-3-5p-pm':40,'nuti-3180h':41,'apexx-3h-6p-pm':42,
    'apexx-6-ac-10p-pm':43,'modulo-m-5p-pm':44,'activator-500':45,'stack-72':46,'stack-79':47,
    'glass-front-small':48,'glass-front-large':49,'dn-5800':50,'freestyle-7100':51,'freestyle-8100':52,
    'freestyle-9100':53,'g-10':54
  };

  const baseImageHtml = window.App.equipmentManualImageHtml;

  Object.assign(window.App, {
    equipmentReferenceImage(item) {
      const index = TILE_BY_SLUG[item?.directorySlug];
      if (!Number.isInteger(index)) return null;
      const col = index % 10;
      const row = Math.floor(index / 10);
      return {
        src: SPRITE,
        index,
        x: `${(col * 100 / 9).toFixed(4)}%`,
        y: `${(row * 100 / 5).toFixed(4)}%`,
        label: 'Imagem de referência gerada para o catálogo'
      };
    },

    equipmentDisplayImage(item) {
      const manual = this.equipmentManualImage(item);
      if (manual?.dataUrl) return { source: 'MANUAL', src: manual.dataUrl, label: 'Fotografia manual', record: manual };
      const reference = this.equipmentReferenceImage(item);
      if (reference) return { source: 'REFERENCE', ...reference };
      return null;
    },

    equipmentManualImageHtml(item, context = 'card') {
      const manual = this.equipmentManualImage(item);
      if (manual?.dataUrl) return baseImageHtml.call(this, item, context);

      const reference = this.equipmentReferenceImage(item);
      if (!reference) return baseImageHtml.call(this, item, context);

      return `<div class="equipment-reference-image-wrap ${context === 'inspector' ? 'is-inspector' : 'is-card'}">
        <span class="equipment-reference-sprite" role="img" aria-label="Imagem de referência de ${this.escapeAttr(item.name)}" style="--reference-x:${reference.x};--reference-y:${reference.y};"></span>
        <span class="equipment-reference-badge">Referência visual</span>
      </div>`;
    }
  });
})();
