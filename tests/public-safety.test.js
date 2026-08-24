'use strict';

const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

const demo = read('js/app-demo.js');
const invalidEmails = demo.match(/[A-Z0-9._%+-]+@example\.invalid/gi) || [];
assert.ok(invalidEmails.length >= 4, 'Os dados DEMO devem usar endereços example.invalid.');
assert.equal(/@(gmail|outlook|hotmail|yahoo|ilunion|coca-cola|ccep)\./i.test(demo), false, 'O módulo DEMO não pode conter domínios reais/corporativos.');
assert.ok(/demo:\s*true/.test(demo), 'Os registos de demonstração devem ser explicitamente marcados como demo.');

const gitignore = read('.gitignore');
for (const expected of [
  'formularios-operacionais-backup-*.json',
  'formularios-operacionais-backup-encriptado-*.json',
  'formularios-operacionais-registos-*.csv',
  'registo-avarias-backup-*.json',
  'registo-avarias-backup-encriptado-*.json',
  'registos-avarias-*.csv'
]) {
  assert.ok(gitignore.includes(expected), `.gitignore deve proteger ${expected}.`);
}

const index = read('index.html');
assert.ok(/Content-Security-Policy/i.test(index), 'index.html deve definir Content Security Policy.');
assert.ok(/script-src 'self'/i.test(index), 'A CSP deve restringir scripts à própria origem.');
assert.equal(/script-src[^;]*'unsafe-inline'/i.test(index), false, 'Scripts inline não devem ser permitidos pela CSP.');
assert.ok(/name="referrer" content="no-referrer"/i.test(index), 'index.html deve aplicar política no-referrer.');

const highRiskPatterns = [
  { name: 'private key', regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { name: 'GitHub classic token', regex: /\bghp_[A-Za-z0-9]{20,}\b/ },
  { name: 'GitHub fine-grained token', regex: /\bgithub_pat_[A-Za-z0-9_]{20,}\b/ },
  { name: 'Slack token', regex: /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/ },
  { name: 'Google API key', regex: /\bAIza[0-9A-Za-z_-]{30,}\b/ },
];

const scanExtensions = new Set(['.js', '.json', '.html', '.css', '.md', '.yml', '.yaml']);
const excludedDirs = new Set(['.git', 'node_modules', 'coverage', 'dist']);

function walk(directory) {
  const output = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (excludedDirs.has(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...walk(full));
    else if (scanExtensions.has(path.extname(entry.name).toLowerCase())) output.push(full);
  }
  return output;
}

for (const file of walk(root)) {
  const content = fs.readFileSync(file, 'utf8');
  for (const pattern of highRiskPatterns) {
    assert.equal(pattern.regex.test(content), false, `${pattern.name} potencial encontrado em ${path.relative(root, file)}.`);
  }
}

console.log(`Public safety tests: OK (${invalidEmails.length} e-mails DEMO validados)`);
