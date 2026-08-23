(() => {
  'use strict';
  Object.assign(window.App, {
    renderClients() {
      const map = new Map();
      this.state.records.filter(r => !r.archived && r.clientName).forEach(r => {
        const key = `${r.taxpayerNumber || ''}|${r.clientName.trim().toLowerCase()}`;
        if (!map.has(key)) map.set(key, { key, name: r.clientName, taxpayerNumber: r.taxpayerNumber, contactName: r.contactName, phone: r.customerContact, establishments: new Set(), equipment: new Set(), records: [] });
        const c = map.get(key);
        if (r.establishmentName) c.establishments.add(r.establishmentName);
        if (r.equipmentReference) c.equipment.add(r.equipmentReference);
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
        const filtered = clients.filter(c => AppCore.normalizeText([c.name,c.taxpayerNumber,c.contactName,c.phone,...c.establishments].join(' ')).includes(q));
        document.getElementById('clientDirectoryResults').innerHTML = this.clientCardsHtml(filtered);
        bindClientButtons();
      });
    },

    clientCardsHtml(clients) {
      if (!clients.length) return this.empty('Nenhum cliente encontrado.','Os clientes são consolidados a partir dos registos criados.');
      return `<div class="directory-grid">${clients.map(c => {
        const latest = [...c.records].sort((a,b)=>new Date(b.updatedAt)-new Date(a.updatedAt))[0];
        return `<article class="record-card"><div class="record-card-top"><strong>${this.escape(c.name)}</strong><span class="status-badge status-REGISTERED">${c.records.length} reg.</span></div><div class="record-card-info"><span>Nº Contribuinte: ${this.escape(c.taxpayerNumber || '—')}</span><span>${c.establishments.size} estabelecimento(s) · ${c.equipment.size} equipamento(s)</span><span>${this.escape(c.contactName || 'Sem contacto')}${c.phone ? ` · ${this.escape(c.phone)}` : ''}</span><span>Última atividade: ${latest ? this.formatDateTimeCompact(latest.updatedAt) : '—'}</span></div><div class="record-card-actions"><button class="btn btn-secondary btn-small" data-client-detail="${this.escapeAttr(c.name)}" data-client-taxpayer="${this.escapeAttr(c.taxpayerNumber || '')}">Detalhe</button><button class="btn btn-secondary btn-small" data-client-filter="${this.escapeAttr(c.name)}">Registos</button></div></article>`;
      }).join('')}</div>`;
    },

    openClientDetail(name, taxpayerNumber = '') {
      const records = this.state.records.filter(r => !r.archived && AppCore.normalizeText(r.clientName) === AppCore.normalizeText(name) && (!taxpayerNumber || String(r.taxpayerNumber||'') === taxpayerNumber)).sort((a,b)=>new Date(b.updatedAt)-new Date(a.updatedAt));
      if (!records.length) return;
      const latest = records[0];
      const establishments = [...new Set(records.map(r=>r.establishmentName).filter(Boolean))];
      const equipment = [...new Set(records.map(r=>r.equipmentReference).filter(Boolean))];
      this.els.recordDialogBody.innerHTML = `<div class="page-head"><div><p class="eyebrow">Cliente</p><h3>${this.escape(name)}</h3></div><span class="status-badge status-REGISTERED">${records.length} reg.</span></div><div class="detail-grid">${this.detailItem('Nº Contribuinte',taxpayerNumber)}${this.detailItem('Contacto',latest.contactName)}${this.detailItem('Telefone',latest.customerContact)}${this.detailItem('Estabelecimentos',establishments.join(' · '))}${this.detailItem('Equipamentos',equipment.join(' · '))}${this.detailItem('Última atividade',this.formatDateTime(latest.updatedAt))}</div><section class="panel"><div class="panel-head"><h4>Ocorrências recentes</h4></div><div class="panel-body stack-md">${records.slice(0,5).map(r=>`<button class="quick-action" data-client-open-record="${r.id}"><span>${this.escape(r.displayId)}</span><span><strong>${this.escape(r.equipmentReference||'Sem REF')}</strong><br><small class="muted">${this.escape(r.faultDescription||r.faultCategory||'Sem descrição')} · ${this.formatDate(r.occurrenceDate)}</small></span></button>`).join('')}</div></section>`;
      this.els.recordDialog.showModal();
      document.querySelectorAll('[data-client-open-record]').forEach(btn => btn.addEventListener('click', () => { const id=btn.dataset.clientOpenRecord; this.els.recordDialog.close(); setTimeout(()=>this.openRecordDetail(id),0); }));
    },

    renderEquipment() {
      const map = new Map();
      this.state.records.filter(r => !r.archived && r.equipmentReference).forEach(r => {
        const key = AppCore.normalizeReference(r.equipmentReference);
        if (!map.has(key)) map.set(key, { reference: key, type: r.equipmentType, clientName: r.clientName, establishmentName: r.establishmentName, records: [] });
        const item = map.get(key);
        if (!item.type && r.equipmentType) item.type = r.equipmentType;
        item.records.push(r);
      });
      const items = [...map.values()].sort((a,b) => a.reference.localeCompare(b.reference,'pt-PT'));
      this.els.viewContainer.innerHTML = `
        <div class="page-head"><div><p class="eyebrow">Histórico técnico</p><h3>Equipamentos</h3></div><div class="page-actions"><button class="btn btn-primary" data-action="new-record">+ Novo registo</button></div></div>
        <div class="directory-toolbar"><input id="equipmentDirectorySearch" class="filter-control" type="search" placeholder="Pesquisar REF, cliente, estabelecimento…"><span>${items.length} equipamento${items.length===1?'':'s'}</span></div>
        <section class="panel"><div class="panel-body"><div id="equipmentDirectoryResults">${this.equipmentCardsHtml(items)}</div></div></section>`;
      this.bindViewActions();
      const bindEquipmentButtons = () => {
        document.querySelectorAll('[data-equipment-detail]').forEach(btn => btn.addEventListener('click', () => this.openEquipmentDetail(btn.dataset.equipmentDetail)));
        document.querySelectorAll('[data-equipment-filter]').forEach(btn => btn.addEventListener('click', () => { this.state.filters = { search: btn.dataset.equipmentFilter, status:'', agent:'', routingCode:'', treated:'', emailSent:'', dateFrom:'', dateTo:'' }; this.navigate('records'); }));
      };
      bindEquipmentButtons();
      document.getElementById('equipmentDirectorySearch')?.addEventListener('input', e => {
        const q = AppCore.normalizeText(e.target.value);
        const filtered = items.filter(item => AppCore.normalizeText([item.reference,item.type,item.clientName,item.establishmentName].join(' ')).includes(q));
        document.getElementById('equipmentDirectoryResults').innerHTML = this.equipmentCardsHtml(filtered);
        bindEquipmentButtons();
      });
    },

    equipmentCardsHtml(items) {
      if (!items.length) return this.empty('Nenhum equipamento encontrado.','As referências são consolidadas a partir dos registos.');
      return `<div class="directory-grid">${items.map(e => `<article class="record-card"><div class="record-card-top"><strong>${this.escape(e.reference)}</strong><span class="status-badge status-IN_PROGRESS">${e.records.length} ocorr.</span></div><div class="record-card-info"><span>${this.escape(e.type || 'Tipo por definir')}</span><strong>${this.escape(e.clientName || 'Sem cliente')}</strong><span>${this.escape(e.establishmentName || '')}</span><span>Última atividade: ${this.formatDateTimeCompact([...e.records].sort((a,b)=>new Date(b.updatedAt)-new Date(a.updatedAt))[0].updatedAt)}</span></div><div class="record-card-actions"><button class="btn btn-secondary btn-small" data-equipment-detail="${this.escapeAttr(e.reference)}">Detalhe</button><button class="btn btn-secondary btn-small" data-equipment-filter="${this.escapeAttr(e.reference)}">Histórico</button></div></article>`).join('')}</div>`;
    },

    openEquipmentDetail(reference) {
      const normalized = AppCore.normalizeReference(reference);
      const records = this.state.records.filter(r => AppCore.normalizeReference(r.equipmentReference) === normalized).sort((a,b)=>new Date(b.updatedAt)-new Date(a.updatedAt));
      if (!records.length) return;
      const latest = records[0];
      const openCount = records.filter(r=>AppCore.OPEN_STATUSES.has(r.status) && !r.archived).length;
      this.els.recordDialogBody.innerHTML = `<div class="page-head"><div><p class="eyebrow">Equipamento</p><h3>${this.escape(normalized)}</h3></div><span class="status-badge status-IN_PROGRESS">${openCount} aberta${openCount===1?'':'s'}</span></div><div class="detail-grid">${this.detailItem('Tipo',latest.equipmentType)}${this.detailItem('Cliente atual',latest.clientName)}${this.detailItem('Estabelecimento',latest.establishmentName)}${this.detailItem('Total de ocorrências',String(records.length))}${this.detailItem('Último sintoma',latest.symptom)}${this.detailItem('Última atividade',this.formatDateTime(latest.updatedAt))}</div><section class="panel"><div class="panel-head"><h4>Histórico cronológico</h4></div><div class="panel-body stack-md">${records.slice(0,10).map(r=>`<button class="quick-action" data-equipment-open-record="${r.id}"><span>${this.escape(r.displayId)}</span><span><strong>${this.escape(r.faultDescription||r.faultCategory||'Sem descrição')}</strong><br><small class="muted">${this.formatDate(r.occurrenceDate)} · ${this.escape(this.statusLabels[r.status]||r.status)}</small></span></button>`).join('')}</div></section>`;
      this.els.recordDialog.showModal();
      document.querySelectorAll('[data-equipment-open-record]').forEach(btn => btn.addEventListener('click', () => { const id=btn.dataset.equipmentOpenRecord; this.els.recordDialog.close(); setTimeout(()=>this.openRecordDetail(id),0); }));
    },

  });
})();
