const CACHE = 'registo-avarias-v3.6.0';
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
  './css/auth-security.css',
  './js/core.js',
  './js/db.js',
  './js/app-base.js',
  './js/app-utils.js',
  './js/app-shell.js',
  './js/app-auth-domain.js',
  './js/app-auth-adaptive.js',
  './js/app-dashboard.js',
  './js/app-form-view.js',
  './js/app-form-logic.js',
  './js/app-form-save.js',
  './js/app-records.js',
  './js/app-record-detail.js',
  './js/app-record-archive.js',
  './js/app-directories.js',
  './js/equipment-data.js',
  './js/app-equipment-catalog.js',
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
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then(response => {
      if (response.ok) caches.open(CACHE).then(cache => cache.put('./index.html', response.clone()));
      return response;
    }).catch(async () => (await caches.match('./index.html')) || new Response(
      '<!doctype html><meta charset="utf-8"><title>Offline</title><p>A aplicação está offline e a página inicial ainda não foi armazenada neste dispositivo.</p>',
      { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    )));
    return;
  }

  event.respondWith(caches.match(event.request).then(cached => {
    if (cached) {
      event.waitUntil(fetch(event.request).then(response => {
        if (response.ok) return caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
      }).catch(() => undefined));
      return cached;
    }
    return fetch(event.request).then(response => {
      if (response.ok) caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
      return response;
    }).catch(() => new Response('Recurso indisponível offline.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }));
  }));
});
