'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const shell = fs.readFileSync(path.join(root, 'js/app-shell.js'), 'utf8');
const sw = fs.readFileSync(path.join(root, 'service-worker.js'), 'utf8');
const refresh = fs.readFileSync(path.join(root, 'js/app-sw-refresh.js'), 'utf8');

for (const id of ['loginModeLogin','loginModeCreate','loginConfirmPassword','passwordStrength','connectionSecurityStatus','loginSecurityMessage']) {
  assert.match(index, new RegExp(`id=["']${id}["']`), `Controlo de autenticação em falta: ${id}`);
}

assert.match(index, /Acesso à aplicação/i, 'O ambiente deve ser identificado como acesso à aplicação.');
assert.match(index, /Não utilize a palavra-passe empresarial/i, 'O ecrã deve impedir reutilização da palavra-passe empresarial.');
assert.match(index, /Bloqueio automático após 15 min/i, 'O ecrã deve informar o bloqueio por inatividade.');
assert.match(index, /css\/auth-security\.css/, 'O CSS de segurança do login deve ser carregado.');

assert.match(shell, /minNewPasswordLength:\s*12/, 'Novos perfis devem exigir pelo menos 12 caracteres.');
assert.match(shell, /passwordIterations:\s*210000/, 'Novos hashes devem usar a iteração reforçada definida para o protótipo.');
assert.match(shell, /maxFailedAttempts:\s*5/, 'Deve existir limite local de tentativas falhadas.');
assert.match(shell, /lockoutMs:\s*5\s*\*\s*60\s*\*\s*1000/, 'O bloqueio local deve ter duração definida.');
assert.match(shell, /idleMs:\s*15\s*\*\s*60\s*\*\s*1000/, 'A sessão deve bloquear após 15 minutos de inatividade.');
assert.match(shell, /state\.authMode === 'create'/, 'Login e criação de acesso devem continuar separados internamente.');
assert.match(shell, /Dados de acesso inválidos neste dispositivo\./, 'Falhas de login devem usar mensagem neutra.');
assert.match(shell, /window\.isSecureContext/, 'A gestão de perfis deve verificar contexto seguro.');
assert.match(shell, /window\.crypto\?\.subtle/, 'A gestão de perfis deve exigir Web Crypto.');
assert.match(shell, /clearLocalSession\(\)/, 'Deve existir limpeza explícita da sessão local transitória.');
assert.equal(/localStorage[^\n;]*(?:password|passwordHash|passwordSalt)/i.test(shell), false, 'Credenciais não podem ser gravadas em localStorage.');

assert.match(sw, /registo-avarias-v3\.8\.0/, 'O cache PWA deve ser atualizado para V3.8.0.');
assert.match(sw, /\.\/css\/auth-security\.css/, 'O CSS de segurança deve estar no cache offline.');
assert.match(sw, /\.\/js\/app-auth-domain\.js/, 'A política de domínio deve estar no cache offline.');
assert.match(sw, /\.\/js\/app-auth-adaptive\.js/, 'O fluxo adaptativo deve estar no cache offline.');
assert.match(sw, /\.\/js\/app-sw-refresh\.js/, 'A atualização do PWA deve estar no cache offline.');
assert.match(refresh, /updateViaCache:\s*'none'/, 'O Service Worker deve ignorar cache HTTP ao procurar atualizações.');
assert.match(refresh, /controllerchange/, 'Uma nova versão do Service Worker deve poder assumir o controlo da página.');
assert.match(refresh, /registoAvariasSwReloadedV38/, 'A recarga automática deve usar a chave da versão atual.');
assert.match(sw, /cache:\s*'no-store'/, 'Recursos críticos online devem procurar a versão atual.');
assert.match(sw, /event\.request\.destination === 'script'/, 'Scripts devem usar estratégia de atualização prioritária pela rede.');
assert.match(sw, /event\.request\.destination === 'style'/, 'CSS deve usar estratégia de atualização prioritária pela rede.');

console.log('Auth security tests: OK');
