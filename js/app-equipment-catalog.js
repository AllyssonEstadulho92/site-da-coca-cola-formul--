(() => {
  'use strict';

  if (!window.App) return;

  const originalRenderEquipment = window.App.renderEquipment;
  const originalRenderRecordForm = window.App.renderRecordForm;

  const CATEGORY_ORDER = ['Vitrines', 'Postmix', 'Vending', 'Freestyle', 'Outros'];
  const CATEGORY_META = {
    Vitrines: { icon: '▣', tone: 'red' },
    Postmix: { icon: '⌁', tone: 'purple' },
    Vending: { icon: '▥', tone: 'blue' },
    Freestyle: { icon: '◫', tone: 'teal' },
    Outros: { icon: '◇', tone: 'orange' },
  };
  const ASSET_CODES = {
    'cooler-countertop': 'VIT-CT01',
    'cooler-single-small': 'VIT-1P01',
    'cooler-single-large': 'VIT-1P02',
    'cooler-double-medium': 'VIT-2P01',
    'vending-glassfront-small': 'VEN-GF-PEQ',
    'vending-glassfront-large': 'VEN-GF-GDE',
    'postmix-counter-6': 'PM-COUNTER-06',
    'postmix-dropin-8': 'PM-DROPIN-08',
    'freestyle-7100': 'FS-7100',
    'freestyle-8100': 'FS-8100',
    'freestyle-9100': 'FS-9100',
    'monster-cooler-unconfirmed': 'OUT-MON-01',
  };

  Object.assign(window.App, {
    equipmentCatalogItems() {
      return Array.isArray(window.EquipmentCatalogData) ? window.EquipmentCatalogData : [];
    },

    equipmentAssetCode(item) {
      return ASSET_CODES[item?.id] || String(item?.id || 'EQ').toUpperCase().replace(/[^A-Z0-9]+/g, '-').slice(0, 18);
    },

    renderEquipment() {
      return this.renderEquipmentCatalog();
    },

    renderEquipmentCatalog() {
      const items = this.equipmentCatalogItems();
      if (!this.state.equipmentCatalogFilters) {
        this.state.equipmentCatalogFilters = { search: '', category: 'ALL', view: 'grid' };
      }
      if (!this.state.equipmentInspectorTab) this.state.equipmentInspectorTab = 'overview';

      const filters = this.state.equipmentCatalogFilters;
      const search = String(filters.search || '').toLowerCase();
      const filtered = items.filter(item => {
        const haystack = `${item.name} ${item.model} ${item.category} ${item.description} ${(item.symptoms || []).join(' ')} ${(item.consequences || []).join(' ')}`.toLowerCase();
        return (!search || haystack.includes(search)) && (filters.category === 'ALL' || item.category === filters.category);
      });

      const selectedStillVisible = filtered.some(item => item.id === this.state.selectedEquipmentCatalogId);
      if (!selectedStillVisible) {
        this.state.selectedEquipmentCatalogId = filtered[0]?.id || '';
        this.state.equipmentInspectorTab = 'overview';
      }
      const selected = filtered.find(item => item.id === this.state.selectedEquipmentCatalogId) || null;
      const categories = ['ALL', ...CATEGORY_ORDER.filter(category => items.some(item => item.category === category))];
      const grouped = CATEGORY_ORDER
        .map(category => [category, filtered.filter(item => item.category === category)])
        .filter(([, group]) => group.length);

      this.els.viewContainer.innerHTML = `
        <div class="equipment-shell-v33">
          <div class="equipment-library-pane">
            <div class="page-head equipment-page-head">
              <div>
                <p class="eyebrow">Catálogo técnico</p>
                <h3>Equipamentos</h3>
                <p class="muted equipment-lead">Identificação visual, ficha técnica de referência, sintomas frequentes e possíveis consequências.</p>
              </div>
              <div class="page-actions">
                <button class="btn btn-primary" data-route-jump="new" type="button">+ Novo registo</button>
              </div>
            </div>

            <div class="equipment-section-tabs" role="tablist" aria-label="Vistas de equipamentos">
              <button class="equipment-section-tab active" type="button" role="tab" aria-selected="true">
                <span aria-hidden="true">▣</span> Catálogo de Equipamentos
              </button>
              <button class="equipment-section-tab" id="showRegisteredEquipment" type="button" role="tab" aria-selected="false">
                <span aria-hidden="true">♙</span> Meus Equipamentos
              </button>
            </div>

            <div class="equipment-source-note compact" role="note">
              <strong>Referência:</strong> dados públicos quando disponíveis. Confirmar sempre placa, modelo e documentação CCEP aplicável antes de qualquer intervenção.
            </div>

            <section class="equipment-toolbar-v33" aria-label="Filtros do catálogo">
              <label class="equipment-search-v33">
                <span class="sr-only">Pesquisar equipamentos</span>
                <span aria-hidden="true" class="equipment-search-icon">⌕</span>
                <input id="equipmentCatalogSearch" type="search" value="${this.escapeAttr(filters.search)}" placeholder="Pesquisar equipamentos…" autocomplete="off" />
              </label>
              <label class="equipment-category-v33">
                <span class="sr-only">Filtrar categoria</span>
                <select id="equipmentCatalogCategory">
                  ${categories.map(category => `<option value="${this.escapeAttr(category)}" ${category === filters.category ? 'selected' : ''}>${this.escape(category === 'ALL' ? 'Todas as Categorias' : category)}</option>`).join('')}
                </select>
              </label>
              <div class="equipment-view-switch" aria-label="Modo de visualização">
                <button type="button" class="${filters.view === 'grid' ? 'active' : ''}" data-equipment-view="grid" aria-label="Vista em grelha" aria-pressed="${filters.view === 'grid'}">▦</button>
                <button type="button" class="${filters.view === 'list' ? 'active' : ''}" data-equipment-view="list" aria-label="Vista compacta" aria-pressed="${filters.view === 'list'}">☷</button>
              </div>
            </section>

            <div class="equipment-result-line" aria-live="polite">${filtered.length} equipamento(s) encontrado(s)</div>

            ${grouped.length ? grouped.map(([category, group]) => this.equipmentCategorySection(category, group, filters.view)).join('') : this.empty('Nenhum equipamento encontrado.', 'Altere a pesquisa ou a categoria.')}
          </div>

          <aside class="equipment-inspector-pane" id="equipmentInspector" aria-label="Ficha do equipamento selecionado">
            ${selected ? this.equipmentInspectorHtml(selected) : this.empty('Selecione um equipamento.', 'A ficha técnica aparecerá aqui.')}
          </aside>
        </div>
      `;

      this.bindViewActions();
      this.bindEquipmentCatalogActions();
    },

    equipmentCategorySection(category, items, view) {
      const meta = CATEGORY_META[category] || CATEGORY_META.Outros;
      return `<section class="equipment-category-section">
        <div class="equipment-category-title">
          <span class="equipment-category-icon tone-${meta.tone}" aria-hidden="true">${meta.icon}</span>
          <h4>${this.escape(category)}</h4>
          <span>${items.length}</span>
        </div>
        <div class="equipment-category-grid ${view === 'list' ? 'is-list' : ''}">
          ${items.map(item => this.equipmentCatalogCard(item)).join('')}
        </div>
      </section>`;
    },

    equipmentCatalogCard(item) {
      const selected = item.id === this.state.selectedEquipmentCatalogId;
      const code = this.equipmentAssetCode(item);
      return `<article class="equipment-catalog-card-v33 ${selected ? 'selected' : ''}" data-equipment-card="${this.escapeAttr(item.id)}">
        <button class="equipment-card-main" type="button" data-equipment-detail="${this.escapeAttr(item.id)}" aria-label="Abrir ficha de ${this.escapeAttr(item.name)}">
          <div class="equipment-thumb-v33">
            ${item.photo ? `<img src="${this.escapeAttr(item.photo)}" alt="${this.escapeAttr(item.name)}" loading="lazy" />` : this.equipmentCatalogVisual(item.visual, item.name)}
          </div>
          <div class="equipment-card-copy-v33">
            <strong>${this.escape(item.name)}</strong>
            <span>${this.escape(item.model)}</span>
            <code>${this.escape(code)}</code>
          </div>
          <span class="equipment-card-menu" aria-hidden="true">⋮</span>
        </button>
      </article>`;
    },

    equipmentInspectorHtml(item) {
      const verified = item.verification === 'PUBLIC_REFERENCE';
      const tab = this.state.equipmentInspectorTab || 'overview';
      const code = this.equipmentAssetCode(item);
      const tabs = [
        ['overview', 'Visão Geral'],
        ['technical', 'Ficha Técnica'],
        ['symptoms', 'Sintomas'],
        ['consequences', 'Consequências'],
        ['documents', 'Documentos'],
      ];
      return `
        <div class="equipment-inspector-head">
          <div class="equipment-inspector-visual">
            ${item.photo ? `<img src="${this.escapeAttr(item.photo)}" alt="${this.escapeAttr(item.name)}" />` : this.equipmentCatalogVisual(item.visual, item.name)}
          </div>
          <div class="equipment-inspector-title">
            <div class="equipment-inspector-kicker"><span>${this.escape(item.category)}</span><span class="equipment-verification ${verified ? 'verified' : 'pending'}">${verified ? 'Referência pública' : 'A confirmar'}</span></div>
            <h3>${this.escape(item.name)}</h3>
            <code>${this.escape(code)}</code>
            <p>${this.escape(item.model)}</p>
          </div>
        </div>

        <div class="equipment-inspector-tabs" role="tablist" aria-label="Detalhes do equipamento">
          ${tabs.map(([key, label]) => `<button type="button" role="tab" data-equipment-tab="${key}" class="${tab === key ? 'active' : ''}" aria-selected="${tab === key}">${this.escape(label)}</button>`).join('')}
        </div>

        <div class="equipment-inspector-body">
          ${this.equipmentInspectorTabHtml(item, tab)}
        </div>

        <div class="equipment-inspector-actions">
          <button class="btn btn-secondary" type="button" data-equipment-tab="technical">Ver ficha técnica</button>
          <button class="btn btn-primary" type="button" data-equipment-new="${this.escapeAttr(item.id)}">+ Criar Registo</button>
        </div>

        <div class="equipment-inspector-safety">
          <strong>Advertência</strong>
          <p>Esta área serve para identificação e triagem. Intervenções em eletricidade, refrigeração, CO₂ e circuitos pressurizados devem ser realizadas por pessoal habilitado.</p>
        </div>
      `;
    },

    equipmentInspectorTabHtml(item, tab) {
      if (tab === 'technical') {
        return `<section class="equipment-inspector-section">
          <h4>Ficha técnica de referência</h4>
          <div class="equipment-fact-grid-v33">${(item.technicalFacts || []).map(([key, value]) => `<div><span>${this.escape(key)}</span><strong>${this.escape(value)}</strong></div>`).join('')}</div>
          <div class="equipment-regional-warning"><strong>Nota regional:</strong> ${this.escape(item.regionalNote || 'Confirmar a placa do equipamento e a documentação aplicável.')}</div>
        </section>`;
      }
      if (tab === 'symptoms') {
        return `<section class="equipment-inspector-section">
          <h4>Sintomas frequentes</h4>
          <ul class="equipment-check-list">${(item.symptoms || []).map(value => `<li><span aria-hidden="true">✓</span>${this.escape(value)}</li>`).join('')}</ul>
        </section>`;
      }
      if (tab === 'consequences') {
        return `<section class="equipment-inspector-section">
          <h4>Possíveis consequências / danos</h4>
          <div class="equipment-consequence-box"><span aria-hidden="true">⚠</span><ul>${(item.consequences || []).map(value => `<li>${this.escape(value)}</li>`).join('')}</ul></div>
        </section>`;
      }
      if (tab === 'documents') {
        const source = item.sourceUrl
          ? `<a class="equipment-document-link" href="${this.escapeAttr(item.sourceUrl)}" target="_blank" rel="noopener noreferrer">Abrir referência pública ↗</a>`
          : '<span class="muted">Ainda não existe documento público confirmado para este modelo.</span>';
        return `<section class="equipment-inspector-section">
          <h4>Documentação e origem</h4>
          <div class="equipment-origin-box">
            <span>Fonte de referência</span>
            <strong>${this.escape(item.sourceLabel || 'Por confirmar')}</strong>
            ${source}
          </div>
          <p class="equipment-document-note">A documentação pública é apenas referência de catálogo. A placa técnica e documentação CCEP/europeia do equipamento instalado prevalecem.</p>
        </section>`;
      }
      return `<section class="equipment-inspector-section">
        <h4>Descrição</h4>
        <p class="equipment-overview-description">${this.escape(item.description)}</p>
        <div class="equipment-overview-grid">
          <div><span>Categoria</span><strong>${this.escape(item.category)}</strong></div>
          <div><span>Modelo / família</span><strong>${this.escape(item.model)}</strong></div>
          <div><span>Referência visual</span><strong>${this.escape(this.equipmentAssetCode(item))}</strong></div>
          <div><span>Estado da ficha</span><strong>${item.verification === 'PUBLIC_REFERENCE' ? 'Referência pública' : 'Por confirmar'}</strong></div>
        </div>
        <div class="equipment-symptom-preview">
          <h4>Sintomas frequentes</h4>
          <div>${(item.symptoms || []).slice(0, 6).map(value => `<span>✓ ${this.escape(value)}</span>`).join('')}</div>
        </div>
        <div class="equipment-impact-preview">
          <strong>Consequências</strong>
          <p>${this.escape((item.consequences || []).slice(0, 2).join('. '))}${item.consequences?.length ? '.' : ''}</p>
        </div>
      </section>`;
    },

    bindEquipmentCatalogActions() {
      document.getElementById('showRegisteredEquipment')?.addEventListener('click', () => this.renderRegisteredEquipmentView());
      document.getElementById('equipmentCatalogSearch')?.addEventListener('input', event => {
        this.state.equipmentCatalogFilters.search = event.target.value;
        this.renderEquipmentCatalog();
        const input = document.getElementById('equipmentCatalogSearch');
        if (input) {
          input.focus();
          input.setSelectionRange(input.value.length, input.value.length);
        }
      });
      document.getElementById('equipmentCatalogCategory')?.addEventListener('change', event => {
        this.state.equipmentCatalogFilters.category = event.target.value;
        this.renderEquipmentCatalog();
      });
      document.querySelectorAll('[data-equipment-view]').forEach(button => button.addEventListener('click', () => {
        this.state.equipmentCatalogFilters.view = button.dataset.equipmentView;
        this.renderEquipmentCatalog();
      }));
      document.querySelectorAll('[data-equipment-detail]').forEach(button => button.addEventListener('click', () => this.openEquipmentCatalogDetail(button.dataset.equipmentDetail)));
      document.querySelectorAll('[data-equipment-tab]').forEach(button => button.addEventListener('click', () => {
        this.state.equipmentInspectorTab = button.dataset.equipmentTab;
        this.renderEquipmentCatalog();
      }));
      document.querySelectorAll('[data-equipment-new]').forEach(button => button.addEventListener('click', () => this.startRecordFromCatalog(button.dataset.equipmentNew)));
    },

    equipmentCatalogVisual(kind, label) {
      const common = 'viewBox="0 0 240 180" role="img"';
      const title = `<title>${this.escape(label)} — ilustração de referência</title>`;
      const visuals = {
        'mini-cooler': `<rect x="69" y="31" width="102" height="126" rx="10"/><rect x="80" y="48" width="80" height="77" rx="5" class="glass"/><path d="M90 67h60M90 87h60M90 107h60"/><path d="M151 52v68"/><rect x="92" y="136" width="56" height="7" rx="3"/>`,
        'single-cooler': `<rect x="74" y="14" width="92" height="152" rx="9"/><rect x="84" y="32" width="72" height="105" rx="4" class="glass"/><path d="M94 56h52M94 78h52M94 100h52M94 122h52"/><path d="M149 38v94"/><rect x="97" y="148" width="46" height="7" rx="3"/>`,
        'double-cooler': `<rect x="42" y="18" width="156" height="145" rx="9"/><rect x="52" y="35" width="66" height="104" rx="4" class="glass"/><rect x="122" y="35" width="66" height="104" rx="4" class="glass"/><path d="M61 60h48M61 84h48M61 108h48M131 60h48M131 84h48M131 108h48"/><path d="M112 40v94M128 40v94"/>`,
        'vending': `<rect x="64" y="14" width="112" height="153" rx="9"/><rect x="77" y="30" width="67" height="101" rx="4" class="glass"/><path d="M87 48h47M87 66h47M87 84h47M87 102h47M87 120h47"/><rect x="150" y="40" width="14" height="31" rx="3"/><rect x="80" y="141" width="79" height="13" rx="4"/>`,
        'vending-wide': `<rect x="49" y="15" width="142" height="151" rx="9"/><rect x="62" y="31" width="92" height="100" rx="4" class="glass"/><path d="M73 49h70M73 67h70M73 85h70M73 103h70M73 121h70"/><rect x="162" y="41" width="16" height="34" rx="3"/><rect x="70" y="141" width="102" height="13" rx="4"/>`,
        'postmix': `<path d="M54 55h132v83H54z"/><path d="M67 55V38h106v17"/><path d="M75 76h90"/><path d="M82 76v26M101 76v26M120 76v26M139 76v26M158 76v26"/><path d="M75 111h90v15H75z"/><path d="M67 145h106"/>`,
        'dropin': `<path d="M48 79h144v65H48z"/><path d="M66 79V47h108v32"/><path d="M78 47v-15h84v15"/><path d="M78 62h84"/><path d="M83 62v22M104 62v22M125 62v22M146 62v22"/><path d="M68 105h104"/>`,
        'freestyle-counter': `<path d="M71 41h98l10 112H61z"/><rect x="86" y="54" width="68" height="45" rx="5" class="screen"/><circle cx="120" cy="124" r="19"/><path d="M105 124h30M120 109v30"/><path d="M80 153h80"/>`,
        'freestyle-tower': `<path d="M81 9h78l13 158H68z"/><rect x="91" y="31" width="58" height="54" rx="5" class="screen"/><circle cx="120" cy="112" r="24"/><path d="M100 112h40M120 92v40"/><path d="M89 151h62"/>`,
      };
      const body = visuals[kind] || visuals['single-cooler'];
      return `<svg ${common} class="equipment-illustration" aria-label="${this.escapeAttr(label)}">${title}<g class="equipment-shape">${body}</g></svg>`;
    },

    openEquipmentCatalogDetail(id) {
      const item = this.equipmentCatalogItems().find(entry => entry.id === id);
      if (!item) return this.toast('Equipamento não encontrado no catálogo.', 'error');
      this.state.selectedEquipmentCatalogId = item.id;
      this.state.equipmentInspectorTab = 'overview';
      this.renderEquipmentCatalog();
      if (window.matchMedia?.('(max-width: 980px)').matches) {
        requestAnimationFrame(() => document.getElementById('equipmentInspector')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
      }
    },

    startRecordFromCatalog(id) {
      const item = this.equipmentCatalogItems().find(entry => entry.id === id);
      if (!item) return;
      sessionStorage.setItem('equipmentCatalogSelection', JSON.stringify({ id: item.id, name: item.name, model: item.model, formType: item.formType }));
      this.navigate('new');
    },

    renderRegisteredEquipmentView() {
      if (typeof originalRenderEquipment !== 'function') return this.toast('A vista de equipamentos registados não está disponível.', 'error');
      originalRenderEquipment.call(this);
      const host = this.els.viewContainer;
      const switcher = document.createElement('div');
      switcher.className = 'equipment-registered-switch';
      switcher.innerHTML = `<button class="btn btn-secondary" id="backToEquipmentCatalog" type="button">← Voltar ao catálogo</button><span class="muted">Esta vista utiliza os equipamentos encontrados nos registos de avaria.</span>`;
      host.prepend(switcher);
      document.getElementById('backToEquipmentCatalog')?.addEventListener('click', () => this.renderEquipmentCatalog());
    },
  });

  if (typeof originalRenderRecordForm === 'function') {
    window.App.renderRecordForm = async function(...args) {
      const result = await originalRenderRecordForm.apply(this, args);
      const existing = args[0];
      if (existing) return result;
      const raw = sessionStorage.getItem('equipmentCatalogSelection');
      if (!raw) return result;
      sessionStorage.removeItem('equipmentCatalogSelection');
      try {
        const selected = JSON.parse(raw);
        const draft = this.state.currentDraft;
        if (draft) {
          draft.catalogEquipmentId = selected.id;
          draft.catalogEquipmentName = selected.name;
          draft.catalogEquipmentModel = selected.model;
        }
        const typeSelect = document.getElementById('equipmentType');
        if (typeSelect && [...typeSelect.options].some(option => option.value === selected.formType)) {
          typeSelect.value = selected.formType;
          if (draft) draft.equipmentType = selected.formType;
        }
        const head = this.els.viewContainer.querySelector('.page-head');
        if (head) {
          head.insertAdjacentHTML('afterend', `<div class="equipment-prefill-note" role="status"><strong>Equipamento selecionado:</strong> ${this.escape(selected.name)} <span>${this.escape(selected.model)}</span>. Confirme a REF e a placa do equipamento antes de enviar o registo.</div>`);
        }
        if (draft && typeof this.refreshSummary === 'function') this.refreshSummary(draft);
      } catch (error) {
        console.warn('Seleção do catálogo:', error);
      }
      return result;
    };
  }
})();
