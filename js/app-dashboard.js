(() => {
  'use strict';
  Object.assign(window.App, {
    renderDashboard() {
      const now = new Date();
      const todayKey = this.dateKey(now);
      const records = this.state.records.filter(r => !r.archived);
      const today = records.filter(r => this.dateKey(new Date(r.createdAt)) === todayKey);
      const drafts = records.filter(r => r.status === 'DRAFT');
      const closed = today.filter(r => r.status === 'CLOSED');
      const pending = today.filter(r => !['CLOSED','ARCHIVED'].includes(r.status));
      const recentActivities = this.state.activities.slice(0, 8);

      this.els.viewContainer.innerHTML = `
        <div class="page-head">
          <div>
            <p class="eyebrow">Resumo diário</p>
            <h3>${this.greeting()}, ${this.escape(this.state.user.name.split(' ')[0])}</h3>
          </div>
          <div class="page-actions">
            <button class="btn btn-secondary" data-action="backup">Criar backup</button>
            <button class="btn btn-primary" data-action="new-record">+ Novo registo</button>
          </div>
        </div>

        <div class="metric-grid">
          ${this.metricCard('Registos hoje', today.length, 'Criados hoje')}
          ${this.metricCard('Pendentes', pending.length, 'Ainda por concluir')}
          ${this.metricCard('Encerrados', closed.length, 'Concluídos hoje')}
          ${this.metricCard('Rascunhos', drafts.length, 'Guardados automaticamente')}
        </div>

        <section class="panel process-panel">
          <div class="panel-head"><h3>Fluxo do processo</h3><span class="muted">Visão dos registos ativos</span></div>
          <div class="panel-body process-flow">
            ${[
              ['REGISTERED','Registado'],['IN_PROGRESS','Em andamento'],['SENT','Enviado'],['IN_TREATMENT','Em tratamento'],['CLOSED','Encerrado']
            ].map(([key,label],index) => `<div class="process-step"><span class="process-number">${index+1}</span><strong>${this.escape(label)}</strong><small>${records.filter(r=>r.status===key).length} reg.</small></div>`).join('<span class="process-connector" aria-hidden="true"></span>')}
          </div>
        </section>

        <div class="content-grid">
          <section class="panel">
            <div class="panel-head"><h3>Atividade recente</h3><button class="btn btn-ghost btn-small" data-route-jump="activity">Ver tudo</button></div>
            <div class="panel-body">
              ${recentActivities.length ? `<div class="activity-list">${recentActivities.map(a => this.activityRow(a)).join('')}</div>` : this.empty('Ainda não existem atividades.', 'Crie o primeiro registo para iniciar o histórico.')}
            </div>
          </section>

          <aside class="panel">
            <div class="panel-head"><h3>Ações rápidas</h3></div>
            <div class="panel-body quick-actions">
              <button class="quick-action" data-action="new-record"><span class="nav-icon">${this.icon('new')}</span><span>Novo registo</span></button>
              <button class="quick-action" data-route-jump="records"><span class="nav-icon">${this.icon('records')}</span><span>Pesquisar registos</span></button>
              <button class="quick-action" data-action="export-csv"><span class="nav-icon">${this.icon('productivity')}</span><span>Exportar Excel/CSV</span></button>
              <button class="quick-action" data-route-jump="routing"><span class="nav-icon">${this.icon('routing')}</span><span>Encaminhamento e e-mails</span></button>
              <button class="quick-action" data-route-jump="settings"><span class="nav-icon">${this.icon('settings')}</span><span>Configurar PT e listas</span></button>
            </div>
          </aside>
        </div>`;
      this.bindViewActions();
    },

    processTrackerHtml(status) {
      const order = ['REGISTERED','IN_PROGRESS','SENT','IN_TREATMENT','WAITING_RESPONSE','CLOSED'];
      const labels = {
        REGISTERED: ['Registado','Ocorrência criada'],
        IN_PROGRESS: ['Em andamento','Validação interna'],
        SENT: ['Enviado','Encaminhamento'],
        IN_TREATMENT: ['Em tratamento','Aguarda intervenção'],
        WAITING_RESPONSE: ['Aguarda resposta','Seguimento'],
        CLOSED: ['Encerrado','Resolvido']
      };
      const normalized = status === 'DRAFT' ? 'REGISTERED' : status;
      const activeIndex = Math.max(0, order.indexOf(normalized));
      return `<div class="process-steps">${order.map((step, index) => {
        const state = index < activeIndex ? 'done' : index === activeIndex ? 'active' : '';
        const [label, hint] = labels[step];
        return `<div class="process-step ${state}"><span class="process-dot">${index + 1}</span><strong>${this.escape(label)}</strong><small>${this.escape(hint)}</small></div>`;
      }).join('')}</div>`;
    },

    metricCard(label, value, sub) {
      return `<article class="metric-card"><span class="metric-label">${this.escape(label)}</span><strong class="metric-value">${value}</strong><span class="metric-sub">${this.escape(sub)}</span></article>`;
    },

    activityRow(activity) {
      const record = this.state.records.find(r => r.id === activity.recordId);
      return `<div class="activity-item">
        <span class="activity-time">${this.formatTime(activity.createdAt)}</span>
        <div class="activity-main"><strong>${this.escape(activity.label || activity.eventType)}</strong><span>${this.escape(record?.displayId || 'Sistema')} · ${this.escape(record?.clientName || 'Sem cliente')}</span></div>
        ${record ? this.statusBadge(record.status) : ''}
      </div>`;
    },

  });
})();
