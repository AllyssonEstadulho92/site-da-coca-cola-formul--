'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const adaptive = fs.readFileSync(path.join(root, 'js/app-auth-adaptive.js'), 'utf8');

assert.match(index, /<h1 id="loginTitle">Entrar<\/h1>/i, 'O título deve ser apenas Entrar.');
assert.match(index, /No primeiro acesso neste dispositivo/i, 'O ecrã deve explicar claramente o primeiro acesso.');
assert.match(index, /Nos acessos seguintes, utilize essa mesma palavra-passe/i, 'O ecrã deve explicar como voltar a entrar.');
assert.match(index, /Palavra-passe da aplicação/i, 'O campo deve distinguir a palavra-passe local da empresarial.');
assert.match(index, /Confirmar nova palavra-passe/i, 'O primeiro acesso deve confirmar a nova palavra-passe.');
assert.match(index, /id="loginSubmit"[^>]*>Continuar<\/button>/i, 'A primeira ação deve ser Continuar.');
assert.match(index, /id="changeLoginEmail"[^>]*>Alterar e-mail<\/button>/i, 'Deve existir forma clara de corrigir o e-mail.');
assert.equal(/Criar perfil de teste/i.test(index), false, 'A expressão Criar perfil de teste não deve aparecer no ecrã.');
assert.equal(/Perfil local @ilunion\.es/i.test(index), false, 'O rodapé antigo de perfil local deve ser removido.');
assert.equal(/Sem SSO corporativo/i.test(index), false, 'O rodapé técnico antigo não deve poluir o ecrã de entrada.');

assert.match(adaptive, /Criar palavra-passe e entrar/, 'O primeiro acesso deve usar uma ação inequívoca.');
assert.match(adaptive, /Introduza a palavra-passe desta aplicação para entrar/, 'O acesso recorrente deve ter instrução direta.');
assert.match(adaptive, /Passo 1 de 2/, 'O fluxo deve indicar a primeira etapa.');
assert.match(adaptive, /Passo 2 de 2/, 'O fluxo deve indicar a segunda etapa.');

console.log('Login copy tests: OK');
