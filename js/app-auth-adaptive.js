(() => {
  'use strict';

  if (!window.App || !window.AppDB) return;

  const originalInit = window.App.init;
  const originalCacheEls = window.App.cacheEls;
  const originalBindGlobalEvents = window.App.bindGlobalEvents;
  const originalHandleLogin = window.App.handleLogin;
  const originalSetLoginMode = window.App.setLoginMode;
  const originalLogout = window.App.logout;

  Object.assign(window.App, {
    cacheEls() {
      originalCacheEls.call(this);
      ['authFlowState', 'authPasswordStage', 'changeLoginEmail'].forEach(id => {
        this.els[id] = document.getElementById(id);
      });
    },

    bindGlobalEvents() {
      originalBindGlobalEvents.call(this);
      this.els.changeLoginEmail?.addEventListener('click', () => {
        this.resetAdaptiveAuthFlow();
        requestAnimationFrame(() => this.els.loginEmail?.focus());
      });
    },

    async init() {
      await originalInit.call(this);
      if (!this.state.user) this.resetAdaptiveAuthFlow();
    },

    resetAdaptiveAuthFlow() {
      this.state.authFlowStage = 'email';
      originalSetLoginMode.call(this, 'login');

      if (this.els.loginEmail) {
        this.els.loginEmail.readOnly = false;
        this.els.loginEmail.removeAttribute('aria-readonly');
      }
      if (this.els.loginPassword) {
        this.els.loginPassword.required = false;
        this.els.loginPassword.value = '';
      }
      if (this.els.loginConfirmPassword) {
        this.els.loginConfirmPassword.required = false;
        this.els.loginConfirmPassword.value = '';
      }

      this.els.authPasswordStage?.classList.add('is-hidden');
      this.els.changeLoginEmail?.classList.add('is-hidden');
      if (this.els.loginSubmit) this.els.loginSubmit.textContent = 'Continuar';
      if (this.els.loginModeHint) this.els.loginModeHint.textContent = 'Introduza o e-mail para continuar.';
      if (this.els.authFlowState) {
        this.els.authFlowState.dataset.stage = 'email';
        this.els.authFlowState.textContent = 'Passo 1 de 2 · Introduza o e-mail.';
      }
      this.clearLoginErrors();
      this.setLoginSecurityMessage('', 'info');
    },

    async prepareAdaptivePasswordStage() {
      const email = this.els.loginEmail.value.trim().toLowerCase();
      this.clearLoginErrors();
      this.setLoginSecurityMessage('', 'info');

      if (!this.updateAuthSecurityUI()) return false;
      if (!this.isAllowedProfileEmail?.(email)) {
        this.setFieldError('loginEmail', 'Utilize um endereço de e-mail @ilunion.es.');
        this.setLoginSecurityMessage('Introduza um endereço válido do domínio @ilunion.es.', 'info');
        return false;
      }

      const profile = await AppDB.get('profiles', email);
      const creating = !profile;
      originalSetLoginMode.call(this, creating ? 'create' : 'login');
      this.state.authFlowStage = 'password';

      this.els.loginEmail.readOnly = true;
      this.els.loginEmail.setAttribute('aria-readonly', 'true');
      this.els.loginPassword.required = true;
      this.els.authPasswordStage?.classList.remove('is-hidden');
      this.els.changeLoginEmail?.classList.remove('is-hidden');

      if (this.els.loginModeHint) {
        this.els.loginModeHint.textContent = creating
          ? 'Primeiro acesso neste dispositivo. Crie agora a palavra-passe desta aplicação e confirme-a.'
          : 'Introduza a palavra-passe desta aplicação para entrar.';
      }
      if (this.els.authFlowState) {
        this.els.authFlowState.dataset.stage = creating ? 'create' : 'login';
        this.els.authFlowState.textContent = creating
          ? 'Passo 2 de 2 · Definir palavra-passe da aplicação.'
          : 'Passo 2 de 2 · Introduzir palavra-passe.';
      }
      if (this.els.loginSubmit) {
        this.els.loginSubmit.textContent = creating ? 'Criar palavra-passe e entrar' : 'Entrar';
      }

      requestAnimationFrame(() => this.els.loginPassword?.focus());
      return true;
    },

    async handleLogin(event) {
      event.preventDefault();
      if (this.state.authFlowStage !== 'password') {
        await this.prepareAdaptivePasswordStage();
        return;
      }
      return originalHandleLogin.call(this, event);
    },

    logout(reason = 'manual') {
      const result = originalLogout.call(this, reason);
      this.resetAdaptiveAuthFlow();
      if (reason === 'idle') {
        this.setLoginSecurityMessage('Sessão bloqueada por inatividade. Introduza novamente o e-mail e a palavra-passe da aplicação.', 'info');
      }
      return result;
    },
  });
})();
