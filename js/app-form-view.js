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
      const design = this.getFormDesign();
      const visible = fieldName => this.isFormFieldVisible(fieldName);
      const equipmentOptions = this.optionList(this.state.settings.equipmentTypes, record.equipmentType);
      const symptomOptions = this.optionList(this.state.settings.symptoms, record.symptom);
      const faultOptions = this.optionList(this.state.settings.faultCategories, record.faultCategory);
      const routingOptions = this.state.settings.routingRules.filter(r => r.active).map(r => `<option value="${this.escapeAttr(r.code)}" ${record.routingCode === r.code ? 'selected' : ''}>${this.escape(r.code)} — ${this.escape(r.label || 'Por definir')}</option>`).join('');
      const priorityOptions = Object.entries(this.priorityLabels).map(([value,label]) => `<option value="${value}" ${record.priority===value?'selected':''}>${this.escape(label)}</option>`).join('');
      const sectionIndex = sectionId => design.sectionOrder.indexOf(sectionId);
      const sectionTitle = sectionId => this.formSectionTitle(sectionId, sectionIndex(sectionId));

      const sections = {
        identity: `<section class="form-section" data-form-section="identity">
          <div class="form-section-head"><h3>${this.escape(sectionTitle('identity'))}</h3><span>* Campos principais</span></div>
          <div class="form-grid">
            ${this.field('occurrenceDate','Data da ocorrência','date',record.occurrenceDate,true)}
            ${this.field('agentName','Agente responsável','text',record.agentName,true,'', 'autocomplete="name"')}
            ${visible('taxpayerNumber') ? this.field('taxpayerNumber','Nº Contribuinte','text',record.taxpayerNumber,false,'Ex.: 123456789','inputmode="numeric"') : ''}
            ${this.field('clientName','Cliente','text',record.clientName,true,'Nome do cliente / conta')}
            ${visible('contactName') ? this.field('contactName','Nome do cliente/contacto','text',record.contactName,false,'Pessoa de contacto') : ''}
            ${visible('customerContact') ? this.field('customerContact','Contacto do cliente','tel',record.customerContact,false,'Ex.: 912 345 678','inputmode="tel"') : ''}
          </div>
        </section>`,

        location: `<section class="form-section" data-form-section="location">
          <div class="form-section-head"><h3>${this.escape(sectionTitle('location'))}</h3><span>Local da ocorrência</span></div>
          <div class="form-grid">
            ${this.field('establishmentName','Nome do estabelecimento','text',record.establishmentName,true,'Ex.: Café Central')}
            ${visible('locality') ? this.field('locality','Localidade','text',record.locality,false,'Ex.: Lisboa') : ''}
            ${this.field('address','Morada / Local','text',record.address,true,'Rua, número, local', 'class="span-2"')}
            ${visible('openingHours') ? this.field('openingHours','Horário de funcionamento','text',record.openingHours,false,'Ex.: 08:00–20:00', 'class="span-2"') : ''}
          </div>
        </section>`,

        incident: `<section class="form-section" data-form-section="incident">
          <div class="form-section-head"><h3>${this.escape(sectionTitle('incident'))}</h3><span>Dados da ocorrência</span></div>
          <div class="form-grid">
            ${this.field('equipmentReference','REF Equipamento','text',record.equipmentReference,true,'Ex.: VEN-000123','autocomplete="off"')}
            ${visible('equipmentType') ? this.selectField('equipmentType','Tipo de equipamento',equipmentOptions,false) : ''}
            ${this.selectField('faultCategory','Categoria da avaria',faultOptions,true)}
            ${visible('symptom') ? this.selectField('symptom','Sintoma',symptomOptions,false) : ''}
            ${visible('priority') ? this.selectField('priority','Prioridade',priorityOptions,false) : ''}
            <div class="field"><span>Completude</span><div class="completion-meter"><span id="completionBar" style="width:${AppCore.calculateCompletion(record)}%"></span></div><small id="completionText" class="field-hint">${AppCore.calculateCompletion(record)}% preenchido</small></div>
            ${this.textareaField('faultDescription','Avaria / descrição',record.faultDescription,true,'Descreva objetivamente o problema observado.', 'span-2')}
          </div>
          <div id="duplicateWarning" class="inline-alert is-hidden" role="status"></div>
        </section>`,

        routing: `<section class="form-section" data-form-section="routing">
          <div class="form-section-head"><h3>${this.escape(sectionTitle('routing'))}</h3><span>PT 32 / 60 / 70 configurável</span></div>
          <div id="routingSuggestion" class="inline-alert info is-hidden" role="status"></div>
          <div class="form-grid">
            ${visible('routingCode') ? `<label class="field"><span>Encaminhamento / PT</span><select id="routingCode" name="routingCode"><option value="">Por definir</option>${routingOptions}</select><small class="field-hint">A sugestão só é apresentada quando existir uma regra configurada com critérios.</small></label>` : ''}
            ${visible('department') ? this.field('department','Departamento / setor','text',record.department,false,'Preenchido pela regra ou manualmente') : ''}
            ${visible('emailDestination') ? this.field('emailDestination','E-mail de destino','email',record.emailDestination,false,'Configurar endereço autorizado') : ''}
            ${visible('emailSent') ? this.selectField('emailSent','E-mail enviado?', `<option value="NO" ${record.emailSent==='NO'?'selected':''}>Não</option><option value="PENDING" ${record.emailSent==='PENDING'?'selected':''}>Por enviar</option><option value="YES" ${record.emailSent==='YES'?'selected':''}>Sim</option><option value="NA" ${record.emailSent==='NA'?'selected':''}>Não aplicável</option>`,false) : ''}
            ${visible('noteNumber') ? this.field('noteNumber','Nº Nota','text',record.noteNumber,false,'Número ou referência da nota') : ''}
          </div>
        </section>`,

        status: `<section class="form-section" data-form-section="status">
          <div class="form-section-head"><h3>${this.escape(sectionTitle('status'))}</h3><span>Acompanhamento</span></div>
          <div class="form-grid">
            ${this.selectField('status','Estado', this.statusOptions(record.status),true)}
            ${this.selectField('treated','Tratado?', `<option value="false" ${!record.treated?'selected':''}>Não</option><option value="true" ${record.treated?'selected':''}>Sim</option>`,true)}
            ${visible('observations') ? this.textareaField('observations','Observações',record.observations,false,'Informação adicional relevante.', 'span-2') : ''}
          </div>
        </section>`
      };

      const orderedSections = design.sectionOrder.map(id => sections[id]).filter(Boolean).join('');
      const formLayoutClass = `form-layout${design.showSummary ? '' : ' no-summary'}`;

      this.els.viewContainer.innerHTML = `
        <div class="${this.formDesignClass()}">
          <div class="page-head">
            <div><p class="eyebrow">${isEdit ? 'Atualização' : 'Criação'}</p><h3>${isEdit ? this.escape(record.displayId) : 'Novo registo'}</h3></div>
            <div class="page-actions">${isEdit ? `<button class="btn btn-secondary" type="button" data-action="discard-edit">Descartar alterações</button>` : ``}<button class="btn btn-secondary designer-shortcut" type="button" data-route-jump="designer">Personalizar formulário</button><button class="btn btn-secondary" type="button" data-route-jump="records">Voltar aos registos</button></div>
          </div>
          <div class="process-tracker" aria-label="Fluxo do processo">${this.processTrackerHtml(record.status)}</div>
          <div class="${formLayoutClass}">
            <form id="recordForm" class="form-card" novalidate>
              ${orderedSections}
              <div class="form-actions">
                <button class="btn btn-secondary" type="button" data-action="save-draft">Guardar rascunho</button>
                <button class="btn btn-primary" type="submit">${isEdit ? 'Guardar alterações' : 'Criar registo'}</button>
              </div>
            </form>
            ${design.showSummary ? `<aside class="summary-card" aria-label="Resumo do registo"><div class="panel-head"><h3>Resumo do registo</h3>${this.statusBadge(record.status)}</div><div id="liveSummary" class="summary-body">${this.summaryHtml(record)}</div></aside>` : ''}
          </div>
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
