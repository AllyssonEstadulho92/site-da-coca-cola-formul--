(() => {
  'use strict';
  Object.assign(window.App, {
    async init() {
      this.cacheEls();
      this.bindGlobalEvents();
      await AppDB.open();
      await this.loadSettings();
      await this.loadData();
      await AppDB.ensureDailySnapshot().catch(() => null);
      this.state.snapshots = await AppDB.getSnapshots().catch(() => []);
      this.renderNavigation();
      this.restoreSession();
      this.registerServiceWorker();
    },

    cacheEls() {
      const ids = ['loginView','appShell','loginForm','loginEmail','loginPassword','togglePassword','desktopNav','mobileNav','viewContainer','pageTitle','topbarEyebrow','globalSearch','quickAddButton','profileButton','avatarInitials','saveState','toastRegion','confirmDialog','confirmTitle','confirmText','confirmActionButton','recordDialog','recordDialogBody','restoreInput','systemBannerTitle','systemBannerText'];
      ids.forEach(id => this.els[id] = document.getElementById(id));
    },

    bindGlobalEvents() {
      this.els.loginForm.addEventListener('submit', e => this.handleLogin(e));
      this.els.togglePassword.addEventListener('click', () => {
        const input = this.els.loginPassword;
        input.type = input.type === 'password' ? 'text' : 'password';
        this.els.togglePassword.setAttribute('aria-label', input.type === 'password' ? 'Mostrar palavra-passe' : 'Ocultar palavra-passe');
      });
      this.els.quickAddButton.addEventListener('click', () => this.navigate('new'));
      this.els.profileButton.addEventListener('click', () => this.navigate('profile'));
      this.els.globalSearch.addEventListener('input', e => {
        const value = e.target.value.trim();
        if (!value) return;
        this.state.filters.search = value;
        this.navigate('records');
      });
      this.els.confirmDialog.addEventListener('close', async () => {
        if (this.els.confirmDialog.returnValue === 'confirm' && this.state.pendingConfirm) {
          const fn = this.state.pendingConfirm;
          this.state.pendingConfirm = null;
          await fn();
        } else {
          this.state.pendingConfirm = null;
        }
      });
      this.els.restoreInput.addEventListener('change', e => this.handleRestoreFile(e));
      window.addEventListener('hashchange', () => this.routeFromHash());
      window.addEventListener('online', () => this.setConnectionBanner(true));
      window.addEventListener('offline', () => this.setConnectionBanner(false));
      window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); this.state.deferredInstallPrompt = event; });
      document.addEventListener('visibilitychange', () => {
        if (document.hidden && this.state.currentDraft) this.saveDraftNow().catch(() => {});
      });
      window.addEventListener('beforeunload', () => {
        if (!this.state.currentDraft) return;
        const key = this.state.editingExistingId ? `editBuffer:${this.state.editingExistingId}` : 'unsavedDraftMirror';
        sessionStorage.setItem(key, JSON.stringify(this.state.currentDraft));
      });
    },

    async loadSettings() {
      const saved = await AppDB.get('settings', 'appSettings');
      const base = structuredClone(this.defaultSettings);
      const value = saved?.value || {};
      const merged = { ...base, ...value };
      merged.equipmentTypes = Array.isArray(value.equipmentTypes) ? value.equipmentTypes : base.equipmentTypes;
      merged.symptoms = Array.isArray(value.symptoms) ? value.symptoms : base.symptoms;
      merged.faultCategories = Array.isArray(value.faultCategories) ? value.faultCategories : base.faultCategories;
      const sourceRules = Array.isArray(value.routingRules) ? value.routingRules : base.routingRules;
      merged.routingRules = base.routingRules.map((template) => {
        const found = sourceRules.find((rule) => rule.code === template.code) || {};
        return { ...template, ...found };
      });
      this.state.settings = merged;
      await AppDB.put('settings', { key: 'appSettings', value: merged });
    },

    async loadData() {
      this.state.records = (await AppDB.getAll('records')).sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      this.state.activities = (await AppDB.getAll('activities')).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    renderNavigation() {
      this.els.desktopNav.innerHTML = this.navItems.filter(item => !item.mobileOnly).map(item => `
        <button class="nav-item" type="button" data-route="${item.id}">
          <span class="nav-icon" aria-hidden="true">${this.icon(item.id)}</span>
          <span>${this.escape(item.desktop)}</span>
        </button>`).join('');

      const mobileIds = ['dashboard','new','records','activity','more'];
      this.els.mobileNav.innerHTML = this.navItems.filter(i => mobileIds.includes(i.id)).map(item => `
        <button class="mobile-nav-item" type="button" data-route="${item.id}">
          <span class="nav-icon" aria-hidden="true">${this.icon(item.id)}</span>
          <span>${this.escape(item.label)}</span>
        </button>`).join('');

      document.querySelectorAll('[data-route]').forEach(btn => btn.addEventListener('click', () => this.navigate(btn.dataset.route)));
    },

    restoreSession() {
      const raw = sessionStorage.getItem('registoAvariasUser');
      if (!raw) return;
      try {
        this.state.user = JSON.parse(raw);
        this.enterApp();
      } catch { sessionStorage.removeItem('registoAvariasUser'); }
    },

    async handleLogin(event) {
      event.preventDefault();
      const email = this.els.loginEmail.value.trim().toLowerCase();
      const password = this.els.loginPassword.value;
      this.clearLoginErrors();
      let valid = true;
      if (!/^\S+@\S+\.\S+$/.test(email)) { this.setFieldError('loginEmail', 'Introduza um e-mail válido.'); valid = false; }
      if (password.length < 8) { this.setFieldError('loginPassword', 'Introduza pelo menos 8 caracteres.'); valid = false; }
      if (!valid) return;

      let profile = await AppDB.get('profiles', email);
      let created = false;
      if (!profile) {
        const displayName = email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const salt = this.createPasswordSalt();
        const passwordHash = await this.derivePasswordHash(password, salt);
        profile = { email, name: displayName || 'Utilizador', role: 'AGENT', createdAt: new Date().toISOString(), lastLogin: new Date().toISOString(), passwordSalt: salt, passwordHash, passwordIterations: 120000 };
        created = true;
      } else if (profile.passwordHash && profile.passwordSalt) {
        const candidate = await this.derivePasswordHash(password, profile.passwordSalt, profile.passwordIterations || 120000);
        if (!this.constantTimeEqual(candidate, profile.passwordHash)) {
          this.setFieldError('loginPassword', 'Palavra-passe incorreta para este perfil local.');
          return;
        }
        profile.lastLogin = new Date().toISOString();
      } else {
        const salt = this.createPasswordSalt();
        profile.passwordSalt = salt;
        profile.passwordHash = await this.derivePasswordHash(password, salt);
        profile.passwordIterations = 120000;
        profile.lastLogin = new Date().toISOString();
      }
      await AppDB.put('profiles', profile);

      const sessionProfile = { email: profile.email, name: profile.name, role: profile.role, createdAt: profile.createdAt, lastLogin: profile.lastLogin };
      this.state.user = sessionProfile;
      sessionStorage.setItem('registoAvariasUser', JSON.stringify(sessionProfile));
      this.els.loginPassword.value = '';
      this.enterApp();
      this.toast(created ? 'Perfil local criado e sessão iniciada.' : 'Sessão local iniciada.', 'success');
    },

    createPasswordSalt() {
      const bytes = crypto.getRandomValues(new Uint8Array(16));
      return btoa(String.fromCharCode(...bytes));
    },

    async derivePasswordHash(password, saltBase64, iterations = 120000) {
      if (!crypto.subtle) throw new Error('Web Crypto não está disponível neste browser.');
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
      const salt = Uint8Array.from(atob(saltBase64), c => c.charCodeAt(0));
      const bits = await crypto.subtle.deriveBits({ name:'PBKDF2', hash:'SHA-256', salt, iterations }, key, 256);
      return btoa(String.fromCharCode(...new Uint8Array(bits)));
    },

    constantTimeEqual(a, b) {
      if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
      let result = 0;
      for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
      return result === 0;
    },

    clearLoginErrors() {
      document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
      [this.els.loginEmail, this.els.loginPassword].forEach(el => el.removeAttribute('aria-invalid'));
    },

    setFieldError(id, message) {
      const input = document.getElementById(id);
      const error = document.querySelector(`[data-error-for="${id}"]`);
      if (input) input.setAttribute('aria-invalid', 'true');
      if (error) error.textContent = message;
    },

    enterApp() {
      this.els.loginView.classList.add('is-hidden');
      this.els.appShell.classList.remove('is-hidden');
      this.updateAvatar();
      this.setConnectionBanner(navigator.onLine);
      this.routeFromHash(true);
    },

    logout() {
      sessionStorage.removeItem('registoAvariasUser');
      this.state.user = null;
      this.state.currentDraft = null;
      location.hash = '';
      this.els.appShell.classList.add('is-hidden');
      this.els.loginView.classList.remove('is-hidden');
      this.els.loginEmail.focus();
    },

    updateAvatar() {
      const name = this.state.user?.name || 'Utilizador';
      const initials = name.split(' ').filter(Boolean).slice(0,2).map(p => p[0]).join('').toUpperCase();
      this.els.avatarInitials.textContent = initials || 'US';
    },

    navigate(route, params = '') {
      const next = `#/${route}${params}`;
      if (location.hash === next) this.renderRoute(route);
      else location.hash = next;
    },

    routeFromHash(force = false) {
      if (!this.state.user) return;
      const match = location.hash.match(/^#\/([^/?]+)/);
      const route = match?.[1] || 'dashboard';
      if (!this.navItems.some(i => i.id === route) && !['edit'].includes(route)) return this.navigate('dashboard');
      if (force || this.state.route !== route || route === 'edit') this.renderRoute(route);
    },

    async renderRoute(route) {
      this.state.route = route;
      this.setActiveNav(route === 'edit' ? 'records' : route);
      const titles = { dashboard: 'Dashboard', new: 'Novo Registo', records: 'Registos', clients: 'Clientes', equipment: 'Equipamentos', routing: 'Encaminhamento', activity: 'Atividade', productivity: 'Produtividade', drafts: 'Rascunhos', archive: 'Arquivo', settings: 'Configurações', help: 'Guia de Utilização', profile: 'Perfil', more: 'Mais', edit: 'Editar Registo' };
      this.els.pageTitle.textContent = titles[route] || 'Registo de Avarias';
      this.els.topbarEyebrow.textContent = route === 'new' || route === 'edit' ? 'Ocorrência' : 'Área de trabalho';
      this.els.viewContainer.innerHTML = '<div class="empty-state">A carregar…</div>';
      await this.loadData();
      const renderers = {
        dashboard: () => this.renderDashboard(),
        new: () => this.renderRecordForm(),
        records: () => this.renderRecords(),
        clients: () => this.renderClients(),
        equipment: () => this.renderEquipment(),
        routing: () => this.renderRouting(),
        activity: () => this.renderActivity(),
        productivity: () => this.renderProductivity(),
        drafts: () => this.renderDrafts(),
        archive: () => this.renderArchive(),
        settings: () => this.renderSettings(),
        help: () => this.renderHelp(),
        profile: () => this.renderProfile(),
        more: () => this.renderMore(),
        edit: () => this.renderEditFromHash(),
      };
      await renderers[route]?.();
      this.els.viewContainer.focus({ preventScroll: true });
    },

    setActiveNav(route) {
      document.querySelectorAll('[data-route]').forEach(el => el.classList.toggle('active', el.dataset.route === route));
    },

  });
})();
