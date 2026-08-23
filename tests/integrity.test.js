'use strict';
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const refs = [
  ...index.matchAll(/(?:src|href)="([^"#?]+)"/g),
].map(match => match[1]).filter(ref => !/^(?:https?:|mailto:|data:)/.test(ref));

for (const ref of refs) {
  const target = path.resolve(root, ref.replace(/^\.\//, ''));
  assert.equal(fs.existsSync(target), true, `Referência inexistente no index.html: ${ref}`);
}

const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
assert.equal(Boolean(manifest.name), true, 'manifest.json sem name');
assert.equal(Boolean(manifest.start_url), true, 'manifest.json sem start_url');

const sw = fs.readFileSync(path.join(root, 'service-worker.js'), 'utf8');
const swRefs = [...sw.matchAll(/'\.\/([^']+)'/g)].map(match => match[1]);
for (const ref of swRefs) {
  if (!ref || ref === '') continue;
  const target = path.resolve(root, ref);
  assert.equal(fs.existsSync(target), true, `Recurso inexistente no cache do Service Worker: ${ref}`);
}

console.log(`Integrity tests: OK (${refs.length} refs HTML, ${swRefs.length} refs SW)`);
