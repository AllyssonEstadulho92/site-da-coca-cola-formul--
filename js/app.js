(() => {
  'use strict';
  window.addEventListener('DOMContentLoaded', () => {
    if (!window.App || !window.AppDB || !window.AppCore) {
      console.error('A aplicação não conseguiu carregar os módulos essenciais.');
      return;
    }
    window.App.init().catch(error => {
      console.error(error);
      const container = document.getElementById('viewContainer');
      if (container) container.innerHTML = '<div class="empty-state"><strong>Não foi possível iniciar a aplicação.</strong><span>Atualize a página. Se o problema persistir, verifique a consola e o armazenamento do browser.</span></div>';
    });
  });
})();
