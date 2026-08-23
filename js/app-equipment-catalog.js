(() => {
  'use strict';

  if (!window.App) return;

  const originalRenderEquipment = window.App.renderEquipment;
  const originalRenderRecordForm = window.App.renderRecordForm;

  Object.assign(window.App, {
    equipmentCatalogItems() {
      return Array.isArray(window.EquipmentCatalogData) ? window.EquipmentCatalogData : [];
    },

    renderEquipment() {
      return this.renderEquipmentCatalog();
    },

    renderEquipmentCatalog() {
      const items = this.equipmentCatalogItems();
      if (!this.state.equipmentCatalogFilters) this.state.equipmentCatalogFilters = { search: '', category: 'ALL' };
      const filters = this.state.equipmentCatalogFilters;
      const categories = ['ALL', ...new Set(items.map(item => item.category))];
      const filtered = items.filter(item => {
        const text = `${item.name} ${item.model} ${item.category} ${item.description} ${(item.symptoms || []).join(' ')}`.toLowerCase();
        const matchesSearch = !filters.search || text.includes(filters.search.toLowerCase());
        const matchesCategory = filters.category === 'ALL' || item.category === filters.category;
        return matchesSearch && matchesCategory;
      });

      this.els.viewContainer.innerHTML = `
        <div class="page-head equipment-page-head">
          <div>
            <p class="eyebrow">Biblioteca operacional</p>
            <h3>Catálogo de Equipamentos</h3>
            <p class="muted equipment-lead">Vitrines, vending, postmix, Freestyle e outros equipamentos, com identificação, ficha técnica de referência, sintomas e possíveis consequências.</p>
          </div>
          <div class="page-actions">
            <button class="btn btn-secondary" id="showRegisteredEquipment" type="button">Equipamentos registados</button>
            <button class="btn btn-primary" data-route-jump="new" type="button">+ Novo registo</button>
          </div>
        </div>

        <div class="equipment-source-note" role="note">
          <strong>Referência técnica:</strong>
          dados públicos Coca-Cola/CokeSolutions quando disponíveis. Valores dos EUA são assinalados e não substituem a placa do equipamento, manual europeu nem documentação CCEP Portugal. Intervenções em eletricidade, refrigeração, CO₂ ou circuitos pressurizados devem ser executadas por técnico habilitado.
        </div>

        <section class="equipment-toolbar" aria-label="Filtros do catálogo">
          <label class="equipment-search-field">
            <span>Pesquisar equipamento</span>
            <input id="equipmentCatalogSearch" type="search" value="${this.escapeAttr(filters.search)}" placeholder="Ex.: Freestyle, vitrine, não refrigera…" />
          </label>
          <label class="equipment-category-field">
            <span>Categoria</span>
            <select id="equipmentCatalogCategory">
              ${categories.map(category => `<option value="${this.escapeAttr(category)}" ${category === filters.category ? 'selected' : ''}>${this.escape(category === 'ALL' ? 'Todas' : category)}</option>`).join('')}
            </select>
          </label>
          <div class="equipment-result-count" aria-live="polite"><strong>${filtered.length}</strong><span>equipamentos</span></div>
        </section>

        ${filtered.length ? `<div class="equipment-catalog-grid">${filtered.map(item => this.equipmentCatalogCard(item)).join('')}</div>` : this.empty('Nenhum equipamento encontrado.', 'Altere a pesquisa ou a categoria.')}
      `;

      this.bindViewActions();
      document.getElementById('showRegisteredEquipment')?.addEventListener('click', () => this.renderRegisteredEquipmentView());
      document.getElementById('equipmentCatalogSearch')?.addEventListener('input', event => {
        this.state.equipmentCatalogFilters.search = event.target.value.trim();
        this.renderEquipmentCatalog();
        const input = document.getElementById('equipmentCatalogSearch');
        if (input) { input.focus(); input.setSelectionRange(input.value.length, input.value.length); }
      });
      document.getElementById('equipmentCatalogCategory')?.addEventListener('change', event => {
        this.state.equipmentCatalogFilters.category = event.target.value;
        this.renderEquipmentCatalog();
      });
      document.querySelectorAll('[data-equipment-detail]').forEach(button => button.addEventListener('click', () => this.openEquipmentCatalogDetail(button.dataset.equipmentDetail)));
      document.querySelectorAll('[data-equipment-new]').forEach(button => button.addEventListener('click', () => this.startRecordFromCatalog(button.dataset.equipmentNew)));
    },

    equipmentCatalogCard(item) {
      const verified = item.verification === 'PUBLIC_REFERENCE';
      return `<article class="equipment-catalog-card">
        <div class="equipment-media">
          ${item.photo ? `<img src="${this.escapeAttr(item.photo)}" alt="${this.escapeAttr(item.name)}" loading="lazy" />` : this.equipmentCatalogVisual(item.visual, item.name)}
          <span class="equipment-photo-status">${item.photo ? 'Fotografia autorizada' : 'Ilustração · foto autorizada por adicionar'}</span>
        </div>
        <div class="equipment-card-body">
          <div class="equipment-card-meta">
            <span class="equipment-category-chip">${this.escape(item.category)}</span>
            <span class="equipment-verification ${verified ? 'verified' : 'pending'}">${verified ? 'Referência pública' : 'A confirmar'}</span>
          </div>
          <h4>${this.escape(item.name)}</h4>
          <p class="equipment-model">${this.escape(item.model)}</p>
          <p class="equipment-description">${this.escape(item.description)}</p>
          <div class="equipment-mini-stats">
            <span><strong>${item.technicalFacts?.length || 0}</strong> dados técnicos</span>
            <span><strong>${item.symptoms?.length || 0}</strong> sintomas</span>
            <span><strong>${item.consequences?.length || 0}</strong> consequências</span>
          </div>
          <div class="equipment-card-actions">
            <button class="btn btn-secondary" type="button" data-equipment-detail="${this.escapeAttr(item.id)}">Ver ficha</button>
            <button class="btn btn-primary" type="button" data-equipment-new="${this.escapeAttr(item.id)}">Criar registo</button>
          </div>
        </div>
      </article>`;
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
        'freestyle-tower': `<path d="M81 9h78l13 158H68z"/><rect x="91" y="31" width="58" height="54" rx="5" class="screen"/><circle cx="120" cy="112" r="24"/><path d="M100 112h40M120 92v40"/><path d="M89 151h62"/>`
      };
      const body = visuals[kind] || visuals['single-cooler'];
      return `<svg ${common} class="equipment-illustration" aria-label="${this.escapeAttr(label)}">${title}<g class="equipment-shape">${body}</g></svg>`;
    },

    openEquipmentCatalogDetail(id) {
      const item = this.equipmentCatalogItems().find(entry => entry.id === id);
      if (!item) return this.toast('Equipamento não encontrado no catálogo.', 'error');
      const verified = item.verification === 'PUBLIC_REFERENCE';
      const source = item.sourceUrl ? `<a class="equipment-source-link" href="${this.escapeAttr(item.sourceUrl)}" target="_blank" rel="noopener noreferrer">Abrir fonte pública ↗</a>` : '<span class="muted">Sem fonte pública confirmada.</span>';

      this.els.recordDialogBody.innerHTML = `
        <div class="equipment-detail-header">
          <div class="equipment-detail-visual">${item.photo ? `<img src="${this.escapeAttr(item.photo)}" alt="${this.escapeAttr(item.name)}" />` : this.equipmentCatalogVisual(item.visual, item.name)}</div>
          <div>
            <div class="equipment-card-meta"><span class="equipment-category-chip">${this.escape(item.category)}</span><span class="equipment-verification ${verified ? 'verified' : 'pending'}">${verified ? 'Referência pública' : 'A confirmar'}</span></div>
            <h3>${this.escape(item.name)}</h3>
            <p class="equipment-model">${this.escape(item.model)}</p>
            <p>${this.escape(item.description)}</p>
          </div>
        </div>
        <div class="equipment-detail-grid">
          <section class="equipment-detail-section">
            <h4>Ficha técnica de referência</h4>
            <div class="equipment-fact-list">${(item.technicalFacts || []).map(([key, value]) => `<div><span>${this.escape(key)}</span><strong>${this.escape(value)}</strong></div>`).join('')}</div>
          </section>
          <section class="equipment-detail-section">
            <h4>Sintomas frequentes</h4>
            <ul>${(item.symptoms || []).map(value => `<li>${this.escape(value)}</li>`).join('')}</ul>
          </section>
          <section class="equipment-detail-section danger-context">
            <h4>Possíveis consequências / danos</h4>
            <ul>${(item.consequences || []).map(value => `<li>${this.escape(value)}</li>`).join('')}</ul>
          </section>
        </div>
        <div class="equipment-regional-warning"><strong>Importante:</strong> ${this.escape(item.regionalNote || 'Confirmar o modelo instalado e a documentação aplicável antes de qualquer intervenção.')}</div>
        <div class="equipment-detail-source"><div><span>Fonte</span><strong>${this.escape(item.sourceLabel || 'Por confirmar')}</strong></div>${source}</div>
        <div class="equipment-detail-actions"><button class="btn btn-primary" type="button" id="detailCreateRecord">Criar registo deste equipamento</button></div>
      `;
      document.getElementById('detailCreateRecord')?.addEventListener('click', () => {
        this.els.recordDialog.close();
        this.startRecordFromCatalog(item.id);
      });
      this.els.recordDialog.showModal();
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
    }
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
        if (head) head.insertAdjacentHTML('afterend', `<div class="equipment-prefill-note" role="status"><strong>Equipamento selecionado:</strong> ${this.escape(selected.name)} <span>${this.escape(selected.model)}</span>. Confirme a REF e a placa do equipamento antes de enviar o registo.</div>`);
        if (draft && typeof this.refreshSummary === 'function') this.refreshSummary(draft);
      } catch (error) {
        console.warn('Seleção do catálogo:', error);
      }
      return result;
    };
  }
})();
