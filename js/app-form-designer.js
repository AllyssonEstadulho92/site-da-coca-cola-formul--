(() => {
  'use strict';

  const SECTION_IDS = ['identity', 'location', 'incident', 'routing', 'status'];
  const FIELD_CATALOG = Object.freeze({
    identity: [
      ['occurrenceDate', 'Data da ocorrência', true],
      ['agentName', 'Agente responsável', true],
      ['taxpayerNumber', 'Nº Contribuinte', false],
      ['clientName', 'Cliente', true],
      ['contactName', 'Nome do cliente/contacto', false],
      ['customerContact', 'Contacto do cliente', false]
    ],
    location: [
      ['establishmentName', 'Nome do estabelecimento', true],
      ['locality', 'Localidade', false],
      ['address', 'Morada / Local', true],
      ['openingHours', 'Horário de funcionamento', false]
    ],
    incident: [
      ['equipmentReference', 'REF Equipamento', true],
      ['equipmentType', 'Tipo de equipamento', false],
      ['faultCategory', 'Categoria da avaria', true],
      ['symptom', 'Sintoma', false],
      ['priority', 'Prioridade', false],
      ['faultDescription', 'Avaria / descrição', true]
    ],
    routing: [
      ['routingCode', 'Encaminhamento / PT', false],
      ['department', 'Departamento / setor', false],
      ['emailDestination', 'E-mail de destino', false],
      ['emailSent', 'E-mail enviado?', false],
      ['noteNumber', 'Nº Nota', false]
    ],
    status: [
      ['status', 'Estado', true],
      ['treated', 'Tratado?', true],
      ['observations', 'Observações', false]
    ]
  });

  function cloneDesign(app) {
    const base = structuredClone(app.defaultSettings.formDesign);
    const source = app.state.settings?.formDesign || {};
    const validOrder = Array.isArray(source.sectionOrder)
      ? source.sectionOrder.filter(id => SECTION_IDS.includes(id))
      : [];
    for (const id of SECTION_IDS) if (!validOrder.includes(id)) validOrder.push(id);
    return {
      ...base,
      ...source,
      sectionOrder: validOrder,
      sectionTitles: { ...base.sectionTitles, ...(source.sectionTitles || {}) },
      hiddenOptionalFields: [...new Set(Array.isArray(source.hiddenOptionalFields) ? source.hiddenOptionalFields : [])]
    };
  }

  Object.assign(window.App, {
    formDesignerFieldCatalog() {
      return FIELD_CATALOG;
    },

    getFormDesign() {
      return cloneDesign(this);
    },

    isFormFieldVisible(fieldName) {
      const catalogEntry = Object.values(FIELD_CATALOG).flat().find(([name]) => name === fieldName);
      if (catalogEntry?.[2]) return true;
      return !this.getFormDesign().hiddenOptionalFields.includes(fieldName);
    },

    formSectionTitle(sectionId, index = null) {
      const design = this.getFormDesign();
      const title = design.sectionTitles[sectionId] || this.defaultSettings.formDesign.sectionTitles[sectionId] || sectionId;
      return index == null ? title : `${index + 1}. ${title}`;
    },

    formDesignClass() {
      const design = this.getFormDesign();
      const density = ['comfortable', 'compact'].includes(design.density) ? design.density : 'comfortable';
      const width = ['standard', 'wide'].includes(design.width) ? design.width : 'standard';
      const accent = ['red', 'blue', 'graphite'].includes(design.accent) ? design.accent : 'red';
      return `form-design density-${density} width-${width} accent-${accent}`;
    },

    renderFormDesigner() {
      if (!this.state.formDesignerDraft) this.state.formDesignerDraft = this.getFormDesign();
      const design = this.state.formDesignerDraft;
      const sectionCards = design.sectionOrder.map((sectionId, index) => {
        const fields = FIELD_CATALOG[sectionId] || [];
        return `<article class="designer-section-card" data-designer-section="${sectionId}">
          <div class="designer-section-head">
            <span class="designer-order">${index + 1}</span>
            <label class="field designer-title-field"><span>Título da secção</span><input data-designer-title="${sectionId}" value="${this.escapeAttr(design.sectionTitles[sectionId] || '')}"></label>
            <div class="designer-move-actions">
              <button class="icon-control" type="button" data-designer-move="up" data-section-id="${sectionId}" ${index === 0 ? 'disabled' : ''} aria-label="Mover secção para cima">↑</button>
              <button class="icon-control" type="button" data-designer-move="down" data-section-id="${sectionId}" ${index === design.sectionOrder.length - 1 ? 'disabled' : ''} aria-label="Mover secção para baixo">↓</button>
            </div>
          </div>
          <div class="designer-field-list">
            ${fields.map(([name, label, required]) => `<label class="designer-field-row ${required ? 'is-required' : ''}">
              <input type="checkbox" data-designer-field="${name}" ${required || !design.hiddenOptionalFields.includes(name) ? 'checked' : ''} ${required ? 'disabled' : ''}>
              <span><strong>${this.escape(label)}</strong><small>${required ? 'Obrigatório · sempre visível' : 'Opcional'}</small></span>
            </label>`).join('')}
          </div>
        </article>`;
      }).join('');

      this.els.viewContainer.innerHTML = `<div class="designer-page">
        <div class="page-head designer-page-head">
          <div><p class="eyebrow">Protótipo funcional</p><h3>Designer de Formulário</h3><p class="muted">Personalize a apresentação sem alterar a estrutura dos dados nem o código do formulário.</p></div>
          <div class="page-actions"><button class="btn btn-secondary" type="button" data-designer-reset>Repor padrão</button><button class="btn btn-primary" type="button" data-designer-save>Guardar design</button></div>
        </div>

        <div class="designer-workspace">
          <aside class="designer-controls panel">
            <div class="panel-head"><div><h3>Aparência</h3><span class="muted">Preferências globais</span></div></div>
            <div class="panel-body stack-md">
              <label class="field"><span>Densidade</span><select data-designer-setting="density"><option value="comfortable" ${design.density === 'comfortable' ? 'selected' : ''}>Confortável</option><option value="compact" ${design.density === 'compact' ? 'selected' : ''}>Compacta</option></select></label>
              <label class="field"><span>Largura</span><select data-designer-setting="width"><option value="standard" ${design.width === 'standard' ? 'selected' : ''}>Padrão</option><option value="wide" ${design.width === 'wide' ? 'selected' : ''}>Ampla</option></select></label>
              <label class="field"><span>Cor de destaque</span><select data-designer-setting="accent"><option value="red" ${design.accent === 'red' ? 'selected' : ''}>Vermelho</option><option value="blue" ${design.accent === 'blue' ? 'selected' : ''}>Azul</option><option value="graphite" ${design.accent === 'graphite' ? 'selected' : ''}>Grafite</option></select></label>
              <label class="toggle-row designer-toggle"><input type="checkbox" data-designer-summary ${design.showSummary ? 'checked' : ''}><span>Mostrar resumo lateral</span></label>
              <p class="field-hint">Campos obrigatórios não podem ser ocultados. Isto evita formulários visualmente personalizados que deixem de cumprir as validações do registo.</p>
              <button class="btn btn-secondary btn-block" type="button" data-route-jump="new">Abrir formulário real</button>
            </div>
          </aside>

          <section class="designer-structure">
            <div class="designer-structure-head"><div><p class="eyebrow">Estrutura</p><h3>Secções e campos</h3></div><span class="muted">Use ↑ ↓ para ordenar</span></div>
            <div class="designer-section-list">${sectionCards}</div>
          </section>

          <aside class="designer-preview-panel panel">
            <div class="panel-head"><div><h3>Pré-visualização</h3><span class="muted">Atualização imediata</span></div></div>
            <div class="panel-body"><div id="formDesignerPreview"></div></div>
          </aside>
        </div>
      </div>`;

      this.bindViewActions();
      this.renderFormDesignerPreview();
      this.bindFormDesignerActions();
    },

    renderFormDesignerPreview() {
      const target = document.getElementById('formDesignerPreview');
      if (!target || !this.state.formDesignerDraft) return;
      const design = this.state.formDesignerDraft;
      const visibleFields = sectionId => (FIELD_CATALOG[sectionId] || []).filter(([name, , required]) => required || !design.hiddenOptionalFields.includes(name));
      target.className = `designer-preview density-${design.density} accent-${design.accent}`;
      target.innerHTML = `<div class="designer-preview-window">
        <div class="designer-preview-top"><span></span><span></span><span></span><strong>Novo registo</strong></div>
        <div class="designer-preview-body">
          ${design.sectionOrder.map((sectionId, index) => `<section class="preview-section"><h4>${index + 1}. ${this.escape(design.sectionTitles[sectionId] || '')}</h4><div class="preview-fields">${visibleFields(sectionId).map(([name, label]) => `<span data-preview-field="${name}">${this.escape(label)}</span>`).join('')}</div></section>`).join('')}
          ${design.showSummary ? '<aside class="preview-summary"><strong>Resumo</strong><span>Estado</span><span>Cliente</span><span>Referência</span></aside>' : ''}
        </div>
      </div>`;
    },

    bindFormDesignerActions() {
      document.querySelectorAll('[data-designer-setting]').forEach(control => control.addEventListener('change', () => {
        this.state.formDesignerDraft[control.dataset.designerSetting] = control.value;
        this.renderFormDesignerPreview();
      }));
      document.querySelector('[data-designer-summary]')?.addEventListener('change', event => {
        this.state.formDesignerDraft.showSummary = event.target.checked;
        this.renderFormDesignerPreview();
      });
      document.querySelectorAll('[data-designer-title]').forEach(input => input.addEventListener('input', () => {
        this.state.formDesignerDraft.sectionTitles[input.dataset.designerTitle] = input.value.trimStart();
        this.renderFormDesignerPreview();
      }));
      document.querySelectorAll('[data-designer-field]').forEach(input => input.addEventListener('change', () => {
        const field = input.dataset.designerField;
        const hidden = new Set(this.state.formDesignerDraft.hiddenOptionalFields);
        if (input.checked) hidden.delete(field); else hidden.add(field);
        this.state.formDesignerDraft.hiddenOptionalFields = [...hidden];
        this.renderFormDesignerPreview();
      }));
      document.querySelectorAll('[data-designer-move]').forEach(button => button.addEventListener('click', () => {
        const order = this.state.formDesignerDraft.sectionOrder;
        const index = order.indexOf(button.dataset.sectionId);
        const target = button.dataset.designerMove === 'up' ? index - 1 : index + 1;
        if (index < 0 || target < 0 || target >= order.length) return;
        [order[index], order[target]] = [order[target], order[index]];
        this.renderFormDesigner();
      }));
      document.querySelector('[data-designer-save]')?.addEventListener('click', () => this.saveFormDesigner());
      document.querySelector('[data-designer-reset]')?.addEventListener('click', () => this.resetFormDesigner());
    },

    async saveFormDesigner() {
      const design = structuredClone(this.state.formDesignerDraft || this.getFormDesign());
      for (const id of SECTION_IDS) {
        if (!String(design.sectionTitles[id] || '').trim()) design.sectionTitles[id] = this.defaultSettings.formDesign.sectionTitles[id];
      }
      this.state.settings.formDesign = design;
      await AppDB.put('settings', { key: 'appSettings', value: this.state.settings });
      this.state.formDesignerDraft = structuredClone(design);
      this.toast('Design do formulário guardado.', 'success');
      this.renderFormDesigner();
    },

    resetFormDesigner() {
      this.confirm('Repor design padrão?', 'A ordem, títulos, campos opcionais e aparência regressam ao modelo inicial. Os registos guardados não são alterados.', async () => {
        this.state.formDesignerDraft = structuredClone(this.defaultSettings.formDesign);
        this.state.settings.formDesign = structuredClone(this.defaultSettings.formDesign);
        await AppDB.put('settings', { key: 'appSettings', value: this.state.settings });
        this.renderFormDesigner();
        this.toast('Design padrão reposto.', 'success');
      });
    }
  });
})();
