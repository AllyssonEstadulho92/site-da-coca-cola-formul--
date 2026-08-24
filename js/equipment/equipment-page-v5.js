(() => {
  'use strict';

  if (!window.App || !window.EquipmentStoreV5 || !window.EquipmentComponentsV5) return;

  const store = window.EquipmentStoreV5;
  const ui = window.EquipmentComponentsV5;
  const defaultFilters = () => ({
    search: '',
    category: 'ALL',
    manufacturer: 'ALL',
    photo: 'ALL',
    documents: 'ALL',
    symptoms: 'ALL',
    validation: 'ALL',
    sort: 'name-asc'
  });

  Object.assign(window.App, {
    equipmentCatalogItems() { return store.items; },
    renderEquipment() { return this.renderEquipmentV5(); },
    renderEquipmentCatalog() { return this.renderEquipmentV5(); },

    renderEquipmentV5() {
      if (!this.state.equipmentV5Filters) this.state.equipmentV5Filters = defaultFilters();
      if (!this.state.equipmentImages) this.state.equipmentImages = {};

      const filters = this.state.equipmentV5Filters;
      const items = store.query(filters, this.state.equipmentImages);
      const counts = store.counts(this.state.equipmentImages);
      const selected = this.state.equipmentV5SelectedId ? store.getById(this.state.equipmentV5SelectedId) : null;

      this.els.viewContainer.innerHTML = `<div class="eq5-page">
        ${ui.header(this, counts)}
        ${ui.toolbar(this, store, filters, items.length)}
        ${ui.grid(this, items)}
        ${ui.drawer(this, store, selected)}
      </div>`;

      this.bindEquipmentV5Actions();
    },

    bindEquipmentV5Actions() {
      const filters = this.state.equipmentV5Filters;
      const rerender = () => this.renderEquipmentV5();
      const search = document.getElementById('equipmentV5Search');

      search?.addEventListener('input', event => {
        filters.search = event.target.value;
        clearTimeout(this.state.equipmentV5SearchTimer);
        this.state.equipmentV5SearchTimer = setTimeout(() => {
          this.renderEquipmentV5();
          const next = document.getElementById('equipmentV5Search');
          if (next) {
            next.focus();
            next.setSelectionRange(next.value.length, next.value.length);
          }
        }, 90);
      });

      document.querySelectorAll('[data-eq5-category]').forEach(button => {
        button.addEventListener('click', () => {
          filters.category = button.dataset.eq5Category;
          rerender();
        });
      });

      document.querySelectorAll('[data-eq5-clear]').forEach(button => {
        button.addEventListener('click', () => {
          this.state.equipmentV5Filters = defaultFilters();
          rerender();
        });
      });

      document.querySelectorAll('[data-eq5-open]').forEach(button => {
        button.addEventListener('click', () => {
          this.state.equipmentV5SelectedId = button.dataset.eq5Open;
          this.state.equipmentV5LastFocus = button.dataset.eq5Open;
          rerender();
          requestAnimationFrame(() => document.querySelector('.eq5-drawer-close')?.focus());
        });
      });

      document.querySelectorAll('[data-eq5-close]').forEach(button => {
        button.addEventListener('click', () => this.closeEquipmentV5Drawer());
      });

      document.querySelectorAll('[data-equipment-image]').forEach(button => {
        button.addEventListener('click', event => {
          event.preventDefault();
          event.stopPropagation();
          this.pickEquipmentImage?.(button.dataset.equipmentImage);
        });
      });

      document.querySelectorAll('[data-equipment-image-remove]').forEach(button => {
        button.addEventListener('click', event => {
          event.preventDefault();
          this.removeEquipmentImage?.(button.dataset.equipmentImageRemove);
        });
      });

      document.querySelectorAll('[data-equipment-new]').forEach(button => {
        button.addEventListener('click', () => this.startRecordFromCatalog?.(button.dataset.equipmentNew));
      });

      if (!this.state.equipmentV5EscapeBound) {
        document.addEventListener('keydown', event => {
          if (event.key === 'Escape' && this.state.equipmentV5SelectedId && this.state.route === 'equipment') {
            this.closeEquipmentV5Drawer();
          }
        });
        this.state.equipmentV5EscapeBound = true;
      }
    },

    closeEquipmentV5Drawer() {
      const focusId = this.state.equipmentV5LastFocus;
      this.state.equipmentV5SelectedId = '';
      this.renderEquipmentV5();
      if (focusId) requestAnimationFrame(() => document.querySelector(`[data-eq5-open="${focusId}"]`)?.focus());
    }
  });
})();
