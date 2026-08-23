(() => {
  'use strict';
  Object.assign(window.App, {
    renderProfile() {
      const user = this.state.user;
      const ownRecords = this.state.records.filter(r => r.createdBy === user.email || r.agentName === user.name);
      this.els.viewContainer.innerHTML = `
        <div class="page-head"><div><p class="eyebrow">Conta local</p><h3>Perfil</h3></div></div>
        <div class="content-grid">
          <section class="panel">
            <div class="panel-head"><h3>Dados do colaborador</h3></div>
            <div class="panel-body stack-md">
              <label class="field"><span>Nome</span><input id="profileName" value="${this.escapeAttr(user.name)}"></label>
              <label class="field"><span>E-mail</span><input value="${this.escapeAttr(user.email)}" disabled></label>
              <label class="field"><span>Função local</span><input value="${this.escapeAttr(user.role || 'AGENT')}" disabled></label>
              <button class="btn btn-primary" type="button" data-action="save-profile">Guardar nome</button>
            </div>
          </section>
          <aside class="panel">
            <div class="panel-head"><h3>Resumo</h3></div>
            <div class="panel-body stack-md">
              ${this.detailItem('Registos associados', String(ownRecords.length))}
              ${this.detailItem('Rascunhos', String(ownRecords.filter(r=>r.status==='DRAFT').length))}
              ${this.detailItem('Encerrados', String(ownRecords.filter(r=>r.status==='CLOSED').length))}
              ${this.detailItem('Sessão', 'Ativa neste browser')}
            </div>
          </aside>
        </div>
        <section class="panel settings-section">
          <div class="panel-head"><h3>Alterar palavra-passe local</h3></div>
          <div class="panel-body form-grid">
            <label class="field"><span>Palavra-passe atual</span><input id="currentPassword" type="password" autocomplete="current-password"></label>
            <label class="field"><span>Nova palavra-passe</span><input id="newPassword" type="password" minlength="8" autocomplete="new-password"></label>
            <label class="field"><span>Confirmar nova palavra-passe</span><input id="confirmNewPassword" type="password" minlength="8" autocomplete="new-password"></label>
            <div class="field"><span>&nbsp;</span><button class="btn btn-secondary" type="button" data-action="change-password">Alterar palavra-passe</button></div>
          </div>
        </section>
        <section class="panel settings-section">
          <div class="panel-head"><h3>Sessão</h3></div>
          <div class="panel-body"><button class="btn btn-danger" type="button" data-action="logout">Terminar sessão</button></div>
        </section>`;
      this.bindViewActions();
    },

    async saveProfileName() {
      const name = document.getElementById('profileName')?.value.trim();
      if (!name || name.length < 2) return this.toast('Introduza um nome válido.', 'error');
      const profile = await AppDB.get('profiles', this.state.user.email);
      if (!profile) return this.toast('Perfil local não encontrado.', 'error');
      const oldName = profile.name;
      profile.name = name;
      await AppDB.put('profiles', profile);
      this.state.user.name = name;
      sessionStorage.setItem('registoAvariasUser', JSON.stringify(this.state.user));
      this.updateAvatar();
      if (oldName !== name) this.toast('Nome do perfil atualizado. Registos históricos mantêm o agente original.', 'success');
      this.renderProfile();
    },

    async changeLocalPassword() {
      const current = document.getElementById('currentPassword')?.value || '';
      const next = document.getElementById('newPassword')?.value || '';
      const confirm = document.getElementById('confirmNewPassword')?.value || '';
      if (next.length < 8) return this.toast('A nova palavra-passe deve ter pelo menos 8 caracteres.', 'error');
      if (next !== confirm) return this.toast('As novas palavras-passe não coincidem.', 'error');
      const profile = await AppDB.get('profiles', this.state.user.email);
      if (!profile) return this.toast('Perfil local não encontrado.', 'error');
      const candidate = await this.derivePasswordHash(current, profile.passwordSalt, profile.passwordIterations || 120000);
      if (!this.constantTimeEqual(candidate, profile.passwordHash)) return this.toast('A palavra-passe atual está incorreta.', 'error');
      const salt = this.createPasswordSalt();
      profile.passwordSalt = salt;
      profile.passwordIterations = 120000;
      profile.passwordHash = await this.derivePasswordHash(next, salt, profile.passwordIterations);
      await AppDB.put('profiles', profile);
      this.toast('Palavra-passe local alterada.', 'success');
      this.renderProfile();
    },

    renderHelp() {
      const steps = [
        ['Iniciar sessão','No primeiro acesso, crie um perfil local neste browser. Em produção deverá ser usado SSO corporativo autorizado.'],
        ['Criar registo','Abra “Novo Registo”, preencha os campos principais e confirme cliente, estabelecimento, REF do equipamento e descrição da avaria.'],
        ['Rascunhos e autosave','Enquanto escreve, a aplicação guarda automaticamente o rascunho. Em edição de registos existentes, as alterações ficam protegidas em buffer até confirmar “Guardar alterações”.'],
        ['Evitar duplicados','Ao introduzir a REF do equipamento, a aplicação verifica ocorrências abertas recentes e avisa se encontrar uma possível duplicação.'],
        ['Encaminhamento','Configure PT 32 / 60 / 70 apenas com regras autorizadas. O sistema pode sugerir um PT quando equipamento, sintoma e/ou categoria coincidirem com uma regra.'],
        ['E-mail','O assistente prepara destinatário, assunto e corpo. O envio não é automático; só marque “enviado” depois de efetuar a comunicação.'],
        ['Estados','Use Registado, Em andamento, Enviado, Em tratamento, Aguarda resposta e Encerrado para manter o acompanhamento. Arquivar preserva o histórico.'],
        ['Pesquisa','Na área Registos pode filtrar por texto, estado, agente, PT, Tratado, e-mail e intervalo de datas.'],
        ['Clientes e equipamentos','Use os diretórios para consultar histórico consolidado por cliente e por REF de equipamento.'],
        ['Backup','Exporte backups JSON ou encriptados e mantenha cópias fora do dispositivo. Os snapshots locais são uma camada adicional, não um backup corporativo completo.'],
        ['Restauro','Antes de restaurar, a aplicação cria um snapshot de segurança. Confirme sempre que o ficheiro corresponde ao ambiente correto.'],
        ['Proteção de dados','Não introduza dados reais em versões públicas/de demonstração sem autorização. Em produção, aplique identidade corporativa, permissões, retenção e backend seguro.']
      ];
      this.els.viewContainer.innerHTML = `
        <div class="page-head"><div><p class="eyebrow">Apoio operacional</p><h3>Guia de Utilização</h3></div></div>
        <div class="prototype-note"><strong>Objetivo:</strong> reduzir perdas de informação, tornar o registo consistente e permitir recuperar rapidamente o contexto de cada ocorrência.</div>
        <div class="guide-grid">${steps.map(([title,text],i)=>`<article class="guide-card"><span class="guide-number">${i+1}</span><div><h4>${this.escape(title)}</h4><p>${this.escape(text)}</p></div></article>`).join('')}</div>`;
    },
  });
})();
