(() => {
  'use strict';
  window.App = {
    state: {
      user: null,
      route: 'dashboard',
      records: [],
      activities: [],
      settings: null,
      currentDraft: null,
      autosaveTimer: null,
      filters: { search: '', status: '', agent: '', routingCode: '', treated: '', emailSent: '', dateFrom: '', dateTo: '' },
      pendingConfirm: null,
      snapshots: [],
      deferredInstallPrompt: null,
      editingExistingId: null,
    },

    navItems: [
      { id: 'dashboard', label: 'Início', desktop: 'Dashboard', icon: '⌂' },
      { id: 'new', label: 'Novo', desktop: 'Novo Registo', icon: '＋' },
      { id: 'records', label: 'Registos', desktop: 'Registos', icon: '▤' },
      { id: 'clients', label: 'Clientes', desktop: 'Clientes', icon: '♙' },
      { id: 'equipment', label: 'Equip.', desktop: 'Equipamentos', icon: '◇' },
      { id: 'routing', label: 'PT/E-mail', desktop: 'Encaminhamento', icon: '↗' },
      { id: 'activity', label: 'Atividade', desktop: 'Atividade', icon: '◷' },
      { id: 'productivity', label: 'Produt.', desktop: 'Produtividade', icon: '▥' },
      { id: 'drafts', label: 'Rascunhos', desktop: 'Rascunhos', icon: '□' },
      { id: 'archive', label: 'Arquivo', desktop: 'Arquivo', icon: '▣' },
      { id: 'settings', label: 'Definições', desktop: 'Configurações', icon: '⚙' },
      { id: 'help', label: 'Guia', desktop: 'Guia de Utilização', icon: '?' },
      { id: 'profile', label: 'Perfil', desktop: 'Perfil', icon: '◉' },
      { id: 'more', label: 'Mais', desktop: 'Mais', icon: '☰', mobileOnly: true },
    ],

    statusLabels: {
      DRAFT: 'Rascunho',
      REGISTERED: 'Registado',
      IN_PROGRESS: 'Em andamento',
      SENT: 'Enviado',
      IN_TREATMENT: 'Em tratamento',
      WAITING_RESPONSE: 'Aguarda resposta',
      CLOSED: 'Encerrado',
      ARCHIVED: 'Arquivado',
    },

    priorityLabels: {
      LOW: 'Baixa',
      NORMAL: 'Normal',
      HIGH: 'Alta',
      URGENT: 'Urgente',
    },

    defaultSettings: {
      equipmentTypes: ['Equipamento de frio', 'Máquina', 'Expositor', 'Dispensador', 'Outro'],
      symptoms: ['Não liga', 'Não refrigera', 'Ruído anormal', 'Fuga', 'Dano visível', 'Outro'],
      faultCategories: ['Avaria técnica', 'Manutenção', 'Instalação', 'Substituição', 'Outro'],
      routingRules: [
        { code: 'PT 32', label: 'Por definir', email: '', department: '', equipmentType: '', symptom: '', faultCategory: '', active: true },
        { code: 'PT 60', label: 'Por definir', email: '', department: '', equipmentType: '', symptom: '', faultCategory: '', active: true },
        { code: 'PT 70', label: 'Por definir', email: '', department: '', equipmentType: '', symptom: '', faultCategory: '', active: true },
      ],
      emailSubjectTemplate: '[{{id}}] {{client}} — {{equipment}}',
      emailBodyTemplate: 'Registo: {{id}}\nData: {{date}}\nCliente: {{client}}\nEstabelecimento: {{establishment}}\nREF equipamento: {{equipment}}\nTipo: {{equipmentType}}\nAvaria: {{fault}}\nSintoma: {{symptom}}\nPT: {{pt}}\nNº Nota: {{note}}\n\nObservações:\n{{observations}}',
      duplicateWindowDays: 14,
    },

    els: {},
  };
})();
