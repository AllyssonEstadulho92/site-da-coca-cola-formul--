'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const domainModule = fs.readFileSync(path.join(root, 'js/app-auth-domain.js'), 'utf8');
const sw = fs.readFileSync(path.join(root, 'service-worker.js'), 'utf8');

assert.match(index, /placeholder="nome@ilunion\.es"/i, 'O login deve indicar o domínio permitido.');
assert.match(index, /Aceita apenas o domínio @ilunion\.es/i, 'O ecrã deve explicar a restrição de domínio.');
assert.match(index, /Não utilize a palavra-passe da conta empresarial/i, 'O ecrã deve desencorajar a reutilização da palavra-passe corporativa.');
assert.match(index, /js\/app-auth-domain\.js/, 'O módulo de domínio deve ser carregado no frontend.');
assert.ok(index.indexOf('js/app-shell.js') < index.indexOf('js/app-auth-domain.js'), 'O módulo de domínio deve carregar depois do shell base.');
assert.ok(index.indexOf('js/app-auth-domain.js') < index.indexOf('js/app.js'), 'O módulo de domínio deve carregar antes do arranque da aplicação.');

assert.match(domainModule, /ALLOWED_EMAIL_DOMAIN\s*=\s*'ilunion\.es'/, 'O domínio permitido deve estar definido de forma explícita.');
assert.match(domainModule, /\^\[\^@\\s\]\+@ilunion\\\.es\$/, 'A validação deve exigir exatamente @ilunion.es.');
assert.match(domainModule, /restoreSession\(\)/, 'Sessões restauradas também devem ser sujeitas à política de domínio.');
assert.match(domainModule, /clearLocalSession\(\)/, 'Sessões incompatíveis devem ser removidas.');
assert.match(sw, /registo-avarias-v3\.6\.0/, 'O cache PWA deve corresponder à V3.6.0.');
assert.match(sw, /\.\/js\/app-auth-domain\.js/, 'A política de domínio deve funcionar offline após cache válido.');

const session = new Map();
const app = {
  state: {},
  els: {
    loginEmail: { value: '', placeholder: '', pattern: '', title: '' },
    loginModeHint: { textContent: '' },
  },
  handleLogin() { return 'base-login'; },
  restoreSession() { return 'base-restore'; },
  setLoginMode(mode) { this.state.authMode = mode === 'create' ? 'create' : 'login'; return this.state.authMode; },
  clearLocalSession() { session.clear(); },
  setLoginSecurityMessage() {},
  clearLoginErrors() {},
  setFieldError() {},
};

const context = {
  window: { App: app },
  sessionStorage: {
    getItem: key => session.has(key) ? session.get(key) : null,
    setItem: (key, value) => session.set(key, String(value)),
    removeItem: key => session.delete(key),
  },
  console,
};
vm.createContext(context);
vm.runInContext(domainModule, context);

assert.equal(app.isAllowedProfileEmail('utilizador@ilunion.es'), true);
assert.equal(app.isAllowedProfileEmail('UTILIZADOR@ILUNION.ES'), true);
assert.equal(app.isAllowedProfileEmail('utilizador@sub.ilunion.es'), false);
assert.equal(app.isAllowedProfileEmail('utilizador@ilunion.es.example'), false);
assert.equal(app.isAllowedProfileEmail('utilizador@example.com'), false);
assert.equal(app.isAllowedProfileEmail(''), false);

app.setLoginMode('create');
assert.equal(app.els.loginEmail.placeholder, 'nome@ilunion.es');
assert.match(app.els.loginModeHint.textContent, /palavra-passe exclusiva/i);

console.log('Email domain tests: OK');
