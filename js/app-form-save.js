(() => {
  'use strict';
  Object.assign(window.App, {
    applySuggestedRouting(code, record) {
      const rule = this.state.settings.routingRules.find(r => r.code === code);
      if (!rule) return;
      record.routingCode = rule.code;
      record.emailDestination = rule.email || record.emailDestination;
      record.department = rule.department || record.department;
      const routing = document.getElementById('routingCode');
      const email = document.getElementById('emailDestination');
      const department = document.getElementById('department');
      if (routing) routing.value = record.routingCode;
      if (email) email.value = record.emailDestination;
      if (department) department.value = record.department;
      this.refreshSummary(record);
      this.refreshRoutingSuggestion(record);
      this.refreshCompletion(record);
      this.queueAutosave();
      this.toast(`Sugestão ${rule.code} aplicada. Confirme os dados antes de enviar.`, 'success');
    },

    refreshSummary(record) {
      const container = document.getElementById('liveSummary');
      if (container) container.innerHTML = this.summaryHtml(record);
      const badge = document.querySelector('.summary-card .status-badge');
      if (badge) badge.outerHTML = this.statusBadge(record.status);
    },

    summaryHtml(r) {
      const rows = [
        ['ID', r.displayId || 'Será criado ao concluir'],
        ['Cliente', r.clientName || '—'],
        ['Estabelecimento', r.establishmentName || '—'],
        ['REF Equipamento', r.equipmentReference || '—'],
        ['Avaria', r.faultDescription || r.faultCategory || '—'],
        ['Prioridade', this.priorityLabels[r.priority] || 'Normal'],
        ['Encaminhamento', r.routingCode || 'Por definir'],
        ['Departamento', r.department || '—'],
        ['E-mail', r.emailDestination || 'Por definir'],
        ['Nº Nota', r.noteNumber || '—'],
        ['Tratado', r.treated ? 'Sim' : 'Não'],
        ['Completude', `${AppCore.calculateCompletion(r)}%`],
        ['Última gravação', this.formatDateTime(r.updatedAt)]
      ];
      return rows.map(([k,v]) => `<div class="summary-row"><span>${this.escape(k)}</span><strong>${this.escape(v)}</strong></div>`).join('');
    },

    queueAutosave() {
      clearTimeout(this.state.autosaveTimer);
      this.setSaveState('A guardar…', 'pending');
      this.state.autosaveTimer = setTimeout(() => this.saveDraftNow(), 650);
    },

    async saveDraftNow() {
      const record = this.state.currentDraft;
      if (!record) return;
      record.updatedAt = new Date().toISOString();
      if (this.state.editingExistingId) {
        sessionStorage.setItem(`editBuffer:${this.state.editingExistingId}`, JSON.stringify(record));
        this.setSaveState(`Alterações protegidas ${this.formatTime(record.updatedAt)}`, 'saved');
        return;
      }
      if (!record.displayId) record.displayId = await this.nextDisplayId();
      record.syncStatus = navigator.onLine ? 'LOCAL' : 'PENDING';
      await AppDB.put('records', record);
      sessionStorage.removeItem('unsavedDraftMirror');
      await this.ensureActivity(record, 'AUTOSAVE', 'Rascunho guardado automaticamente', true);
      this.setSaveState(`Guardado ${this.formatTime(record.updatedAt)}`, 'saved');
    },

    async submitRecordForm(event, existing) {
      event.preventDefault();
      const form = event.currentTarget;
      const record = this.state.currentDraft;
      this.captureForm(record);
      record.equipmentReference = AppCore.normalizeReference(record.equipmentReference);
      const refInput = document.getElementById('equipmentReference');
      if (refInput) refInput.value = record.equipmentReference;
      if (!this.validateRecordForm(form)) {
        this.toast('Reveja os campos assinalados antes de guardar.', 'error');
        return;
      }
      const previousStatus = existing?.status;
      const previousEmailState = existing?.emailSent;
      if (record.status === 'DRAFT') record.status = 'REGISTERED';
      if (!record.displayId) record.displayId = await this.nextDisplayId();
      record.updatedAt = new Date().toISOString();
      if (!existing) record.createdAt = record.createdAt || new Date().toISOString();
      const tracked = ['occurrenceDate','agentName','taxpayerNumber','clientName','contactName','customerContact','establishmentName','locality','address','openingHours','equipmentReference','equipmentType','faultCategory','symptom','faultDescription','priority','routingCode','department','emailDestination','emailSent','noteNumber','treated','status','observations'];
      const changes = AppCore.diffRecord(existing, record, tracked);
      await AppDB.put('records', record);
      await this.ensureActivity(record, existing ? 'UPDATED' : 'CREATED', existing ? 'Registo atualizado' : 'Registo criado', false, { changes });
      if (previousStatus && previousStatus !== record.status) await this.ensureActivity(record, 'STATUS_CHANGED', `Estado alterado de ${this.statusLabels[previousStatus]} para ${this.statusLabels[record.status]}`);
      if (previousEmailState && previousEmailState !== 'YES' && record.emailSent === 'YES') await this.ensureActivity(record, 'EMAIL_MARKED_SENT', 'E-mail assinalado como enviado');
      this.state.currentDraft = null;
      if (existing?.id) sessionStorage.removeItem(`editBuffer:${existing.id}`);
      this.state.editingExistingId = null;
      sessionStorage.removeItem('unsavedDraftMirror');
      this.toast(existing ? 'Alterações guardadas.' : 'Registo criado com sucesso.', 'success');
      this.navigate('records');
    },

    validateRecordForm(form) {
      let firstInvalid = null;
      form.querySelectorAll('input, select, textarea').forEach(input => {
        const emptyRequired = input.required && !String(input.value || '').trim();
        const typeInvalid = !emptyRequired && input.value && !input.checkValidity();
        const invalid = emptyRequired || typeInvalid;
        input.setAttribute('aria-invalid', invalid ? 'true' : 'false');
        if (invalid && !firstInvalid) firstInvalid = input;
      });
      if (firstInvalid) { firstInvalid.focus(); return false; }
      return true;
    },

    async nextDisplayId() {
      const year = new Date().getFullYear();
      const pattern = new RegExp(`^REG-${year}-(\\d{6})$`);
      const nums = this.state.records.map(r => (r.displayId || '').match(pattern)).filter(Boolean).map(m => Number(m[1]));
      const next = (nums.length ? Math.max(...nums) : 0) + 1;
      return `REG-${year}-${String(next).padStart(6,'0')}`;
    },

    async ensureActivity(record, eventType, label, silent = false, meta = {}) {
      if (silent) {
        const existing = this.state.activities.find(a => a.recordId === record.id && a.eventType === 'AUTOSAVE' && Math.abs(new Date(a.createdAt) - new Date()) < 60000);
        if (existing) return;
      }
      const activity = { id: crypto.randomUUID(), recordId: record.id, userId: this.state.user.email, eventType, label, createdAt: new Date().toISOString(), ...meta };
      await AppDB.put('activities', activity);
      this.state.activities.unshift(activity);
    },

    renderEditFromHash() {
      const params = new URLSearchParams(location.hash.split('?')[1] || '');
      const id = params.get('id');
      const record = this.state.records.find(r => r.id === id);
      if (!record) { this.toast('Registo não encontrado.', 'error'); return this.navigate('records'); }
      this.renderRecordForm(record);
    },

  });
})();
