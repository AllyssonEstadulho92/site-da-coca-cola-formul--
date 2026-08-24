(() => {
  'use strict';
  window.App = {
    state: {
      user:null, route:'dashboard', records:[], activities:[], notifications:[], settings:null, currentDraft:null, autosaveTimer:null,
      filters:{ search:'', status:'', agent:'', routingCode:'', treated:'', emailSent:'', dateFrom:'', dateTo:'' },
      pendingConfirm:null, pendingRecordReview:null, snapshots:[], deferredInstallPrompt:null, editingExistingId:null, formDesignerDraft:null,
    },

    navItems:[
      { id:'dashboard', label:'Resumo', desktop:'Resumo', group:'Operação' },
      { id:'notifications', label:'Alertas', desktop:'Notificações', group:'Operação' },
      { id:'new', label:'Novo', desktop:'Novo Registo', group:'Operação' },
      { id:'records', label:'Registos', desktop:'Registos', group:'Operação' },
      { id:'drafts', label:'Rascunhos', desktop:'Rascunhos', group:'Operação' },
      { id:'clients', label:'Clientes', desktop:'Clientes', group:'Operação' },
      { id:'statistics', label:'Estat.', desktop:'Estatísticas', group:'Análise' },
      { id:'productivity', label:'Produt.', desktop:'Produtividade', group:'Análise' },
      { id:'activity', label:'Atividade', desktop:'Atividade', group:'Análise' },
      { id:'routing', label:'PT/E-mail', desktop:'Encaminhamento', group:'Análise' },
      { id:'designer', label:'Designer', desktop:'Designer de Formulário', group:'Configuração' },
      { id:'archive', label:'Arquivo', desktop:'Arquivo', group:'Configuração' },
      { id:'settings', label:'Definições', desktop:'Configurações', group:'Configuração' },
      { id:'help', label:'Ajuda', desktop:'Guia de Utilização', group:'Configuração' },
      { id:'profile', label:'Ident.', desktop:'Identificação Local', group:'Configuração' },
      { id:'more', label:'Mais', desktop:'Mais', mobileOnly:true },
    ],

    statusLabels:{ DRAFT:'Rascunho', REGISTERED:'Registado', IN_PROGRESS:'Em andamento', SENT:'Enviado', IN_TREATMENT:'Em tratamento', WAITING_RESPONSE:'Aguarda resposta', CLOSED:'Encerrado', ARCHIVED:'Arquivado' },
    priorityLabels:{ LOW:'Baixa', NORMAL:'Normal', HIGH:'Alta', URGENT:'Urgente' },

    defaultSettings:{
      localOperatorName:'Utilizador local',
      equipmentTypes:['Equipamento de frio','Máquina','Expositor','Dispensador','Outro'],
      symptoms:['Não liga','Não refrigera','Ruído anormal','Fuga','Dano visível','Outro'],
      faultCategories:['Avaria técnica','Manutenção','Instalação','Substituição','Outro'],
      routingRules:[
        { code:'PT 32', label:'Por definir', email:'', department:'', equipmentType:'', symptom:'', faultCategory:'', active:true },
        { code:'PT 60', label:'Por definir', email:'', department:'', equipmentType:'', symptom:'', faultCategory:'', active:true },
        { code:'PT 70', label:'Por definir', email:'', department:'', equipmentType:'', symptom:'', faultCategory:'', active:true },
      ],
      formDesign:{ density:'comfortable', width:'standard', accent:'red', showSummary:true, sectionOrder:['identity','location','incident','routing','status'], sectionTitles:{ identity:'Identificação', location:'Estabelecimento', incident:'Ocorrência e avaria', routing:'Encaminhamento', status:'Estado e observações' }, hiddenOptionalFields:[] },
      attentionFeedback:{ sound:true, vibration:true, reminders:true, reminderMinutes:15 },
      emailSubjectTemplate:'[{{id}}] {{client}} — {{equipment}}',
      emailBodyTemplate:'Registo: {{id}}\nData: {{date}}\nCliente: {{client}}\nEstabelecimento: {{establishment}}\nREF equipamento: {{equipment}}\nTipo: {{equipmentType}}\nAvaria: {{fault}}\nSintoma: {{symptom}}\nPT: {{pt}}\nNº Nota: {{note}}\n\nObservações:\n{{observations}}',
      duplicateWindowDays:14,
    },
    els:{},
  };
})();
