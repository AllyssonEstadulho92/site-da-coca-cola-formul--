const CACHE = 'registo-avarias-v3.0.0';
const ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/core.js',
  './js/db.js',
  './js/app.js',
  './manifest.json',
  './assets/app-icon.svg'
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
