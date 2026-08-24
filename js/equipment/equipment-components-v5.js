(() => {
  'use strict';

  function referencePosition(reference) {
    const index = reference?.tile;
    if (!Number.isInteger(index)) return null;
    const col = index % 10;
    const row = Math.floor(index / 10);
    return { x: `${(col * 100 / 9).toFixed(4)}%`, y: `${(row * 100 / 5).toFixed(4)}%` };
  }

  function imageHtml(app, item, context = 'card') {
    const manual = app.equipmentManualImage?.(item.id);
    if (manual?.dataUrl) {
      return `<div class="eq5-image eq5-image-${context} is-user">
        <img src="${app.escapeAttr(manual.dataUrl)}" alt="Fotografia de ${app.escapeAttr(item.name)}" loading="lazy" />
        <span class="eq5-photo-label">Fotografia real</span>
      </div>`;
    }

    const pos = referencePosition(item.referenceImage);
    if (item.referenceImage && pos) {
      return `<div class="eq5-image eq5-image-${context} is-reference">
        <span class="eq5-reference-sprite" role="img" aria-label="Referência visual de ${app.escapeAttr(item.name)}" style="--eq5-x:${pos.x};--eq5-y:${pos.y}"></span>
        <span class="eq5-photo-label">Referência visual</span>
      </div>`;
    }

    return `<div class="eq5-image eq5-image-${context} is-empty" role="img" aria-label="Sem fotografia para ${app.escapeAttr(item.name)}">
      <span aria-hidden="true">◇</span><small>Sem fotografia</small>
    </div>`;
  }

  function header(app, counts) {
    return `<header class="eq5-header">
      <div>
        <p class="eyebrow">Catálogo operacional</p>
        <h3>Equipamentos</h3>
        <p>${counts.total} equipamentos com descrição e sintomas de classificação operacional.</p>
      </div>
    </header>`;
  }

  function toolbar(app, store, filters, resultCount) {
    const categories = ['ALL', ...store.categories()];
    return `<section class="eq5-toolbar" aria-label="Pesquisa de equipamentos">
      <label class="eq5-search">
        <span aria-hidden="true">⌕</span>
        <span class="sr-only">Pesquisar equipamentos</span>
        <input id="equipmentV5Search" type="search" autocomplete="off" placeholder="Pesquisar equipamento, modelo, código, fabricante ou sintoma…" value="${app.escapeAttr(filters.search || '')}" />
      </label>
      <div class="eq5-category-row" role="group" aria-label="Categorias">
        ${categories.map(category => `<button type="button" data-eq5-category="${app.escapeAttr(category)}" class="${filters.category === category ? 'active' : ''}" aria-pressed="${filters.category === category}">${app.escape(category === 'ALL' ? 'Todos' : category)}</button>`).join('')}
      </div>
      <div class="eq5-result-row">
        <span aria-live="polite"><strong>${resultCount}</strong> equipamento${resultCount === 1 ? '' : 's'}</span>
        ${(filters.search || filters.category !== 'ALL') ? '<button type="button" data-eq5-clear>Limpar</button>' : ''}
      </div>
    </section>`;
  }

  const preferredCodes = Object.freeze({
    ESPECIFICO_DISPENSING: ['054', '057', '066'],
    ESPECIFICO_VENDING: ['066', '068', '073'],
    FUNCIONAMENTO_GERAL: ['020', '032', '041']
  });

  function featuredSymptoms(item) {
    const groups = item.operationalSymptomGroups || [];
    const specific = groups.find(group => group.id === 'ESPECIFICO_DISPENSING' || group.id === 'ESPECIFICO_VENDING');
    const selectedGroup = specific || groups.find(group => group.id === 'FUNCIONAMENTO_GERAL') || groups[0];
    if (!selectedGroup) return [];
    const codes = preferredCodes[selectedGroup.id] || [];
    const selected = codes.map(code => selectedGroup.items.find(entry => entry.code === code)).filter(Boolean);
    return (selected.length ? selected : selectedGroup.items.slice(0, 3)).slice(0, 3);
  }

  function symptomPreview(app, item) {
    const featured = featuredSymptoms(item);
    if (!featured.length) return '';
    const remaining = Math.max(0, Number(item.operationalSymptomCount || 0) - featured.length);
    return `<div class="eq5-symptom-preview">
      <strong>Sintomas aplicáveis</strong>
      <div>${featured.map(entry => `<span><b>${app.escape(entry.code)}</b> ${app.escape(entry.symptom)}</span>`).join('')}${remaining ? `<small>+${remaining} outros</small>` : ''}</div>
    </div>`;
  }

  function card(app, item) {
    const manual = app.equipmentManualImage?.(item.id);
    const manufacturer = item.manufacturer || 'Fabricante por confirmar';
    return `<article class="eq5-equipment-card">
      <div class="eq5-card-grid">
        <button type="button" class="eq5-card-media" data-equipment-image="${app.escapeAttr(item.id)}" aria-label="${manual?.dataUrl ? 'Alterar fotografia de' : 'Adicionar fotografia para'} ${app.escapeAttr(item.name)}">
          ${imageHtml(app, item, 'card')}
        </button>
        <div class="eq5-card-content">
          <div class="eq5-card-kicker"><span>${app.escape(item.category)}</span><code>${app.escape(item.code)}</code></div>
          <div class="eq5-card-heading">
            <h4>${app.escape(item.name)}</h4>
            <p>${app.escape(item.model)} · ${app.escape(manufacturer)}</p>
          </div>
          <p class="eq5-card-description">${app.escape(item.catalogDescription || item.shortDescription || '')}</p>
          ${symptomPreview(app, item)}
          <div class="eq5-card-actions">
            <button type="button" class="btn btn-secondary btn-small" data-eq5-open="${app.escapeAttr(item.id)}">Ver ficha</button>
            <button type="button" class="btn btn-primary btn-small" data-equipment-new="${app.escapeAttr(item.id)}">Criar registo</button>
          </div>
        </div>
      </div>
    </article>`;
  }

  function grid(app, items) {
    if (!items.length) {
      return `<div class="eq5-empty"><h4>Nenhum equipamento encontrado.</h4><p>Altere a pesquisa ou a categoria.</p><button type="button" class="btn btn-secondary" data-eq5-clear>Limpar pesquisa</button></div>`;
    }
    return `<section class="eq5-grid" aria-label="Lista de equipamentos">${items.map(item => card(app, item)).join('')}</section>`;
  }

  function operationalSymptoms(app, item) {
    const groups = item.operationalSymptomGroups || [];
    if (!groups.length) return '<p class="eq5-detail-empty">Sem matriz operacional associada.</p>';
    return `<div class="eq5-operational-groups">${groups.map(group => `<section class="eq5-operational-group">
      <div class="eq5-operational-group-heading"><h5>${app.escape(group.title)}</h5><span>${group.items.length}</span></div>
      <div class="eq5-operational-list">${group.items.map(entry => `<div><code>${app.escape(entry.code)}</code><span>${app.escape(entry.symptom)}</span></div>`).join('')}</div>
    </section>`).join('')}</div>`;
  }

  function drawer(app, store, item) {
    if (!item) return '';
    const manual = app.equipmentManualImage?.(item.id);
    const manufacturer = item.manufacturer || 'Fabricante por confirmar';
    return `<div class="eq5-drawer-overlay" data-eq5-close aria-hidden="true"></div>
      <aside class="eq5-drawer" role="dialog" aria-modal="true" aria-label="Ficha de ${app.escapeAttr(item.name)}">
        <button type="button" class="eq5-drawer-close" data-eq5-close aria-label="Fechar">×</button>
        <div class="eq5-drawer-scroll">
          <div class="eq5-detail-grid">
            <div class="eq5-detail-media">
              ${imageHtml(app, item, 'detail')}
              <button type="button" class="btn btn-secondary" data-equipment-image="${app.escapeAttr(item.id)}">${manual?.dataUrl ? 'Alterar fotografia' : 'Adicionar fotografia'}</button>
              ${manual?.dataUrl ? `<button type="button" class="eq5-remove-photo" data-equipment-image-remove="${app.escapeAttr(item.id)}">Remover fotografia</button>` : ''}
            </div>
            <div class="eq5-detail-main">
              <div class="eq5-detail-kicker"><span>${app.escape(item.category)}</span><code>${app.escape(item.code)}</code></div>
              <h3>${app.escape(item.name)}</h3>
              <p class="eq5-detail-model">${app.escape(item.model)} · ${app.escape(manufacturer)}</p>
              <section class="eq5-description-section">
                <h4>Descrição</h4>
                <p class="eq5-detail-description">${app.escape(item.catalogDescription || item.shortDescription || '')}</p>
              </section>
              <section class="eq5-symptoms-section">
                <div class="eq5-section-heading"><div><h4>Sintomas</h4><p>${item.operationalSymptomCount || 0} códigos operacionais aplicáveis a este tipo de equipamento.</p></div></div>
                <p class="eq5-operational-note">Os códigos abaixo servem para classificar o sintoma reportado. Não constituem diagnóstico técnico.</p>
                ${operationalSymptoms(app, item)}
              </section>
            </div>
          </div>
        </div>
        <footer class="eq5-drawer-footer">
          <button type="button" class="btn btn-secondary" data-eq5-close>Fechar</button>
          <button type="button" class="btn btn-primary" data-equipment-new="${app.escapeAttr(item.id)}">+ Criar registo</button>
        </footer>
      </aside>`;
  }

  window.EquipmentComponentsV5 = { header, toolbar, grid, drawer, imageHtml };
})();
