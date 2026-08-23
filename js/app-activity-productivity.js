(() => {
  'use strict';
  Object.assign(window.App, {
    renderActivity() {
      const activities = this.state.activities;
      this.els.viewContainer.innerHTML = `
        <div class="page-head"><div><p class="eyebrow">Rastreabilidade</p><h3>Histórico de atividade</h3></div></div>
        <section class="panel"><div class="panel-body">${activities.length ? `<div class="timeline">${activities.map(a => this.timelineItem(a, true)).join('')}</div>` : this.empty('Ainda não existem atividades.','As ações sobre registos aparecerão aqui.')}</div></section>`;
    },

    timelineItem(a, includeRecord = false) {
      const record = this.state.records.find(r => r.id === a.recordId);
      const changes = Array.isArray(a.changes) && a.changes.length ? `<small class="audit-changes">${a.changes.slice(0,4).map(c => this.escape(c.field)).join(' · ')}${a.changes.length > 4 ? ` +${a.changes.length-4}` : ''}</small>` : '';
      return `<div class="timeline-item"><span class="timeline-time">${this.formatDateTimeCompact(a.createdAt)}</span><span class="timeline-dot" aria-hidden="true"></span><span class="timeline-line" aria-hidden="true"></span><div class="timeline-copy"><strong>${this.escape(a.label || a.eventType)}</strong><span>${this.escape(a.userId || '')}${includeRecord && record ? ` · ${this.escape(record.displayId)} · ${this.escape(record.clientName || '')}` : ''}</span>${changes}</div></div>`;
    },

    renderProductivity() {
      const records = this.state.records.filter(r => r.status !== 'DRAFT' && !r.archived);
      const last7 = Array.from({length:7}, (_,i) => { const d = new Date(); d.setDate(d.getDate() - (6-i)); return d; });
      const counts = last7.map(d => records.filter(r => this.dateKey(new Date(r.createdAt)) === this.dateKey(d)).length);
      const max = Math.max(...counts, 1);
      const closed = records.filter(r => r.status === 'CLOSED').length;
      const pending = records.length - closed;
      const currentMonth = new Date().getMonth(); const currentYear = new Date().getFullYear();
      const monthCount = records.filter(r => { const d = new Date(r.createdAt); return d.getMonth() === currentMonth && d.getFullYear() === currentYear; }).length;
      const daysElapsed = new Date().getDate();
      const avg = daysElapsed ? (monthCount / daysElapsed).toFixed(1) : '0.0';
      const emailSent = records.filter(r => r.emailSent === 'YES').length;
      const statusCounts = Object.entries(this.statusLabels).filter(([key]) => !['DRAFT','ARCHIVED'].includes(key)).map(([key,label]) => [label, records.filter(r => r.status === key).length]);
      const routingMap = new Map();
      records.forEach(r => { const key = r.routingCode || 'Por definir'; routingMap.set(key, (routingMap.get(key)||0)+1); });
      const routingCounts = [...routingMap.entries()].sort((a,b)=>b[1]-a[1]);
      this.els.viewContainer.innerHTML = `
        <div class="page-head"><div><p class="eyebrow">Indicadores operacionais</p><h3>Produtividade</h3></div><div class="page-actions"><button class="btn btn-secondary" data-action="export-csv">Exportar dados</button></div></div>
        <div class="metric-grid">${this.metricCard('Total de registos', records.length, 'Sem rascunhos/arquivo')}${this.metricCard('Este mês', monthCount, 'Registos criados')}${this.metricCard('Média diária', avg, 'No mês atual')}${this.metricCard('Pendentes', pending, `${closed} encerrados`)}</div>
        <div class="content-grid">
          <section class="panel"><div class="panel-head"><h3>Registos nos últimos 7 dias</h3></div><div class="panel-body"><div class="chart-bars">${last7.map((d,i) => `<div class="chart-bar-group"><div class="chart-bar" style="height:${Math.max((counts[i]/max)*100,2)}%" title="${counts[i]} registos"></div><div class="chart-label">${new Intl.DateTimeFormat('pt-PT',{weekday:'short'}).format(d)}</div></div>`).join('')}</div></div></section>
          <aside class="panel"><div class="panel-head"><h3>Comunicação</h3></div><div class="panel-body stack-md">${this.detailItem('E-mails assinalados como enviados',String(emailSent))}${this.detailItem('Por enviar',String(records.filter(r=>r.emailSent==='PENDING').length))}${this.detailItem('Sem PT definido',String(records.filter(r=>!r.routingCode).length))}</div></aside>
        </div>
        <div class="content-grid">
          <section class="panel"><div class="panel-head"><h3>Distribuição por estado</h3></div><div class="panel-body breakdown-list">${statusCounts.map(([label,count])=>`<div class="breakdown-row"><span>${this.escape(label)}</span><strong>${count}</strong></div>`).join('')}</div></section>
          <aside class="panel"><div class="panel-head"><h3>Distribuição por PT</h3></div><div class="panel-body breakdown-list">${routingCounts.length?routingCounts.map(([label,count])=>`<div class="breakdown-row"><span>${this.escape(label)}</span><strong>${count}</strong></div>`).join(''):this.empty('Sem dados de encaminhamento.','')}</div></aside>
        </div>`;
      this.bindViewActions();
    },

  });
})();
