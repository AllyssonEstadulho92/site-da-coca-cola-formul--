(() => {
  'use strict';

  Object.assign(window.App, {
    renderProfile() {
      const user = this.state.user || { name: 'Utilizador local', role: 'LOCAL' };
      const records = this.state.records || [];
      this.els.viewContainer.innerHTML = `
        <div class="page-head">
          <div><p class="eyebrow">Identificação do dispositivo</p><h3>Identificação Local</h3></div>
        </div>
        <div class="prototype-note" role="note">
          <strong>Sem autenticação.</strong> Este nome serve apenas para identificar localmente novos registos e atividades neste dispositivo. Não controla quem pode abrir a aplicação.
        </div>
        <div class="content-grid">
          <section class="panel">
            <div class="panel-head"><h3>Nome do operador local</h3></div>
            <div class="panel-body stack-md">
              <label class="field">
                <span>Nome</span>
                <input id="profileName" value="${this.escapeAttr(user.name)}" maxlength="80" autocomplete="off">
                <small class="field-hint">Guardado apenas nas definições locais deste browser.</small>
              </label>
              <button class="btn btn-primary" type="button" data-action="save-profile">Guardar identificação</button>
            </div>
          </section>
          <aside class="panel">
            <div class="panel-head"><h3>Resumo local</h3></div>
            <div class="panel-body stack-md">
              ${this.detailItem('Registos neste dispositivo', String(records.length))}
              ${this.detailItem('Rascunhos', String(records.filter(r => r.status === 'DRAFT').length))}
              ${this.detailItem('Encerrados', String(records.filter(r => r.status === 'CLOSED').length))}
              ${this.detailItem('Acesso', 'Direto · sem autenticação')}
            </div>
          </aside>
        </div>`;
      this.bindViewActions();
    },

    async saveProfileName() {
      const name = document.getElementById('profileName')?.value.trim();
      if (!name || name.length < 2) return this.toast('Introduza um nome válido.', 'error');
      if (name.length > 80) return this.toast('O nome é demasiado longo.', 'error');

      this.state.settings.localOperatorName = name;
      await AppDB.put('settings', { key: 'appSettings', value: this.state.settings });
      this.state.user = { email: 'local-user', name, role: 'LOCAL' };
      this.updateAvatar();
      this.toast('Identificação local atualizada.', 'success');
      this.renderProfile();
    },

    renderHelp() {
      const steps = [
        ['Abrir a aplicação','A aplicação abre diretamente no Dashboard, sem login ou palavra-passe. A identificação local é opcional e não funciona como controlo de acesso.'],
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
        ['Proteção de dados','Este protótipo público não tem autenticação. Não introduza dados reais, credenciais, informação SAP ou dados pessoais. Para produção são necessários identidade corporativa, permissões e backend seguro.']
      ];
      this.els.viewContainer.innerHTML = `
        <div class="page-head"><div><p class="eyebrow">Apoio operacional</p><h3>Guia de Utilização</h3></div></div>
        <div class="prototype-note"><strong>Objetivo:</strong> reduzir perdas de informação, tornar o registo consistente e permitir recuperar rapidamente o contexto de cada ocorrência.</div>
        <div class="guide-grid">${steps.map(([title, text], i) => `<article class="guide-card"><span class="guide-number">${i + 1}</span><div><h4>${this.escape(title)}</h4><p>${this.escape(text)}</p></div></article>`).join('')}</div>`;
    },
  });
})();
