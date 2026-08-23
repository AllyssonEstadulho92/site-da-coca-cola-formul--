'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const adaptive = fs.readFileSync(path.join(root, 'js/app-auth-adaptive.js'), 'utf8');
const sw = fs.readFileSync(path.join(root, 'service-worker.js'), 'utf8');

for (const id of ['authFlowState','authPasswordStage','changeLoginEmail']) {
  assert.match(index, new RegExp(`id=["']${id}["']`), `Elemento do fluxo adaptativo em falta: ${id}`);
}

assert.match(index, /id="loginSubmit"[^>]*>Continuar</i, 'O primeiro passo deve apresentar Continuar.');
assert.match(index, /Palavra-passe exclusiva do protótipo/i, 'A palavra-passe deve ser claramente identificada como exclusiva do protótipo.');
assert.match(index, /nunca a palavra-passe empresarial/i, 'O primeiro acesso deve desaconselhar explicitamente a palavra-passe empresarial.');
assert.match(index, /auth-mode-switch is-hidden/i, 'A escolha manual Entrar/Criar perfil deve ficar oculta no fluxo adaptativo.');
assert.match(index, /js\/app-auth-adaptive\.js/, 'O módulo adaptativo deve ser carregado.');
assert.ok(index.indexOf('js/app-auth-domain.js') < index.indexOf('js/app-auth-adaptive.js'), 'O módulo adaptativo deve carregar depois da política de domínio.');
assert.ok(index.indexOf('js/app-auth-adaptive.js') < index.indexOf('js/app.js'), 'O módulo adaptativo deve carregar antes do arranque da aplicação.');

assert.match(adaptive, /AppDB\.get\('profiles', email\)/, 'O fluxo deve verificar localmente se o perfil já existe.');
assert.match(adaptive, /const creating = !profile/, 'A criação deve ser determinada automaticamente pela existência do perfil local.');
assert.match(adaptive, /originalSetLoginMode\.call\(this, creating \? 'create' : 'login'\)/, 'O modo deve ser escolhido automaticamente.');
assert.match(adaptive, /this\.state\.authFlowStage = 'email'/, 'O fluxo deve começar na etapa de e-mail.');
assert.match(adaptive, /this\.state\.authFlowStage = 'password'/, 'O fluxo deve avançar para a etapa de palavra-passe.');
assert.match(adaptive, /loginEmail\.readOnly = true/, 'O e-mail deve ficar bloqueado durante a segunda etapa para evitar inconsistência de identidade local.');
assert.match(adaptive, /Criar acesso local e entrar/, 'O primeiro acesso deve usar uma ação clara de criação local.');
assert.match(adaptive, /Alterar e-mail/i, 'O fluxo deve permitir regressar e alterar o e-mail.');

assert.match(sw, /registo-avarias-v3\.6\.0/, 'O cache PWA deve corresponder à V3.6.0.');
assert.match(sw, /\.\/js\/app-auth-adaptive\.js/, 'O módulo adaptativo deve estar disponível offline após cache válido.');

console.log('Adaptive auth tests: OK');
