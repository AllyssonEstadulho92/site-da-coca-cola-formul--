(() => {
  'use strict';

  if (!window.App) return;

  Object.assign(window.App, {
    registerServiceWorker() {
      if (!('serviceWorker' in navigator) || !/^https?:$/.test(location.protocol)) return;

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        const key = 'registoAvariasSwReloadedV50';
        if (sessionStorage.getItem(key) === '1') return;
        sessionStorage.setItem(key, '1');
        location.reload();
      }, { once: true });

      navigator.serviceWorker.register('./service-worker.js', { updateViaCache: 'none' })
        .then(registration => registration.update().catch(() => undefined))
        .catch(error => console.warn('Service Worker:', error));
    },
  });
})();