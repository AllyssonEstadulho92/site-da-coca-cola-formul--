(() => {
  'use strict';

  const symptom = value => Object.freeze({
    id:value.id,
    name:value.name,
    observableDescription:value.observableDescription || value.name,
    appliesToModels:value.appliesToModels || [],
    appliesToCategories:value.appliesToCategories || [],
    manufacturerIncludes:value.manufacturerIncludes || '',
    component:value.component || '',
    possibleCauses:value.possibleCauses || [],
    triageQuestions:value.triageQuestions || [],
    safeChecks:value.safeChecks || [],
    requiresTechnicalService:value.requiresTechnicalService !== false,
    sourceId:value.sourceId,
    sourceSection:value.sourceSection || '',
    validationLevel:value.validationLevel || 'MODEL_DOCUMENTED',
    note:value.note || ''
  });

  window.EquipmentSymptomsV5 = Object.freeze([
    symptom({
      id:'plus450-no-power', name:'Equipamento não funciona', appliesToModels:['plus-450'], component:'Alimentação', sourceId:'frigoglass-plus-450', sourceSection:'5. Troubleshooting — The ICM does not work',
      possibleCauses:['Cabo de alimentação não ligado','Sem alimentação na tomada'],
      triageQuestions:['O equipamento apresenta iluminação ou qualquer sinal de alimentação?','Existe alimentação disponível na tomada?'],
      safeChecks:['Confirmar externamente se a ficha está ligada. Não abrir painéis elétricos.'],
      note:'O manual do fabricante limita intervenções no sistema elétrico e de refrigeração a pessoal autorizado.'
    }),
    symptom({
      id:'plus450-warm-products', name:'Não arrefece o suficiente / produtos quentes', appliesToModels:['plus-450'], component:'Refrigeração / circulação de ar', sourceId:'frigoglass-plus-450', sourceSection:'5. Troubleshooting — The cooler does not cool enough',
      possibleCauses:['Regulação do termóstato inadequada','Carga recente de produtos quentes','Circulação de ar bloqueada pela carga','Porta sem vedação adequada','Fuga no sistema de refrigeração'],
      triageQuestions:['O equipamento foi recentemente carregado com produto quente?','A carga está a bloquear a circulação interna?','A porta fecha e veda corretamente?'],
      safeChecks:['Confirmar visualmente a organização da carga e o fecho da porta. Reparações de porta ou refrigeração devem ser encaminhadas para assistência autorizada.']
    }),
    symptom({
      id:'plus450-water-floor', name:'Água no chão', appliesToModels:['plus-450'], component:'Drenagem / tabuleiro', sourceId:'frigoglass-plus-450', sourceSection:'5. Troubleshooting — There is water on the floor',
      possibleCauses:['Orifício de drenagem de condensados bloqueado','Fuga no tabuleiro'],
      triageQuestions:['A água aparece por baixo do equipamento?','Existe risco de escorregamento para clientes ou operadores?'],
      safeChecks:['Isolar o risco no piso e escalar se existir fuga persistente. Não desmontar componentes técnicos durante a chamada.']
    }),
    symptom({
      id:'plus450-lights', name:'Iluminação não funciona', appliesToModels:['plus-450'], component:'Iluminação', sourceId:'frigoglass-plus-450', sourceSection:'5. Troubleshooting — The lights do not work',
      possibleCauses:['Lâmpada/tubo, balastro ou starter avariado'],
      triageQuestions:['O equipamento continua a refrigerar?','A falha afeta toda a iluminação?'],
      safeChecks:['Registar a falha e encaminhar para assistência; o fabricante reserva o acesso elétrico a pessoal autorizado.']
    }),
    symptom({
      id:'icool-no-power', name:'Equipamento não funciona', appliesToModels:['icool-300','icool-450','icool-900'], component:'Alimentação', sourceId:'frigoglass-icool', sourceSection:'11. Troubleshooting — The ICM does not work', validationLevel:'FAMILY_DOCUMENTED',
      possibleCauses:['Cabo de alimentação não ligado','Sem alimentação na tomada'],
      triageQuestions:['Existe algum sinal de alimentação?','A tomada tem alimentação disponível?'],
      safeChecks:['Confirmar externamente a alimentação. Não abrir partes elétricas.'],
      note:'Aplicável aos modelos ICOOL abrangidos pelo manual público da série; confirmar variante na placa.'
    }),
    symptom({
      id:'icool-not-cooling', name:'Equipamento não arrefece', appliesToModels:['icool-300','icool-450','icool-900'], component:'Refrigeração / circulação de ar', sourceId:'frigoglass-icool', sourceSection:'11. Troubleshooting — The ICM does not cool', validationLevel:'FAMILY_DOCUMENTED',
      possibleCauses:['Carga recente de produtos quentes','Circulação de ar interior bloqueada pela carga'],
      triageQuestions:['O equipamento foi carregado recentemente?','Os produtos bloqueiam as zonas de circulação de ar?'],
      safeChecks:['Confirmar visualmente a distribuição da carga. Acesso ao sistema de refrigeração deve ser feito apenas por pessoal autorizado.']
    }),
    symptom({
      id:'energize-unable-dispense', name:'Não dispensa bebida', appliesToModels:['energize-3','energize-4','energize-5'], component:'Alimentação / torre / controlo', sourceId:'cornelius-energize-range', sourceSection:'Errors and malfunctions / Troubleshooting table — Unable to dispense', validationLevel:'FAMILY_DOCUMENTED',
      possibleCauses:['Sem alimentação elétrica','Transformador ou fusível do transformador com falha'],
      triageQuestions:['A torre/equipamento apresenta alimentação?','A falha afeta todas as bebidas?'],
      safeChecks:['Confirmar apenas o estado externo de alimentação. A documentação Cornelius reserva instalação, manutenção e reparação a técnicos treinados/certificados.']
    }),
    symptom({
      id:'energize-warm-compressor-running', name:'Bebida demasiado quente com compressor em funcionamento', appliesToModels:['energize-3','energize-4','energize-5'], component:'Refrigeração', sourceId:'cornelius-energize-range', sourceSection:'Errors and malfunctions — Beverage is too warm and compressor is running', validationLevel:'FAMILY_DOCUMENTED',
      possibleCauses:['Dispensação acima da capacidade','Condensador sujo ou coberto','Motor agitador com falha','Bomba de circulação com falha'],
      triageQuestions:['O problema surge apenas em períodos de grande procura?','A bebida está quente em todas as seleções?'],
      safeChecks:['Não abrir a unidade. Registar o contexto de utilização e escalar para assistência se persistir.']
    }),
    symptom({
      id:'energize-only-soda', name:'Sai apenas soda/água gaseificada', appliesToModels:['energize-3','energize-4','energize-5'], component:'Xarope / pressão / válvula', sourceId:'cornelius-energize-range', sourceSection:'Errors and malfunctions — Only soda is being dispensed', validationLevel:'FAMILY_DOCUMENTED',
      possibleCauses:['Recipiente de xarope vazio','Ligações do recipiente de xarope incorretas','Pressão de CO₂ do circuito de xarope incorreta','Tubo de xarope desligado ou contaminado','Válvula da torre incorretamente ajustada ou com defeito'],
      triageQuestions:['A falha afeta todos os sabores ou apenas um?','Sai água gaseificada mas não sai xarope?'],
      safeChecks:['Registar quais sabores são afetados. Não ajustar pressões, válvulas ou ligações técnicas durante a chamada.']
    }),
    symptom({
      id:'freestyle-screen-frozen', name:'Ecrã bloqueado ou sem resposta', appliesToModels:['freestyle-7100','freestyle-8100','freestyle-9100'], component:'Interface / sistema', sourceId:'cokesolutions-troubleshooting', sourceSection:'Coca-Cola Freestyle — Not Dispensing or Screen Frozen and Not Responding', validationLevel:'FAMILY_DOCUMENTED',
      triageQuestions:['O ecrã está totalmente sem resposta?','A máquina também deixou de dispensar?','Existe mensagem visível?'],
      safeChecks:['Registar a mensagem/estado apresentado e seguir apenas o procedimento operacional oficial autorizado para o local.'],
      note:'A fonte oficial descreve o cenário ao nível da família Freestyle, não como diagnóstico específico de um modelo.'
    }),
    symptom({
      id:'freestyle-not-dispensing', name:'Não dispensa bebida', appliesToModels:['freestyle-7100','freestyle-8100','freestyle-9100'], component:'Dispensação', sourceId:'cokesolutions-troubleshooting', sourceSection:'Coca-Cola Freestyle — Not Dispensing or Screen Frozen and Not Responding', validationLevel:'FAMILY_DOCUMENTED',
      triageQuestions:['A falha afeta todos os sabores?','O ecrã continua a responder?'],
      safeChecks:['Registar seleções afetadas e mensagens no ecrã antes de escalar.']
    }),
    symptom({
      id:'freestyle-diet-unavailable', name:'Opções diet/sem açúcar não são dispensadas', appliesToModels:['freestyle-7100','freestyle-8100','freestyle-9100'], component:'Ingrediente NNS', sourceId:'cokesolutions-troubleshooting', sourceSection:'Coca-Cola Freestyle — Not Dispensing Diet Drinks', validationLevel:'FAMILY_DOCUMENTED',
      possibleCauses:['Adoçante NNS vazio','Adoçante NNS fora da data de utilização indicada'],
      triageQuestions:['As bebidas regulares funcionam?','A falha afeta apenas opções diet/sem açúcar?'],
      safeChecks:['Confirmar o estado indicado pelo sistema e seguir apenas o procedimento operacional oficial para consumíveis.']
    }),
    symptom({
      id:'dn5800-selection-no-vend', name:'Seleção não entrega produto', appliesToModels:['dn-5800'], component:'Mecanismo de venda', sourceId:'crane-dn5800', sourceSection:'Troubleshooting / vending mechanism', validationLevel:'MODEL_DOCUMENTED',
      triageQuestions:['A falha ocorre numa seleção específica ou em várias?','O produto fica visivelmente preso?','O pagamento/crédito é reconhecido?'],
      safeChecks:['Registar a seleção e o comportamento observado. Não abrir o mecanismo; o manual de serviço destina reparações a técnicos qualificados.']
    }),
    symptom({
      id:'vending-payment-or-vend-failure', name:'Pagamento aceite mas produto não dispensado', appliesToModels:['glass-front-small','glass-front-large','dn-5800'], component:'Pagamento / controlador / mecanismo', sourceId:'crane-bevmax4', sourceSection:'Troubleshooting / service information', validationLevel:'MANUFACTURER_FAMILY',
      triageQuestions:['O crédito aparece no visor?','A falha ocorre em todas as seleções?','Existe produto preso?'],
      safeChecks:['Registar o valor aceite e a seleção tentada; não aceder ao compartimento técnico.']
    })
  ]);
})();
