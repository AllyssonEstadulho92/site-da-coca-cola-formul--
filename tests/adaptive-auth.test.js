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

assert.match(index, /<h1 id="loginTitle">Entrar na aplicação<\/h1>/i, 'O ecrã deve apresentar uma ação de entrada clara.');
assert.match(index, /id="loginSubmit"[^>]*>Continuar</i, 'O primeiro passo deve apresentar Continuar.');
assert.match(index, /Palavra-passe do acesso local/i, 'A palavra-passe deve ser identificada como acesso local.');
assert.match(index, /Não utilize a palavra-passe da conta empresarial/i, 'O ecrã deve desaconselhar explicitamente a palavra-passe empresarial.');
assert.equal(/class="auth-mode-switch/.test(index), false, 'A escolha visual Entrar/Criar perfil deve ser removida do ecrã.');
assert.match(index, /id="changeLoginEmail"[^>]*>Usar outro e-mail</i, 'O fluxo deve permitir regressar e alterar o e-mail.');
assert.match(index, /js\/app-auth-adaptive\.js/, 'O módulo adaptativo deve ser carregado.');
assert.match(index, /js\/app-sw-refresh\.js/, 'O módulo de atualização do PWA deve ser carregado.');
assert.ok(index.indexOf('js/app-auth-domain.js') < index.indexOf('js/app-auth-adaptive.js'), 'O módulo adaptativo deve carregar depois da política de domínio.');
assert.ok(index.indexOf('js/app-auth-adaptive.js') < index.indexOf('js/app-sw-refresh.js'), 'O módulo de atualização deve carregar depois do fluxo de autenticação.');
assert.ok(index.indexOf('js/app-sw-refresh.js') < index.indexOf('js/app.js'), 'Os módulos de acesso devem carregar antes do arranque da aplicação.');

assert.match(adaptive, /AppDB\.get\('profiles', email\)/, 'O fluxo deve verificar localmente se o acesso já existe.');
assert.match(adaptive, /const creating = !profile/, 'A configuração inicial deve ser determinada automaticamente pela existência do perfil local.');
assert.match(adaptive, /originalSetLoginMode\.call\(this, creating \? 'create' : 'login'\)/, 'O modo interno deve ser escolhido automaticamente.');
assert.match(adaptive, /this\.state\.authFlowStage = 'email'/, 'O fluxo deve começar na etapa de e-mail.');
assert.match(adaptive, /this\.state\.authFlowStage = 'password'/, 'O fluxo deve avançar para a etapa de palavra-passe.');
assert.match(adaptive, /loginEmail\.readOnly = true/, 'O e-mail deve ficar bloqueado durante a segunda etapa.');
assert.match(adaptive, /Configurar acesso e entrar/, 'O primeiro acesso deve usar uma ação clara e não a expressão perfil de teste.');
assert.match(adaptive, /Acesso encontrado neste dispositivo/, 'O retorno ao sistema deve indicar que existe acesso local.');

assert.match(sw, /registo-avarias-v3\.7\.0/, 'O cache PWA deve corresponder à V3.7.0.');
assert.match(sw, /\.\/js\/app-auth-adaptive\.js/, 'O módulo adaptativo deve estar disponível offline após cache válido.');
assert.match(sw, /\.\/js\/app-sw-refresh\.js/, 'O módulo de atualização deve estar disponível offline após cache válido.');

console.log('Adaptive auth tests: OK');
