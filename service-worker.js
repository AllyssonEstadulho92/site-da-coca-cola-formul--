const CACHE = 'registo-avarias-v4.5.0';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/app-icon.svg',
  './css/styles.css',
  './css/base.css',
  './css/features.css',
  './css/theme.css',
  './css/equipment-catalog.css',
  './css/equipment-images-v41.css',
  './css/equipment-manual-v42.css',
  './css/equipment-upload-hotfix.css',
  './css/equipment-models-v43.css',
  './js/core.js',
  './js/db.js',
  './js/app-base.js',
  './js/app-utils.js',
  './js/app-shell.js',
  './js/app-sw-refresh.js',
  './js/app-dashboard.js',
  './js/app-form-view.js',
  './js/app-form-logic.js',
  './js/app-form-save.js',
  './js/app-records.js',
  './js/app-record-detail.js',
  './js/app-record-archive.js',
  './js/app-directories.js',
  './js/equipment-data.js',
  './js/equipment-directory-v43.js',
  './js/app-equipment-catalog.js',
  './js/app-equipment-catalog-v4.js',
  './js/app-equipment-manual.js',
  './js/app-equipment-default-images.js',
  './js/app-equipment-upload-hotfix.js',
  './js/app-equipment-models-v43.js',
  './js/app-routing-views.js',
  './js/app-activity-productivity.js',
  './js/app-settings.js',
  './js/app-backup.js',
  './js/app-profile-help.js',
  './js/app-demo.js',
  './js/app.js'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

async function networkFirst(request, fallbackKey = request) {
  try {
    const response = await fetch(request, { cache: 'no-store' });
    if (response.ok) {
      const cache = await caches.open(CACHE);
      await cache.put(fallbackKey, response.clone());
    }
    return response;
  } catch {
    return (await caches.match(fallbackKey)) || (await caches.match(request));
  }
}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  const isNavigation = event.request.mode === 'navigate';
  const isCriticalAsset = event.request.destination === 'script' || event.request.destination === 'style';

  if (isNavigation) {
    event.respondWith((async () => {
      const response = await networkFirst(event.request, './index.html');
      return response || new Response(
        '<!doctype html><meta charset="utf-8"><title>Offline</title><p>A aplicação está offline e a página inicial ainda não foi armazenada neste dispositivo.</p>',
        { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    })());
    return;
  }

  if (isCriticalAsset) {
    event.respondWith((async () => {
      const response = await networkFirst(event.request);
      return response || new Response('Recurso indisponível offline.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    })());
    return;
  }

  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok) caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
    return response;
  }).catch(() => new Response('Recurso indisponível offline.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }))));
});
