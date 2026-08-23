(() => {
  'use strict';
  Object.assign(window.App, {
    renderRecords() {
      const agents = [...new Set(this.state.records.map(r => r.agentName).filter(Boolean))].sort((a,b) => a.localeCompare(b,'pt-PT'));
      const routingCodes = [...new Set(this.state.records.map(r => r.routingCode).filter(Boolean))].sort();
      this.els.viewContainer.innerHTML = `
        <div class="page-head">
          <div><p class="eyebrow">Arquivo operacional</p><h3>Registos e rascunhos</h3></div>
          <div class="page-actions"><button class="btn btn-secondary" data-action="export-filtered-csv">Exportar resultados</button><button class="btn btn-primary" data-action="new-record">+ Novo registo</button></div>
        </div>
        <div class="filter-bar filter-bar-advanced">
          <input id="filterSearch" class="filter-control filter-search-wide" type="search" placeholder="Pesquisar ID, cliente, REF, nota…" value="${this.escapeAttr(this.state.filters.search)}" />
          <select id="filterStatus" class="filter-control"><option value="">Todos os estados</option>${Object.entries(this.statusLabels).map(([k,v]) => `<option value="${k}" ${this.state.filters.status===k?'selected':''}>${this.escape(v)}</option>`).join('')}</select>
          <select id="filterAgent" class="filter-control"><option value="">Todos os agentes</option>${agents.map(a => `<option value="${this.escapeAttr(a)}" ${this.state.filters.agent===a?'selected':''}>${this.escape(a)}</option>`).join('')}</select>
          <select id="filterRouting" class="filter-control"><option value="">Todos os PT</option>${routingCodes.map(a => `<option value="${this.escapeAttr(a)}" ${this.state.filters.routingCode===a?'selected':''}>${this.escape(a)}</option>`).join('')}</select>
          <select id="filterTreated" class="filter-control"><option value="">Tratado: todos</option><option value="true" ${this.state.filters.treated==='true'?'selected':''}>Tratado: sim</option><option value="false" ${this.state.filters.treated==='false'?'selected':''}>Tratado: não</option></select>
          <select id="filterEmailSent" class="filter-control"><option value="">E-mail: todos</option><option value="YES" ${this.state.filters.emailSent==='YES'?'selected':''}>Enviado</option><option value="PENDING" ${this.state.filters.emailSent==='PENDING'?'selected':''}>Por enviar</option><option value="NO" ${this.state.filters.emailSent==='NO'?'selected':''}>Não enviado</option><option value="NA" ${this.state.filters.emailSent==='NA'?'selected':''}>Não aplicável</option></select>
          <label class="compact-field"><span>De</span><input id="filterDateFrom" class="filter-control" type="date" value="${this.escapeAttr(this.state.filters.dateFrom)}"></label>
          <label class="compact-field"><span>Até</span><input id="filterDateTo" class="filter-control" type="date" value="${this.escapeAttr(this.state.filters.dateTo)}"></label>
          <button id="clearFilters" class="btn btn-secondary" type="button">Limpar filtros</button>
        </div>
        <div id="resultSummary" class="result-summary"></div>
        <section class="panel"><div id="recordsResult"></div></section>`;
      ['filterSearch','filterStatus','filterAgent','filterRouting','filterTreated','filterEmailSent','filterDateFrom','filterDateTo'].forEach(id => document.getElementById(id).addEventListener('input', () => this.updateRecordFilters()));
      document.getElementById('clearFilters').addEventListener('click', () => {
        const fixedStatus = this.state.route === 'drafts' ? 'DRAFT' : this.state.route === 'archive' ? 'ARCHIVED' : '';
        this.state.filters = { search:'', status:fixedStatus, agent:'', routingCode:'', treated:'', emailSent:'', dateFrom:'', dateTo:'' };
        if (this.state.route === 'drafts') return this.renderDrafts();
        if (this.state.route === 'archive') return this.renderArchive();
        this.renderRecords();
      });
      this.updateRecordFilters();
      this.bindViewActions();
    },

    updateRecordFilters() {
      this.state.filters = {
        search: document.getElementById('filterSearch')?.value.trim() || '',
        status: document.getElementById('filterStatus')?.value || '',
        agent: document.getElementById('filterAgent')?.value || '',
        routingCode: document.getElementById('filterRouting')?.value || '',
        treated: document.getElementById('filterTreated')?.value || '',
        emailSent: document.getElementById('filterEmailSent')?.value || '',
        dateFrom: document.getElementById('filterDateFrom')?.value || '',
        dateTo: document.getElementById('filterDateTo')?.value || '',
      };
      this.renderRecordResults();
    },

    filteredRecords() {
      const f = this.state.filters;
      const q = AppCore.normalizeText(f.search);
      return this.state.records.filter(r => {
        if (r.archived && f.status !== 'ARCHIVED') return false;
        const hay = AppCore.normalizeText([r.displayId,r.clientName,r.taxpayerNumber,r.establishmentName,r.equipmentReference,r.noteNumber,r.customerContact,r.agentName,r.faultDescription,r.symptom,r.department,r.emailDestination].join(' '));
        const date = r.occurrenceDate || String(r.createdAt || '').slice(0,10);
        return (!q || hay.includes(q))
          && (!f.status || r.status === f.status)
          && (!f.agent || r.agentName === f.agent)
          && (!f.routingCode || r.routingCode === f.routingCode)
          && (!f.treated || String(Boolean(r.treated)) === f.treated)
          && (!f.emailSent || r.emailSent === f.emailSent)
          && (!f.dateFrom || date >= f.dateFrom)
          && (!f.dateTo || date <= f.dateTo);
      });
    },

    renderRecordResults() {
      const target = document.getElementById('recordsResult');
      if (!target) return;
      const records = this.filteredRecords();
      const summary = document.getElementById('resultSummary');
      if (summary) summary.textContent = `${records.length} resultado${records.length === 1 ? '' : 's'} · ${this.state.records.length} registos locais`;
      if (!records.length) { target.innerHTML = this.empty('Nenhum registo encontrado.', 'Altere os filtros ou crie um novo registo.'); return; }
      target.innerHTML = `
        <div class="record-table-wrap"><table class="record-table"><thead><tr><th>ID</th><th>Data</th><th>Cliente</th><th>REF equipamento</th><th>Prioridade</th><th>PT</th><th>Estado</th><th></th></tr></thead><tbody>
        ${records.map(r => `<tr><td><strong>${this.escape(r.displayId)}</strong></td><td>${this.formatDate(r.occurrenceDate || r.createdAt)}</td><td>${this.escape(r.clientName || '—')}<br><span class="muted">${this.escape(r.establishmentName || '')}</span></td><td>${this.escape(r.equipmentReference || '—')}</td><td>${this.escape(this.priorityLabels[r.priority] || 'Normal')}</td><td>${this.escape(r.routingCode || '—')}</td><td>${this.statusBadge(r.status)}</td><td><div class="table-actions"><button class="btn btn-secondary btn-small" data-view-record="${r.id}">Ver</button>${r.status!=='ARCHIVED'?`<button class="btn btn-secondary btn-small" data-edit-record="${r.id}">Editar</button>`:''}</div></td></tr>`).join('')}
        </tbody></table></div>
        <div class="record-cards">${records.map(r => `<article class="record-card"><div class="record-card-top"><strong>${this.escape(r.displayId)}</strong>${this.statusBadge(r.status)}</div><div class="record-card-info"><strong>${this.escape(r.clientName || 'Sem cliente')}</strong><span>${this.escape(r.equipmentReference || 'Sem REF')} · ${this.formatDate(r.occurrenceDate || r.createdAt)}</span><span>${this.escape(this.priorityLabels[r.priority] || 'Normal')} · ${this.escape(r.routingCode || 'PT por definir')}</span></div><div class="record-card-actions"><button class="btn btn-secondary btn-small" data-view-record="${r.id}">Ver</button>${r.status!=='ARCHIVED'?`<button class="btn btn-secondary btn-small" data-edit-record="${r.id}">Editar</button>`:''}</div></article>`).join('')}</div>`;
      this.bindRecordResultEvents();
    },

    bindRecordResultEvents() {
      document.querySelectorAll('[data-view-record]').forEach(btn => btn.addEventListener('click', () => this.openRecordDetail(btn.dataset.viewRecord)));
      document.querySelectorAll('[data-edit-record]').forEach(btn => btn.addEventListener('click', () => this.navigate('edit', `?id=${encodeURIComponent(btn.dataset.editRecord)}`)));
    },

  });
})();
