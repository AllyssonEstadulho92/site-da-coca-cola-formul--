(() => {
  'use strict';

  if (!window.App) return;

  // O catálogo visível deve corresponder exatamente aos 53 diretórios do projeto.
  window.EquipmentCatalogData = (window.EquipmentCatalogData || []).filter(item => !['cooler-gs15-neon','cooler-countertop'].includes(item.id));

  const baseInspectorTabHtml = window.App.equipmentInspectorTabHtml;

  Object.assign(window.App, {
    equipmentAssetCode(item) {
      if (item?.assetCode) return item.assetCode;
      return String(item?.model || item?.id || 'EQ').toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 28);
    },

    equipmentCatalogCard(item) {
      const selected = item.id === this.state.selectedEquipmentCatalogId;
      const image = this.equipmentManualImage(item);
      return `<article class="equipment-card-v43 ${selected ? 'selected' : ''}" data-equipment-card="${this.escapeAttr(item.id)}">
        <button class="equipment-card-photo-v43" type="button" data-equipment-image="${this.escapeAttr(item.id)}" aria-label="${image ? 'Alterar' : 'Adicionar'} fotografia de ${this.escapeAttr(item.name)}">
          ${this.equipmentManualImageHtml(item, 'card')}
          <span class="equipment-photo-action-v43">${image ? 'Alterar fotografia' : '+ Adicionar fotografia'}</span>
        </button>
        <div class="equipment-card-body-v43">
          <div class="equipment-card-meta-v43">
            <span class="equipment-category-pill-v43">${this.escape(item.category)}</span>
            <code>${this.escape(this.equipmentAssetCode(item))}</code>
          </div>
          <h5>${this.escape(item.name)}</h5>
          <p class="equipment-model-v43">Modelo: <strong>${this.escape(item.model)}</strong></p>
          <p class="equipment-description-v43">${this.escape(item.description)}</p>
          <button class="equipment-detail-button-v43" type="button" data-equipment-detail="${this.escapeAttr(item.id)}">Ver detalhes <span aria-hidden="true">→</span></button>
        </div>
      </article>`;
    },

    equipmentInspectorTabHtml(item, tab) {
      if (tab === 'technical') {
        const causes = Array.isArray(item.causes) ? item.causes : [];
        return `<section class="equipment-inspector-section">
          <h4>Ficha técnica</h4>
          <div class="equipment-fact-grid-v33">${(item.technicalFacts || []).map(([key, value]) => `<div><span>${this.escape(key)}</span><strong>${this.escape(value)}</strong></div>`).join('')}</div>
          ${causes.length ? `<div class="equipment-causes-v43"><h4>Causas / pontos de verificação</h4><ul>${causes.map(value => `<li>${this.escape(value)}</li>`).join('')}</ul></div>` : ''}
          <div class="equipment-regional-warning"><strong>Confirmação:</strong> compare sempre os dados com a placa técnica do equipamento instalado.</div>
        </section>`;
      }

      if (tab === 'consequences') {
        return `<section class="equipment-inspector-section"><h4>Possíveis consequências / impactos</h4>
          <div class="equipment-consequence-box"><span aria-hidden="true">⚠</span><ul>${(item.consequences || []).map(value => `<li>${this.escape(value)}</li>`).join('')}</ul></div>
          ${item.consequencesNote ? `<p class="equipment-source-disclaimer-v43">${this.escape(item.consequencesNote)}</p>` : ''}
        </section>`;
      }

      if (tab === 'documents') {
        const docs = Array.isArray(item.documents) ? item.documents : [];
        const image = this.equipmentManualImage(item);
        return `<section class="equipment-inspector-section"><h4>Documentos e diretório</h4>
          <div class="equipment-origin-box"><span>Diretório do modelo</span><strong>${this.escape(item.directorySlug || item.id)}</strong><span>${this.escape(item.sourceLabel || 'Fonte por confirmar')}</span></div>
          <div class="equipment-origin-box"><span>Fotografia</span><strong>${image ? 'Adicionada manualmente' : 'Ainda não adicionada'}</strong><span>${image ? this.escape(image.fileName || 'Imagem local') : 'Toque na imagem do equipamento para escolher a fotografia correta.'}</span></div>
          <div class="equipment-document-list">${docs.length ? docs.map(document => document.url ? `<a class="equipment-document-link" href="${this.escapeAttr(document.url)}" target="_blank" rel="noopener noreferrer">${this.escape(document.label)} ↗</a>` : `<span class="equipment-document-link is-static">${this.escape(document.label)}</span>`).join('') : '<span class="muted">A referência técnica deste modelo está identificada no catálogo; documentos locais podem ser adicionados numa evolução posterior.</span>'}</div>
          ${item.regionalNote ? `<p class="equipment-document-note">${this.escape(item.regionalNote)}</p>` : ''}
        </section>`;
      }

      return baseInspectorTabHtml.call(this, item, tab);
    },
  });
})();
