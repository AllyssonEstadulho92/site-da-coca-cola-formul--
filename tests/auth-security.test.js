'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const shell = fs.readFileSync(path.join(root, 'js/app-shell.js'), 'utf8');
const sw = fs.readFileSync(path.join(root, 'service-worker.js'), 'utf8');

for (const id of ['loginModeLogin','loginModeCreate','loginConfirmPassword','passwordStrength','connectionSecurityStatus','loginSecurityMessage']) {
  assert.match(index, new RegExp(`id=["']${id}["']`), `Controlo de autenticação em falta: ${id}`);
}

assert.match(index, /Protótipo local/i, 'O ambiente deve ser identificado como protótipo local.');
assert.match(index, /Não utilize dados reais de clientes/i, 'O aviso deve impedir utilização de dados reais no protótipo público.');
assert.match(index, /Bloqueio após 15 min de inatividade/i, 'O ecrã deve informar o bloqueio por inatividade.');
assert.match(index, /css\/auth-security\.css/, 'O CSS de segurança do login deve ser carregado.');

assert.match(shell, /minNewPasswordLength:\s*12/, 'Novos perfis devem exigir pelo menos 12 caracteres.');
assert.match(shell, /passwordIterations:\s*210000/, 'Novos hashes devem usar a iteração reforçada definida para o protótipo.');
assert.match(shell, /maxFailedAttempts:\s*5/, 'Deve existir limite local de tentativas falhadas.');
assert.match(shell, /lockoutMs:\s*5\s*\*\s*60\s*\*\s*1000/, 'O bloqueio local deve ter duração definida.');
assert.match(shell, /idleMs:\s*15\s*\*\s*60\s*\*\s*1000/, 'A sessão deve bloquear após 15 minutos de inatividade.');
assert.match(shell, /state\.authMode === 'create'/, 'Login e criação de perfil devem ser fluxos distintos.');
assert.match(shell, /Dados de acesso inválidos neste dispositivo\./, 'Falhas de login devem usar mensagem neutra.');
assert.match(shell, /window\.isSecureContext/, 'A gestão de perfis deve verificar contexto seguro.');
assert.match(shell, /window\.crypto\?\.subtle/, 'A gestão de perfis deve exigir Web Crypto.');
assert.match(shell, /clearLocalSession\(\)/, 'Deve existir limpeza explícita da sessão local transitória.');
assert.equal(/localStorage[^\n;]*(?:password|passwordHash|passwordSalt)/i.test(shell), false, 'Credenciais não podem ser gravadas em localStorage.');

assert.match(sw, /registo-avarias-v3\.4\.0/, 'O cache PWA deve ser atualizado para V3.4.0.');
assert.match(sw, /\.\/css\/auth-security\.css/, 'O CSS de segurança deve estar no cache offline.');

console.log('Auth security tests: OK');
