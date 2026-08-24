'use strict';
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const directories = ['assets', 'css', 'js'];
const files = ['index.html', 'manifest.json', 'service-worker.js'];

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const directory of directories) {
  fs.cpSync(path.join(root, directory), path.join(dist, directory), { recursive: true });
}
for (const file of files) {
  fs.copyFileSync(path.join(root, file), path.join(dist, file));
}

// Fallback simples para GitHub Pages; a navegação interna usa hash routes.
fs.copyFileSync(path.join(root, 'index.html'), path.join(dist, '404.html'));

const marker = {
  build: 'equipment-catalog-v5',
  generatedAt: new Date().toISOString(),
  files: files.length,
  directories
};
fs.writeFileSync(path.join(dist, 'build-info.json'), JSON.stringify(marker, null, 2));
console.log(`Static build created at ${dist}`);
