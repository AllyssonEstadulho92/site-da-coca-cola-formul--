(() => {
  'use strict';

  if (!window.App) return;

  const CATEGORY_ORDER = ['Vitrines', 'Postmix', 'Vending', 'Freestyle', 'Monster', 'Outros'];

  // O catálogo visível deve corresponder aos 53 diretórios aprovados do projeto.
  window.EquipmentCatalogData = (window.EquipmentCatalogData || [])
    .filter(item => !['cooler-gs15-neon','cooler-countertop'].includes(item.id))
    .map(item => item.id === 'cooler-g10-monster' ? { ...item, category: 'Monster' } : item);

  const baseInspectorTabHtml = window.App.equipmentInspectorTabHtml;

  Object.assign(window.App, {
    equipmentAssetCode(item) {
      if (item?.assetCode) return item.assetCode;
      return String(item?.model || item?.id || 'EQ').toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 28);
    },

    renderEquipmentCatalog() {
      const items = this.equipmentCatalogItems();
      if (!this.state.equipmentCatalogFilters) this.state.equipmentCatalogFilters = { search: '', category: 'ALL', view: 'grid' };
      if (!this.state.equipmentInspectorTab) this.state.equipmentInspectorTab = 'overview';
      if (!this.state.equipmentImages) this.state.equipmentImages = {};

      const filters = this.state.equipmentCatalogFilters;
      const search = String(filters.search || '').trim().toLowerCase();
      const filtered = items.filter(item => {
        const facts = (item.technicalFacts || []).flat().join(' ');
        const haystack = [item.name, item.officialName, item.model, item.manufacturer, item.category, item.description, item.directorySlug, facts, ...(item.aliases || []), ...(item.symptoms || [])].join(' ').toLowerCase();
        return (!search || haystack.includes(search)) && (filters.category === 'ALL' || item.category === filters.category);
      });

      if (!filtered.some(item => item.id === this.state.selectedEquipmentCatalogId)) {
        this.state.selectedEquipmentCatalogId = filtered[0]?.id || '';
        this.state.equipmentInspectorTab = 'overview';
      }
      const selected = filtered.find(item => item.id === this.state.selectedEquipmentCatalogId) || null;
      const categories = CATEGORY_ORDER.filter(category => items.some(item => item.category === category));
      const grouped = CATEGORY_ORDER.map(category => [category, filtered.filter(item => item.category === category)]).filter(([, group]) => group.length);
      const configuredImages = items.filter(item => this.equipmentManualImage(item)?.dataUrl).length;

      this.els.viewContainer.innerHTML = `
        <div class="equipment-shell-v42 equipment-shell-v45">
          <div class="equipment-library-pane">
            <div class="page-head equipment-page-head equipment-page-head-v42">
              <div>
                <p class="eyebrow">Catálogo visual · ${items.length} modelos</p>
                <h3>Equipamentos</h3>
                <p class="muted equipment-lead">Procure pelo nome ou modelo exato. A categoria descreve a família; o título do cartão identifica o equipamento.</p>
              </div>
              <div class="page-actions"><button class="btn btn-primary" data-route-jump="new" type="button">+ Novo registo</button></div>
            </div>

            <div class="equipment-section-tabs" role="tablist" aria-label="Vistas de equipamentos">
              <button class="equipment-section-tab active" type="button" role="tab" aria-selected="true"><span aria-hidden="true">▣</span> Catálogo de Equipamentos</button>
              <button class="equipment-section-tab" id="showRegisteredEquipment" type="button" role="tab" aria-selected="false"><span aria-hidden="true">♙</span> Meus Equipamentos</button>
            </div>

            <div class="equipment-category-chips" aria-label="Categorias de equipamento">
              <button type="button" data-equipment-category-chip="ALL" class="${filters.category === 'ALL' ? 'active' : ''}">Todos</button>
              ${categories.map(category => `<button type="button" data-equipment-category-chip="${this.escapeAttr(category)}" class="${filters.category === category ? 'active' : ''}">${this.escape(category)}</button>`).join('')}
            </div>

            <section class="equipment-toolbar-v42" aria-label="Pesquisa e visualização">
              <label class="equipment-search-v33">
                <span class="sr-only">Pesquisar equipamentos</span>
                <span aria-hidden="true" class="equipment-search-icon">⌕</span>
                <input id="equipmentCatalogSearch" type="search" value="${this.escapeAttr(filters.search)}" placeholder="Pesquisar nome, modelo ou diretório…" autocomplete="off" />
              </label>
              <label class="equipment-category-v33">
                <span class="sr-only">Filtrar categoria</span>
                <select id="equipmentCatalogCategory">
                  <option value="ALL" ${filters.category === 'ALL' ? 'selected' : ''}>Todas as categorias</option>
                  ${categories.map(category => `<option value="${this.escapeAttr(category)}" ${filters.category === category ? 'selected' : ''}>${this.escape(category)}</option>`).join('')}
                </select>
              </label>
              <div class="equipment-view-switch" aria-label="Modo de visualização">
                <button type="button" class="${filters.view === 'grid' ? 'active' : ''}" data-equipment-view="grid" aria-label="Vista em grelha" aria-pressed="${filters.view === 'grid'}">▦</button>
                <button type="button" class="${filters.view === 'list' ? 'active' : ''}" data-equipment-view="list" aria-label="Vista em lista" aria-pressed="${filters.view === 'list'}">☷</button>
              </div>
            </section>

            <div class="equipment-manual-info equipment-manual-info-v45" role="note">
              <div><strong>Fotografias do catálogo</strong><span>${configuredImages} de ${items.length} configuradas neste dispositivo.</span></div>
              <p>Toque na fotografia de um cartão para associar a imagem real ao modelo correto. O nome/modelo não é alterado pela fotografia.</p>
            </div>

            <div class="equipment-result-line" aria-live="polite">${filtered.length} modelo(s) encontrado(s)</div>
            ${grouped.length ? grouped.map(([category, group]) => this.equipmentCategorySection(category, group, filters.view)).join('') : this.empty('Nenhum equipamento encontrado.', 'Altere a pesquisa ou a categoria.')}
          </div>

          <aside class="equipment-inspector-pane equipment-inspector-v42" id="equipmentInspector" aria-label="Ficha do equipamento selecionado">
            ${selected ? this.equipmentInspectorHtml(selected) : this.empty('Selecione um equipamento.', 'A ficha técnica aparecerá aqui.')}
          </aside>
        </div>`;

      this.bindViewActions();
      this.bindEquipmentCatalogActions();
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
