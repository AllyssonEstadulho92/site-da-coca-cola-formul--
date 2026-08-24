(() => {
  'use strict';
  Object.assign(window.App, {
    renderDashboard() {
      const now = new Date();
      const todayKey = this.dateKey(now);
      const records = this.state.records.filter(r => !r.archived);
      const operational = records.filter(r => r.status !== 'DRAFT');
      const today = operational.filter(r => this.dateKey(new Date(r.createdAt)) === todayKey);
      const drafts = records.filter(r => r.status === 'DRAFT');
      const closed = operational.filter(r => r.status === 'CLOSED');
      const open = operational.filter(r => r.status !== 'CLOSED');
      const resolutionRate = operational.length ? Math.round((closed.length / operational.length) * 100) : 0;
      const recentActivities = this.state.activities.slice(0, 7);
      const dateLabel = new Intl.DateTimeFormat('pt-PT', { weekday:'long', day:'2-digit', month:'long' }).format(now);

      const last7 = Array.from({length:7}, (_,i) => { const d = new Date(); d.setDate(d.getDate()-(6-i)); return d; });
      const daily = last7.map(date => {
        const key = this.dateKey(date);
        return {
          date,
          created: operational.filter(r => this.dateKey(new Date(r.createdAt)) === key).length,
          closed: operational.filter(r => r.status === 'CLOSED' && this.dateKey(new Date(r.updatedAt || r.createdAt)) === key).length,
        };
      });
      const maxDaily = Math.max(...daily.flatMap(day => [day.created, day.closed]), 1);
      const trend = `<div class="ops-trend">${daily.map(day => `<div class="ops-day"><div class="ops-bars"><div class="ops-bar" style="height:${Math.max(3,(day.created/maxDaily)*100)}%"></div><div class="ops-bar closed" style="height:${Math.max(3,(day.closed/maxDaily)*100)}%"></div></div><small>${new Intl.DateTimeFormat('pt-PT',{weekday:'short'}).format(day.date)}</small></div>`).join('')}</div>`;

      const categoryMap = new Map();
      operational.forEach(record => {
        const key = record.faultCategory || 'Por definir';
        categoryMap.set(key, (categoryMap.get(key) || 0) + 1);
      });
      const categories = [...categoryMap.entries()].sort((a,b)=>b[1]-a[1]).slice(0,5);
      const maxCategory = Math.max(...categories.map(([,count])=>count),1);
      const categoryHtml = categories.length ? `<div class="ops-category-list">${categories.map(([label,count]) => `<div class="ops-category-row"><span title="${this.escapeAttr(label)}">${this.escape(label)}</span><div class="ops-category-track"><div class="ops-category-fill" style="width:${Math.max(5,(count/maxCategory)*100)}%"></div></div><strong>${count}</strong></div>`).join('')}</div>` : this.empty('Sem categorias ainda.','Os dados aparecerão com os primeiros registos.');

      const activeStatus = [
        ['Em andamento', operational.filter(r=>r.status==='IN_PROGRESS').length],
        ['Em tratamento', operational.filter(r=>r.status==='IN_TREATMENT').length],
        ['Aguarda resposta', operational.filter(r=>r.status==='WAITING_RESPONSE').length],
        ['Encerradas', closed.length],
      ];

      this.els.viewContainer.innerHTML = `
        <div class="ops-welcome">
          <div><p class="eyebrow">Coca-Cola · Serviço Técnico</p><h3>${this.greeting()}, ${this.escape(this.state.user.name.split(' ')[0])} 👋</h3><p>Resumo organizado das ocorrências e do trabalho registado.</p></div>
          <span class="ops-date-chip">▣ ${this.escape(dateLabel)}</span>
        </div>

        <div class="ops-metric-grid">
          ${this.opsMetric('Avarias abertas', open.length, 'Em acompanhamento', '↗')}
          ${this.opsMetric('Concluídas', closed.length, 'Total encerrado', '✓')}
          ${this.opsMetric('Taxa de resolução', `${resolutionRate}%`, 'Sobre registos operacionais', '◎')}
          ${this.opsMetric('Registos hoje', today.length, 'Criados hoje', '+')}
          ${this.opsMetric('Rascunhos', drafts.length, 'Guardados localmente', '□')}
        </div>

        <div class="ops-dashboard-grid">
          <section class="panel ops-panel-wide"><div class="panel-head"><h3>Avarias ao longo do tempo</h3><div class="ops-chart-header"><span class="ops-legend">Criadas</span><span class="ops-legend closed">Concluídas</span></div></div><div class="panel-body">${trend}</div></section>
          <aside class="panel"><div class="panel-head"><h3>Avarias por categoria</h3><button class="btn btn-ghost btn-small" data-route-jump="statistics">Ver estatísticas</button></div><div class="panel-body">${categoryHtml}</div></aside>
        </div>

        <div class="ops-dashboard-grid">
          <section class="panel"><div class="panel-head"><h3>Atividade recente</h3><button class="btn btn-ghost btn-small" data-route-jump="activity">Ver tudo</button></div><div class="panel-body">${recentActivities.length ? `<div class="activity-list">${recentActivities.map(a=>this.activityRow(a)).join('')}</div>` : this.empty('Ainda não existem atividades.','Crie o primeiro registo para iniciar o histórico.')}</div></section>
          <aside class="panel"><div class="panel-head"><h3>Estado das avarias</h3></div><div class="panel-body"><div class="ops-donut-wrap"><div class="ops-donut-shell"><div class="ops-donut" style="--done:${resolutionRate}%"></div><div class="ops-donut-label"><strong>${operational.length}</strong><span>Total</span></div></div><div class="ops-status-list">${activeStatus.map(([label,count])=>`<div class="ops-status-line"><span>${this.escape(label)}</span><strong>${count}</strong></div>`).join('')}</div></div></div></aside>
        </div>

        <section class="panel" style="margin-top:14px"><div class="panel-head"><h3>Acesso rápido</h3><span class="muted">Todas as funções permanecem disponíveis</span></div><div class="panel-body quick-actions">
          <button class="quick-action" data-action="new-record"><span class="nav-icon">${this.icon('new')}</span><span>Novo registo</span></button>
          <button class="quick-action" data-route-jump="records"><span class="nav-icon">${this.icon('records')}</span><span>Registos</span></button>
          <button class="quick-action" data-route-jump="statistics"><span class="nav-icon">${this.icon('statistics')}</span><span>Estatísticas</span></button>
          <button class="quick-action" data-route-jump="designer"><span class="nav-icon">${this.icon('designer')}</span><span>Designer de formulário</span></button>
        </div></section>`;
      this.bindViewActions();
    },

    processTrackerHtml(status) {
      const order = ['REGISTERED','IN_PROGRESS','SENT','IN_TREATMENT','WAITING_RESPONSE','CLOSED'];
      const labels = {
        REGISTERED: ['Registado','Ocorrência criada'], IN_PROGRESS: ['Em andamento','Validação interna'], SENT: ['Enviado','Encaminhamento'], IN_TREATMENT: ['Em tratamento','Aguarda intervenção'], WAITING_RESPONSE: ['Aguarda resposta','Seguimento'], CLOSED: ['Encerrado','Resolvido']
      };
      const normalized = status === 'DRAFT' ? 'REGISTERED' : status;
      const activeIndex = Math.max(0, order.indexOf(normalized));
      return `<div class="process-steps">${order.map((step,index)=>{const state=index<activeIndex?'done':index===activeIndex?'active':'';const [label,hint]=labels[step];return `<div class="process-step ${state}"><span class="process-dot">${index+1}</span><strong>${this.escape(label)}</strong><small>${this.escape(hint)}</small></div>`;}).join('')}</div>`;
    },

    metricCard(label, value, sub) {
      return `<article class="metric-card"><span class="metric-label">${this.escape(label)}</span><strong class="metric-value">${value}</strong><span class="metric-sub">${this.escape(sub)}</span></article>`;
    },

    activityRow(activity) {
      const record = this.state.records.find(r => r.id === activity.recordId);
      return `<div class="activity-item"><span class="activity-time">${this.formatTime(activity.createdAt)}</span><div class="activity-main"><strong>${this.escape(activity.label || activity.eventType)}</strong><span>${this.escape(record?.displayId || 'Sistema')} · ${this.escape(record?.clientName || 'Sem cliente')}</span></div>${record ? this.statusBadge(record.status) : ''}</div>`;
    },
  });
})();
