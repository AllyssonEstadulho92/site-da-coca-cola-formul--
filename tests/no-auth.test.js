'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

const index = read('index.html');
const shell = read('js/app-shell.js');
const profile = read('js/app-profile-help.js');
const db = read('js/db.js');
const sw = read('service-worker.js');

assert.equal(/id=["']loginView["']/.test(index), false, 'O ecrã de login não pode existir.');
assert.equal(/id=["']loginForm["']/.test(index), false, 'O formulário de login não pode existir.');
assert.equal(/type=["']password["']/.test(index), false, 'O documento principal não pode pedir palavra-passe.');
assert.equal(/app-auth-(?:domain|adaptive)\.js/.test(index), false, 'Módulos de autenticação não podem ser carregados.');
assert.equal(/auth-security\.css/.test(index), false, 'CSS exclusivo de autenticação não pode ser carregado.');
assert.match(index, /Protótipo sem autenticação/i, 'O utilizador deve ser informado de que não existe autenticação.');

assert.match(shell, /initializeLocalOperator\(\)/, 'A aplicação deve inicializar uma identificação local sem autenticação.');
assert.match(shell, /this\.enterApp\(\)/, 'A aplicação deve abrir diretamente após inicialização.');
assert.match(shell, /email:\s*'local-user'/, 'A auditoria deve usar um identificador local genérico.');
assert.equal(/handleLogin|derivePasswordHash|passwordHash|passwordSalt|authPolicy/.test(shell), false, 'O shell não pode conter lógica de autenticação.');

assert.equal(/Alterar palavra-passe|Terminar sessão/i.test(profile), false, 'A área de identificação não pode conter controlos de autenticação.');
assert.match(profile, /Acesso.*Direto.*sem autenticação/is, 'A área de identificação deve explicar o acesso direto.');

assert.match(db, /DB_VERSION\s*=\s*4/, 'A base local deve estar na versão 4 para suportar imagens manuais.');
assert.match(db, /deleteObjectStore\('profiles'\)/, 'A migração deve continuar a remover a store antiga de perfis.');
assert.equal(/getAll\('profiles'\)/.test(db), false, 'Backups novos não podem exportar perfis de autenticação.');
assert.equal(/objectStore\('profiles'\)\.put/.test(db), false, 'Restauros não podem recriar perfis de autenticação.');

assert.match(sw, /registo-avarias-v4\.4\.0/, 'O cache PWA deve corresponder à V4.4.0.');
assert.equal(/app-auth-(?:domain|adaptive)\.js/.test(sw), false, 'O cache PWA não pode conter módulos de autenticação.');
assert.equal(/auth-security\.css/.test(sw), false, 'O cache PWA não pode conter CSS de autenticação.');

console.log('No-auth tests: OK');