(() => {
  'use strict';
  if (!window.App) return;

  const baseTab = window.App.equipmentInspectorTabHtml;

  Object.assign(window.App, {
    equipmentAssetCode(item) {
      return item?.assetCode || String(item?.id || 'EQ').toUpperCase().replace(/[^A-Z0-9]+/g, '-').slice(0, 18);
    },

    equipmentInspectorTabHtml(item, tab) {
      if (tab === 'overview') {
        const directPhoto = item.imageStatus === 'DIRECT_OFFICIAL' && Boolean(item.photo);
        return `<section class="equipment-inspector-section">
          <h4>Identificação do equipamento</h4>
          <p class="equipment-overview-description">${this.escape(item.description)}</p>
          <div class="equipment-overview-grid">
            <div><span>Nome oficial</span><strong>${this.escape(item.officialName || item.name)}</strong></div>
            <div><span>Modelo / família</span><strong>${this.escape(item.model)}</strong></div>
            <div><span>Fabricante</span><strong>${this.escape(item.manufacturer || 'Por confirmar')}</strong></div>
            <div><span>Referência do catálogo</span><strong>${this.escape(this.equipmentAssetCode(item))}</strong></div>
            <div><span>Imagem</span><strong>${directPhoto ? 'Fotografia oficial verificada' : 'Imagem na ficha oficial'}</strong></div>
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
        const docs = Array.isArray(item.documents) ? item.documents : [];
        const directPhoto = item.imageStatus === 'DIRECT_OFFICIAL' && Boolean(item.photo);
        return `<section class="equipment-inspector-section">
          <h4>Documentação e imagem de referência</h4>
          <div class="equipment-origin-box">
            <span>Identificação oficial</span>
            <strong>${this.escape(item.officialName || item.model || item.name)}</strong>
            <span>${this.escape(item.manufacturer || 'Fabricante por confirmar')}</span>
            <span>${directPhoto ? 'Fotografia oficial direta verificada' : 'A fotografia oficial deve ser confirmada na ficha ligada abaixo'}</span>
          </div>
          ${directPhoto ? `<a class="equipment-document-link" href="${this.escapeAttr(item.photo)}" target="_blank" rel="noopener noreferrer">Abrir fotografia oficial ↗</a>` : ''}
          <div class="equipment-document-list">
            ${docs.length ? docs.map(document => `<a class="equipment-document-link" href="${this.escapeAttr(document.url)}" target="_blank" rel="noopener noreferrer">${this.escape(document.label)} ↗</a>`).join('') : '<span class="muted">Sem documento público individualizado.</span>'}
          </div>
          <p class="equipment-document-note">${this.escape(item.regionalNote || '')}</p>
        </section>`;
      }

      return baseTab.call(this, item, tab);
    },
  });
})();
