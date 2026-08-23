(() => {
  'use strict';
  Object.assign(window.App, {
    async archiveRecord(id) {
      const record = this.state.records.find(r => r.id === id);
      if (!record) return;
      record.archived = true; record.status = 'ARCHIVED'; record.updatedAt = new Date().toISOString(); record.updatedBy = this.state.user.email;
      await AppDB.put('records', record);
      await this.ensureActivity(record, 'ARCHIVED', 'Registo arquivado');
      this.toast('Registo arquivado.', 'success');
      await this.renderRoute('records');
    },

    async reopenRecord(id) {
      const record = this.state.records.find(r => r.id === id);
      if (!record) return;
      record.archived = false; record.status = 'REGISTERED'; record.updatedAt = new Date().toISOString(); record.updatedBy = this.state.user.email;
      await AppDB.put('records', record);
      await this.ensureActivity(record, 'REOPENED', 'Registo reaberto');
      this.toast('Registo reaberto.', 'success');
      await this.renderRoute('records');
    },
  });
})();
