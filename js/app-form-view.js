(() => {
  'use strict';
  Object.assign(window.App, {
    renderRecordForm(existing = null) {
      const mirror = !existing ? this.restoreDraftMirror() : null;
      let editBuffer = null;
      if (existing) {
        try {
          const raw = sessionStorage.getItem(`editBuffer:${existing.id}`);
          const parsed = raw ? JSON.parse(raw) : null;
          if (parsed?.id === existing.id) editBuffer = parsed;
        } catch { editBuffer = null; }
      }
      const record = existing ? (editBuffer || structuredClone(existing)) : (mirror || this.blankRecord());
      record.priority ||= 'NORMAL';
      record.department ||= '';
      this.state.currentDraft = record;
      this.state.editingExistingId = existing?.id || null;
      const isEdit = Boolean(existing);
      const equipmentOptions = this.optionList(this.state.settings.equipmentTypes, record.equipmentType);
      const symptomOptions = this.optionList(this.state.settings.symptoms, record.symptom);
      const faultOptions = this.optionList(this.state.settings.faultCategories, record.faultCategory);
      const routingOptions = this.state.settings.routingRules.filter(r => r.active).map(r => `<option value="${this.escapeAttr(r.code)}" ${record.routingCode === r.code ? 'selected' : ''}>${this.escape(r.code)} — ${this.escape(r.label || 'Por definir')}</option>`).join('');
      const priorityOptions = Object.entries(this.priorityLabels).map(([value,label]) => `<option value="${value}" ${record.priority===value?'selected':''}>${this.escape(label)}</option>`).join('');

      this.els.viewContainer.innerHTML = `
        <div class="page-head">
          <div><p class="eyebrow">${isEdit ? 'Atualização' : 'Criação'}</p><h3>${isEdit ? this.escape(record.displayId) : 'Novo registo de avaria'}</h3></div>
          <div class="page-actions">${isEdit ? `<button class="btn btn-secondary" type="button" data-action="discard-edit">Descartar alterações</button>` : ``}<button class="btn btn-secondary" data-route-jump="records">Voltar aos registos</button></div>
        </div>
        <div class="process-tracker" aria-label="Fluxo do processo">${this.processTrackerHtml(record.status)}</div>
        <div class="form-layout">
          <form id="recordForm" class="form-card" novalidate>
            <section class="form-section">
              <div class="form-section-head"><h3>1. Identificação</h3><span>* Campos principais</span></div>
              <div class="form-grid">
                ${this.field('occurrenceDate','Data da ocorrência','date',record.occurrenceDate,true)}
                ${this.field('agentName','Agente responsável','text',record.agentName,true,'', 'autocomplete="name"')}
                ${this.field('taxpayerNumber','Nº Contribuinte','text',record.taxpayerNumber,false,'Ex.: 123456789','inputmode="numeric"')}
                ${this.field('clientName','Cliente','text',record.clientName,true,'Nome do cliente / conta')}
                ${this.field('contactName','Nome do cliente/contacto','text',record.contactName,false,'Pessoa de contacto')}
                ${this.field('customerContact','Contacto do cliente','tel',record.customerContact,false,'Ex.: 912 345 678','inputmode="tel"')}
              </div>
            </section>

            <section class="form-section">
              <div class="form-section-head"><h3>2. Estabelecimento</h3><span>Local da ocorrência</span></div>
              <div class="form-grid">
                ${this.field('establishmentName','Nome do estabelecimento','text',record.establishmentName,true,'Ex.: Café Central')}
                ${this.field('locality','Localidade','text',record.locality,false,'Ex.: Lisboa')}
                ${this.field('address','Morada / Local','text',record.address,true,'Rua, número, local', 'class="span-2"')}
                ${this.field('openingHours','Horário de funcionamento','text',record.openingHours,false,'Ex.: 08:00–20:00', 'class="span-2"')}
              </div>
            </section>

            <section class="form-section">
              <div class="form-section-head"><h3>3. Equipamento e avaria</h3><span>Dados técnicos</span></div>
              <div class="form-grid">
                ${this.field('equipmentReference','REF Equipamento','text',record.equipmentReference,true,'Ex.: VEN-000123','autocomplete="off"')}
                ${this.selectField('equipmentType','Tipo de equipamento',equipmentOptions,false)}
                ${this.selectField('faultCategory','Categoria da avaria',faultOptions,true)}
                ${this.selectField('symptom','Sintoma',symptomOptions,false)}
                ${this.selectField('priority','Prioridade',priorityOptions,false)}
                <div class="field"><span>Completude</span><div class="completion-meter"><span id="completionBar" style="width:${AppCore.calculateCompletion(record)}%"></span></div><small id="completionText" class="field-hint">${AppCore.calculateCompletion(record)}% preenchido</small></div>
                ${this.textareaField('faultDescription','Avaria / descrição',record.faultDescription,true,'Descreva objetivamente o problema observado.', 'span-2')}
              </div>
              <div id="duplicateWarning" class="inline-alert is-hidden" role="status"></div>
            </section>

            <section class="form-section">
              <div class="form-section-head"><h3>4. Encaminhamento</h3><span>PT 32 / 60 / 70 configurável</span></div>
              <div id="routingSuggestion" class="inline-alert info is-hidden" role="status"></div>
              <div class="form-grid">
                <label class="field"><span>Encaminhamento / PT</span><select id="routingCode" name="routingCode"><option value="">Por definir</option>${routingOptions}</select><small class="field-hint">A sugestão só é apresentada quando existir uma regra configurada com critérios.</small></label>
                ${this.field('department','Departamento / setor','text',record.department,false,'Preenchido pela regra ou manualmente')}
                ${this.field('emailDestination','E-mail de destino','email',record.emailDestination,false,'Configurar endereço autorizado')}
                ${this.selectField('emailSent','E-mail enviado?', `<option value="NO" ${record.emailSent==='NO'?'selected':''}>Não</option><option value="PENDING" ${record.emailSent==='PENDING'?'selected':''}>Por enviar</option><option value="YES" ${record.emailSent==='YES'?'selected':''}>Sim</option><option value="NA" ${record.emailSent==='NA'?'selected':''}>Não aplicável</option>`,false)}
                ${this.field('noteNumber','Nº Nota','text',record.noteNumber,false,'Número ou referência da nota')}
              </div>
            </section>

            <section class="form-section">
              <div class="form-section-head"><h3>5. Estado e observações</h3><span>Acompanhamento</span></div>
              <div class="form-grid">
                ${this.selectField('status','Estado', this.statusOptions(record.status),true)}
                ${this.selectField('treated','Tratado?', `<option value="false" ${!record.treated?'selected':''}>Não</option><option value="true" ${record.treated?'selected':''}>Sim</option>`,true)}
                ${this.textareaField('observations','Observações',record.observations,false,'Informação adicional relevante.', 'span-2')}
              </div>
            </section>

            <div class="form-actions">
              <button class="btn btn-secondary" type="button" data-action="save-draft">Guardar rascunho</button>
              <button class="btn btn-primary" type="submit">${isEdit ? 'Guardar alterações' : 'Criar registo'}</button>
            </div>
          </form>

          <aside class="summary-card" aria-label="Resumo do registo">
            <div class="panel-head"><h3>Resumo do registo</h3>${this.statusBadge(record.status)}</div>
            <div id="liveSummary" class="summary-body">${this.summaryHtml(record)}</div>
          </aside>
        </div>`;

      const form = document.getElementById('recordForm');
      form.addEventListener('input', () => this.captureForm(record));
      form.addEventListener('change', () => this.captureForm(record));
      form.addEventListener('submit', e => this.submitRecordForm(e, existing));
      document.getElementById('equipmentReference')?.addEventListener('blur', () => {
        const el = document.getElementById('equipmentReference');
        if (el) el.value = AppCore.normalizeReference(el.value);
        this.captureForm(record);
      });
      this.refreshDuplicateWarning(record);
      this.refreshRoutingSuggestion(record);
      this.bindViewActions();
    },

  });
})();
