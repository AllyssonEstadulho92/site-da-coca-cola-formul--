(() => {
  'use strict';
  if (!window.App) return;

  const baseTab = window.App.equipmentInspectorTabHtml;
  const baseBind = window.App.bindEquipmentCatalogActions;

  const PDF_OVERRIDES = {
    'postmix-counter-6': 'https://www.cokesolutions.com/content/dam/cokesolutions/us/documents/gameplan/CounterElectric6v_KO.pdf',
    'postmix-counter-8': 'https://www.cokesolutions.com/content/dam/cokesolutions/us/documents/cokesolutions/Equipment/Equipment-Fountain-CounterElectric-8v.pdf',
    'postmix-dropin-6': 'https://www.cokesolutions.com/content/dam/cokesolutions/us/documents/cokesolutions/Equipment/Equipment-Fountain-DropIn-6v.pdf',
  };

  function trustedCokeUrl(value) {
    try {
      const url = new URL(String(value || ''));
      if (url.protocol !== 'https:') return '';
      if (!['www.cokesolutions.com', 'cokesolutions.com', 'd110qkvvq2aow9.cloudfront.net'].includes(url.hostname)) return '';
      return url.href;
    } catch {
      return '';
    }
  }

  function isPdf(value) {
    return /\.pdf(?:$|[?#])/i.test(String(value || ''));
  }

  Object.assign(window.App, {
    equipmentAssetCode(item) {
      return item?.assetCode || String(item?.id || 'EQ').toUpperCase().replace(/[^A-Z0-9]+/g, '-').slice(0, 18);
    },

    equipmentOfficialPreview(item) {
      const directPhoto = item?.imageStatus === 'DIRECT_OFFICIAL' ? trustedCokeUrl(item.photo) : '';
      if (directPhoto) return { type: 'image', url: directPhoto, label: 'Fotografia oficial direta' };

      const documents = Array.isArray(item?.documents) ? item.documents : [];
      const override = trustedCokeUrl(PDF_OVERRIDES[item?.id]);
      const documentPdf = trustedCokeUrl(documents.find(document => isPdf(document?.url))?.url);
      const sourcePdf = isPdf(item?.sourceUrl) ? trustedCokeUrl(item.sourceUrl) : '';
      const pdfUrl = override || documentPdf || sourcePdf;
      if (pdfUrl) return { type: 'pdf', url: pdfUrl, label: 'Ficha oficial com imagem do modelo' };

      return { type: 'fallback', url: '', label: 'Referência visual por confirmar' };
    },

    equipmentOfficialPreviewHtml(item, context = 'card') {
      const preview = this.equipmentOfficialPreview(item);
      if (preview.type === 'image') {
        return `<img src="${this.escapeAttr(preview.url)}" alt="${this.escapeAttr(item.name)}" loading="lazy" referrerpolicy="no-referrer" />`;
      }

      if (preview.type === 'pdf') {
        const frameUrl = `${preview.url}#page=1&zoom=page-fit&toolbar=0&navpanes=0&scrollbar=0`;
        return `<div class="equipment-preview-stack ${context === 'inspector' ? 'is-inspector' : 'is-card'}">
          ${this.equipmentCatalogVisual(item.visual, item.name)}
          <iframe class="equipment-official-frame" src="${this.escapeAttr(frameUrl)}" title="Ficha oficial de ${this.escapeAttr(item.name)}" loading="lazy" tabindex="-1" referrerpolicy="no-referrer"></iframe>
          <span class="equipment-preview-badge">Ficha oficial</span>
        </div>`;
      }

      return `<div class="equipment-preview-stack is-fallback">${this.equipmentCatalogVisual(item.visual, item.name)}<span class="equipment-preview-badge">A confirmar</span></div>`;
    },

    equipmentCatalogCard(item) {
      const selected = item.id === this.state.selectedEquipmentCatalogId;
      const code = this.equipmentAssetCode(item);
      const preview = this.equipmentOfficialPreview(item);
      return `<article class="equipment-catalog-card-v33 ${selected ? 'selected' : ''}" data-equipment-card="${this.escapeAttr(item.id)}">
        <div class="equipment-card-main equipment-card-main-v41">
          <div class="equipment-thumb-v33">${this.equipmentOfficialPreviewHtml(item, 'card')}</div>
          <div class="equipment-card-copy-v33">
            <strong>${this.escape(item.name)}</strong>
            <span>${this.escape(item.model)}</span>
            <code>${this.escape(code)}</code>
            <span>${preview.type === 'image' ? 'Fotografia oficial' : preview.type === 'pdf' ? 'Imagem na ficha oficial' : 'Imagem por confirmar'}</span>
          </div>
          <span class="equipment-card-menu" aria-hidden="true">⋮</span>
        </div>
        <button class="equipment-card-hit" type="button" data-equipment-detail="${this.escapeAttr(item.id)}" aria-label="Abrir ficha de ${this.escapeAttr(item.name)}"></button>
      </article>`;
    },

    equipmentInspectorTabHtml(item, tab) {
      if (tab === 'overview') {
        const preview = this.equipmentOfficialPreview(item);
        return `<section class="equipment-inspector-section">
          <div class="equipment-official-preview-panel">
            <div class="equipment-official-preview-head">
              <strong>Referência visual oficial</strong>
              <span>${this.escape(preview.label)}</span>
            </div>
            <div class="equipment-official-preview-visual">${this.equipmentOfficialPreviewHtml(item, 'inspector')}</div>
            <div class="equipment-official-preview-footer">
              <span>${preview.type === 'pdf' ? 'A primeira página da ficha oficial contém a imagem associada a esta referência.' : 'Imagem associada diretamente à referência pública.'}</span>
              ${preview.url ? `<a href="${this.escapeAttr(preview.url)}" target="_blank" rel="noopener noreferrer">Abrir origem oficial ↗</a>` : ''}
            </div>
          </div>
          <h4>Identificação do equipamento</h4>
          <p class="equipment-overview-description">${this.escape(item.description)}</p>
          <div class="equipment-overview-grid">
            <div><span>Nome oficial</span><strong>${this.escape(item.officialName || item.name)}</strong></div>
            <div><span>Modelo / família</span><strong>${this.escape(item.model)}</strong></div>
            <div><span>Fabricante</span><strong>${this.escape(item.manufacturer || 'Por confirmar')}</strong></div>
            <div><span>Referência do catálogo</span><strong>${this.escape(this.equipmentAssetCode(item))}</strong></div>
            <div><span>Imagem</span><strong>${preview.type === 'image' ? 'Fotografia oficial direta' : preview.type === 'pdf' ? 'Pré-visualização da ficha oficial' : 'Por confirmar'}</strong></div>
            <div><span>Fonte</span><strong>CokeSolutions</strong></div>
          </div>
          ${item.aliases?.length ? `<div class="equipment-aliases"><strong>Pode ser referido como:</strong><span>${item.aliases.map(value => this.escape(value)).join(' · ')}</span></div>` : ''}
          <div class="equipment-symptom-preview">
            <h4>Sintomas frequentes</h4>
            <div>${(item.symptoms || []).slice(0, 6).map(value => `<span>✓ ${this.escape(value)}</span>`).join('')}</div>
          </div>
          <p class="equipment-document-note">${this.escape(item.symptomsNote || '')}</p>
        </section>`;
      }

      if (tab === 'documents') {
        const preview = this.equipmentOfficialPreview(item);
        const docs = Array.isArray(item.documents) ? [...item.documents] : [];
        if (preview.type === 'pdf' && !docs.some(document => document?.url === preview.url)) {
          docs.unshift({ label: 'Ficha oficial usada na pré-visualização', url: preview.url, kind: 'PDF oficial' });
        }
        const uniqueDocs = docs.filter((document, index, list) => document?.url && list.findIndex(candidate => candidate?.url === document.url) === index);
        return `<section class="equipment-inspector-section">
          <h4>Documentação e imagem de referência</h4>
          <div class="equipment-origin-box">
            <span>Identificação oficial</span>
            <strong>${this.escape(item.officialName || item.model || item.name)}</strong>
            <span>${this.escape(item.manufacturer || 'Fabricante por confirmar')}</span>
            <span>${preview.type === 'image' ? 'Fotografia oficial direta verificada' : preview.type === 'pdf' ? 'Imagem apresentada através da ficha oficial do modelo' : 'Imagem ainda por confirmar'}</span>
          </div>
          ${preview.type === 'image' ? `<a class="equipment-document-link" href="${this.escapeAttr(preview.url)}" target="_blank" rel="noopener noreferrer">Abrir fotografia oficial ↗</a>` : ''}
          <div class="equipment-document-list">
            ${uniqueDocs.length ? uniqueDocs.map(document => `<a class="equipment-document-link" href="${this.escapeAttr(document.url)}" target="_blank" rel="noopener noreferrer">${this.escape(document.label)} ↗</a>`).join('') : '<span class="muted">Sem documento público individualizado.</span>'}
          </div>
          <p class="equipment-document-note">${this.escape(item.regionalNote || '')}</p>
        </section>`;
      }

      return baseTab.call(this, item, tab);
    },

    bindEquipmentCatalogActions() {
      baseBind.call(this);
      document.querySelectorAll('.equipment-official-frame').forEach(frame => {
        frame.addEventListener('load', () => frame.classList.add('is-loaded'), { once: true });
      });
    },
  });
})();
