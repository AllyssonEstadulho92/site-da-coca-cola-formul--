(() => {
  'use strict';
  Object.assign(window.App, {
    discardEditBuffer() {
      const id = this.state.editingExistingId;
      if (id) sessionStorage.removeItem(`editBuffer:${id}`);
      this.state.currentDraft = null;
      this.state.editingExistingId = null;
      this.toast('Alterações locais descartadas.', 'success');
      this.navigate('records');
    },

    blankRecord() {
      const now = new Date();
      return {
        id: crypto.randomUUID(), displayId: '', createdAt: now.toISOString(), updatedAt: now.toISOString(), createdBy: this.state.user.email, updatedBy: this.state.user.email,
        occurrenceDate: this.localDateInput(now), agentName: this.state.user.name, taxpayerNumber: '', clientName: '', contactName: '', customerContact: '', establishmentName: '', locality: '', address: '', openingHours: '', equipmentReference: '', equipmentType: '', faultCategory: '', symptom: '', faultDescription: '', priority: 'NORMAL', routingCode: '', department: '', emailDestination: '', emailSent: 'NO', emailSentAt: '', noteNumber: '', treated: false, status: 'DRAFT', observations: '', archived: false, syncStatus: 'LOCAL'
      };
    },

    restoreDraftMirror() {
      const raw = sessionStorage.getItem('unsavedDraftMirror');
      if (!raw) return null;
      try {
        const mirror = JSON.parse(raw);
        sessionStorage.removeItem('unsavedDraftMirror');
        return mirror.status === 'DRAFT' ? mirror : null;
      } catch { return null; }
    },

    captureForm(record) {
      const form = document.getElementById('recordForm');
      if (!form) return;
      const data = new FormData(form);
      const previousRoutingCode = record.routingCode;
      const fields = ['occurrenceDate','agentName','taxpayerNumber','clientName','contactName','customerContact','establishmentName','locality','address','openingHours','equipmentReference','equipmentType','faultCategory','symptom','faultDescription','priority','routingCode','department','emailDestination','emailSent','noteNumber','status','observations'];
      fields.forEach(key => {
        if (data.has(key)) record[key] = String(data.get(key) ?? '').trim();
      });
      if (data.has('treated')) record.treated = data.get('treated') === 'true';
      record.updatedAt = new Date().toISOString();
      record.updatedBy = this.state.user.email;
      if (record.emailSent === 'YES' && !record.emailSentAt) record.emailSentAt = new Date().toISOString();
      if (record.emailSent !== 'YES') record.emailSentAt = '';
      this.applyRoutingDefaults(record, previousRoutingCode !== record.routingCode);
      this.state.currentDraft = record;
      this.refreshSummary(record);
      this.refreshDuplicateWarning(record);
      this.refreshRoutingSuggestion(record);
      this.refreshCompletion(record);
      this.queueAutosave();
    },

    applyRoutingDefaults(record, force = false) {
      const rule = this.state.settings.routingRules.find(r => r.code === record.routingCode);
      if (!rule) return;
      if ((force || !record.emailDestination) && rule.email) {
        record.emailDestination = rule.email;
        const el = document.getElementById('emailDestination');
        if (el) el.value = rule.email;
      }
      if ((force || !record.department) && rule.department) {
        record.department = rule.department;
        const el = document.getElementById('department');
        if (el) el.value = rule.department;
      }
    },

    refreshCompletion(record) {
      const completion = AppCore.calculateCompletion(record);
      const bar = document.getElementById('completionBar');
      const text = document.getElementById('completionText');
      if (bar) bar.style.width = `${completion}%`;
      if (text) text.textContent = `${completion}% preenchido`;
    },

    refreshDuplicateWarning(record) {
      const box = document.getElementById('duplicateWarning');
      if (!box) return;
      const duplicates = AppCore.findDuplicates(this.state.records, record, { days: this.state.settings.duplicateWindowDays || 14, excludeId: record.id });
      if (!duplicates.length) {
        box.classList.add('is-hidden');
        box.innerHTML = '';
        return;
      }
      const first = duplicates[0];
      box.classList.remove('is-hidden');
      box.innerHTML = `<div><strong>Possível registo duplicado</strong><span>Existe ${duplicates.length === 1 ? 'uma ocorrência aberta' : `${duplicates.length} ocorrências abertas`} para a REF ${this.escape(record.equipmentReference)} nos últimos ${Number(this.state.settings.duplicateWindowDays || 14)} dias.</span></div><button class="btn btn-secondary btn-small" type="button" data-open-duplicate="${first.id}">Ver ${this.escape(first.displayId || 'registo')}</button>`;
      box.querySelector('[data-open-duplicate]')?.addEventListener('click', e => this.openRecordDetail(e.currentTarget.dataset.openDuplicate));
    },

    refreshRoutingSuggestion(record) {
      const box = document.getElementById('routingSuggestion');
      if (!box) return;
      const result = AppCore.suggestRouting(this.state.settings.routingRules, record);
      if (!result.rule && !result.ambiguous) {
        box.classList.add('is-hidden');
        box.innerHTML = '';
        return;
      }
      box.classList.remove('is-hidden');
      box.classList.add('info');
      if (result.ambiguous) {
        const codes = [...new Set(result.matches.filter(m => m.specificity === result.matches[0].specificity).map(m => m.code))];
        box.innerHTML = `<div><strong>Regras de encaminhamento ambíguas</strong><span>Coincidem várias regras com a mesma especificidade: ${this.escape(codes.join(', '))}. Reveja a configuração antes de aplicar.</span></div>`;
        return;
      }
      const rule = result.rule;
      const detail = [rule.department, rule.email].filter(Boolean).join(' · ');
      box.innerHTML = `<div><strong>Sugestão: ${this.escape(rule.code)} — ${this.escape(rule.label || 'Regra configurada')}</strong><span>${this.escape(detail || 'Sem departamento/e-mail configurado.')}</span></div><button class="btn btn-secondary btn-small" type="button" data-apply-routing="${this.escapeAttr(rule.code)}">Aplicar sugestão</button>`;
      box.querySelector('[data-apply-routing]')?.addEventListener('click', e => this.applySuggestedRouting(e.currentTarget.dataset.applyRouting, record));
    },
  });
})();
