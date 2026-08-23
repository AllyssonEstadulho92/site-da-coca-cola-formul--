(() => {
  'use strict';
  Object.assign(window.App, {
    authPolicy: Object.freeze({
      minLoginPasswordLength: 8,
      minNewPasswordLength: 12,
      passwordIterations: 210000,
      maxFailedAttempts: 5,
      lockoutMs: 5 * 60 * 1000,
      idleMs: 15 * 60 * 1000,
      activityWriteThrottleMs: 15000,
    }),

    async init() {
      this.cacheEls();
      this.bindGlobalEvents();
      this.setLoginMode('login');
      this.updateAuthSecurityUI();
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
      const ids = ['loginView','appShell','loginForm','loginEmail','loginPassword','loginConfirmPassword','createProfileFields','loginModeLogin','loginModeCreate','loginModeHint','loginSubmit','passwordStrength','passwordStrengthBar','passwordStrengthText','connectionSecurityStatus','loginSecurityMessage','togglePassword','desktopNav','mobileNav','viewContainer','pageTitle','topbarEyebrow','globalSearch','quickAddButton','profileButton','avatarInitials','saveState','toastRegion','confirmDialog','confirmTitle','confirmText','confirmActionButton','recordDialog','recordDialogBody','restoreInput','systemBannerTitle','systemBannerText'];
      ids.forEach(id => this.els[id] = document.getElementById(id));
    },

    bindGlobalEvents() {
      this.els.loginForm.addEventListener('submit', e => this.handleLogin(e));
      this.els.loginModeLogin.addEventListener('click', () => this.setLoginMode('login'));
      this.els.loginModeCreate.addEventListener('click', () => this.setLoginMode('create'));
      this.els.loginPassword.addEventListener('input', () => this.updatePasswordStrength());
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
      ['pointerdown','keydown','touchstart'].forEach(type => document.addEventListener(type, () => this.noteUserActivity(), { passive: true }));
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          if (this.state.currentDraft) this.saveDraftNow().catch(() => {});
        } else {
          this.checkIdleLock();
        }
      });
      window.addEventListener('pageshow', () => this.checkIdleLock());
      window.addEventListener('beforeunload', () => {
        if (!this.state.currentDraft) return;
        const key = this.state.editingExistingId ? `editBuffer:${this.state.editingExistingId}` : 'unsavedDraftMirror';
        sessionStorage.setItem(key, JSON.stringify(this.state.currentDraft));
      });
    },

    updateAuthSecurityUI() {
      const secure = Boolean(window.isSecureContext && window.crypto?.subtle);
      if (!this.els.connectionSecurityStatus) return secure;
      this.els.connectionSecurityStatus.dataset.secure = String(secure);
      this.els.connectionSecurityStatus.textContent = secure ? 'Ligação segura / Web Crypto' : 'Contexto não seguro';
      if (!secure) this.setLoginSecurityMessage('Este protótipo requer HTTPS ou localhost e suporte Web Crypto para gerir perfis locais.');
      return secure;
    },

    setLoginMode(mode) {
      const next = mode === 'create' ? 'create' : 'login';
      this.state.authMode = next;
      const creating = next === 'create';
      this.els.loginModeLogin.classList.toggle('active', !creating);
      this.els.loginModeCreate.classList.toggle('active', creating);
      this.els.loginModeLogin.setAttribute('aria-pressed', String(!creating));
      this.els.loginModeCreate.setAttribute('aria-pressed', String(creating));
      this.els.createProfileFields.classList.toggle('is-hidden', !creating);
      this.els.loginConfirmPassword.required = creating;
      this.els.loginPassword.minLength = creating ? this.authPolicy.minNewPasswordLength : this.authPolicy.minLoginPasswordLength;
      this.els.loginPassword.autocomplete = creating ? 'new-password' : 'current-password';
      this.els.loginSubmit.textContent = creating ? 'Criar perfil de teste' : 'Entrar';
      this.els.loginModeHint.textContent = creating
        ? 'Crie um perfil apenas para este browser. Não utilize uma palavra-passe corporativa ou reutilizada noutros serviços.'
        : 'Entre com um perfil local já criado neste browser.';
      this.els.loginConfirmPassword.value = '';
      this.clearLoginErrors();
      this.setLoginSecurityMessage('', 'info');
      this.updatePasswordStrength();
    },

    assessPassword(password) {
      const value = String(password || '');
      const lowered = value.toLowerCase();
      const common = new Set(['password123456','qwerty12345678','123456789012','abcdefghijkl','administrador123']);
      const categories = [/[a-z]/.test(value), /[A-Z]/.test(value), /\d/.test(value), /[^A-Za-z0-9]/.test(value)].filter(Boolean).length;
      let score = 0;
      if (value.length >= 8) score = 1;
      if (value.length >= 12 && categories >= 2) score = 2;
      if (value.length >= 12 && categories >= 3) score = 3;
      if (value.length >= 16 && categories >= 4) score = 4;
      const isCommon = common.has(lowered);
      return {
        score: isCommon ? Math.min(score, 1) : score,
        valid: value.length >= this.authPolicy.minNewPasswordLength && categories >= 3 && !isCommon,
        isCommon,
        categories,
      };
    },

    updatePasswordStrength() {
      if (!this.els.passwordStrength) return;
      const creating = this.state.authMode === 'create';
      if (!creating) {
        this.els.passwordStrength.dataset.score = '0';
        this.els.passwordStrengthText.textContent = 'Use pelo menos 12 caracteres e combine diferentes tipos de caracteres.';
        return;
      }
      const result = this.assessPassword(this.els.loginPassword.value);
      this.els.passwordStrength.dataset.score = String(result.score);
      const labels = ['Muito fraca','Fraca','Razoável','Boa','Forte'];
      if (result.isCommon) this.els.passwordStrengthText.textContent = 'Esta palavra-passe é demasiado previsível. Escolha outra.';
      else if (!this.els.loginPassword.value) this.els.passwordStrengthText.textContent = 'Use pelo menos 12 caracteres e combine diferentes tipos de caracteres.';
      else this.els.passwordStrengthText.textContent = `${labels[result.score]}. Para criar o perfil são necessários 12+ caracteres e pelo menos 3 tipos de caracteres.`;
    },

    authAttemptKey(email) {
      return `authAttempt:${encodeURIComponent(String(email || '').toLowerCase())}`;
    },

    getAuthAttempt(email) {
      try {
        return JSON.parse(sessionStorage.getItem(this.authAttemptKey(email)) || '{"count":0,"lockedUntil":0}');
      } catch {
        return { count: 0, lockedUntil: 0 };
      }
    },

    recordFailedLogin(email) {
      const current = this.getAuthAttempt(email);
      const now = Date.now();
      const count = (current.lockedUntil > now ? current.count : Math.max(0, current.count)) + 1;
      const lockedUntil = count >= this.authPolicy.maxFailedAttempts ? now + this.authPolicy.lockoutMs : 0;
      const next = { count, lockedUntil };
      sessionStorage.setItem(this.authAttemptKey(email), JSON.stringify(next));
      return next;
    },

    clearFailedLogin(email) {
      sessionStorage.removeItem(this.authAttemptKey(email));
    },

    setLoginSecurityMessage(message, kind = 'error') {
      if (!this.els.loginSecurityMessage) return;
      this.els.loginSecurityMessage.textContent = message || '';
      if (message) this.els.loginSecurityMessage.dataset.kind = kind;
      else this.els.loginSecurityMessage.removeAttribute('data-kind');
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
        const lastActivity = Number(sessionStorage.getItem('registoAvariasLastActivity')) || Date.now();
        if (Date.now() - lastActivity >= this.authPolicy.idleMs) {
          this.clearLocalSession();
          this.setLoginSecurityMessage('A sessão anterior foi bloqueada por inatividade. Introduza novamente a palavra-passe.', 'info');
          return;
        }
        this.state.user = JSON.parse(raw);
        sessionStorage.setItem('registoAvariasLastActivity', String(lastActivity));
        this.enterApp();
      } catch {
        this.clearLocalSession();
      }
    },

    async handleLogin(event) {
      event.preventDefault();
      const email = this.els.loginEmail.value.trim().toLowerCase();
      const password = this.els.loginPassword.value;
      const confirmPassword = this.els.loginConfirmPassword.value;
      const creating = this.state.authMode === 'create';
      this.clearLoginErrors();
      this.setLoginSecurityMessage('', 'info');

      if (!this.updateAuthSecurityUI()) return;

      let valid = true;
      if (!/^\S+@\S+\.\S+$/.test(email)) { this.setFieldError('loginEmail', 'Introduza um e-mail válido.'); valid = false; }
      if (creating) {
        const assessment = this.assessPassword(password);
        if (!assessment.valid) { this.setFieldError('loginPassword', 'Use 12 ou mais caracteres e pelo menos 3 tipos de caracteres.'); valid = false; }
        if (password !== confirmPassword) { this.setFieldError('loginConfirmPassword', 'As palavras-passe não coincidem.'); valid = false; }
      } else if (password.length < this.authPolicy.minLoginPasswordLength) {
        this.setFieldError('loginPassword', 'Introduza pelo menos 8 caracteres.');
        valid = false;
      }
      if (!valid) return;

      if (!creating) {
        const attempt = this.getAuthAttempt(email);
        if (attempt.lockedUntil > Date.now()) {
          const minutes = Math.max(1, Math.ceil((attempt.lockedUntil - Date.now()) / 60000));
          this.setLoginSecurityMessage(`Acesso temporariamente bloqueado neste browser após várias tentativas. Tente novamente dentro de cerca de ${minutes} min.`);
          return;
        }
      }

      let profile = await AppDB.get('profiles', email);
      let created = false;

      if (creating) {
        if (profile) {
          this.setLoginSecurityMessage('Não foi possível criar o perfil. Se este e-mail já tiver um perfil neste browser, utilize Entrar.');
          return;
        }
        const displayName = email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const salt = this.createPasswordSalt();
        const passwordHash = await this.derivePasswordHash(password, salt, this.authPolicy.passwordIterations);
        profile = {
          email,
          name: displayName || 'Utilizador',
          role: 'AGENT',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          passwordSalt: salt,
          passwordHash,
          passwordIterations: this.authPolicy.passwordIterations,
        };
        created = true;
      } else {
        if (!profile?.passwordHash || !profile?.passwordSalt) {
          this.recordFailedLogin(email);
          this.setLoginSecurityMessage('Dados de acesso inválidos neste dispositivo.');
          return;
        }
        const candidate = await this.derivePasswordHash(password, profile.passwordSalt, profile.passwordIterations || 120000);
        if (!this.constantTimeEqual(candidate, profile.passwordHash)) {
          const failed = this.recordFailedLogin(email);
          if (failed.lockedUntil > Date.now()) {
            this.setLoginSecurityMessage('Dados de acesso inválidos. O acesso local foi temporariamente bloqueado após várias tentativas.');
          } else {
            this.setLoginSecurityMessage('Dados de acesso inválidos neste dispositivo.');
          }
          return;
        }
        this.clearFailedLogin(email);
        if ((profile.passwordIterations || 120000) < this.authPolicy.passwordIterations) {
          const newSalt = this.createPasswordSalt();
          profile.passwordSalt = newSalt;
          profile.passwordHash = await this.derivePasswordHash(password, newSalt, this.authPolicy.passwordIterations);
          profile.passwordIterations = this.authPolicy.passwordIterations;
        }
        profile.lastLogin = new Date().toISOString();
      }

      await AppDB.put('profiles', profile);
      this.clearFailedLogin(email);
      const sessionProfile = { email: profile.email, name: profile.name, role: profile.role, createdAt: profile.createdAt, lastLogin: profile.lastLogin };
      this.state.user = sessionProfile;
      sessionStorage.setItem('registoAvariasUser', JSON.stringify(sessionProfile));
      sessionStorage.setItem('registoAvariasLastActivity', String(Date.now()));
      this.els.loginPassword.value = '';
      this.els.loginConfirmPassword.value = '';
      this.enterApp();
      this.toast(created ? 'Perfil de teste criado e sessão iniciada.' : 'Sessão local iniciada.', 'success');
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
      [this.els.loginEmail, this.els.loginPassword, this.els.loginConfirmPassword].filter(Boolean).forEach(el => el.removeAttribute('aria-invalid'));
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
      this.noteUserActivity(true);
      this.routeFromHash(true);
    },

    noteUserActivity(force = false) {
      if (!this.state.user) return;
      const now = Date.now();
      const previous = Number(sessionStorage.getItem('registoAvariasLastActivity')) || 0;
      if (!force && now - previous < this.authPolicy.activityWriteThrottleMs) return;
      sessionStorage.setItem('registoAvariasLastActivity', String(now));
      this.scheduleIdleLock();
    },

    scheduleIdleLock() {
      if (this.state.idleLockTimer) clearTimeout(this.state.idleLockTimer);
      if (!this.state.user) return;
      const last = Number(sessionStorage.getItem('registoAvariasLastActivity')) || Date.now();
      const remaining = Math.max(250, this.authPolicy.idleMs - (Date.now() - last) + 250);
      this.state.idleLockTimer = setTimeout(() => this.checkIdleLock(), remaining);
    },

    checkIdleLock() {
      if (!this.state.user) return;
      const last = Number(sessionStorage.getItem('registoAvariasLastActivity')) || Date.now();
      if (Date.now() - last >= this.authPolicy.idleMs) {
        this.logout('idle');
        return;
      }
      this.scheduleIdleLock();
    },

    clearLocalSession() {
      const keys = [];
      for (let index = 0; index < sessionStorage.length; index++) keys.push(sessionStorage.key(index));
      keys.filter(Boolean).forEach(key => {
        if (['registoAvariasUser','registoAvariasLastActivity','unsavedDraftMirror','equipmentCatalogSelection'].includes(key) || key.startsWith('editBuffer:')) {
          sessionStorage.removeItem(key);
        }
      });
    },

    logout(reason = 'manual') {
      if (this.state.idleLockTimer) clearTimeout(this.state.idleLockTimer);
      this.state.idleLockTimer = null;
      this.clearLocalSession();
      this.state.user = null;
      this.state.currentDraft = null;
      location.hash = '';
      this.els.appShell.classList.add('is-hidden');
      this.els.loginView.classList.remove('is-hidden');
      this.els.loginPassword.value = '';
      this.els.loginConfirmPassword.value = '';
      this.setLoginMode('login');
      if (reason === 'idle') this.setLoginSecurityMessage('Sessão bloqueada após 15 minutos de inatividade. Introduza novamente a palavra-passe.', 'info');
      requestAnimationFrame(() => this.els.loginEmail.focus());
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