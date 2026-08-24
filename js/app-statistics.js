(() => {
  'use strict';

  Object.assign(window.App, {
    renderStatistics() {
      const records = this.state.records.filter(r => !r.archived && r.status !== 'DRAFT');
      const open = records.filter(r => r.status !== 'CLOSED');
      const closed = records.filter(r => r.status === 'CLOSED');
      const resolutionRate = records.length ? Math.round((closed.length / records.length) * 100) : 0;
      const monthKey = this.dateKey(new Date()).slice(0, 7);
      const thisMonth = records.filter(r => String(r.occurrenceDate || this.dateKey(new Date(r.createdAt))).slice(0, 7) === monthKey).length;
      const todayKey = this.dateKey(new Date());
      const today = records.filter(r => this.dateKey(new Date(r.createdAt)) === todayKey).length;

      const countBy = (key, fallback = 'Por definir') => {
        const map = new Map();
        records.forEach(record => {
          const value = String(record[key] || fallback).trim() || fallback;
          map.set(value, (map.get(value) || 0) + 1);
        });
        return [...map.entries()].sort((a, b) => b[1] - a[1]);
      };
      const barList = entries => {
        if (!entries.length) return this.empty('Sem dados suficientes.', 'Os indicadores surgem à medida que os registos são criados.');
        const max = Math.max(...entries.map(([,count]) => count), 1);
        return `<div class="stats-bar-list">${entries.slice(0, 7).map(([label,count]) => `<div class="stats-bar-row"><span title="${this.escapeAttr(label)}">${this.escape(label)}</span><div class="stats-bar-track"><div class="stats-bar-fill" style="width:${Math.max(4,(count/max)*100)}%"></div></div><strong>${count}</strong></div>`).join('')}</div>`;
      };

      const last7 = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d; });
      const daily = last7.map(date => {
        const key = this.dateKey(date);
        return {
          date,
          created: records.filter(r => this.dateKey(new Date(r.createdAt)) === key).length,
          closed: records.filter(r => r.status === 'CLOSED' && this.dateKey(new Date(r.updatedAt || r.createdAt)) === key).length,
        };
      });
      const maxDaily = Math.max(...daily.flatMap(day => [day.created, day.closed]), 1);
      const trend = `<div class="ops-trend">${daily.map(day => `<div class="ops-day"><div class="ops-bars"><div class="ops-bar" style="height:${Math.max(3,(day.created/maxDaily)*100)}%" title="${day.created} registos"></div><div class="ops-bar closed" style="height:${Math.max(3,(day.closed/maxDaily)*100)}%" title="${day.closed} encerrados"></div></div><small>${new Intl.DateTimeFormat('pt-PT',{weekday:'short'}).format(day.date)}</small></div>`).join('')}</div>`;

      const statusCounts = Object.entries(this.statusLabels)
        .filter(([key]) => !['DRAFT','ARCHIVED'].includes(key))
        .map(([key,label]) => [label, records.filter(r => r.status === key).length])
        .filter(([,count]) => count > 0);

      this.els.viewContainer.innerHTML = `
        <div class="stats-hero">
          <div><p class="eyebrow">Análise operacional</p><h3>Estatísticas de avarias</h3><p>Indicadores calculados exclusivamente a partir dos registos guardados neste dispositivo.</p></div>
          <div class="page-actions"><button class="btn btn-secondary" data-action="export-csv">Exportar dados</button><button class="btn btn-primary" data-action="new-record">+ Nova avaria</button></div>
        </div>
        <div class="stats-summary">
          ${this.opsMetric('Avarias abertas', open.length, 'Em acompanhamento', '↗')}
          ${this.opsMetric('Concluídas', closed.length, 'Histórico encerrado', '✓')}
          ${this.opsMetric('Taxa de resolução', `${resolutionRate}%`, `${closed.length} de ${records.length || 0}`, '◎')}
          ${this.opsMetric('Este mês', thisMonth, 'Registos criados', '▤')}
          ${this.opsMetric('Hoje', today, 'Novos registos', '+')}
        </div>
        <div class="stats-grid">
          <section class="panel"><div class="panel-head"><h3>Avarias nos últimos 7 dias</h3><div class="ops-chart-header"><span class="ops-legend">Criadas</span><span class="ops-legend closed">Concluídas</span></div></div><div class="panel-body">${trend}</div></section>
          <section class="panel"><div class="panel-head"><h3>Por categoria</h3><span class="muted">Top categorias</span></div><div class="panel-body">${barList(countBy('faultCategory'))}</div></section>
          <section class="panel"><div class="panel-head"><h3>Por técnico / agente</h3><span class="muted">Volume de registos</span></div><div class="panel-body">${barList(countBy('agentName','Sem agente'))}</div></section>
          <section class="panel"><div class="panel-head"><h3>Por localidade</h3><span class="muted">Distribuição territorial</span></div><div class="panel-body">${barList(countBy('locality','Sem localidade'))}</div></section>
          <section class="panel"><div class="panel-head"><h3>Por estado</h3><span class="muted">Fluxo atual</span></div><div class="panel-body">${barList(statusCounts)}</div></section>
          <section class="panel"><div class="panel-head"><h3>Indicadores de qualidade</h3></div><div class="panel-body stack-md">${this.detailItem('Com PT definido', String(records.filter(r=>r.routingCode).length))}${this.detailItem('E-mail marcado como enviado', String(records.filter(r=>r.emailSent==='YES').length))}${this.detailItem('Tratados', String(records.filter(r=>r.treated).length))}${this.detailItem('Sem categoria', String(records.filter(r=>!r.faultCategory).length))}</div></section>
        </div>`;
      this.bindViewActions();
    },

    opsMetric(label, value, sub, icon = '•') {
      return `<article class="ops-metric"><span class="ops-metric-icon" aria-hidden="true">${this.escape(icon)}</span><div class="ops-metric-copy"><span>${this.escape(label)}</span><strong>${this.escape(String(value))}</strong><small>${this.escape(sub)}</small></div></article>`;
    },
  });
})();
