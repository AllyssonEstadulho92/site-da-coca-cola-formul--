(() => {
  'use strict';

  const validationLabel = status => ({
    MODEL_DOCUMENTED:'Validado por modelo',
    FAMILY_DOCUMENTED:'Validado por família',
    SOURCE_IDENTIFIED:'Fonte identificada',
    UNVALIDATED:'Por validar'
  })[status] || 'Por validar';

  const validationTone = status => ({
    MODEL_DOCUMENTED:'ok', FAMILY_DOCUMENTED:'info', SOURCE_IDENTIFIED:'neutral', UNVALIDATED:'warning'
  })[status] || 'warning';

  function referencePosition(reference) {
    const index = reference?.tile;
    if (!Number.isInteger(index)) return null;
    const col = index % 10;
    const row = Math.floor(index / 10);
    return { x:`${(col * 100 / 9).toFixed(4)}%`, y:`${(row * 100 / 5).toFixed(4)}%` };
  }

  function imageHtml(app, item, context = 'card') {
    const userImage = app.equipmentManualImage?.(item.id);
    if (userImage?.dataUrl) {
      return `<div class="eq5-image eq5-image-${context} is-user">
        <img src="${app.escapeAttr(userImage.dataUrl)}" alt="Fotografia real de ${app.escapeAttr(item.name)}" loading="lazy" />
        <span class="eq5-image-source">Fotografia real</span>
      </div>`;
    }
    const pos = referencePosition(item.referenceImage);
    if (item.referenceImage && pos) {
      return `<div class="eq5-image eq5-image-${context} is-reference">
        <span class="eq5-reference-sprite" role="img" aria-label="Referência visual de ${app.escapeAttr(item.name)}" style="--eq5-x:${pos.x};--eq5-y:${pos.y}"></span>
        <span class="eq5-image-source">Referência visual</span>
      </div>`;
    }
    return `<div class="eq5-image eq5-image-${context} is-empty" role="img" aria-label="Sem fotografia para ${app.escapeAttr(item.name)}">
      <span aria-hidden="true">◇</span><small>Sem imagem autorizada</small>
    </div>`;
  }

  function stat(label, value) {
    return `<div class="eq5-stat"><strong>${value}</strong><span>${label}</span></div>`;
  }

  function header(app, counts) {
    return `<header class="eq5-header">
      <div class="eq5-header-copy">
        <p class="eyebrow">Catálogo técnico operacional</p>
        <h3>Equipamentos</h3>
        <p>Consulte rapidamente modelos, características, documentação e sintomas validados.</p>
      </div>
      <div class="eq5-stats" aria-label="Resumo do catálogo">
        ${stat('equipamentos', counts.total)}
        ${stat('categorias', counts.categories)}
        ${stat('com documentos', counts.withDocuments)}
        ${stat('com foto real', counts.withUserPhoto)}
      </div>
    </header>`;
  }

  function toolbar(app, store, filters, resultCount) {
    const categories = ['ALL', ...store.categories()];
    const manufacturers = store.manufacturers();
    const categoryLabel = value => value === 'ALL' ? 'Todos' : value;
    return `<section class="eq5-toolbar" aria-label="Pesquisa e filtros de equipamentos">
      <div class="eq5-search-row">
        <label class="eq5-search">
          <span class="sr-only">Pesquisar equipamentos</span>
          <span aria-hidden="true">⌕</span>
          <input id="equipmentV5Search" type="search" autocomplete="off" placeholder="Pesquisar nome, modelo, código, fabricante ou tipo…" value="${app.escapeAttr(filters.search || '')}" />
        </label>
        <label class="eq5-sort">
          <span class="sr-only">Ordenar equipamentos</span>
          <select id="equipmentV5Sort">
            <option value="name-asc" ${filters.sort==='name-asc'?'selected':''}>Nome A–Z</option>
            <option value="name-desc" ${filters.sort==='name-desc'?'selected':''}>Nome Z–A</option>
            <option value="category" ${filters.sort==='category'?'selected':''}>Categoria</option>
            <option value="manufacturer" ${filters.sort==='manufacturer'?'selected':''}>Fabricante</option>
            <option value="recent" ${filters.sort==='recent'?'selected':''}>Recentemente atualizado</option>
          </select>
        </label>
      </div>

      <div class="eq5-category-chips" role="group" aria-label="Categorias">
        ${categories.map(value => `<button type="button" class="${filters.category===value?'active':''}" data-eq5-category="${app.escapeAttr(value)}" aria-pressed="${filters.category===value}">${app.escape(categoryLabel(value))}</button>`).join('')}
      </div>

      <details class="eq5-more-filters" ${filters.moreOpen ? 'open' : ''}>
        <summary>Mais filtros</summary>
        <div class="eq5-filter-grid">
          <label><span>Fabricante</span><select id="equipmentV5Manufacturer"><option value="ALL">Todos</option>${manufacturers.map(value=>`<option value="${app.escapeAttr(value)}" ${filters.manufacturer===value?'selected':''}>${app.escape(value)}</option>`).join('')}</select></label>
          <label><span>Fotografia</span><select id="equipmentV5Photo"><option value="ALL">Todas</option><option value="USER" ${filters.photo==='USER'?'selected':''}>Com fotografia real</option><option value="REFERENCE" ${filters.photo==='REFERENCE'?'selected':''}>Só referência visual</option><option value="MISSING" ${filters.photo==='MISSING'?'selected':''}>Sem imagem</option></select></label>
          <label><span>Documentação</span><select id="equipmentV5Documents"><option value="ALL">Todos</option><option value="WITH" ${filters.documents==='WITH'?'selected':''}>Com documentos</option><option value="WITHOUT" ${filters.documents==='WITHOUT'?'selected':''}>Sem documentos</option></select></label>
          <label><span>Sintomas</span><select id="equipmentV5Symptoms"><option value="ALL">Todos</option><option value="DOCUMENTED" ${filters.symptoms==='DOCUMENTED'?'selected':''}>Com sintomas documentados</option><option value="UNVALIDATED" ${filters.symptoms==='UNVALIDATED'?'selected':''}>Sintomas por validar</option></select></label>
          <label><span>Validação</span><select id="equipmentV5Validation"><option value="ALL">Todos</option><option value="MODEL_DOCUMENTED" ${filters.validation==='MODEL_DOCUMENTED'?'selected':''}>Validado por modelo</option><option value="FAMILY_DOCUMENTED" ${filters.validation==='FAMILY_DOCUMENTED'?'selected':''}>Validado por família</option><option value="SOURCE_IDENTIFIED" ${filters.validation==='SOURCE_IDENTIFIED'?'selected':''}>Fonte identificada</option><option value="UNVALIDATED" ${filters.validation==='UNVALIDATED'?'selected':''}>Por validar</option></select></label>
        </div>
      </details>

      <div class="eq5-result-row">
        <span aria-live="polite"><strong>${resultCount}</strong> equipamento${resultCount===1?'':'s'} encontrado${resultCount===1?'':'s'}</span>
        <button type="button" class="eq5-clear" data-eq5-clear>Limpar filtros</button>
      </div>
    </section>`;
  }

  function factPreview(app, item) {
    const entries = Object.entries(item.specifications || {}).filter(([,value]) => value && value !== '—').slice(0, 3);
    if (!entries.length) return '<span class="eq5-no-facts">Dados técnicos por confirmar</span>';
    return `<dl class="eq5-card-facts">${entries.map(([key,value])=>`<div><dt>${app.escape(key)}</dt><dd>${app.escape(value)}</dd></div>`).join('')}</dl>`;
  }

  function symptomBadge(app, item) {
    if (!item.symptoms.length) return '<span class="eq5-status-chip warning">Sintomas por validar</span>';
    const suffix = item.validationStatus === 'MODEL_DOCUMENTED' ? 'validados' : 'por família';
    return `<span class="eq5-status-chip ${validationTone(item.validationStatus)}">${item.symptoms.length} sintoma${item.symptoms.length===1?'':'s'} ${suffix}</span>`;
  }

  function card(app, item) {
    const userImage = app.equipmentManualImage?.(item.id);
    const manufacturer = item.manufacturer || 'Fabricante por confirmar';
    const symptoms = item.symptoms.slice(0, 2);
    return `<article class="eq5-card">
      <button type="button" class="eq5-card-image-button" data-equipment-image="${app.escapeAttr(item.id)}" aria-label="${userImage?.dataUrl ? 'Alterar fotografia real de' : 'Adicionar fotografia real para'} ${app.escapeAttr(item.name)}">
        ${imageHtml(app, item, 'card')}
      </button>
      <div class="eq5-card-content">
        <div class="eq5-card-topline"><span class="eq5-category">${app.escape(item.category)}</span><code>${app.escape(item.code)}</code></div>
        <div class="eq5-card-title"><h4>${app.escape(item.name)}</h4><p>${app.escape(item.model)} · ${app.escape(manufacturer)}</p></div>
        <p class="eq5-description">${app.escape(item.shortDescription)}</p>
        ${factPreview(app, item)}
        <div class="eq5-card-symptoms">
          ${symptomBadge(app, item)}
          ${symptoms.length ? `<div>${symptoms.map(value=>`<span>${app.escape(value.name)}</span>`).join('')}${item.symptoms.length>2?`<small>+${item.symptoms.length-2} outros</small>`:''}</div>` : ''}
        </div>
        <div class="eq5-card-actions">
          <button type="button" class="btn btn-secondary btn-small" data-eq5-open="${app.escapeAttr(item.id)}">Ver equipamento</button>
          ${!userImage?.dataUrl ? `<button type="button" class="eq5-photo-link" data-equipment-image="${app.escapeAttr(item.id)}">Adicionar fotografia</button>` : ''}
        </div>
      </div>
    </article>`;
  }

  function grid(app, items) {
    if (!items.length) return `<div class="eq5-empty"><span aria-hidden="true">⌕</span><h4>Nenhum equipamento corresponde aos filtros selecionados.</h4><button type="button" class="btn btn-secondary" data-eq5-clear>Limpar filtros</button></div>`;
    return `<section class="eq5-grid" aria-label="Lista de equipamentos">${items.map(item=>card(app,item)).join('')}</section>`;
  }

  function sourceLink(app, store, sourceId, sourceSection = '') {
    const source = store.sources[sourceId];
    if (!source) return '<span>Fonte não registada</span>';
    const section = sourceSection ? ` · ${app.escape(sourceSection)}` : '';
    if (!source.url) return `<span>${app.escape(source.title)}${section}</span>`;
    return `<a href="${app.escapeAttr(source.url)}" target="_blank" rel="noopener noreferrer">${app.escape(source.title)}${section} ↗</a>`;
  }

  function overviewTab(app, store, item) {
    const sourceLinks = item.sourceIds.length ? item.sourceIds.map(id=>sourceLink(app,store,id)).join('') : '<span>Não validado para este modelo.</span>';
    return `<div class="eq5-detail-section">
      <h4>Visão geral</h4>
      <p class="eq5-detail-description">${app.escape(item.shortDescription)}</p>
      <dl class="eq5-overview-list">
        <div><dt>Modelo</dt><dd>${app.escape(item.model)}</dd></div>
        ${item.manufacturer ? `<div><dt>Fabricante</dt><dd>${app.escape(item.manufacturer)}</dd></div>` : ''}
        <div><dt>Categoria</dt><dd>${app.escape(item.category)}</dd></div>
        <div><dt>Tipo</dt><dd>${app.escape(item.type)}</dd></div>
        <div><dt>Estado</dt><dd><span class="eq5-status-chip ${validationTone(item.validationStatus)}">${validationLabel(item.validationStatus)}</span></dd></div>
      </dl>
      <div class="eq5-source-block"><strong>Fonte principal</strong>${sourceLinks}<small>${app.escape(item.validationNote || '')}</small></div>
    </div>`;
  }

  function specificationsTab(app, item) {
    const rows = Object.entries(item.specifications || {}).filter(([,value]) => value && value !== '—');
    return `<div class="eq5-detail-section"><h4>Especificações</h4>${rows.length ? `<div class="eq5-spec-table" role="table" aria-label="Especificações técnicas">${rows.map(([key,value])=>`<div role="row"><span role="cell">${app.escape(key)}</span><strong role="cell">${app.escape(value)}</strong></div>`).join('')}</div>` : '<div class="eq5-validation-empty">Não validado para este modelo.</div>'}<p class="eq5-detail-note">Mostrar apenas dados presentes nas fontes associadas. A placa técnica do equipamento instalado prevalece.</p></div>`;
  }

  function symptomsTab(app, store, item) {
    if (!item.symptoms.length) return `<div class="eq5-detail-section"><h4>Sintomas</h4><div class="eq5-validation-empty"><strong>Não validado para este modelo.</strong><span>Não existe relação documental suficiente entre sintomas e este modelo nas fontes atualmente registadas.</span></div></div>`;
    return `<div class="eq5-detail-section"><div class="eq5-detail-heading"><div><h4>Sintomas</h4><p>Sintoma observado não é diagnóstico. As causas abaixo são apenas possibilidades documentadas.</p></div><span class="eq5-status-chip ${validationTone(item.validationStatus)}">${validationLabel(item.validationStatus)}</span></div>
      <div class="eq5-symptom-list">${item.symptoms.map(symptom=>`<article class="eq5-symptom-card">
        <div class="eq5-symptom-title"><span>Sintoma observado</span><h5>${app.escape(symptom.name)}</h5><p>${app.escape(symptom.observableDescription)}</p></div>
        ${symptom.triageQuestions.length ? `<div><strong>Perguntas úteis durante a chamada</strong><ul>${symptom.triageQuestions.map(value=>`<li>${app.escape(value)}</li>`).join('')}</ul></div>` : ''}
        ${symptom.safeChecks.length ? `<div><strong>Verificações básicas permitidas</strong><ul>${symptom.safeChecks.map(value=>`<li>${app.escape(value)}</li>`).join('')}</ul></div>` : ''}
        ${symptom.possibleCauses.length ? `<div class="eq5-possible-causes"><strong>Possíveis causas documentadas — não são diagnóstico</strong><ul>${symptom.possibleCauses.map(value=>`<li>${app.escape(value)}</li>`).join('')}</ul></div>` : ''}
        <div class="eq5-escalation"><strong>Escalar assistência</strong><span>${symptom.requiresTechnicalService ? 'Sim — se o sintoma persistir ou exigir acesso técnico.' : 'Conforme procedimento aplicável.'}</span></div>
        <footer><strong>Fonte</strong>${sourceLink(app,store,symptom.sourceId,symptom.sourceSection)}${symptom.note?`<small>${app.escape(symptom.note)}</small>`:''}</footer>
      </article>`).join('')}</div>
    </div>`;
  }

  function documentsTab(app, store, item) {
    const docs = item.documents;
    const sourceEntries = item.sourceIds.map(id=>store.sources[id]).filter(Boolean);
    return `<div class="eq5-detail-section"><h4>Documentação</h4>
      ${docs.length ? `<div class="eq5-doc-list">${docs.map(doc=>`<article><div><strong>${app.escape(doc.name)}</strong><span>${app.escape(doc.type)}${doc.manufacturer?` · ${app.escape(doc.manufacturer)}`:''}</span></div>${doc.url?`<a href="${app.escapeAttr(doc.url)}" target="_blank" rel="noopener noreferrer">Abrir ↗</a>`:'<span>Sem URL pública</span>'}</article>`).join('')}</div>` : '<div class="eq5-validation-empty">Sem documento associado a este modelo.</div>'}
      ${sourceEntries.length ? `<div class="eq5-source-list"><h5>Fontes registadas</h5>${sourceEntries.map(source=>`<div><strong>${app.escape(source.organization)}</strong><span>${app.escape(source.title)}</span><small>Consulta: ${app.escape(source.consultedAt || '—')} · ${app.escape(source.validationLevel || '—')}</small>${source.url?`<a href="${app.escapeAttr(source.url)}" target="_blank" rel="noopener noreferrer">Abrir fonte ↗</a>`:''}</div>`).join('')}</div>`:''}
    </div>`;
  }

  function photosTab(app, item) {
    const userImage = app.equipmentManualImage?.(item.id);
    return `<div class="eq5-detail-section"><h4>Fotografias</h4>
      <div class="eq5-photo-grid">
        <div><span>Fotografia real</span>${userImage?.dataUrl ? imageHtml(app,item,'detail') : '<div class="eq5-photo-empty">Ainda não adicionada.</div>'}<button type="button" class="btn btn-secondary" data-equipment-image="${app.escapeAttr(item.id)}">${userImage?.dataUrl?'Substituir fotografia':'Adicionar fotografia'}</button>${userImage?.dataUrl?`<button type="button" class="eq5-remove-photo" data-equipment-image-remove="${app.escapeAttr(item.id)}">Remover</button>`:''}</div>
        <div><span>Referência visual</span>${item.referenceImage ? imageHtml({...app,equipmentManualImage:()=>null},item,'detail') : '<div class="eq5-photo-empty">Sem referência visual.</div>'}<small>${app.escape(item.referenceImage?.source || 'Sem imagem autorizada.')}</small></div>
      </div>
      <div class="eq5-copyright-note"><strong>Prioridade visual</strong><span>A fotografia real adicionada neste dispositivo tem prioridade. Não copiar automaticamente imagens protegidas da Internet.</span></div>
    </div>`;
  }

  function detailBody(app, store, item, tab) {
    if (tab === 'specifications') return specificationsTab(app,item);
    if (tab === 'symptoms') return symptomsTab(app,store,item);
    if (tab === 'documents') return documentsTab(app,store,item);
    if (tab === 'photos') return photosTab(app,item);
    return overviewTab(app,store,item);
  }

  function drawer(app, store, item, tab) {
    if (!item) return '';
    const tabs = [['overview','Visão geral'],['specifications','Especificações'],['symptoms','Sintomas'],['documents','Documentação'],['photos','Fotografias']];
    return `<div class="eq5-drawer-overlay" data-eq5-close aria-hidden="true"></div><aside class="eq5-drawer is-open" id="equipmentV5Drawer" aria-label="Ficha de ${app.escapeAttr(item.name)}">
      <header class="eq5-drawer-header">
        <button type="button" class="eq5-drawer-close" data-eq5-close aria-label="Fechar ficha">×</button>
        <div class="eq5-drawer-hero">${imageHtml(app,item,'drawer')}<div><span class="eq5-category">${app.escape(item.category)}</span><h3>${app.escape(item.name)}</h3><p>${app.escape(item.model)}${item.manufacturer?` · ${app.escape(item.manufacturer)}`:''}</p><code>${app.escape(item.code)}</code></div></div>
      </header>
      <nav class="eq5-detail-tabs" role="tablist" aria-label="Secções da ficha">${tabs.map(([key,label])=>`<button type="button" role="tab" data-eq5-tab="${key}" class="${tab===key?'active':''}" aria-selected="${tab===key}">${label}</button>`).join('')}</nav>
      <div class="eq5-drawer-body">${detailBody(app,store,item,tab)}</div>
      <footer class="eq5-drawer-actions"><button type="button" class="btn btn-secondary" data-equipment-image="${app.escapeAttr(item.id)}">${app.equipmentManualImage?.(item.id)?.dataUrl?'Alterar fotografia':'Adicionar fotografia'}</button><button type="button" class="btn btn-primary" data-equipment-new="${app.escapeAttr(item.id)}">+ Criar Registo</button></footer>
    </aside>`;
  }

  window.EquipmentComponentsV5 = Object.freeze({ header, toolbar, grid, drawer, imageHtml, validationLabel, validationTone });
})();
