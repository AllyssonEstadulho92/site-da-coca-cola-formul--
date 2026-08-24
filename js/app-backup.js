(() => {
  'use strict';
  Object.assign(window.App, {
    async exportBackup() {
      try {
        const payload = await AppDB.exportAll();
        const filename = `formularios-operacionais-backup-${this.localDateInput(new Date())}.json`;
        this.downloadBlob(new Blob([JSON.stringify(payload, null, 2)], { type:'application/json' }), filename);
        this.toast('Backup JSON exportado.', 'success');
      } catch (error) {
        console.error(error);
        this.toast('Não foi possível exportar o backup.', 'error');
      }
    },

    async exportEncryptedBackup() {
      const password = document.getElementById('backupEncryptionPassword')?.value || '';
      const confirm = document.getElementById('backupEncryptionConfirm')?.value || '';
      if (password.length < 10) return this.toast('Use uma palavra-passe de backup com pelo menos 10 caracteres.', 'error');
      if (password !== confirm) return this.toast('As palavras-passe do backup não coincidem.', 'error');
      try {
        const payload = await AppDB.exportAll();
        const encrypted = await this.encryptBackupPayload(payload, password);
        const filename = `formularios-operacionais-backup-encriptado-${this.localDateInput(new Date())}.json`;
        this.downloadBlob(new Blob([JSON.stringify(encrypted, null, 2)], { type:'application/json' }), filename);
        document.getElementById('backupEncryptionPassword').value = '';
        document.getElementById('backupEncryptionConfirm').value = '';
        this.toast('Backup encriptado exportado.', 'success');
      } catch (error) {
        console.error(error);
        this.toast('Falha ao criar o backup encriptado.', 'error');
      }
    },

    async encryptBackupPayload(payload, password) {
      if (!crypto.subtle) throw new Error('Web Crypto indisponível.');
      const encoder = new TextEncoder();
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const iterations = 180000;
      const material = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']);
      const key = await crypto.subtle.deriveKey({ name:'PBKDF2', hash:'SHA-256', salt, iterations }, material, { name:'AES-GCM', length:256 }, false, ['encrypt']);
      const ciphertext = await crypto.subtle.encrypt({ name:'AES-GCM', iv }, key, encoder.encode(JSON.stringify(payload)));
      return {
        format: 'registo-avarias-encrypted-backup',
        version: 1,
        algorithm: 'AES-GCM-256',
        kdf: 'PBKDF2-SHA256',
        iterations,
        createdAt: new Date().toISOString(),
        salt: this.bytesToBase64(salt),
        iv: this.bytesToBase64(iv),
        ciphertext: this.bytesToBase64(new Uint8Array(ciphertext)),
      };
    },

    async decryptBackupPayload(wrapper, password) {
      if (!wrapper || wrapper.format !== 'registo-avarias-encrypted-backup') throw new Error('Formato encriptado inválido.');
      if (!crypto.subtle) throw new Error('Web Crypto indisponível.');
      const encoder = new TextEncoder();
      const material = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey']);
      const salt = this.base64ToBytes(wrapper.salt);
      const iv = this.base64ToBytes(wrapper.iv);
      const key = await crypto.subtle.deriveKey({ name:'PBKDF2', hash:'SHA-256', salt, iterations:Number(wrapper.iterations || 180000) }, material, { name:'AES-GCM', length:256 }, false, ['decrypt']);
      const plaintext = await crypto.subtle.decrypt({ name:'AES-GCM', iv }, key, this.base64ToBytes(wrapper.ciphertext));
      return JSON.parse(new TextDecoder().decode(plaintext));
    },

    bytesToBase64(bytes) {
      let binary = '';
      const chunk = 0x8000;
      for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
      return btoa(binary);
    },

    base64ToBytes(value) {
      const binary = atob(String(value || ''));
      return Uint8Array.from(binary, c => c.charCodeAt(0));
    },

    async handleRestoreFile(event) {
      const file = event.target.files?.[0];
      event.target.value = '';
      if (!file) return;
      try {
        const raw = await file.text();
        let payload = JSON.parse(raw);
        if (payload?.format === 'registo-avarias-encrypted-backup') {
          const password = window.prompt('Introduza a palavra-passe deste backup encriptado:');
          if (!password) return;
          try { payload = await this.decryptBackupPayload(payload, password); }
          catch { return this.toast('Não foi possível desencriptar o backup. Verifique a palavra-passe e o ficheiro.', 'error'); }
        }
        AppDB.validateBackup(payload);
        this.confirm('Restaurar backup', `O ficheiro contém ${(payload.records || []).length} registos. Os dados locais atuais serão substituídos. Será criado primeiro um snapshot de segurança.`, async () => {
          try {
            await AppDB.createSnapshot('Antes do restauro de ficheiro');
            await AppDB.importAll(payload);
            await this.loadSettings();
            await this.loadData();
            this.state.snapshots = await AppDB.getSnapshots();
            this.toast('Backup restaurado com sucesso.', 'success');
            this.navigate('dashboard');
          } catch (error) {
            console.error(error);
            this.toast(`Não foi possível restaurar: ${error.message}`, 'error');
          }
        });
      } catch (error) {
        console.error(error);
        this.toast('Ficheiro de backup inválido ou danificado.', 'error');
      }
    },

    async createLocalSnapshot() {
      try {
        const snapshot = await AppDB.createSnapshot('Snapshot manual');
        this.state.snapshots = await AppDB.getSnapshots();
        this.toast(`Snapshot criado às ${this.formatTime(snapshot.createdAt)}.`, 'success');
        if (this.state.route === 'settings') this.renderSettings();
      } catch (error) {
        console.error(error);
        this.toast('Não foi possível criar o snapshot.', 'error');
      }
    },

    async restoreLocalSnapshot(id) {
      try {
        await AppDB.createSnapshot('Antes do restauro de snapshot');
        await AppDB.restoreSnapshot(id);
        await this.loadSettings();
        await this.loadData();
        this.state.snapshots = await AppDB.getSnapshots();
        this.toast('Snapshot restaurado.', 'success');
        this.navigate('dashboard');
      } catch (error) {
        console.error(error);
        this.toast('Falha ao restaurar o snapshot.', 'error');
      }
    },

    exportCsv(records = this.state.records.filter(r => !r.archived)) {
      const columns = [
        ['ID','displayId'],['Data','occurrenceDate'],['Agente','agentName'],['Nº Contribuinte','taxpayerNumber'],['Cliente','clientName'],['Nome Contacto','contactName'],['Contacto','customerContact'],['Estabelecimento','establishmentName'],['Morada','address'],['Localidade','locality'],['Horário','openingHours'],['REF Equipamento','equipmentReference'],['Tipo Equipamento','equipmentType'],['Categoria','faultCategory'],['Sintoma','symptom'],['Avaria','faultDescription'],['Prioridade','priority'],['PT','routingCode'],['Departamento','department'],['E-mail Destino','emailDestination'],['E-mail Estado','emailSent'],['E-mail Enviado Em','emailSentAt'],['Nº Nota','noteNumber'],['Tratado','treated'],['Estado','status'],['Observações','observations'],['Criado Em','createdAt'],['Atualizado Em','updatedAt']
      ];
      const rows = [columns.map(([label]) => AppCore.safeCsvCell(label)).join(';')];
      for (const record of records) {
        rows.push(columns.map(([,key]) => {
          let value = record[key] ?? '';
          if (key === 'priority') value = this.priorityLabels[value] || value;
          if (key === 'status') value = this.statusLabels[value] || value;
          if (key === 'treated') value = value ? 'Sim' : 'Não';
          return AppCore.safeCsvCell(value);
        }).join(';'));
      }
      const bom = '\uFEFF';
      const filename = `formularios-operacionais-registos-${this.localDateInput(new Date())}.csv`;
      this.downloadBlob(new Blob([bom + rows.join('\r\n')], { type:'text/csv;charset=utf-8' }), filename);
      this.toast(`${records.length} registo(s) exportados para CSV.`, 'success');
    },

    downloadBlob(blob, filename) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = filename; a.rel = 'noopener';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    },

    async installApp() {
      const promptEvent = this.state.deferredInstallPrompt;
      if (!promptEvent) return this.toast('A instalação não está disponível neste momento.', 'error');
      promptEvent.prompt();
      await promptEvent.userChoice.catch(() => null);
      this.state.deferredInstallPrompt = null;
      if (this.state.route === 'settings') this.renderSettings();
    },
  });
})();
