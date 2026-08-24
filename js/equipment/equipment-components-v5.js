(() => {
  'use strict';

  const validationLabel = status => ({
    MODEL_DOCUMENTED: 'Validado por modelo',
    FAMILY_DOCUMENTED: 'Validado por família',
    SOURCE_IDENTIFIED: 'Fonte identificada',
    UNVALIDATED: 'Por validar'
  })[status] || 'Por validar';

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
        <p class="eyebrow">Catálogo técnico</p>
        <h3>Equipamentos</h3>
        <p>${counts.total} equipamentos organizados por categoria.</p>
      </div>
    </header>`;
  }

  function toolbar(app, store, filters, resultCount) {
    const categories = ['ALL', ...store.categories()];
    return `<section class="eq5-toolbar" aria-label="Pesquisa de equipamentos">
      <label class="eq5-search">
        <span aria-hidden="true">⌕</span>
        <span class="sr-only">Pesquisar equipamentos</span>
        <input id="equipmentV5Search" type="search" autocomplete="off" placeholder="Pesquisar equipamento, modelo, código ou sintoma…" value="${app.escapeAttr(filters.search || '')}" />
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

  function factPreview(app, item) {
    const rows = Object.entries(item.specifications || {}).filter(([, value]) => value && value !== '—').slice(0, 2);
    if (!rows.length) return '';
    return `<dl class="eq5-facts">${rows.map(([label, value]) => `<div><dt>${app.escape(label)}</dt><dd>${app.escape(value)}</dd></div>`).join('')}</dl>`;
  }

  function operationalSummary(item) {
    const count = Number(item.operationalSymptomCount || 0);
    return `<span class="eq5-operational-summary">${count} código${count === 1 ? '' : 's'} operacional${count === 1 ? '' : 'is'}</span>`;
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
          ${item.shortDescription ? `<p class="eq5-card-description">${app.escape(item.shortDescription)}</p>` : ''}
          ${factPreview(app, item)}
          <div class="eq5-card-status">${operationalSummary(item)}${item.symptoms?.length ? `<span>${item.symptoms.length} sintoma${item.symptoms.length === 1 ? '' : 's'} técnico${item.symptoms.length === 1 ? '' : 's'}</span>` : ''}</div>
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

  function detailFacts(app, item) {
    const rows = Object.entries(item.specifications || {}).filter(([, value]) => value && value !== '—');
    if (!rows.length) return '<p class="eq5-detail-empty">Sem dados técnicos confirmados para este modelo.</p>';
    return `<dl class="eq5-detail-facts">${rows.map(([label, value]) => `<div><dt>${app.escape(label)}</dt><dd>${app.escape(value)}</dd></div>`).join('')}</dl>`;
  }

  function detailOperationalSymptoms(app, item) {
    const groups = item.operationalSymptomGroups || [];
    if (!groups.length) return '<p class="eq5-detail-empty">Sem códigos operacionais associados.</p>';
    return `<div class="eq5-operational-block">
      <p class="eq5-section-note">Matriz operacional fornecida ao projeto. A associação é feita pela categoria do equipamento e não constitui diagnóstico técnico.</p>
      <div class="eq5-operational-groups">${groups.map(group => `<details class="eq5-op-group">
        <summary><span>${app.escape(group.title)}</span><small>${group.items.length} código${group.items.length === 1 ? '' : 's'}</small></summary>
        <div class="eq5-op-table" role="table" aria-label="${app.escapeAttr(group.title)}">
          ${group.items.map(entry => `<div role="row"><code role="cell">${app.escape(entry.code)}</code><span role="cell">${app.escape(entry.symptom)}</span></div>`).join('')}
        </div>
      </details>`).join('')}</div>
    </div>`;
  }

  function detailTechnicalSymptoms(app, item) {
    if (!item.symptoms?.length) return '';
    return `<section><h4>Sintomas técnicos documentados</h4><div class="eq5-detail-symptoms">${item.symptoms.map(symptom => `<article><strong>${app.escape(symptom.name)}</strong>${symptom.observableDescription ? `<p>${app.escape(symptom.observableDescription)}</p>` : ''}</article>`).join('')}</div></section>`;
  }

  function detailDocuments(app, item) {
    if (!item.documents?.length) return '<p class="eq5-detail-empty">Sem documentação associada.</p>';
    return `<div class="eq5-detail-docs">${item.documents.map(doc => doc.url ? `<a href="${app.escapeAttr(doc.url)}" target="_blank" rel="noopener noreferrer"><span>${app.escape(doc.name)}</span><small>${app.escape(doc.type || 'Documento')}</small></a>` : `<div class="eq5-doc-static"><span>${app.escape(doc.name)}</span><small>${app.escape(doc.type || 'Documento')}</small></div>`).join('')}</div>`;
  }

  function drawer(app, store, item) {
    if (!item) return '';
    const manual = app.equipmentManualImage?.(item.id);
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
              <p class="eq5-detail-model">${app.escape(item.model)}${item.manufacturer ? ` · ${app.escape(item.manufacturer)}` : ''}</p>
              ${item.shortDescription ? `<p class="eq5-detail-description">${app.escape(item.shortDescription)}</p>` : ''}
              <div class="eq5-detail-meta">${operationalSummary(item)}<span>${app.escape(validationLabel(item.validationStatus))}</span></div>

              <section><h4>Ficha técnica</h4>${detailFacts(app, item)}</section>
              <section><h4>Sintomas operacionais</h4>${detailOperationalSymptoms(app, item)}</section>
              ${detailTechnicalSymptoms(app, item)}
              <section><h4>Documentação</h4>${detailDocuments(app, item)}</section>
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
