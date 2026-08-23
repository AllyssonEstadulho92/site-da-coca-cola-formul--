(() => {
  'use strict';

  if (!window.App) return;

  const baseLoadData = window.App.loadData;
  const baseBindEquipmentCatalogActions = window.App.bindEquipmentCatalogActions;
  const CATEGORY_ORDER = ['Vitrines', 'Postmix', 'Vending', 'Freestyle', 'Outros'];
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

    equipmentManualImageHtml(item, context = 'card') {
      const image = this.equipmentManualImage(item);
      if (image?.dataUrl) {
        return `<div class="equipment-manual-image-wrap ${context === 'inspector' ? 'is-inspector' : 'is-card'}">
          <img class="equipment-manual-image" src="${this.escapeAttr(image.dataUrl)}" alt="${this.escapeAttr(item.name)}" loading="lazy" />
          <span class="equipment-manual-badge">Imagem manual</span>
        </div>`;
      }
      return `<div class="equipment-manual-placeholder ${context === 'inspector' ? 'is-inspector' : 'is-card'}">
        ${this.equipmentCatalogVisual(item.visual, item.name)}
        <span aria-hidden="true">＋</span>
        <strong>Adicionar imagem</strong>
      </div>`;
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
        const haystack = [item.name, item.officialName, item.model, item.manufacturer, item.category, item.description, facts, ...(item.aliases || []), ...(item.symptoms || [])].join(' ').toLowerCase();
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
        <div class="equipment-shell-v42">
          <div class="equipment-library-pane">
            <div class="page-head equipment-page-head equipment-page-head-v42">
              <div>
                <p class="eyebrow">Catálogo visual</p>
                <h3>Equipamentos</h3>
                <p class="muted equipment-lead">Identifique rapidamente o equipamento durante a chamada e consulte ficha técnica, sintomas e consequências.</p>
              </div>
              <div class="page-actions">
                <button class="btn btn-primary" data-route-jump="new" type="button">+ Novo registo</button>
              </div>
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
                <input id="equipmentCatalogSearch" type="search" value="${this.escapeAttr(filters.search)}" placeholder="Pesquisar equipamento, modelo…" autocomplete="off" />
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

            <div class="equipment-manual-info" role="note">
              <div><strong>Imagens manuais</strong><span>${configuredImages} de ${items.length} configuradas neste dispositivo.</span></div>
              <p>Use fotografias reais do equipamento ou da placa/modelo. A imagem escolhida fica guardada localmente e é incluída no backup da aplicação.</p>
            </div>

            <div class="equipment-result-line" aria-live="polite">${filtered.length} equipamento(s) encontrado(s)</div>
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
      return `<article class="equipment-catalog-card-v33 equipment-card-v42 ${selected ? 'selected' : ''}" data-equipment-card="${this.escapeAttr(item.id)}">
        <button class="equipment-card-main equipment-card-main-v42" type="button" data-equipment-detail="${this.escapeAttr(item.id)}" aria-label="Abrir ficha de ${this.escapeAttr(item.name)}">
          <div class="equipment-thumb-v33 equipment-thumb-v42">${this.equipmentManualImageHtml(item, 'card')}</div>
          <div class="equipment-card-copy-v33">
            <strong>${this.escape(item.name)}</strong>
            <span>${this.escape(item.model)}</span>
            <code>${this.escape(this.equipmentAssetCode(item))}</code>
            <small>${image ? 'Imagem definida manualmente' : 'Sem imagem manual'}</small>
          </div>
        </button>
        <button class="equipment-card-image-action" type="button" data-equipment-image="${this.escapeAttr(item.id)}" aria-label="${image ? 'Alterar' : 'Adicionar'} imagem de ${this.escapeAttr(item.name)}" title="${image ? 'Alterar imagem' : 'Adicionar imagem'}">⋮</button>
      </article>`;
    },

    equipmentInspectorHtml(item) {
      const tab = this.state.equipmentInspectorTab || 'overview';
      const image = this.equipmentManualImage(item);
      const tabs = [['overview','Visão Geral'],['technical','Ficha Técnica'],['symptoms','Sintomas'],['consequences','Consequências'],['documents','Documentos']];
      return `
        <div class="equipment-inspector-head equipment-inspector-head-v42">
          <div class="equipment-inspector-visual equipment-inspector-visual-v42">${this.equipmentManualImageHtml(item, 'inspector')}</div>
          <div class="equipment-inspector-title">
            <div class="equipment-inspector-kicker"><span>${this.escape(item.category)}</span><span class="equipment-verification ${image ? 'verified' : 'pending'}">${image ? 'Imagem manual' : 'Imagem por adicionar'}</span></div>
            <h3>${this.escape(item.name)}</h3>
            <code>${this.escape(this.equipmentAssetCode(item))}</code>
            <p>${this.escape(item.model)}${item.manufacturer ? ` · ${this.escape(item.manufacturer)}` : ''}</p>
          </div>
        </div>

        <div class="equipment-inspector-image-tools">
          <button class="btn btn-secondary" type="button" data-equipment-image="${this.escapeAttr(item.id)}">${image ? 'Alterar imagem' : '+ Adicionar imagem'}</button>
          ${image ? `<button class="equipment-remove-image" type="button" data-equipment-image-remove="${this.escapeAttr(item.id)}">Remover</button>` : ''}
        </div>

        <div class="equipment-inspector-tabs" role="tablist" aria-label="Detalhes do equipamento">
          ${tabs.map(([key, label]) => `<button type="button" role="tab" data-equipment-tab="${key}" class="${tab === key ? 'active' : ''}" aria-selected="${tab === key}">${this.escape(label)}</button>`).join('')}
        </div>
        <div class="equipment-inspector-body">${this.equipmentInspectorTabHtml(item, tab)}</div>
        <div class="equipment-inspector-actions">
          <button class="btn btn-secondary" type="button" data-equipment-tab="technical">Ver ficha técnica</button>
          <button class="btn btn-primary" type="button" data-equipment-new="${this.escapeAttr(item.id)}">+ Criar Registo</button>
        </div>
        <div class="equipment-inspector-safety"><strong>Advertência</strong><p>Esta área serve para identificação e triagem. Confirme sempre a placa/modelo antes de indicar qualquer intervenção técnica.</p></div>`;
    },

    equipmentInspectorTabHtml(item, tab) {
      const image = this.equipmentManualImage(item);
      if (tab === 'technical') {
        return `<section class="equipment-inspector-section"><h4>Ficha técnica</h4><div class="equipment-fact-grid-v33">${(item.technicalFacts || []).map(([key, value]) => `<div><span>${this.escape(key)}</span><strong>${this.escape(value)}</strong></div>`).join('')}</div><div class="equipment-regional-warning"><strong>Confirmação:</strong> compare estes dados com a placa técnica do equipamento instalado.</div></section>`;
      }
      if (tab === 'symptoms') {
        return `<section class="equipment-inspector-section"><h4>Sintomas frequentes</h4><ul class="equipment-check-list">${(item.symptoms || []).map(value => `<li><span aria-hidden="true">✓</span>${this.escape(value)}</li>`).join('')}</ul></section>`;
      }
      if (tab === 'consequences') {
        return `<section class="equipment-inspector-section"><h4>Possíveis consequências / danos</h4><div class="equipment-consequence-box"><span aria-hidden="true">⚠</span><ul>${(item.consequences || []).map(value => `<li>${this.escape(value)}</li>`).join('')}</ul></div></section>`;
      }
      if (tab === 'documents') {
        const docs = Array.isArray(item.documents) ? item.documents : [];
        return `<section class="equipment-inspector-section"><h4>Documentos e imagem</h4>
          <div class="equipment-origin-box"><span>Imagem do equipamento</span><strong>${image ? 'Adicionada manualmente' : 'Ainda não adicionada'}</strong>${image ? `<span>${this.escape(image.fileName || 'Imagem local')} · ${this.escape(this.formatDateTime(image.updatedAt))}</span>` : '<span>Use “Adicionar imagem” para associar uma fotografia real a este modelo.</span>'}</div>
          <div class="equipment-document-list">${docs.length ? docs.map(document => `<a class="equipment-document-link" href="${this.escapeAttr(document.url)}" target="_blank" rel="noopener noreferrer">${this.escape(document.label)} ↗</a>`).join('') : '<span class="muted">Sem documento adicional ligado.</span>'}</div>
          <p class="equipment-document-note">As imagens manuais ficam neste dispositivo e acompanham o backup JSON da aplicação.</p></section>`;
      }

      const primaryFacts = (item.technicalFacts || []).slice(0, 6);
      return `<section class="equipment-inspector-section">
        <h4>Descrição</h4><p class="equipment-overview-description">${this.escape(item.description)}</p>
        <div class="equipment-overview-grid equipment-overview-grid-v42">
          <div><span>Categoria</span><strong>${this.escape(item.category)}</strong></div>
          <div><span>Modelo / família</span><strong>${this.escape(item.model)}</strong></div>
          ${primaryFacts.slice(0, 4).map(([key, value]) => `<div><span>${this.escape(key)}</span><strong>${this.escape(value)}</strong></div>`).join('')}
        </div>
        <div class="equipment-symptom-preview"><h4>Sintomas frequentes</h4><div>${(item.symptoms || []).slice(0, 6).map(value => `<span>✓ ${this.escape(value)}</span>`).join('')}</div></div>
        <div class="equipment-impact-preview"><strong>Consequências</strong><p>${this.escape((item.consequences || []).slice(0, 3).join('. '))}${item.consequences?.length ? '.' : ''}</p></div>
        <div class="equipment-local-origin"><strong>Origem da imagem</strong><span>${image ? 'Fotografia adicionada manualmente neste dispositivo.' : 'Nenhuma fotografia associada. Adicione a imagem real para identificação durante a chamada.'}</span></div>
      </section>`;
    },

    bindEquipmentCatalogActions() {
      baseBindEquipmentCatalogActions.call(this);
      document.querySelectorAll('[data-equipment-category-chip]').forEach(button => button.addEventListener('click', () => {
        this.state.equipmentCatalogFilters.category = button.dataset.equipmentCategoryChip;
        this.renderEquipmentCatalog();
      }));
      document.querySelectorAll('[data-equipment-image]').forEach(button => button.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        this.pickEquipmentImage(button.dataset.equipmentImage);
      }));
      document.querySelectorAll('[data-equipment-image-remove]').forEach(button => button.addEventListener('click', event => {
        event.preventDefault();
        this.removeEquipmentImage(button.dataset.equipmentImageRemove);
      }));
    },

    pickEquipmentImage(equipmentId) {
      const item = this.equipmentCatalogItems().find(entry => entry.id === equipmentId);
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
            source: 'MANUAL',
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
      if (dataUrlBytes(result) > TARGET_IMAGE_BYTES * 1.35) throw new Error('A imagem continua demasiado grande depois da otimização.');
      return result;
    },

    removeEquipmentImage(equipmentId) {
      const item = this.equipmentCatalogItems().find(entry => entry.id === equipmentId);
      if (!item || !this.equipmentManualImage(equipmentId)) return;
      this.confirm('Remover imagem?', `A imagem manual de “${item.name}” será eliminada deste dispositivo.`, async () => {
        await AppDB.remove('equipmentImages', equipmentId);
        delete this.state.equipmentImages[equipmentId];
        this.renderEquipmentCatalog();
        this.toast('Imagem manual removida.', 'success');
      });
    },
  });
})();
