(() => {
  'use strict';

  if (!window.App) return;

  const baseRender = window.App.renderEquipmentCatalog;
  const baseTabHtml = window.App.equipmentInspectorTabHtml;

  const evidenceEmpty = (app, title, note) => `<section class="equipment-inspector-section">
    <h4>${app.escape(title)}</h4>
    <div class="equipment-evidence-empty-v46">
      <span aria-hidden="true">i</span>
      <div><strong>Não documentado na fonte disponível</strong><p>${app.escape(note)}</p></div>
    </div>
  </section>`;

  Object.assign(window.App, {
    renderEquipmentCatalog() {
      baseRender.call(this);
      const shell = this.els.viewContainer.querySelector('.equipment-shell-v45');
      if (shell) shell.classList.add('equipment-shell-v46');

      const items = this.equipmentCatalogItems();
      const referenceCount = items.filter(item => this.equipmentReferenceImage?.(item)).length;
      const manualCount = items.filter(item => this.equipmentManualImage(item)?.dataUrl).length;
      const info = this.els.viewContainer.querySelector('.equipment-manual-info-v45');
      if (info) info.innerHTML = `<div><strong>Catálogo visual dos 53 equipamentos</strong><span>${referenceCount} referências visuais · ${manualCount} fotografias reais adicionadas.</span></div>
        <p>Cada cartão está dividido em duas áreas: miniatura à esquerda e informação técnica resumida à direita. Fotografias reais adicionadas por si têm prioridade sobre a referência visual.</p>`;
    },

    equipmentCatalogCard(item) {
      const selected = item.id === this.state.selectedEquipmentCatalogId;
      const manual = this.equipmentManualImage(item);
      const display = this.equipmentDisplayImage?.(item);
      const imageLabel = manual?.dataUrl ? 'Fotografia real' : display?.source === 'REFERENCE' ? 'Referência visual' : 'Sem imagem';
      const symptoms = Array.isArray(item.symptoms) ? item.symptoms : [];
      const consequences = Array.isArray(item.consequences) ? item.consequences : [];
      const docs = Array.isArray(item.documents) ? item.documents : [];
      const facts = (item.technicalFacts || []).filter(([, value]) => value && value !== '—').slice(0, 2);
      const symptomSummary = symptoms.length ? symptoms.slice(0, 2) : [];

      return `<article class="equipment-card-v43 equipment-card-v46 equipment-card-split-v46 ${selected ? 'selected' : ''}" data-equipment-card="${this.escapeAttr(item.id)}">
        <section class="equipment-card-media-v46" aria-label="Imagem de ${this.escapeAttr(item.name)}">
          <button class="equipment-card-photo-v43 equipment-card-photo-v46 equipment-card-thumbnail-v46" type="button" data-equipment-image="${this.escapeAttr(item.id)}" aria-label="${manual?.dataUrl ? 'Alterar fotografia real de' : 'Adicionar fotografia real para'} ${this.escapeAttr(item.name)}">
            ${this.equipmentManualImageHtml(item, 'card')}
          </button>
          <span class="equipment-card-image-label-v46">${this.escape(imageLabel)}</span>
          <button class="equipment-card-image-link-v46" type="button" data-equipment-image="${this.escapeAttr(item.id)}">${manual?.dataUrl ? 'Alterar foto' : '+ Foto real'}</button>
        </section>

        <section class="equipment-card-info-v46">
          <div class="equipment-card-meta-v43">
            <span class="equipment-category-pill-v43">${this.escape(item.category)}</span>
            <code>${this.escape(this.equipmentAssetCode(item))}</code>
          </div>
          <div class="equipment-card-title-v46">
            <h5>${this.escape(item.name)}</h5>
            <p class="equipment-model-v43">Modelo: <strong>${this.escape(item.model)}</strong></p>
          </div>
          <p class="equipment-description-v43 equipment-description-v46">${this.escape(item.description)}</p>

          <div class="equipment-card-evidence-v46">
            <div class="equipment-card-evidence-row-v46">
              <span class="equipment-card-evidence-key-v46">Sintomas</span>
              <div class="equipment-card-evidence-value-v46">${symptomSummary.length
                ? symptomSummary.map(value => `<span>• ${this.escape(value)}</span>`).join('')
                : '<strong>Não documentados</strong><small>Sem sintomas específicos validados na fonte disponível.</small>'}</div>
            </div>
            <div class="equipment-card-evidence-row-v46">
              <span class="equipment-card-evidence-key-v46">Ficha</span>
              <div class="equipment-card-facts-inline-v46">${facts.length
                ? facts.map(([key,value]) => `<span><small>${this.escape(key)}</small><strong>${this.escape(value)}</strong></span>`).join('')
                : '<span><small>Dados técnicos</small><strong>Por confirmar</strong></span>'}</div>
            </div>
          </div>

          <div class="equipment-card-footer-v46">
            <div class="equipment-card-mini-status-v46">
              <span>Consequências: <strong>${consequences.length ? `${consequences.length} documentada(s)` : 'não documentadas'}</strong></span>
              <span>Documentos: <strong>${docs.length}</strong></span>
            </div>
            <button class="equipment-detail-button-v43 equipment-detail-button-v46" type="button" data-equipment-detail="${this.escapeAttr(item.id)}">Ver ficha completa <span aria-hidden="true">→</span></button>
          </div>
        </section>
      </article>`;
    },

    equipmentInspectorHtml(item) {
      const tab = this.state.equipmentInspectorTab || 'overview';
      const manual = this.equipmentManualImage(item);
      const display = this.equipmentDisplayImage?.(item);
      const tabs = [['overview','Visão Geral'],['technical','Ficha Técnica'],['symptoms','Sintomas'],['consequences','Consequências'],['documents','Documentos']];
      const imageLabel = manual?.dataUrl ? 'Fotografia manual' : display?.source === 'REFERENCE' ? 'Referência visual' : 'Sem imagem';
      return `<div class="equipment-inspector-v46">
        <div class="equipment-inspector-hero-v46">
          <div class="equipment-inspector-visual equipment-inspector-visual-v46">${this.equipmentManualImageHtml(item, 'inspector')}</div>
          <div class="equipment-inspector-title-v46">
            <div class="equipment-inspector-kicker"><span>${this.escape(item.category)}</span><span class="equipment-image-source-v46">${this.escape(imageLabel)}</span></div>
            <h3>${this.escape(item.name)}</h3>
            <p class="equipment-inspector-model-v46">${this.escape(item.model)}</p>
            <code>${this.escape(this.equipmentAssetCode(item))}</code>
            <small>${this.escape(item.sourceLabel || 'Fonte por confirmar')}</small>
          </div>
        </div>

        <div class="equipment-inspector-image-tools equipment-inspector-image-tools-v46">
          <button class="btn btn-secondary" type="button" data-equipment-image="${this.escapeAttr(item.id)}">${manual?.dataUrl ? 'Alterar fotografia real' : '+ Adicionar fotografia real'}</button>
          ${manual?.dataUrl ? `<button class="equipment-remove-image" type="button" data-equipment-image-remove="${this.escapeAttr(item.id)}">Remover fotografia</button>` : ''}
        </div>

        <div class="equipment-inspector-tabs" role="tablist" aria-label="Detalhes do equipamento">
          ${tabs.map(([key,label]) => `<button type="button" role="tab" data-equipment-tab="${key}" class="${tab === key ? 'active' : ''}" aria-selected="${tab === key}">${this.escape(label)}</button>`).join('')}
        </div>
        <div class="equipment-inspector-body">${this.equipmentInspectorTabHtml(item, tab)}</div>
        <div class="equipment-inspector-actions equipment-inspector-actions-v46">
          <button class="btn btn-secondary" type="button" data-equipment-tab="technical">Ficha técnica</button>
          <button class="btn btn-primary" type="button" data-equipment-new="${this.escapeAttr(item.id)}">+ Criar Registo</button>
        </div>
        <div class="equipment-inspector-safety"><strong>Uso durante a chamada</strong><p>Use a imagem para identificação e a ficha como referência. Não indique causas, danos ou procedimentos que não estejam documentados numa fonte autorizada.</p></div>
      </div>`;
    },

    equipmentInspectorTabHtml(item, tab) {
      if (tab === 'overview') {
        const primaryFacts = (item.technicalFacts || []).slice(0, 6);
        const symptoms = Array.isArray(item.symptoms) ? item.symptoms : [];
        const consequences = Array.isArray(item.consequences) ? item.consequences : [];
        return `<section class="equipment-inspector-section equipment-overview-v46">
          <div class="equipment-section-heading-v46"><div><span>Descrição</span><h4>${this.escape(item.name)}</h4></div><span class="equipment-evidence-pill-v46">Fonte identificada</span></div>
          <p class="equipment-overview-description">${this.escape(item.description)}</p>
          <div class="equipment-overview-grid equipment-overview-grid-v42">${primaryFacts.map(([key,value]) => `<div><span>${this.escape(key)}</span><strong>${this.escape(value)}</strong></div>`).join('')}</div>
          <div class="equipment-evidence-grid-v46">
            <div><span>Sintomas</span><strong>${symptoms.length ? `${symptoms.length} documentado(s)` : 'Não documentados'}</strong><small>${this.escape(item.symptomsNote || '')}</small></div>
            <div><span>Consequências</span><strong>${consequences.length ? `${consequences.length} documentada(s)` : 'Não documentadas'}</strong><small>${this.escape(item.consequencesNote || '')}</small></div>
          </div>
          <div class="equipment-source-box-v46"><span>Fonte da ficha</span><strong>${this.escape(item.sourceLabel || 'Por confirmar')}</strong><p>${this.escape(item.regionalNote || '')}</p></div>
        </section>`;
      }

      if (tab === 'symptoms') {
        const symptoms = Array.isArray(item.symptoms) ? item.symptoms : [];
        if (!symptoms.length) return evidenceEmpty(this, 'Sintomas', item.symptomsNote || 'Sem sintomas específicos validados para este modelo.');
        return `<section class="equipment-inspector-section"><h4>Sintomas documentados</h4><ul class="equipment-check-list">${symptoms.map(value => `<li><span aria-hidden="true">✓</span>${this.escape(value)}</li>`).join('')}</ul><p class="equipment-source-disclaimer-v43">${this.escape(item.symptomsNote || '')}</p></section>`;
      }

      if (tab === 'consequences') {
        const consequences = Array.isArray(item.consequences) ? item.consequences : [];
        if (!consequences.length) return evidenceEmpty(this, 'Consequências / danos', item.consequencesNote || 'Sem consequências específicas validadas para este modelo.');
        return `<section class="equipment-inspector-section"><h4>Consequências documentadas</h4><div class="equipment-consequence-box"><ul>${consequences.map(value => `<li>${this.escape(value)}</li>`).join('')}</ul><p class="equipment-source-disclaimer-v43">${this.escape(item.consequencesNote || '')}</p></section>`;
      }

      return baseTabHtml.call(this, item, tab);
    }
  });
})();
