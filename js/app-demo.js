(() => {
  'use strict';

  Object.assign(window.App, {
    async loadDemoData() {
      const existingDemo = this.state.records.filter(record => record.demo === true);
      if (existingDemo.length) {
        this.toast('Os dados de demonstração já estão carregados.', 'error');
        return;
      }

      const now = new Date();
      const at = (daysAgo, hour, minute) => {
        const value = new Date(now);
        value.setDate(value.getDate() - daysAgo);
        value.setHours(hour, minute, 0, 0);
        return value.toISOString();
      };
      const dateOnly = daysAgo => {
        const value = new Date(now);
        value.setDate(value.getDate() - daysAgo);
        return this.localDateInput(value);
      };

      const agentName = this.state.user?.name || 'Utilizador Demo';
      const agentId = this.state.user?.email || 'demo@example.invalid';
      const demoRecords = [
        {
          id: crypto.randomUUID(), displayId: 'DEMO-000001', demo: true,
          createdAt: at(0, 9, 10), updatedAt: at(0, 9, 22), occurrenceDate: dateOnly(0),
          agentName, agentId, taxpayerNumber: 'DEMO-NIF-001', clientName: 'Cliente Demonstração Norte',
          contactName: 'Contacto Fictício A', customerContact: '210 000 001', establishmentName: 'Café Horizonte Demo',
          locality: 'Lisboa', address: 'Rua Exemplo 100', openingHours: '08:00–20:00',
          equipmentReference: 'DEMO-EQ-0001', equipmentType: 'Equipamento de frio', faultCategory: 'Avaria técnica',
          symptom: 'Não refrigera', faultDescription: 'Exemplo fictício: temperatura acima do valor esperado.', priority: 'HIGH',
          routingCode: '', department: '', emailDestination: 'assistencia@example.invalid', emailSent: 'NO', emailSentAt: '',
          noteNumber: 'DEMO-NOTA-001', treated: false, status: 'IN_PROGRESS', observations: 'Registo criado exclusivamente para demonstração pública.',
          archived: false, syncStatus: 'LOCAL'
        },
        {
          id: crypto.randomUUID(), displayId: 'DEMO-000002', demo: true,
          createdAt: at(0, 10, 5), updatedAt: at(0, 10, 40), occurrenceDate: dateOnly(0),
          agentName, agentId, taxpayerNumber: 'DEMO-NIF-002', clientName: 'Cliente Demonstração Centro',
          contactName: 'Contacto Fictício B', customerContact: '210 000 002', establishmentName: 'Loja Praça Demo',
          locality: 'Coimbra', address: 'Avenida Modelo 25', openingHours: '09:00–22:00',
          equipmentReference: 'DEMO-EQ-0002', equipmentType: 'Expositor', faultCategory: 'Manutenção',
          symptom: 'Ruído anormal', faultDescription: 'Exemplo fictício: ruído intermitente durante o funcionamento.', priority: 'NORMAL',
          routingCode: '', department: '', emailDestination: 'operacoes@example.invalid', emailSent: 'YES', emailSentAt: at(0, 10, 30),
          noteNumber: 'DEMO-NOTA-002', treated: false, status: 'SENT', observations: 'Dados fictícios; não correspondem a qualquer cliente real.',
          archived: false, syncStatus: 'LOCAL'
        },
        {
          id: crypto.randomUUID(), displayId: 'DEMO-000003', demo: true,
          createdAt: at(0, 11, 15), updatedAt: at(0, 12, 5), occurrenceDate: dateOnly(0),
          agentName, agentId, taxpayerNumber: 'DEMO-NIF-003', clientName: 'Cliente Demonstração Sul',
          contactName: 'Contacto Fictício C', customerContact: '210 000 003', establishmentName: 'Mercado Atlântico Demo',
          locality: 'Faro', address: 'Praça Fictícia 7', openingHours: '07:30–21:00',
          equipmentReference: 'DEMO-EQ-0003', equipmentType: 'Máquina', faultCategory: 'Avaria técnica',
          symptom: 'Não liga', faultDescription: 'Exemplo fictício: equipamento sem resposta ao comando de arranque.', priority: 'URGENT',
          routingCode: '', department: '', emailDestination: 'tecnico@example.invalid', emailSent: 'YES', emailSentAt: at(0, 11, 35),
          noteNumber: 'DEMO-NOTA-003', treated: false, status: 'IN_TREATMENT', observations: 'Exemplo para validar estados, filtros e timeline.',
          archived: false, syncStatus: 'LOCAL'
        },
        {
          id: crypto.randomUUID(), displayId: 'DEMO-000004', demo: true,
          createdAt: at(1, 14, 0), updatedAt: at(1, 16, 20), occurrenceDate: dateOnly(1),
          agentName, agentId, taxpayerNumber: 'DEMO-NIF-004', clientName: 'Cliente Demonstração Oeste',
          contactName: 'Contacto Fictício D', customerContact: '210 000 004', establishmentName: 'Restaurante Linha Demo',
          locality: 'Leiria', address: 'Rua de Teste 48', openingHours: '10:00–23:00',
          equipmentReference: 'DEMO-EQ-0004', equipmentType: 'Dispensador', faultCategory: 'Substituição',
          symptom: 'Fuga', faultDescription: 'Exemplo fictício: indicação de fuga sem dados técnicos reais.', priority: 'NORMAL',
          routingCode: '', department: '', emailDestination: 'servico@example.invalid', emailSent: 'YES', emailSentAt: at(1, 14, 25),
          noteNumber: 'DEMO-NOTA-004', treated: true, status: 'CLOSED', observations: 'Ocorrência fictícia encerrada para demonstrar produtividade.',
          archived: false, syncStatus: 'LOCAL'
        },
        {
          id: crypto.randomUUID(), displayId: 'DEMO-000005', demo: true,
          createdAt: at(2, 8, 45), updatedAt: at(2, 9, 0), occurrenceDate: dateOnly(2),
          agentName, agentId, taxpayerNumber: 'DEMO-NIF-005', clientName: 'Cliente Demonstração Interior',
          contactName: 'Contacto Fictício E', customerContact: '210 000 005', establishmentName: 'Quiosque Serra Demo',
          locality: 'Viseu', address: 'Largo Exemplo 3', openingHours: '08:00–19:00',
          equipmentReference: 'DEMO-EQ-0005', equipmentType: 'Outro', faultCategory: 'Outro',
          symptom: 'Dano visível', faultDescription: 'Exemplo fictício para demonstrar rascunhos.', priority: 'LOW',
          routingCode: '', department: '', emailDestination: '', emailSent: 'NO', emailSentAt: '',
          noteNumber: '', treated: false, status: 'DRAFT', observations: 'Rascunho fictício para demonstração.',
          archived: false, syncStatus: 'LOCAL'
        }
      ];

      for (const record of demoRecords) {
        await AppDB.put('records', record);
        const activity = {
          id: crypto.randomUUID(), recordId: record.id, userId: agentId, eventType: 'DEMO_CREATED',
          label: 'Registo fictício de demonstração criado', createdAt: record.createdAt, demo: true
        };
        await AppDB.put('activities', activity);
      }

      await this.loadData();
      this.toast('Dados fictícios de demonstração carregados.', 'success');
      this.navigate('dashboard');
    },

    async clearDemoData() {
      const demoIds = new Set(this.state.records.filter(record => record.demo === true).map(record => record.id));
      if (!demoIds.size) {
        this.toast('Não existem dados de demonstração para remover.', 'error');
        return;
      }

      const demoRecords = this.state.records.filter(record => demoIds.has(record.id));
      const demoActivities = this.state.activities.filter(activity => activity.demo === true || demoIds.has(activity.recordId));
      for (const record of demoRecords) await AppDB.remove('records', record.id);
      for (const activity of demoActivities) await AppDB.remove('activities', activity.id);

      await this.loadData();
      this.toast('Dados de demonstração removidos.', 'success');
      if (this.state.route === 'settings') this.renderSettings();
      else this.navigate('dashboard');
    }
  });
})();
