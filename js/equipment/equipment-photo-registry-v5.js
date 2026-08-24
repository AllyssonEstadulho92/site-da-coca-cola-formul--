(() => {
  'use strict';

  const VERIFIED_STATUS = 'VERIFIED_REAL';

  // Apenas fotografias reais, verificadas e autorizadas devem ser registadas aqui.
  // O nome do ficheiro deve seguir o slug do equipamento para evitar associações erradas.
  const photos = Object.freeze({});

  function getForItem(item) {
    const slug = String(item?.slug || '').trim();
    const photo = photos[slug];
    if (!photo || photo.status !== VERIFIED_STATUS) return null;
    return photo;
  }

  function validate(items = []) {
    const itemSlugs = new Set(items.map(item => item.slug));
    const errors = [];
    for (const [slug, photo] of Object.entries(photos)) {
      if (!itemSlugs.has(slug)) errors.push(`Fotografia sem equipamento correspondente: ${slug}`);
      if (photo?.status !== VERIFIED_STATUS) errors.push(`Fotografia não validada: ${slug}`);
      if (!/^assets\/equipment\/photos\/[a-z0-9-]+\.(?:png|jpe?g|webp)$/i.test(String(photo?.src || ''))) {
        errors.push(`Caminho de fotografia inválido: ${slug}`);
      }
    }
    return Object.freeze(errors);
  }

  window.EquipmentPhotoRegistryV5 = Object.freeze({
    VERIFIED_STATUS,
    photos,
    getForItem,
    validate
  });
})();
