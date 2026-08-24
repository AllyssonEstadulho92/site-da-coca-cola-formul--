(() => {
  'use strict';
  Object.assign(window.App, {
    renderClients() {
      const map = new Map();
      this.state.records.filter(r => !r.archived && r.clientName).forEach(r => {
        const key = `${r.taxpayerNumber || ''}|${r.clientName.trim().toLowerCase()}`;
        if (!map.has(key)) map.set(key, { key, name: r.clientName, taxpayerNumber: r.taxpayerNumber, contactName: r.contactName, phone: r.customerContact, establishments: new Set(), references: new Set(), records: [] });
        const c = map.get(key);
        if (r.establishmentName) c.establishments.add(r.establishmentName);
        if (r.equipmentReference) c.references.add(r.equipmentReference);
        if (!c.contactName && r.contactName) c.contactName = r.contactName;
        if (!c.phone && r.customerContact) c.phone = r.customerContact;
        c.records.push(r);
      });
      const clients = [...map.values()].sort((a,b) => a.name.localeCompare(b.name,'pt-PT'));
      this.els.viewContainer.innerHTML = `
        <div class="page-head"><div><p class="eyebrow">Visão consolidada</p><h3>Clientes</h3></div><div class="page-actions"><button class="btn btn-primary" data-action="new-record">+ Novo registo</button></div></div>
        <div class="directory-toolbar"><input id="clientDirectorySearch" class="filter-control" type="search" placeholder="Pesquisar cliente, NIF, contacto…"><span>${clients.length} cliente${clients.length===1?'':'s'}</span></div>
        <section class="panel"><div class="panel-body"><div id="clientDirectoryResults">${this.clientCardsHtml(clients)}</div></div></section>`;
      this.bindViewActions();
      const bindClientButtons = () => {
        document.querySelectorAll('[data-client-detail]').forEach(btn => btn.addEventListener('click', () => this.openClientDetail(btn.dataset.clientDetail, btn.dataset.clientTaxpayer || '')));
        document.querySelectorAll('[data-client-filter]').forEach(btn => btn.addEventListener('click', () => { this.state.filters = { search: btn.dataset.clientFilter, status:'', agent:'', routingCode:'', treated:'', emailSent:'', dateFrom:'', dateTo:'' }; this.navigate('records'); }));
      };
      bindClientButtons();
      document.getElementById('clientDirectorySearch')?.addEventListener('input', e => {
        const q = AppCore.normalizeText(e.target.value);
        const filtered = clients.filter(c => AppCore.normalizeText([c.name,c.taxpayerNumber,c.contactName,c.phone,...c.establishments,...c.references].join(' ')).includes(q));
        document.getElementById('clientDirectoryResults').innerHTML = this.clientCardsHtml(filtered);
        bindClientButtons();
      });
    },

    clientCardsHtml(clients) {
      if (!clients.length) return this.empty('Nenhum cliente encontrado.','Os clientes são consolidados a partir dos registos criados.');
      return `<div class="directory-grid">${clients.map(c => {
        const latest = [...c.records].sort((a,b)=>new Date(b.updatedAt)-new Date(a.updatedAt))[0];
        return `<article class="record-card"><div class="record-card-top"><strong>${this.escape(c.name)}</strong><span class="status-badge status-REGISTERED">${c.records.length} reg.</span></div><div class="record-card-info"><span>Nº Contribuinte: ${this.escape(c.taxpayerNumber || '—')}</span><span>${c.establishments.size} estabelecimento(s) · ${c.references.size} referência(s)</span><span>${this.escape(c.contactName || 'Sem contacto')}${c.phone ? ` · ${this.escape(c.phone)}` : ''}</span><span>Última atividade: ${latest ? this.formatDateTimeCompact(latest.updatedAt) : '—'}</span></div><div class="record-card-actions"><button class="btn btn-secondary btn-small" data-client-detail="${this.escapeAttr(c.name)}" data-client-taxpayer="${this.escapeAttr(c.taxpayerNumber || '')}">Detalhe</button><button class="btn btn-secondary btn-small" data-client-filter="${this.escapeAttr(c.name)}">Registos</button></div></article>`;
      }).join('')}</div>`;
    },

    openClientDetail(name, taxpayerNumber = '') {
      const records = this.state.records.filter(r => !r.archived && AppCore.normalizeText(r.clientName) === AppCore.normalizeText(name) && (!taxpayerNumber || String(r.taxpayerNumber||'') === taxpayerNumber)).sort((a,b)=>new Date(b.updatedAt)-new Date(a.updatedAt));
      if (!records.length) return;
      const latest = records[0];
      const establishments = [...new Set(records.map(r=>r.establishmentName).filter(Boolean))];
      const references = [...new Set(records.map(r=>r.equipmentReference).filter(Boolean))];
      this.els.recordDialogBody.innerHTML = `<div class="page-head"><div><p class="eyebrow">Cliente</p><h3>${this.escape(name)}</h3></div><span class="status-badge status-REGISTERED">${records.length} reg.</span></div><div class="detail-grid">${this.detailItem('Nº Contribuinte',taxpayerNumber)}${this.detailItem('Contacto',latest.contactName)}${this.detailItem('Telefone',latest.customerContact)}${this.detailItem('Estabelecimentos',establishments.join(' · '))}${this.detailItem('Referências',references.join(' · '))}${this.detailItem('Última atividade',this.formatDateTime(latest.updatedAt))}</div><section class="panel"><div class="panel-head"><h4>Ocorrências recentes</h4></div><div class="panel-body stack-md">${records.slice(0,5).map(r=>`<button class="quick-action" data-client-open-record="${r.id}"><span>${this.escape(r.displayId)}</span><span><strong>${this.escape(r.equipmentReference||'Sem REF')}</strong><br><small class="muted">${this.escape(r.faultDescription||r.faultCategory||'Sem descrição')} · ${this.formatDate(r.occurrenceDate)}</small></span></button>`).join('')}</div></section>`;
      this.els.recordDialog.showModal();
      document.querySelectorAll('[data-client-open-record]').forEach(btn => btn.addEventListener('click', () => { const id=btn.dataset.clientOpenRecord; this.els.recordDialog.close(); setTimeout(()=>this.openRecordDetail(id),0); }));
    },
  });
})();
