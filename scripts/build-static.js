'use strict';
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const serviceWorkerPath = path.join(root, 'service-worker.js');
const serviceWorker = fs.readFileSync(serviceWorkerPath, 'utf8');

const runtimeFiles = new Set(['index.html', 'manifest.json', 'service-worker.js']);
for (const match of serviceWorker.matchAll(/'\.\/([^']+)'/g)) {
  const relativePath = match[1];
  if (!relativePath || relativePath.endsWith('/')) continue;
  runtimeFiles.add(relativePath);
}

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const relativePath of [...runtimeFiles].sort()) {
  const source = path.join(root, relativePath);
  if (!fs.existsSync(source) || !fs.statSync(source).isFile()) {
    throw new Error(`Recurso de runtime inexistente: ${relativePath}`);
  }
  const target = path.join(dist, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

fs.copyFileSync(path.join(root, 'index.html'), path.join(dist, '404.html'));

const marker = {
  build: 'equipment-catalog-v5',
  generatedAt: new Date().toISOString(),
  totalRuntimeFiles: runtimeFiles.size,
  runtimeFiles: [...runtimeFiles].sort()
};
fs.writeFileSync(path.join(dist, 'build-info.json'), JSON.stringify(marker, null, 2));
console.log(`Static build created at ${dist} (${runtimeFiles.size} runtime files)`);
