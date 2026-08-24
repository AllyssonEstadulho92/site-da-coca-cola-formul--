(() => {
  'use strict';
  if (!window.App) return;

  const baseToast = App.toast;
  const baseIcon = App.icon;
  const baseRenderSettings = App.renderSettings;
  const baseSaveSettings = App.saveSettings;
  const SWIPE_LIMIT = 92;
  const SWIPE_TRIGGER = 42;

  Object.assign(App, {
    icon(name) {
      if (name === 'notifications') return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></svg>';
      return baseIcon.call(this, name);
    },

    notificationTitle(type) {
      return type === 'error' ? 'Atenção' : type === 'success' ? 'Concluído' : 'Informação';
    },

    async recordInteractionNotification(message, type = '') {
      if (!message || !window.AppDB) return;
      const now = Date.now();
      const latest = this.state.notifications?.[0];
      if (latest && latest.message === message && now - new Date(latest.createdAt).getTime() < 2500) return;
      const hash = location.hash || '#/dashboard';
      const params = hash.includes('?') ? `?${hash.split('?').slice(1).join('?')}` : '';
      const item = {
        id: crypto.randomUUID(),
        title: this.notificationTitle(type),
        message: String(message),
        type: type || 'info',
        route: this.state.route || 'dashboard',
        params,
        createdAt: new Date(now).toISOString(),
        readAt: null,
      };
      await AppDB.put('notifications', item);
      this.state.notifications = [item, ...(this.state.notifications || [])];
      for (const old of this.state.notifications.slice(200)) await AppDB.remove('notifications', old.id).catch(() => {});
      this.state.notifications = this.state.notifications.slice(0, 200);
      this.updateNotificationBadge();
    },

    shouldAttentionFeedback(message, type) {
      if (type === 'error') return true;
      if (type !== 'success') return false;
      return /guardad|criad|atualiz|arquivad|reabert|enviado|restaur|backup|snapshot|configura|eliminad|removid/i.test(String(message));
    },

    async playAttentionFeedback(kind = 'success') {
      const prefs = this.state.settings?.attentionFeedback || {};
      if (prefs.vibration !== false && navigator.vibrate) {
        try { navigator.vibrate(kind === 'error' ? [70, 50, 70] : 60); } catch {}
      }
      if (prefs.sound === false) return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      try {
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') await ctx.resume();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = kind === 'error' ? 240 : 820;
        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.07, ctx.currentTime + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.11);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
        setTimeout(() => ctx.close().catch(() => {}), 180);
      } catch {}
    },

    reminderKey(kind, id) {
      return `${kind}:${id}`;
    },

    reminderDismissed(kind, record) {
      const dismissed = this.state.settings?.attentionFeedback?.dismissedReminders || {};
      return dismissed[this.reminderKey(kind, record.id)] === String(record.updatedAt || record.createdAt || '');
    },

    attentionReminders() {
      const prefs = this.state.settings?.attentionFeedback || {};
      if (prefs.reminders === false) return [];
      const minutes = Math.min(240, Math.max(5, Number(prefs.reminderMinutes || 15)));
      const cutoff = Date.now() - minutes * 60000;
      const reminders = [];
      for (const r of this.state.records || []) {
        if (r.archived || new Date(r.updatedAt || r.createdAt).getTime() > cutoff) continue;
        const base = { id: r.id, displayId: r.displayId || 'Rascunho', client: r.clientName || r.establishmentName || 'Sem cliente', updatedAt: r.updatedAt || r.createdAt };
        let reminder = null;
        if (r.status === 'DRAFT') reminder = { ...base, kind: 'draft', title: 'Rascunho por concluir', text: `Sem alterações há pelo menos ${minutes} min.` };
        else if (r.emailSent === 'PENDING') reminder = { ...base, kind: 'email', title: 'E-mail por concluir', text: 'O registo continua marcado como “Por enviar”.' };
        else if (r.status === 'WAITING_RESPONSE') reminder = { ...base, kind: 'waiting', title: 'Seguimento pendente', text: 'O registo continua a aguardar resposta.' };
        if (reminder && !this.reminderDismissed(reminder.kind, r)) reminders.push(reminder);
      }
      return reminders.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)).slice(0, 24);
    },

    updateNotificationBadge() {
      const badge = this.els?.notificationBadge;
      const button = this.els?.notificationButton;
      if (!badge) return;
      const unread = (this.state.notifications || []).filter(n => !n.readAt).length;
      const total = unread + this.attentionReminders().length;
      badge.hidden = total === 0;
      badge.textContent = total > 99 ? '99+' : String(total);
      if (button) button.setAttribute('aria-label', total ? `Abrir notificações — ${total} por verificar` : 'Abrir notificações');
    },

    swipeActionIcon(kind) {
      if (kind === 'edit') return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v5M14 11v5"/></svg>';
    },

    reminderCardHtml(r) {
      return `<div class="swipe-row reminder-swipe-row" data-swipe-row>
        <div class="swipe-action swipe-action-edit"><button type="button" data-reminder-open="${this.escapeAttr(r.id)}" data-reminder-kind="${this.escapeAttr(r.kind)}" aria-label="Editar ${this.escapeAttr(r.displayId)}">${this.swipeActionIcon('edit')}<span>Editar</span></button></div>
        <div class="swipe-action swipe-action-delete"><button type="button" data-reminder-delete="${this.escapeAttr(r.id)}" data-reminder-kind="${this.escapeAttr(r.kind)}" aria-label="Eliminar ${this.escapeAttr(r.displayId)}">${this.swipeActionIcon('delete')}<span>Eliminar</span></button></div>
        <article class="reminder-card swipe-surface" data-swipe-surface>
          <div class="reminder-copy"><span class="reminder-kind">${this.escape(r.kind === 'draft' ? 'Rascunho' : r.kind === 'email' ? 'Comunicação' : 'Seguimento')}</span><strong>${this.escape(r.title)}</strong><p>${this.escape(r.displayId)} · ${this.escape(r.client)}</p><small>${this.escape(r.text)}</small><span class="swipe-hint">Deslize → editar · ← eliminar</span></div>
          <div class="swipe-desktop-actions"><button class="btn btn-secondary btn-small" type="button" data-reminder-open="${this.escapeAttr(r.id)}" data-reminder-kind="${this.escapeAttr(r.kind)}">Editar</button><button class="btn btn-ghost btn-small danger-text" type="button" data-reminder-delete="${this.escapeAttr(r.id)}" data-reminder-kind="${this.escapeAttr(r.kind)}">Eliminar</button></div>
        </article>
      </div>`;
    },

    notificationItemHtml(n) {
      return `<div class="swipe-row notification-swipe-row" data-swipe-row>
        ${n.route ? `<div class="swipe-action swipe-action-edit"><button type="button" data-notification-open="${this.escapeAttr(n.id)}" aria-label="Abrir notificação">${this.swipeActionIcon('edit')}<span>Abrir</span></button></div>` : '<div class="swipe-action swipe-action-edit is-disabled" aria-hidden="true"></div>'}
        <div class="swipe-action swipe-action-delete"><button type="button" data-notification-delete="${this.escapeAttr(n.id)}" aria-label="Eliminar notificação">${this.swipeActionIcon('delete')}<span>Eliminar</span></button></div>
        <article class="notification-row swipe-surface ${n.readAt ? '' : 'unread'}" data-swipe-surface><span class="notification-dot" aria-hidden="true"></span><div class="notification-copy"><div><strong>${this.escape(n.title || 'Informação')}</strong><time>${this.formatDateTimeCompact(n.createdAt)}</time></div><p>${this.escape(n.message || '')}</p><span class="swipe-hint">Deslize → abrir · ← eliminar</span></div><div class="notification-actions swipe-desktop-actions">${n.route ? `<button class="btn btn-secondary btn-small" type="button" data-notification-open="${this.escapeAttr(n.id)}">Abrir</button>` : ''}<button class="btn btn-ghost btn-small danger-text" type="button" data-notification-delete="${this.escapeAttr(n.id)}">Eliminar</button></div></article>
      </div>`;
    },

    renderNotifications() {
      const reminders = this.attentionReminders();
      const messages = this.state.notifications || [];
      const unread = messages.filter(n => !n.readAt).length;
      const showAll = Boolean(this.state.attentionShowAll);
      const visibleReminders = showAll ? reminders : reminders.slice(0, 6);
      const hiddenCount = Math.max(0, reminders.length - visibleReminders.length);
      const gear = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.1A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3v-4h.1A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.1A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.15.37.36.7.6 1 .28.33.66.55 1.1.6h.1v4h-.1c-.44.05-.82.27-1.1.6-.24.3-.45.63-.6 1Z"/></svg>';
      this.els.viewContainer.innerHTML = `<div class="page-head notification-page-head"><div><p class="eyebrow">Centro de atenção</p><h3>Notificações e pendências</h3></div><div class="page-actions notification-page-actions"><button class="attention-settings-button" type="button" data-attention-settings aria-label="Definições do centro de atenção" title="Definições">${gear}</button><button class="btn btn-secondary" type="button" data-notifications-read-all ${unread ? '' : 'disabled'}>Marcar como lidas</button><button class="btn btn-secondary" type="button" data-notifications-clear ${messages.length ? '' : 'disabled'}>Limpar mensagens</button></div></div>
        <div class="notification-summary"><span><strong>${reminders.length}</strong> a concluir</span><span><strong>${unread}</strong> por ler</span><span><strong>${messages.length}</strong> interações</span></div>
        <section class="panel"><div class="panel-head"><div><h3>A concluir</h3><span class="muted">Deslize cada cartão para editar ou eliminar. Registos operacionais confirmados não são apagados pelo gesto.</span></div></div><div class="panel-body">${reminders.length ? `<div class="reminder-list">${visibleReminders.map(r => this.reminderCardHtml(r)).join('')}</div>${hiddenCount ? `<button class="btn btn-secondary reminder-more" type="button" data-reminders-more>Ver mais ${hiddenCount}</button>` : showAll && reminders.length > 6 ? '<button class="btn btn-ghost reminder-more" type="button" data-reminders-less>Mostrar menos</button>' : ''}` : this.empty('Sem pendências antigas.', 'Os rascunhos em edição recente não geram alerta.')}</div></section>
        <section class="panel notifications-panel"><div class="panel-head"><div><h3>Mensagens das interações</h3><span class="muted">Confirmações, avisos e erros apresentados durante a utilização.</span></div></div><div class="panel-body">${messages.length ? `<div class="notification-list">${messages.map(n => this.notificationItemHtml(n)).join('')}</div>` : this.empty('Sem mensagens guardadas.', 'As próximas interações relevantes aparecerão aqui.')}</div></section>`;

      document.querySelectorAll('[data-notification-open]').forEach(btn => btn.addEventListener('click', async () => {
        const item = this.state.notifications.find(n => n.id === btn.dataset.notificationOpen);
        if (!item) return;
        await this.markNotificationRead(item.id);
        this.navigate(item.route || 'dashboard', item.params || '');
      }));
      document.querySelectorAll('[data-notification-delete]').forEach(btn => btn.addEventListener('click', () => this.deleteNotification(btn.dataset.notificationDelete)));
      document.querySelectorAll('[data-reminder-open]').forEach(btn => btn.addEventListener('click', () => this.openReminderRecord(btn.dataset.reminderOpen, btn.dataset.reminderKind)));
      document.querySelectorAll('[data-reminder-delete]').forEach(btn => btn.addEventListener('click', () => this.requestDeleteReminder(btn.dataset.reminderDelete, btn.dataset.reminderKind)));
      document.querySelector('[data-notifications-read-all]')?.addEventListener('click', () => this.markAllNotificationsRead());
      document.querySelector('[data-notifications-clear]')?.addEventListener('click', () => this.confirm('Limpar mensagens', 'As mensagens do centro de notificações serão removidas. Registos e histórico de atividade não serão afetados.', () => this.clearNotifications()));
      document.querySelector('[data-attention-settings]')?.addEventListener('click', () => this.navigate('settings', '?section=attention'));
      document.querySelector('[data-reminders-more]')?.addEventListener('click', () => { this.state.attentionShowAll = true; this.renderNotifications(); });
      document.querySelector('[data-reminders-less]')?.addEventListener('click', () => { this.state.attentionShowAll = false; this.renderNotifications(); });
      this.bindSwipeRows();
    },

    openReminderRecord(id, kind) {
      if (kind === 'draft' || kind === 'email' || kind === 'waiting') return this.navigate('edit', `?id=${encodeURIComponent(id)}`);
      this.navigate('records');
    },

    async dismissReminder(id, kind) {
      const record = this.state.records.find(r => r.id === id);
      if (!record) return;
      const feedback = this.state.settings.attentionFeedback || (this.state.settings.attentionFeedback = {});
      const dismissed = { ...(feedback.dismissedReminders || {}) };
      dismissed[this.reminderKey(kind, id)] = String(record.updatedAt || record.createdAt || '');
      const entries = Object.entries(dismissed).slice(-200);
      feedback.dismissedReminders = Object.fromEntries(entries);
      await AppDB.put('settings', { key: 'appSettings', value: this.state.settings });
      this.updateNotificationBadge();
      baseToast.call(this, 'Lembrete removido do Centro de Atenção.', 'success');
      this.renderNotifications();
    },

    requestDeleteReminder(id, kind) {
      const record = this.state.records.find(r => r.id === id);
      if (!record) return;
      if (kind !== 'draft') {
        this.confirm('Eliminar lembrete', 'O lembrete será retirado do Centro de Atenção, mas o registo operacional será preservado. Se o registo for alterado e continuar pendente, o lembrete poderá voltar.', () => this.dismissReminder(id, kind));
        return;
      }
      this.confirm('Eliminar rascunho', `O rascunho ${record.displayId || ''} será eliminado deste dispositivo. Esta ação não elimina registos já confirmados.`, () => this.deleteDraftFromAttention(id));
    },

    async deleteDraftFromAttention(id) {
      const record = this.state.records.find(r => r.id === id);
      if (!record || record.status !== 'DRAFT') return baseToast.call(this, 'Este item já não é um rascunho.', 'error');
      await AppDB.remove('records', id);
      for (const activity of (this.state.activities || []).filter(a => a.recordId === id)) await AppDB.remove('activities', activity.id).catch(() => {});
      if (this.state.currentDraft?.id === id) this.state.currentDraft = null;
      sessionStorage.removeItem(`editBuffer:${id}`);
      await this.loadData();
      this.updateNotificationBadge();
      baseToast.call(this, 'Rascunho eliminado.', 'success');
      this.renderNotifications();
    },

    bindSwipeRows() {
      const rows = [...document.querySelectorAll('[data-swipe-row]')];
      const closeOthers = active => rows.forEach(row => {
        if (row === active) return;
        const surface = row.querySelector('[data-swipe-surface]');
        if (surface) surface.style.transform = 'translate3d(0,0,0)';
        row.dataset.swipeOpen = '';
      });
      rows.forEach(row => {
        const surface = row.querySelector('[data-swipe-surface]');
        if (!surface) return;
        let pointerId = null;
        let startX = 0;
        let startY = 0;
        let offset = 0;
        let dragging = false;
        surface.addEventListener('pointerdown', event => {
          if (event.pointerType === 'mouse' && event.button !== 0) return;
          pointerId = event.pointerId;
          startX = event.clientX;
          startY = event.clientY;
          offset = Number(row.dataset.swipeOpen || 0);
          dragging = false;
          surface.setPointerCapture?.(pointerId);
          closeOthers(row);
        });
        surface.addEventListener('pointermove', event => {
          if (pointerId !== event.pointerId) return;
          const dx = event.clientX - startX;
          const dy = event.clientY - startY;
          if (!dragging && Math.abs(dx) < 8) return;
          if (!dragging && Math.abs(dy) > Math.abs(dx)) return;
          dragging = true;
          event.preventDefault();
          const next = Math.max(-SWIPE_LIMIT, Math.min(SWIPE_LIMIT, offset + dx));
          surface.style.transform = `translate3d(${next}px,0,0)`;
        }, { passive: false });
        const finish = event => {
          if (pointerId !== event.pointerId) return;
          const dx = event.clientX - startX;
          const current = Math.max(-SWIPE_LIMIT, Math.min(SWIPE_LIMIT, offset + dx));
          const snap = current > SWIPE_TRIGGER ? SWIPE_LIMIT : current < -SWIPE_TRIGGER ? -SWIPE_LIMIT : 0;
          surface.style.transform = `translate3d(${snap}px,0,0)`;
          row.dataset.swipeOpen = String(snap);
          pointerId = null;
        };
        surface.addEventListener('pointerup', finish);
        surface.addEventListener('pointercancel', finish);
      });
    },

    async markNotificationRead(id) {
      const item = this.state.notifications.find(n => n.id === id);
      if (!item || item.readAt) return;
      item.readAt = new Date().toISOString();
      await AppDB.put('notifications', item);
      this.updateNotificationBadge();
    },

    async markAllNotificationsRead() {
      const now = new Date().toISOString();
      for (const item of this.state.notifications) {
        if (!item.readAt) { item.readAt = now; await AppDB.put('notifications', item); }
      }
      this.updateNotificationBadge();
      baseToast.call(this, 'Mensagens marcadas como lidas.', 'success');
      this.renderNotifications();
    },

    async deleteNotification(id) {
      await AppDB.remove('notifications', id);
      this.state.notifications = this.state.notifications.filter(n => n.id !== id);
      this.updateNotificationBadge();
      baseToast.call(this, 'Mensagem eliminada.', 'success');
      this.renderNotifications();
    },

    async clearNotifications() {
      await AppDB.clear('notifications');
      this.state.notifications = [];
      this.updateNotificationBadge();
      baseToast.call(this, 'Mensagens do centro de notificações limpas.', 'success');
      this.renderNotifications();
    },

    injectAttentionSettings() {
      const sticky = this.els.viewContainer.querySelector('.sticky-settings-save');
      if (!sticky || document.getElementById('attentionSettings')) return;
      const prefs = this.state.settings.attentionFeedback || {};
      const vibrationSupport = Boolean(navigator.vibrate);
      sticky.insertAdjacentHTML('beforebegin', `<section class="panel settings-section" id="attentionSettings"><div class="panel-head"><div><h3>Atenção, som e vibração</h3><span class="muted">Feedback local para confirmar ações e lembrar trabalho por concluir</span></div></div><div class="panel-body attention-settings-grid"><label class="toggle-row"><input id="attentionSound" type="checkbox" ${prefs.sound !== false ? 'checked' : ''}><span>Som curto em ações concluídas/guardadas</span></label><label class="toggle-row"><input id="attentionVibration" type="checkbox" ${prefs.vibration !== false ? 'checked' : ''} ${vibrationSupport ? '' : 'disabled'}><span>Vibração quando suportada pelo dispositivo</span></label><label class="toggle-row"><input id="attentionReminders" type="checkbox" ${prefs.reminders !== false ? 'checked' : ''}><span>Lembrar rascunhos e seguimentos pendentes</span></label><label class="field"><span>Lembrar após</span><input id="attentionReminderMinutes" type="number" min="5" max="240" value="${Math.min(240, Math.max(5, Number(prefs.reminderMinutes || 15)))}"><small class="field-hint">Minutos sem alteração antes de surgir em “A concluir”.</small></label><div class="attention-test"><button class="btn btn-secondary" type="button" data-attention-test>Testar som/vibração</button><small class="muted">O som depende das permissões do navegador. ${vibrationSupport ? 'Este dispositivo expõe suporte a vibração.' : 'Vibração não disponível neste navegador.'}</small></div></div></section>`);
      document.querySelector('[data-attention-test]')?.addEventListener('click', () => { this.playAttentionFeedback('success'); baseToast.call(this, 'Teste de atenção executado.', 'success'); });
      const params = new URLSearchParams((location.hash.split('?')[1] || ''));
      if (params.get('section') === 'attention') requestAnimationFrame(() => document.getElementById('attentionSettings')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    },
  });

  App.toast = function(message, type = '') {
    baseToast.call(this, message, type);
    this.recordInteractionNotification(message, type).catch(() => {});
    if (this.shouldAttentionFeedback(message, type)) this.playAttentionFeedback(type === 'error' ? 'error' : 'success');
  };

  App.renderSettings = async function() {
    await baseRenderSettings.call(this);
    this.injectAttentionSettings();
  };

  App.saveSettings = async function() {
    const sound = document.getElementById('attentionSound');
    const vibration = document.getElementById('attentionVibration');
    const reminders = document.getElementById('attentionReminders');
    const minutes = document.getElementById('attentionReminderMinutes');
    if (sound && vibration && reminders && minutes) {
      this.state.settings.attentionFeedback = {
        ...(this.state.settings.attentionFeedback || {}),
        sound: sound.checked,
        vibration: vibration.checked,
        reminders: reminders.checked,
        reminderMinutes: Math.min(240, Math.max(5, Number(minutes.value || 15))),
      };
    }
    return baseSaveSettings.call(this);
  };
})();
