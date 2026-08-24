(() => {
  'use strict';

  if (!window.App || !window.EquipmentStoreV5 || !window.EquipmentComponentsV5) return;

  const store = window.EquipmentStoreV5;
  const ui = window.EquipmentComponentsV5;
  const defaultFilters = () => ({search:'',category:'ALL',manufacturer:'ALL',photo:'ALL',documents:'ALL',symptoms:'ALL',validation:'ALL',sort:'name-asc',moreOpen:false});

  Object.assign(window.App, {
    equipmentCatalogItems(){ return store.items; },
    renderEquipment(){ return this.renderEquipmentV5(); },
    renderEquipmentCatalog(){ return this.renderEquipmentV5(); },

    equipmentV5SourceHtml(item, context='section') {
      const sourceIds = new Set(item.sourceIds || []);
      if (context === 'symptoms') (item.symptoms || []).forEach(symptom => symptom.sourceId && sourceIds.add(symptom.sourceId));
      if (context === 'photos') {
        const manual = this.equipmentManualImage?.(item.id);
        return `<div class="eq5-section-source"><strong>Fonte desta secção</strong><span>${manual?.dataUrl ? 'Fotografia real adicionada localmente neste dispositivo. ' : ''}${item.referenceImage ? 'A referência visual do catálogo é uma imagem gerada no projeto e não uma fotografia oficial do fabricante.' : 'Sem imagem de referência.'}</span></div>`;
      }
      const entries = [...sourceIds].map(id => store.sources[id]).filter(Boolean);
      if (!entries.length) return `<div class="eq5-section-source is-unvalidated"><strong>Fonte desta secção</strong><span>Sem fonte técnica pública suficientemente específica para este modelo. Não inferir dados.</span></div>`;
      return `<div class="eq5-section-source"><strong>Fontes desta secção</strong><div>${entries.map(source => source.url ? `<a href="${this.escapeAttr(source.url)}" target="_blank" rel="noopener noreferrer">${this.escape(source.organization)} — ${this.escape(source.title)} ↗</a>` : `<span>${this.escape(source.organization)} — ${this.escape(source.title)}</span>`).join('')}</div><small>Consulta: ${this.escape(entries[0]?.consultedAt || '2026-08-24')} · usar apenas no âmbito documentado pela fonte.</small></div>`;
    },

    decorateEquipmentV5Sources(items, selected) {
      document.querySelectorAll('.eq5-card').forEach(card => {
        const id = card.querySelector('[data-eq5-open]')?.dataset.eq5Open;
        const item = items.find(entry => entry.id === id);
        const actions = card.querySelector('.eq5-card-actions');
        if (!item || !actions || card.querySelector('.eq5-card-source')) return;
        const first = (item.sourceIds || []).map(sourceId => store.sources[sourceId]).find(Boolean);
        const source = document.createElement('div');
        source.className = `eq5-card-source ${first ? '' : 'is-unvalidated'}`;
        source.textContent = first ? `Fonte: ${first.organization}` : 'Sem fonte técnica pública confirmada';
        actions.before(source);
      });

      if (!selected) return;
      const section = document.querySelector('.eq5-drawer-body .eq5-detail-section');
      if (!section || section.querySelector('.eq5-section-source')) return;
      section.insertAdjacentHTML('beforeend', this.equipmentV5SourceHtml(selected, this.state.equipmentV5Tab || 'overview'));
    },

    renderEquipmentV5() {
      if (!this.state.equipmentV5Filters) this.state.equipmentV5Filters = defaultFilters();
      if (!this.state.equipmentImages) this.state.equipmentImages = {};
      if (!this.state.equipmentV5Tab) this.state.equipmentV5Tab = 'overview';
      const filters = this.state.equipmentV5Filters;
      const items = store.query(filters, this.state.equipmentImages);
      const counts = store.counts(this.state.equipmentImages);
      const selected = this.state.equipmentV5SelectedId ? store.getById(this.state.equipmentV5SelectedId) : null;

      this.els.viewContainer.innerHTML = `<div class="eq5-page">
        ${ui.header(this, counts)}
        <div class="eq5-public-note" role="note"><strong>Protótipo sem autenticação</strong><span>Não utilizar dados reais de clientes, informação SAP ou informação interna/confidencial.</span></div>
        ${ui.toolbar(this, store, filters, items.length)}
        ${ui.grid(this, items)}
        ${ui.drawer(this, store, selected, this.state.equipmentV5Tab)}
      </div>`;
      this.decorateEquipmentV5Sources(items, selected);
      this.bindEquipmentV5Actions();
    },

    bindEquipmentV5Actions() {
      const rerender = () => this.renderEquipmentV5();
      const filters = this.state.equipmentV5Filters;
      const search = document.getElementById('equipmentV5Search');
      search?.addEventListener('input', event => {
        filters.search = event.target.value;
        clearTimeout(this.state.equipmentV5SearchTimer);
        this.state.equipmentV5SearchTimer = setTimeout(() => {
          this.renderEquipmentV5();
          const next = document.getElementById('equipmentV5Search');
          if (next) { next.focus(); next.setSelectionRange(next.value.length,next.value.length); }
        },90);
      });
      document.getElementById('equipmentV5Sort')?.addEventListener('change',event=>{filters.sort=event.target.value;rerender();});
      document.getElementById('equipmentV5Manufacturer')?.addEventListener('change',event=>{filters.manufacturer=event.target.value;rerender();});
      document.getElementById('equipmentV5Photo')?.addEventListener('change',event=>{filters.photo=event.target.value;rerender();});
      document.getElementById('equipmentV5Documents')?.addEventListener('change',event=>{filters.documents=event.target.value;rerender();});
      document.getElementById('equipmentV5Symptoms')?.addEventListener('change',event=>{filters.symptoms=event.target.value;rerender();});
      document.getElementById('equipmentV5Validation')?.addEventListener('change',event=>{filters.validation=event.target.value;rerender();});
      document.querySelectorAll('[data-eq5-category]').forEach(button=>button.addEventListener('click',()=>{filters.category=button.dataset.eq5Category;rerender();}));
      document.querySelectorAll('[data-eq5-clear]').forEach(button=>button.addEventListener('click',()=>{this.state.equipmentV5Filters=defaultFilters();rerender();}));
      document.querySelectorAll('[data-eq5-open]').forEach(button=>button.addEventListener('click',()=>{this.state.equipmentV5SelectedId=button.dataset.eq5Open;this.state.equipmentV5LastFocus=button.dataset.eq5Open;this.state.equipmentV5Tab='overview';rerender();requestAnimationFrame(()=>document.querySelector('.eq5-drawer-close')?.focus());}));
      document.querySelectorAll('[data-eq5-close]').forEach(button=>button.addEventListener('click',()=>this.closeEquipmentV5Drawer()));
      document.querySelectorAll('[data-eq5-tab]').forEach(button=>button.addEventListener('click',()=>{this.state.equipmentV5Tab=button.dataset.eq5Tab;rerender();requestAnimationFrame(()=>document.querySelector(`[data-eq5-tab="${this.state.equipmentV5Tab}"]`)?.focus());}));
      document.querySelectorAll('[data-equipment-image]').forEach(button=>button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();this.pickEquipmentImage?.(button.dataset.equipmentImage);}));
      document.querySelectorAll('[data-equipment-image-remove]').forEach(button=>button.addEventListener('click',event=>{event.preventDefault();this.removeEquipmentImage?.(button.dataset.equipmentImageRemove);}));
      document.querySelectorAll('[data-equipment-new]').forEach(button=>button.addEventListener('click',()=>this.startRecordFromCatalog?.(button.dataset.equipmentNew)));
      if (!this.state.equipmentV5EscapeBound) {
        document.addEventListener('keydown',event=>{if(event.key==='Escape'&&this.state.equipmentV5SelectedId&&this.state.route==='equipment')this.closeEquipmentV5Drawer();});
        this.state.equipmentV5EscapeBound=true;
      }
    },

    closeEquipmentV5Drawer() {
      const focusId=this.state.equipmentV5LastFocus;
      this.state.equipmentV5SelectedId='';
      this.state.equipmentV5Tab='overview';
      this.renderEquipmentV5();
      if(focusId)requestAnimationFrame(()=>document.querySelector(`[data-eq5-open="${focusId}"]`)?.focus());
    }
  });
})();
