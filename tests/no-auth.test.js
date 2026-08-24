'use strict';
const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');const root=path.resolve(__dirname,'..');const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const index=read('index.html');const shell=read('js/app-shell.js');const profile=read('js/app-profile-help.js');const db=read('js/db.js');const sw=read('service-worker.js');
assert.equal(/id=["']loginView["']/.test(index),false);assert.equal(/id=["']loginForm["']/.test(index),false);assert.equal(/type=["']password["']/.test(index),false);assert.equal(/app-auth-(?:domain|adaptive)\.js/.test(index),false);assert.equal(/auth-security\.css/.test(index),false);
assert.match(index,/Protótipo sem autenticação/i);assert.match(index,/Não utilize dados reais de clientes, informação SAP ou informação interna\/confidencial/i);
assert.match(shell,/initializeLocalOperator\(\)/);assert.match(shell,/this\.enterApp\(\)/);assert.match(shell,/email:'local-user'/);assert.equal(/handleLogin|derivePasswordHash|passwordHash|passwordSalt|authPolicy/.test(shell),false);assert.equal(/Alterar palavra-passe|Terminar sessão/i.test(profile),false);assert.match(profile,/Acesso.*Direto.*sem autenticação/is);
assert.match(db,/DB_VERSION=6/);assert.match(db,/appVersion:'6\.2\.0'/);assert.match(db,/deleteObjectStore\('profiles'\)/);assert.equal(/getAll\('profiles'\)/.test(db),false);assert.equal(/objectStore\('profiles'\)\.put/.test(db),false);
assert.match(sw,/formularios-operacionais-v6\.2\.0/);assert.equal(/app-auth-(?:domain|adaptive)\.js/.test(sw),false);assert.equal(/auth-security\.css/.test(sw),false);
console.log('No-auth tests V6.2.0: OK');
