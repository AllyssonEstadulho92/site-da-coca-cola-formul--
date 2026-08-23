(() => {
  'use strict';

  if (!window.App) return;

  const ALLOWED_EMAIL_DOMAIN = 'ilunion.es';
  const originalHandleLogin = window.App.handleLogin;
  const originalRestoreSession = window.App.restoreSession;
  const originalSetLoginMode = window.App.setLoginMode;

  Object.assign(window.App, {
    allowedProfileDomain: ALLOWED_EMAIL_DOMAIN,

    isAllowedProfileEmail(email) {
      const value = String(email || '').trim().toLowerCase();
      return /^[^@\s]+@ilunion\.es$/.test(value);
    },

    setLoginMode(mode) {
      const result = originalSetLoginMode.call(this, mode);
      const creating = this.state.authMode === 'create';
      if (this.els.loginEmail) {
        this.els.loginEmail.placeholder = 'nome@ilunion.es';
        this.els.loginEmail.pattern = '[^@\\s]+@ilunion\\.es';
        this.els.loginEmail.title = 'Utilize um endereço @ilunion.es';
      }
      if (this.els.loginModeHint) {
        this.els.loginModeHint.textContent = creating
          ? 'Crie um perfil de teste com um endereço @ilunion.es. Use uma palavra-passe exclusiva deste protótipo — nunca a palavra-passe corporativa.'
          : 'Entre com um perfil local @ilunion.es já criado neste browser.';
      }
      return result;
    },

    restoreSession() {
      const raw = sessionStorage.getItem('registoAvariasUser');
      if (raw) {
        try {
          const session = JSON.parse(raw);
          if (!this.isAllowedProfileEmail(session?.email)) {
            this.clearLocalSession();
            this.setLoginSecurityMessage('A sessão local foi removida porque o perfil não pertence ao domínio permitido @ilunion.es.', 'info');
            return;
          }
        } catch {
          this.clearLocalSession();
          return;
        }
      }
      return originalRestoreSession.call(this);
    },

    async handleLogin(event) {
      event.preventDefault();
      const email = this.els.loginEmail.value.trim().toLowerCase();
      if (!this.isAllowedProfileEmail(email)) {
        this.clearLoginErrors();
        this.setFieldError('loginEmail', 'Utilize um endereço de e-mail @ilunion.es.');
        this.setLoginSecurityMessage('Este protótipo aceita apenas perfis locais associados ao domínio @ilunion.es.', 'info');
        return;
      }
      return originalHandleLogin.call(this, event);
    },
  });
})();
