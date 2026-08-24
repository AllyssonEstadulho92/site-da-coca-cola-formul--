(() => {
  'use strict';

  const symptom = value => Object.freeze({
    id: value.id,
    name: value.name,
    observableDescription: value.observableDescription || value.name,
    appliesToModels: value.appliesToModels || [],
    appliesToCategories: value.appliesToCategories || [],
    manufacturerIncludes: value.manufacturerIncludes || '',
    component: value.component || '',
    possibleCauses: value.possibleCauses || [],
    triageQuestions: value.triageQuestions || [],
    safeChecks: value.safeChecks || [],
    requiresTechnicalService: value.requiresTechnicalService !== false,
    sourceId: value.sourceId,
    sourceSection: value.sourceSection || '',
    validationLevel: value.validationLevel || 'MODEL_DOCUMENTED',
    note: value.note || ''
  });

  const frigoglassModels = ['plus-450','plus-900'];
  const icoolModels = ['icool-300','icool-450','icool-900'];
  const freestyleModels = ['freestyle-7100','freestyle-8100','freestyle-9100'];

  window.EquipmentSymptomsV5 = Object.freeze([
    symptom({
      id:'frigoglass-plus-not-working',
      name:'Equipamento não funciona',
      observableDescription:'O expositor não apresenta funcionamento normal.',
      appliesToModels:frigoglassModels,
      component:'Alimentação elétrica',
      sourceId:'frigoglass-plus-450-900',
      sourceSection:'Resolução de problemas, pp. 82–83 (PT)',
      possibleCauses:['Cabo de alimentação não ligado à tomada','Ausência de energia na tomada'],
      triageQuestions:['O equipamento apresenta iluminação ou qualquer sinal de funcionamento?','O cabo está ligado à tomada sem extensão improvisada?'],
      safeChecks:['Confirmar visualmente que a ficha está corretamente ligada','Não abrir painéis elétricos; se não houver alimentação normal, escalar assistência'],
      validationLevel:'MODEL_DOCUMENTED'
    }),
    symptom({
      id:'frigoglass-plus-insufficient-cooling',
      name:'Não refrigera suficientemente / produtos quentes',
      observableDescription:'O equipamento funciona, mas as bebidas permanecem demasiado quentes.',
      appliesToModels:frigoglassModels,
      component:'Refrigeração / circulação de ar / porta',
      sourceId:'frigoglass-plus-450-900',
      sourceSection:'Resolução de problemas, pp. 82–83 (PT)',
      possibleCauses:['Regulação do termóstato inadequada','Carga recente com produtos quentes','Produtos a obstruir a circulação de ar','Porta sem vedação correta','Fuga no sistema de refrigeração'],
      triageQuestions:['O equipamento foi carregado recentemente com produto à temperatura ambiente?','A porta fecha completamente?','Existe produto a bloquear a circulação interna de ar?'],
      safeChecks:['Confirmar que a porta fecha totalmente','Confirmar que a carga não bloqueia a circulação de ar','Não intervir no circuito de refrigeração'],
      validationLevel:'MODEL_DOCUMENTED'
    }),
    symptom({
      id:'frigoglass-plus-metal-noise',
      name:'Ruído metálico intenso ou ruído anormal',
      observableDescription:'O cliente relata ruído acima do funcionamento normal do expositor.',
      appliesToModels:frigoglassModels,
      component:'Estrutura / refrigeração',
      sourceId:'frigoglass-plus-450-900',
      sourceSection:'Resolução de problemas, p. 83 (PT)',
      possibleCauses:['Ruído normal do mecanismo dinâmico','Piso inclinado ou curvo','Falha técnica quando existe ruído metálico intenso'],
      triageQuestions:['O ruído é metálico e intenso ou apenas som normal do compressor/ventilação?','O equipamento está visivelmente desnivelado?'],
      safeChecks:['Confirmar visualmente se o equipamento está estável e nivelado','Ruído metálico intenso deve ser encaminhado para assistência técnica'],
      validationLevel:'MODEL_DOCUMENTED'
    }),
    symptom({
      id:'frigoglass-plus-water-floor',
      name:'Água no chão',
      observableDescription:'Existe água acumulada no piso junto ao equipamento.',
      appliesToModels:frigoglassModels,
      component:'Drenagem / tabuleiro de condensação',
      sourceId:'frigoglass-plus-450-900',
      sourceSection:'Resolução de problemas, p. 83 (PT)',
      possibleCauses:['Orifício de drenagem da condensação obstruído','Fuga no tabuleiro'],
      triageQuestions:['A água aparece continuamente?','A água parece vir da zona inferior do equipamento?'],
      safeChecks:['Sinalizar e manter a zona do piso segura','Não desmontar o sistema de drenagem; escalar se a origem não for imediatamente visível'],
      validationLevel:'MODEL_DOCUMENTED'
    }),
    symptom({
      id:'frigoglass-plus-light-failure',
      name:'Iluminação não funciona',
      observableDescription:'A iluminação do expositor não acende.',
      appliesToModels:frigoglassModels,
      component:'Iluminação',
      sourceId:'frigoglass-plus-450-900',
      sourceSection:'Resolução de problemas, p. 83 (PT)',
      possibleCauses:['Lâmpada fluorescente avariada','Balastro avariado','Arrancador avariado'],
      triageQuestions:['O equipamento continua a refrigerar apesar da falha de iluminação?'],
      safeChecks:['Não abrir compartimentos elétricos; encaminhar para assistência autorizada'],
      validationLevel:'MODEL_DOCUMENTED'
    }),

    symptom({
      id:'frigoglass-icool-not-working',
      name:'Equipamento não funciona',
      observableDescription:'O ICM não apresenta funcionamento normal.',
      appliesToModels:icoolModels,
      component:'Alimentação elétrica',
      sourceId:'frigoglass-icool',
      sourceSection:'Troubleshooting / Resolução de problemas',
      possibleCauses:['Cabo de alimentação não ligado','Ausência de energia na tomada'],
      triageQuestions:['Existe iluminação ou qualquer sinal de funcionamento?'],
      safeChecks:['Confirmar visualmente a ligação da ficha','Não abrir componentes elétricos'],
      validationLevel:'MODEL_DOCUMENTED'
    }),
    symptom({
      id:'frigoglass-icool-insufficient-cooling',
      name:'Não refrigera suficientemente / produtos quentes',
      observableDescription:'O equipamento está ligado mas não mantém o produto suficientemente frio.',
      appliesToModels:icoolModels,
      component:'Refrigeração / circulação de ar / porta',
      sourceId:'frigoglass-icool',
      sourceSection:'Troubleshooting / Resolução de problemas',
      possibleCauses:['Regulação do termóstato inadequada','Carga recente com produto não refrigerado','Produto a bloquear circulação de ar','Porta sem vedação correta','Fuga no sistema de refrigeração'],
      triageQuestions:['O equipamento foi carregado recentemente?','A porta fecha completamente?','Existe produto a bloquear as saídas de ar?'],
      safeChecks:['Confirmar o fecho da porta','Confirmar que o produto não bloqueia a circulação interna','Não intervir no circuito refrigerante'],
      validationLevel:'MODEL_DOCUMENTED'
    }),
    symptom({
      id:'frigoglass-icool-noise',
      name:'Ruído anormal / ruído metálico intenso',
      observableDescription:'O cliente reporta ruído fora do padrão normal do equipamento.',
      appliesToModels:icoolModels,
      component:'Estrutura / refrigeração',
      sourceId:'frigoglass-icool',
      sourceSection:'Troubleshooting / Resolução de problemas',
      possibleCauses:['Funcionamento normal do mecanismo dinâmico','Piso inclinado ou curvo','Falha técnica quando existe ruído metálico intenso'],
      triageQuestions:['O ruído é metálico e intenso?','O equipamento parece desnivelado?'],
      safeChecks:['Confirmar visualmente estabilidade/nivelamento','Escalar ruído metálico intenso'],
      validationLevel:'MODEL_DOCUMENTED'
    }),
    symptom({
      id:'frigoglass-icool-water-floor',
      name:'Água no chão',
      observableDescription:'Existe água acumulada junto à base do equipamento.',
      appliesToModels:icoolModels,
      component:'Drenagem / condensação',
      sourceId:'frigoglass-icool',
      sourceSection:'Troubleshooting / Resolução de problemas',
      possibleCauses:['Orifício de drenagem da condensação obstruído','Fuga no tabuleiro'],
      triageQuestions:['A água reaparece depois de ser limpa?'],
      safeChecks:['Sinalizar o piso molhado','Não desmontar a drenagem; escalar se persistir'],
      validationLevel:'MODEL_DOCUMENTED'
    }),
    symptom({
      id:'frigoglass-icool-light-failure',
      name:'Iluminação não funciona',
      observableDescription:'O sistema de iluminação do equipamento não funciona.',
      appliesToModels:icoolModels,
      component:'Iluminação',
      sourceId:'frigoglass-icool',
      sourceSection:'Troubleshooting / Resolução de problemas',
      possibleCauses:['Lâmpada/iluminação avariada','Balastro ou arrancador avariado, conforme versão'],
      triageQuestions:['A refrigeração continua operacional?'],
      safeChecks:['Não substituir nem abrir componentes elétricos; encaminhar assistência'],
      validationLevel:'MODEL_DOCUMENTED'
    }),

    symptom({
      id:'dn5800-selection-will-not-vend',
      name:'Seleção não dispensa produto',
      observableDescription:'O cliente faz uma seleção, mas o produto não é entregue.',
      appliesToModels:['dn-5800'],
      component:'Mecanismo de venda / picker / seleção',
      sourceId:'crane-bevmax4',
      sourceSection:'Troubleshooting — Selection Will Not Vend',
      possibleCauses:['Preço/configuração da seleção incorretos','Crédito insuficiente','Produto e gate incompatíveis','Gate preso','Falha do mecanismo de entrega','Ligação/cabo/controlador com falha'],
      triageQuestions:['Outras seleções funcionam?','A máquina apresenta mensagem ou código de erro?','O pagamento foi aceite?'],
      safeChecks:['Registar a seleção afetada e a mensagem apresentada','Não introduzir mãos no mecanismo de entrega nem abrir zonas técnicas'],
      validationLevel:'MODEL_DOCUMENTED'
    }),
    symptom({
      id:'dn5800-display-blank',
      name:'Ecrã/display sem imagem',
      observableDescription:'O display fica totalmente ou parcialmente em branco.',
      appliesToModels:['dn-5800'],
      component:'Display / keypad / controlo',
      sourceId:'crane-dn5800',
      sourceSection:'Display troubleshooting / BevMax DN5800',
      possibleCauses:['Ligação do display solta','Harness do display defeituoso','Display defeituoso','Keypad defeituoso','Placa de controlo com falha'],
      triageQuestions:['O display fica completamente em branco ou apaga após mostrar parte da mensagem?','A máquina continua a aceitar seleções?'],
      safeChecks:['Registar exatamente o comportamento do display','Não abrir a porta de serviço nem tocar em componentes elétricos'],
      validationLevel:'MODEL_DOCUMENTED'
    }),
    symptom({
      id:'dn5800-payment-rejected',
      name:'Moedas/notas não são aceites',
      observableDescription:'O sistema de pagamento rejeita moedas ou notas.',
      appliesToModels:['dn-5800'],
      component:'Sistema de pagamento',
      sourceId:'crane-bevmax4',
      sourceSection:'Troubleshooting — Coin/Bill Acceptance Issues',
      possibleCauses:[],
      triageQuestions:['A rejeição acontece com todas as moedas/notas?','Existe mensagem no display?'],
      safeChecks:['Testar apenas com meio de pagamento válido se permitido pelo procedimento local','Não desmontar leitores ou mecanismos'],
      validationLevel:'MODEL_DOCUMENTED'
    }),
    symptom({
      id:'dn5800-not-cooling',
      name:'Máquina não refrigera',
      observableDescription:'Os produtos estão quentes ou a máquina não mantém a temperatura esperada.',
      appliesToModels:['dn-5800'],
      component:'Refrigeração',
      sourceId:'crane-bevmax4',
      sourceSection:'Refrigeration Troubleshooting — Machine Not Cooling',
      possibleCauses:[],
      triageQuestions:['O problema afeta todos os produtos?','Existe gelo/frost visível no evaporador?','A máquina apresenta erro de temperatura?'],
      safeChecks:['Registar temperatura/estado observado se existir indicador','Não abrir o circuito de refrigeração'],
      validationLevel:'MODEL_DOCUMENTED'
    }),

    symptom({
      id:'freestyle-screen-frozen',
      name:'Ecrã bloqueado ou máquina sem resposta',
      observableDescription:'O ecrã fica congelado/não muda ou o dispensador não responde.',
      appliesToModels:freestyleModels,
      component:'Interface / controlo',
      sourceId:'cokesolutions-troubleshooting',
      sourceSection:'Coca-Cola Freestyle Not Dispensing or Screen Frozen and Not Responding',
      possibleCauses:[],
      triageQuestions:['O ecrã está congelado ou completamente apagado?','A máquina responde a alguma seleção?'],
      safeChecks:['Seguir apenas o procedimento de reinício publicado pela Coca-Cola se autorizado no local; caso contrário escalar assistência'],
      validationLevel:'FAMILY_DOCUMENTED',
      note:'A fonte Coca-Cola descreve o cenário para Coca-Cola Freestyle como família; confirmar o procedimento aplicável ao modelo/instalação local.'
    }),
    symptom({
      id:'freestyle-diet-not-dispensing',
      name:'Bebidas diet não são dispensadas',
      observableDescription:'As opções diet deixam de dispensar enquanto outras opções podem continuar disponíveis.',
      appliesToModels:freestyleModels,
      component:'NNS / ingrediente',
      sourceId:'cokesolutions-troubleshooting',
      sourceSection:'Coca-Cola Freestyle Not Dispensing Diet Drinks',
      possibleCauses:['NNS sweetener vazio','NNS sweetener fora da data de utilização indicada'],
      triageQuestions:['A falha afeta apenas bebidas diet?','Existe indicação de ingrediente/NNS no ecrã?'],
      safeChecks:['Registar a indicação apresentada no ecrã; procedimentos de substituição/prime devem seguir a formação e permissões locais'],
      validationLevel:'FAMILY_DOCUMENTED',
      note:'Fonte oficial Coca-Cola para a família Freestyle; não tratar como diagnóstico automático.'
    })
  ]);
})();