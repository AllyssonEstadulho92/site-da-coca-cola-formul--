'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const jsDir = path.join(root, 'js');
const files = fs.readdirSync(jsDir).filter(name => name.endsWith('.js')).map(name => path.join(jsDir, name));
files.push(path.join(root, 'service-worker.js'));

for (const file of files) {
  execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
}

console.log(`Syntax tests: OK (${files.length} ficheiros)`);
