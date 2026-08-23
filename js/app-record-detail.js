(() => {
  'use strict';
  Object.assign(window.App, {
    openRecordDetail(id) {
      const r = this.state.records.find(x => x.id === id);
      if (!r) return;
      const activities = this.state.activities.filter(a => a.recordId === id).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
      const emailLabel = { YES:'Enviado', PENDING:'Por enviar', NO:'Não enviado', NA:'Não aplicável' }[r.emailSent] || '—';
      this.els.recordDialogBody.innerHTML = `
        <div class="page-head"><div><p class="eyebrow">Detalhe do registo</p><h3>${this.escape(r.displayId)}</h3></div>${this.statusBadge(r.status)}</div>
        <div class="detail-grid">
          ${this.detailItem('Data', this.formatDate(r.occurrenceDate))}${this.detailItem('Agente', r.agentName)}${this.detailItem('Cliente', r.clientName)}${this.detailItem('Nº Contribuinte', r.taxpayerNumber)}${this.detailItem('Nome contacto', r.contactName)}${this.detailItem('Contacto', r.customerContact)}${this.detailItem('Estabelecimento', r.establishmentName)}${this.detailItem('Morada / local', [r.address,r.locality].filter(Boolean).join(', '))}${this.detailItem('Horário', r.openingHours)}${this.detailItem('REF Equipamento', r.equipmentReference)}${this.detailItem('Tipo de equipamento', r.equipmentType)}${this.detailItem('Categoria', r.faultCategory)}${this.detailItem('Sintoma', r.symptom)}${this.detailItem('Prioridade', this.priorityLabels[r.priority] || 'Normal')}${this.detailItem('Avaria', r.faultDescription)}${this.detailItem('PT', r.routingCode)}${this.detailItem('Departamento', r.department)}${this.detailItem('E-mail destino', r.emailDestination)}${this.detailItem('Estado do e-mail', emailLabel)}${this.detailItem('Nº Nota', r.noteNumber)}${this.detailItem('Tratado', r.treated ? 'Sim' : 'Não')}${this.detailItem('Completude', `${AppCore.calculateCompletion(r)}%`)}${this.detailItem('Última alteração', this.formatDateTime(r.updatedAt))}
        </div>
        <section class="panel"><div class="panel-head"><h4>Observações</h4></div><div class="panel-body preserve-lines">${this.escape(r.observations || 'Sem observações.')}</div></section>
        <section class="panel"><div class="panel-head"><h4>Timeline / auditoria</h4></div><div class="panel-body">${activities.length ? `<div class="timeline">${activities.map(a => this.timelineItem(a)).join('')}</div>` : this.empty('Sem atividade registada.','')}</div></section>
        <div class="page-actions detail-actions">
          <button class="btn btn-secondary" type="button" data-dialog-print="${r.id}">Imprimir / PDF</button>
          ${r.emailDestination ? `<button class="btn btn-secondary" type="button" data-dialog-email="${r.id}">Preparar e-mail</button>` : ''}
          ${r.status !== 'ARCHIVED' ? `<button class="btn btn-secondary" type="button" data-dialog-edit="${r.id}">Editar</button><button class="btn btn-secondary" type="button" data-dialog-archive="${r.id}">Arquivar</button>` : `<button class="btn btn-secondary" type="button" data-dialog-reopen="${r.id}">Reabrir</button>`}
        </div>`;
      this.els.recordDialog.showModal();
      document.querySelector('[data-dialog-edit]')?.addEventListener('click', e => { this.els.recordDialog.close(); this.navigate('edit', `?id=${encodeURIComponent(e.currentTarget.dataset.dialogEdit)}`); });
      document.querySelector('[data-dialog-email]')?.addEventListener('click', e => { const targetId = e.currentTarget.dataset.dialogEmail; this.els.recordDialog.close(); this.openEmailAssistant(targetId); });
      document.querySelector('[data-dialog-print]')?.addEventListener('click', e => this.printRecord(e.currentTarget.dataset.dialogPrint));
      document.querySelector('[data-dialog-archive]')?.addEventListener('click', e => { this.els.recordDialog.close(); this.confirm('Arquivar registo', 'O registo ficará preservado no histórico e poderá ser reaberto posteriormente.', () => this.archiveRecord(e.currentTarget.dataset.dialogArchive)); });
      document.querySelector('[data-dialog-reopen]')?.addEventListener('click', e => { this.els.recordDialog.close(); this.confirm('Reabrir registo', 'O registo regressará ao estado Registado e ficará novamente disponível nos registos ativos.', () => this.reopenRecord(e.currentTarget.dataset.dialogReopen)); });
    },

    emailDraft(record) {
      return {
        to: record.emailDestination || '',
        subject: AppCore.applyTemplate(this.state.settings.emailSubjectTemplate, record),
        body: AppCore.applyTemplate(this.state.settings.emailBodyTemplate, record),
      };
    },

    openEmailAssistant(id) {
      const record = this.state.records.find(r => r.id === id);
      if (!record) return;
      const draft = this.emailDraft(record);
      this.els.recordDialogBody.innerHTML = `
        <div class="page-head"><div><p class="eyebrow">Assistente de comunicação</p><h3>${this.escape(record.displayId)}</h3></div><span class="status-badge status-SENT">${this.escape(record.routingCode || 'PT por definir')}</span></div>
        <div class="prototype-note"><strong>Envio controlado pelo utilizador.</strong> A aplicação prepara o conteúdo, mas não envia automaticamente nem confirma que a mensagem foi entregue.</div>
        <div class="stack-md">
          <label class="field"><span>Para</span><input id="emailAssistTo" type="email" value="${this.escapeAttr(draft.to)}"></label>
          <label class="field"><span>Assunto</span><input id="emailAssistSubject" type="text" value="${this.escapeAttr(draft.subject)}"></label>
          <label class="field"><span>Mensagem</span><textarea id="emailAssistBody" style="min-height:260px">${this.escape(draft.body)}</textarea></label>
        </div>
        <div class="page-actions detail-actions">
          <button class="btn btn-secondary" type="button" data-email-copy>Copiar conteúdo</button>
          <button class="btn btn-secondary" type="button" data-email-open>Abrir no e-mail</button>
          ${record.emailSent !== 'YES' ? `<button class="btn btn-primary" type="button" data-email-mark-sent>Marcar como enviado</button>` : `<span class="status-badge status-CLOSED">Já assinalado como enviado</span>`}
        </div>`;
      this.els.recordDialog.showModal();
      const getDraft = () => ({ to: document.getElementById('emailAssistTo').value.trim(), subject: document.getElementById('emailAssistSubject').value, body: document.getElementById('emailAssistBody').value });
      document.querySelector('[data-email-copy]')?.addEventListener('click', async () => {
        const d = getDraft();
        await this.copyText(`Para: ${d.to}\nAssunto: ${d.subject}\n\n${d.body}`);
        this.toast('Conteúdo do e-mail copiado.', 'success');
      });
      document.querySelector('[data-email-open]')?.addEventListener('click', () => {
        const d = getDraft();
        if (!d.to) return this.toast('Defina primeiro o endereço de destino.', 'error');
        const href = `mailto:${encodeURIComponent(d.to)}?subject=${encodeURIComponent(d.subject)}&body=${encodeURIComponent(d.body)}`;
        location.href = href;
      });
      document.querySelector('[data-email-mark-sent]')?.addEventListener('click', async () => {
        await this.markEmailSent(record.id);
        this.els.recordDialog.close();
      });
    },

    async copyText(text) {
      if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
      const area = document.createElement('textarea');
      area.value = text;
      area.style.position = 'fixed'; area.style.opacity = '0';
      document.body.appendChild(area); area.select(); document.execCommand('copy'); area.remove();
    },

    async markEmailSent(id) {
      const record = this.state.records.find(r => r.id === id);
      if (!record) return;
      record.emailSent = 'YES';
      record.emailSentAt = new Date().toISOString();
      record.updatedAt = record.emailSentAt;
      record.updatedBy = this.state.user.email;
      if (record.status === 'REGISTERED' || record.status === 'IN_PROGRESS') record.status = 'SENT';
      await AppDB.put('records', record);
      await this.ensureActivity(record, 'EMAIL_MARKED_SENT', 'E-mail assinalado como enviado');
      this.toast('E-mail assinalado como enviado.', 'success');
      await this.loadData();
      if (this.state.route === 'routing') this.renderRouting();
    },

    printRecord(id) {
      const r = this.state.records.find(x => x.id === id);
      if (!r) return;
      const win = window.open('', '_blank');
      if (win) win.opener = null;
      if (!win) return this.toast('O browser bloqueou a janela de impressão.', 'error');
      const items = [
        ['ID',r.displayId],['Data',this.formatDate(r.occurrenceDate)],['Agente',r.agentName],['Cliente',r.clientName],['Nº Contribuinte',r.taxpayerNumber],['Estabelecimento',r.establishmentName],['Morada',r.address],['Localidade',r.locality],['Contacto',r.customerContact],['REF Equipamento',r.equipmentReference],['Tipo',r.equipmentType],['Categoria',r.faultCategory],['Sintoma',r.symptom],['Avaria',r.faultDescription],['Prioridade',this.priorityLabels[r.priority]||'Normal'],['PT',r.routingCode],['Departamento',r.department],['E-mail',r.emailDestination],['Nº Nota',r.noteNumber],['Tratado',r.treated?'Sim':'Não'],['Estado',this.statusLabels[r.status]||r.status],['Observações',r.observations]
      ];
      win.document.write(`<!doctype html><html lang="pt-PT"><head><meta charset="utf-8"><title>${this.escape(r.displayId)}</title><style>body{font:14px system-ui;margin:32px;color:#222}h1{font-size:22px;border-bottom:3px solid #d71920;padding-bottom:12px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.item{border-bottom:1px solid #ddd;padding:8px 0}.item span{display:block;color:#666;font-size:12px}.item strong{white-space:pre-wrap}.wide{grid-column:1/-1}@media print{body{margin:12mm}}</style></head><body><h1>Registo de Avaria — ${this.escape(r.displayId)}</h1><div class="grid">${items.map(([k,v],i)=>`<div class="item ${i===items.length-1?'wide':''}"><span>${this.escape(k)}</span><strong>${this.escape(v||'—')}</strong></div>`).join('')}</div><script>window.onload=()=>window.print()<\/script></body></html>`);
      win.document.close();
    },

  });
})();
