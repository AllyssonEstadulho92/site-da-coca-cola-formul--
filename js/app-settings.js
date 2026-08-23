(() => {
  'use strict';
  Object.assign(window.App, {
    async renderSettings() {
      this.state.snapshots = await AppDB.getSnapshots().catch(() => []);
      const rules = this.state.settings.routingRules;
      const eqOptions = selected => this.optionList(this.state.settings.equipmentTypes, selected);
      const symptomOptions = selected => this.optionList(this.state.settings.symptoms, selected);
      const faultOptions = selected => this.optionList(this.state.settings.faultCategories, selected);
      const demoCount = this.state.records.filter(record => record.demo === true).length;

      this.els.viewContainer.innerHTML = `
        <div class="page-head">
          <div><p class="eyebrow">Administração local</p><h3>Configurações</h3></div>
          <div class="page-actions">
            <button class="btn btn-secondary" data-action="snapshot">Snapshot local</button>
            <button class="btn btn-secondary" data-action="backup">Backup JSON</button>
            <button class="btn btn-secondary" data-action="restore">Restaurar ficheiro</button>
          </div>
        </div>

        <div class="prototype-note"><strong>Regras empresariais:</strong> PT 32 / PT 60 / PT 70, departamentos e e-mails só devem ser preenchidos com dados autorizados. As regras automáticas são aplicadas apenas quando existirem critérios configurados.</div>

        <section class="panel settings-section">
          <div class="panel-head"><div><h3>Demonstração pública segura</h3><span class="muted">Dados fictícios para validar a interface sem expor informação operacional</span></div></div>
          <div class="panel-body backup-layout">
            <div class="stack-md">
              <p class="muted">Os registos de demonstração são identificados pelo prefixo <strong>DEMO</strong>, usam contactos fictícios e endereços <code>example.invalid</code>. Não representam clientes, equipamentos ou encaminhamentos reais.</p>
              ${this.detailItem('Registos DEMO carregados', String(demoCount))}
            </div>
            <div class="page-actions">
              <button class="btn btn-secondary" data-action="load-demo" ${demoCount ? 'disabled' : ''}>Carregar dados DEMO</button>
              <button class="btn btn-danger" data-action="clear-demo" ${demoCount ? '' : 'disabled'}>Remover dados DEMO</button>
            </div>
          </div>
        </section>

        <section class="panel settings-section">
          <div class="panel-head"><div><h3>Regras de encaminhamento</h3><span class="muted">Equipamento + sintoma + categoria → PT / setor / e-mail</span></div></div>
          <div class="panel-body routing-settings-grid">
            ${rules.map((r,i) => `<article class="settings-card routing-settings-card">
              <div class="record-card-top"><code>${this.escape(r.code)}</code><label class="toggle-row"><input type="checkbox" data-rule-active="${i}" ${r.active?'checked':''}><span>Ativa</span></label></div>
              <label class="field"><span>Descrição</span><input data-rule-label="${i}" value="${this.escapeAttr(r.label || '')}" placeholder="Por definir"></label>
              <label class="field"><span>Departamento / setor</span><input data-rule-department="${i}" value="${this.escapeAttr(r.department || '')}" placeholder="Setor autorizado"></label>
              <label class="field"><span>E-mail</span><input type="email" data-rule-email="${i}" value="${this.escapeAttr(r.email || '')}" placeholder="email@empresa.pt"></label>
              <label class="field"><span>Critério: tipo de equipamento</span><select data-rule-equipment="${i}">${eqOptions(r.equipmentType)}</select></label>
              <label class="field"><span>Critério: sintoma</span><select data-rule-symptom="${i}">${symptomOptions(r.symptom)}</select></label>
              <label class="field"><span>Critério: categoria</span><select data-rule-fault="${i}">${faultOptions(r.faultCategory)}</select></label>
              <small class="field-hint">Campos de critério vazios significam “não considerar”. Se todos estiverem vazios, a regra não gera sugestão automática.</small>
            </article>`).join('')}
          </div>
        </section>

        <div class="settings-grid settings-section">
          <section class="settings-card"><h4>Tipos de equipamento</h4><p class="muted">Lista administrável. Um item por linha.</p><textarea id="equipmentSettings" class="filter-control settings-textarea">${this.escape(this.state.settings.equipmentTypes.join('\n'))}</textarea></section>
          <section class="settings-card"><h4>Sintomas</h4><p class="muted">Um item por linha.</p><textarea id="symptomSettings" class="filter-control settings-textarea">${this.escape(this.state.settings.symptoms.join('\n'))}</textarea></section>
          <section class="settings-card"><h4>Categorias de avaria</h4><p class="muted">Um item por linha.</p><textarea id="faultSettings" class="filter-control settings-textarea">${this.escape(this.state.settings.faultCategories.join('\n'))}</textarea></section>
          <section class="settings-card"><h4>Prevenção de duplicados</h4><p class="muted">Janela temporal para avisar sobre ocorrências abertas da mesma REF.</p><label class="field"><span>Dias</span><input id="duplicateWindowDays" type="number" min="1" max="90" value="${Number(this.state.settings.duplicateWindowDays || 14)}"></label></section>
        </div>

        <section class="panel settings-section">
          <div class="panel-head"><h3>Modelo de e-mail</h3></div>
          <div class="panel-body stack-md">
            <label class="field"><span>Assunto</span><input id="emailSubjectTemplate" value="${this.escapeAttr(this.state.settings.emailSubjectTemplate || '')}"><small class="field-hint">Variáveis: {{id}}, {{client}}, {{equipment}}, {{pt}}, {{date}}.</small></label>
            <label class="field"><span>Corpo</span><textarea id="emailBodyTemplate" class="settings-email-template">${this.escape(this.state.settings.emailBodyTemplate || '')}</textarea><small class="field-hint">Também disponíveis: {{agent}}, {{taxpayer}}, {{establishment}}, {{address}}, {{contact}}, {{phone}}, {{equipmentType}}, {{faultCategory}}, {{symptom}}, {{fault}}, {{note}}, {{observations}}.</small></label>
          </div>
        </section>

        <section class="panel settings-section">
          <div class="panel-head"><div><h3>Dados, backup e recuperação</h3><span class="muted">Camadas locais — não substituem backup corporativo do servidor</span></div></div>
          <div class="panel-body backup-layout">
            <div class="stack-md">
              ${this.detailItem('Registos locais', String(this.state.records.length))}
              ${this.detailItem('Atividades de auditoria', String(this.state.activities.length))}
              ${this.detailItem('Snapshots locais', String(this.state.snapshots.length))}
              <p class="muted">Antes de restaurar um ficheiro, a aplicação cria automaticamente um snapshot local da situação atual.</p>
              <div class="encrypted-backup-box">
                <strong>Backup encriptado</strong>
                <label class="field"><span>Palavra-passe do backup</span><input id="backupEncryptionPassword" type="password" minlength="10" autocomplete="new-password" placeholder="Mínimo 10 caracteres"></label>
                <label class="field"><span>Confirmar palavra-passe</span><input id="backupEncryptionConfirm" type="password" minlength="10" autocomplete="new-password"></label>
                <button class="btn btn-secondary" data-action="backup-encrypted">Exportar backup protegido</button>
                <small class="field-hint">Se perder esta palavra-passe, o ficheiro encriptado não poderá ser recuperado.</small>
              </div>
              ${this.state.deferredInstallPrompt ? `<button class="btn btn-secondary" data-action="install-app">Instalar aplicação neste dispositivo</button>` : ''}
            </div>
            <div>
              <h4>Snapshots recentes</h4>
              ${this.state.snapshots.length ? `<div class="snapshot-list">${this.state.snapshots.map(s => `<div class="snapshot-row"><div><strong>${this.escape(s.label || 'Snapshot')}</strong><span>${this.formatDateTime(s.createdAt)}</span></div><button class="btn btn-secondary btn-small" data-restore-snapshot="${s.id}">Restaurar</button></div>`).join('')}</div>` : `<p class="muted">Ainda não existem snapshots locais.</p>`}
            </div>
          </div>
        </section>

        <div class="sticky-settings-save"><button class="btn btn-primary" data-action="save-settings">Guardar configurações</button></div>`;

      this.bindViewActions();
      document.querySelectorAll('[data-restore-snapshot]').forEach(btn => btn.addEventListener('click', () => this.confirm('Restaurar snapshot local', 'Os dados atuais serão substituídos pelos dados deste snapshot. Será criado um snapshot de segurança antes da operação.', () => this.restoreLocalSnapshot(btn.dataset.restoreSnapshot))));
    },

    async saveSettings() {
      const settings = structuredClone(this.state.settings);
      settings.equipmentTypes = this.lines(document.getElementById('equipmentSettings').value);
      settings.symptoms = this.lines(document.getElementById('symptomSettings').value);
      settings.faultCategories = this.lines(document.getElementById('faultSettings').value);
      settings.duplicateWindowDays = Math.min(90, Math.max(1, Number(document.getElementById('duplicateWindowDays').value || 14)));
      settings.emailSubjectTemplate = document.getElementById('emailSubjectTemplate').value.trim();
      settings.emailBodyTemplate = document.getElementById('emailBodyTemplate').value;
      settings.routingRules = settings.routingRules.map((r,i) => ({
        ...r,
        label: document.querySelector(`[data-rule-label="${i}"]`).value.trim(),
        department: document.querySelector(`[data-rule-department="${i}"]`).value.trim(),
        email: document.querySelector(`[data-rule-email="${i}"]`).value.trim(),
        equipmentType: document.querySelector(`[data-rule-equipment="${i}"]`).value,
        symptom: document.querySelector(`[data-rule-symptom="${i}"]`).value,
        faultCategory: document.querySelector(`[data-rule-fault="${i}"]`).value,
        active: document.querySelector(`[data-rule-active="${i}"]`).checked,
      }));

      const invalidEmail = settings.routingRules.find(r => r.email && !/^\S+@\S+\.\S+$/.test(r.email));
      if (invalidEmail) return this.toast(`O e-mail configurado em ${invalidEmail.code} não é válido.`, 'error');
      if (!settings.equipmentTypes.length || !settings.symptoms.length || !settings.faultCategories.length) return this.toast('As listas de equipamento, sintomas e categorias não podem ficar vazias.', 'error');

      this.state.settings = settings;
      await AppDB.put('settings', { key:'appSettings', value:settings });
      this.toast('Configurações guardadas.', 'success');
      this.renderSettings();
    },

    lines(value) {
      return [...new Set(String(value || '').split(/\r?\n/).map(v => v.trim()).filter(Boolean))];
    },
  });
})();
