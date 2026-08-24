(() => {
  'use strict';

  const S = (id, name, observableDescription, options = {}) => ({
    id,
    name,
    observableDescription,
    applicableFamilies: options.applicableFamilies || [],
    confirmedModels: options.confirmedModels || [],
    component: options.component || '',
    possibleCauses: options.possibleCauses || [],
    triageQuestions: options.triageQuestions || [],
    safeChecks: options.safeChecks || [],
    escalation: options.escalation || 'Escalar para assistência técnica quando o sintoma persiste ou exige acesso técnico ao equipamento.',
    sourceIds: options.sourceIds || ['project-manual'],
    validation: options.validation || 'PROJECT_MANUAL'
  });

  window.EquipmentSymptomsV5 = Object.freeze([
    S('powered-no-cooling', 'Ligado, mas não arrefece', 'O equipamento aparenta estar ligado, mas as bebidas ou o interior não atingem a temperatura esperada.', {
      confirmedModels: ['PLUS 450','ICOOL 300','DN 3061','S-78','LOOP XL Horizontal'], component: 'refrigeração',
      possibleCauses: ['Condensador obstruído ou sem limpeza','Falha de ventilação/circulação','Sensor ou termóstato com falha','Problema de vedação','Carga de refrigerante insuficiente apenas onde o manual o refere'],
      triageQuestions: ['O equipamento está ligado e com iluminação/indicador ativo?','O problema afeta todo o interior ou apenas uma zona?','Há gelo, água ou ruído anormal visível/audível?'],
      safeChecks: ['Confirmar sem desmontagem que as grelhas externas não estão bloqueadas por objetos e que existe espaço de ventilação conforme a instalação.']
    }),
    S('lower-zone-warm', 'Zona inferior mais quente', 'A zona inferior ou algumas prateleiras permanecem mais quentes do que o restante equipamento.', {
      confirmedModels: ['PLUS 450','ICOOL 300','ICOOL 450','ICOOL 900','V-544'], component: 'circulação de ar',
      possibleCauses: ['Saídas de ar obstruídas','Ventoinha interna com falha','Carga de produtos a bloquear circulação','Sensor/controlo de temperatura com falha'],
      triageQuestions: ['A diferença de temperatura é apenas entre prateleiras?','Existe produto encostado às saídas de ar?','A porta fecha completamente?']
    }),
    S('door-not-closing', 'Porta não fecha corretamente', 'A porta não encosta, não mantém o fecho ou apresenta folga visível.', {
      confirmedModels: ['ICOOL 450','ICOOL 900','PLUS 900','V-544'], component: 'porta/vedação',
      possibleCauses: ['Borracha de vedação danificada ou deslocada','Porta desalinhada','Fecho desnivelado'],
      triageQuestions: ['A porta fica aberta sozinha ou apenas apresenta folga?','A borracha está visivelmente solta, rasgada ou deformada?','Existe algum produto a impedir o fecho?'],
      safeChecks: ['Remover apenas obstruções externas ou produtos que estejam claramente a impedir o fecho; não desmontar dobradiças ou fechos.']
    }),
    S('abnormal-noise', 'Ruído anormal', 'O cliente ouve ruído, vibração ou som diferente do funcionamento habitual.', {
      confirmedModels: ['ICOOL 300','RETRO','S288','SC410','NUTI 3180H'], component: 'ventilação/refrigeração/estrutura',
      possibleCauses: ['Ventoinha com desgaste ou bloqueio','Nivelamento incorreto onde documentado','Compressor/arranque ruidoso onde documentado','Bomba de recirculação em post-mix onde documentado'],
      triageQuestions: ['O ruído é contínuo ou acontece apenas no arranque?','Vem da zona inferior, traseira ou do interior?','O equipamento continua a refrigerar/dispensar normalmente?']
    }),
    S('excess-ice', 'Formação excessiva de gelo', 'É visível gelo acima do normal no interior, evaporador ou cantos do equipamento.', {
      confirmedModels: ['S-78','RVC 400'], component: 'degelo/vedação/drenagem',
      possibleCauses: ['Termóstato com defeito','Evaporador com gelo acumulado','Vedação deficiente','Condições de drenagem/uso descritas no manual'],
      triageQuestions: ['Onde está concentrado o gelo?','A porta/tampa fecha corretamente?','Existe água acumulada juntamente com o gelo?']
    }),
    S('water-accumulation', 'Água acumulada ou a pingar', 'Existe água no fundo do equipamento, no interior ou a pingar para o exterior.', {
      confirmedModels: ['FV 280','RVC 400','BC 80B','LOOP XL Horizontal'], component: 'drenagem/refrigeração',
      possibleCauses: ['Dreno entupido','Gelo acumulado no evaporador','Vedação deficiente','Instalação/ventilação inadequada onde documentado'],
      triageQuestions: ['A água está dentro do equipamento ou no piso?','O problema aparece continuamente ou após degelo/uso intenso?','Há gelo acumulado visível?'],
      safeChecks: ['Manter a área do piso seca e sinalizada para evitar escorregamento; não desmontar o dreno ou circuito.']
    }),
    S('condensation-heavy', 'Condensação excessiva', 'Existe condensação anormal nas paredes, vidro ou interior do equipamento.', {
      confirmedModels: ['DN 3061'], component: 'refrigeração/vedação',
      possibleCauses: ['Sensor de temperatura com falha','Condensador obstruído','Ventoinha interna com falha','Vedação da porta defeituosa'],
      triageQuestions: ['A condensação está no vidro, paredes internas ou exterior?','A porta fecha completamente?','O equipamento continua a refrigerar?']
    }),
    S('not-cold-enough', 'Bebidas pouco frias', 'As bebidas estão mais quentes do que o esperado, apesar do equipamento estar em funcionamento.', {
      confirmedModels: ['BC 80B','FV 280','SC410'], component: 'refrigeração',
      possibleCauses: ['Respiro/condensador obstruído','Ajuste de temperatura inadequado onde documentado','Vedação da porta','Ventilação traseira insuficiente'],
      triageQuestions: ['As bebidas estão uniformemente pouco frias?','O equipamento está muito carregado ou junto a fonte de calor?','A porta fecha normalmente?']
    }),
    S('only-gas', 'Sai apenas gás', 'Ao acionar uma saída, não é dispensada a mistura normal da bebida e o cliente refere apenas gás/ar.', {
      confirmedModels: ['ENERGIZE 3','ENERGIZE 4','ENERGIZE 4 8P','LOOP XL Post-Mix','3180 H PM','RECOR 1/3 5P PM','APEXX 3H 6P PM'], component: 'xarope/CO₂/válvula',
      possibleCauses: ['Linha ou bomba de xarope com falha','Entrada de ar na tubagem','Válvula/misturador obstruído','Pressão/fornecimento de CO₂ fora do esperado onde documentado'],
      triageQuestions: ['O problema ocorre em um sabor ou em todos?','Sai água, gás ou nenhum líquido?','O problema começou após troca de xarope/CO₂ ou higienização?']
    }),
    S('no-flavor-watery', 'Bebida sem sabor ou demasiado aguada', 'A bebida sai com sabor muito fraco, sem xarope aparente ou com mistura incorreta.', {
      confirmedModels: ['ENERGIZE 3','ENERGIZE 3H','ENERGIZE 4','3180 H PM','RECOR 1/3 4P PM'], component: 'mistura água/xarope',
      possibleCauses: ['Bomba/linha de xarope com falha','Entrada de ar na tubagem','Misturador/ratio desregulado','Válvula com obstrução'],
      triageQuestions: ['Acontece em um sabor ou em vários?','A bebida mantém gás?','O problema apareceu depois de troca de produto ou manutenção?']
    }),
    S('no-dispense-one-valve', 'Uma saída não dispensa', 'Uma torneira, válvula ou seleção específica não fornece bebida enquanto outras podem continuar disponíveis.', {
      confirmedModels: ['ENERGIZE 3','ENERGIZE 4 8P','RECOR 1/3 5P PM'], component: 'válvula/bomba/seleção',
      possibleCauses: ['Válvula entupida ou com desgaste','Bomba de xarope com falha','Falha de comando da saída onde documentado'],
      triageQuestions: ['Qual sabor/posição está afetado?','As restantes saídas funcionam?','A saída afetada faz algum som ou inicia fluxo?']
    }),
    S('flat-drink', 'Bebida sem gás', 'A bebida é dispensada, mas o cliente refere pouca ou nenhuma carbonatação.', {
      confirmedModels: ['ENERGIZE 3H'], applicableFamilies: ['Postmix'], component: 'carbonatação/CO₂',
      possibleCauses: ['Pressão de CO₂ insuficiente','Perda de água/refrigeração do sistema de carbonatação conforme documentação oficial'],
      triageQuestions: ['A bebida está também quente?','O problema afeta todas as bebidas gaseificadas?','Existe gelo suficiente no dispensador quando aplicável?'],
      safeChecks: ['Em sistemas fountain abrangidos pelo Phone Fix oficial, confirmar se há gelo suficiente; se houver dúvida sobre pressão, cilindros ou instalação, escalar.'],
      sourceIds: ['project-manual','cokesolutions-self-help'], validation: 'MIXED_PROJECT_OFFICIAL'
    }),
    S('warm-beverage', 'Bebida demasiado quente', 'A bebida dispensada está mais quente do que o normal.', {
      confirmedModels: ['ENERGIZE 5 10P','LOOP XL Post-Mix','NUTI 3180H','MÓDULO M 5P PM'], applicableFamilies: ['Postmix'], component: 'gelo/refrigeração/recirculação',
      possibleCauses: ['Gelo insuficiente ou mal distribuído','Bomba de recirculação com falha','Sensor de temperatura fora da posição/escala'],
      triageQuestions: ['Acontece em todas as saídas?','Existe gelo suficiente no equipamento quando aplicável?','O sintoma é contínuo ou só em períodos de maior uso?'],
      safeChecks: ['Quando o modelo usa cuba de gelo e a documentação o permite, confirmar visualmente se existe gelo suficiente sem desmontar componentes.'],
      sourceIds: ['project-manual','cokesolutions-self-help']
    }),
    S('controls-no-response', 'Botão ou seleção sem resposta', 'Um ou mais botões/seleções não respondem ao toque/pressão.', {
      confirmedModels: ['ENERGIZE 4 8P'], component: 'painel/controlo',
      possibleCauses: ['Falha de comunicação do painel com as saídas','Válvula/saída associada com falha'],
      triageQuestions: ['É um botão específico ou todo o painel?','Outras saídas respondem normalmente?','Existe mensagem/código visível?']
    }),
    S('panel-frozen', 'Painel bloqueado ou sem resposta', 'O painel/ecrã deixa de responder às ações do utilizador.', {
      confirmedModels: ['APEXX 3H 6P PM'], applicableFamilies: ['Freestyle'], component: 'interface/controlo',
      possibleCauses: ['Falha de leitura/interface no APEXX conforme manual do projeto','Estado de software/arranque em Coca-Cola Freestyle conforme Phone Fix oficial'],
      triageQuestions: ['O ecrã está ligado?','Existe mensagem ou código de erro?','O equipamento continua a dispensar alguma bebida?'],
      safeChecks: ['Para Coca-Cola Freestyle, seguir apenas o procedimento oficial Phone Fix se o operador estiver autorizado; caso contrário registar o estado e escalar.'],
      sourceIds: ['project-manual','cokesolutions-self-help'], validation: 'MIXED_PROJECT_OFFICIAL'
    }),
    S('freestyle-not-dispensing', 'Freestyle não dispensa', 'A interface pode estar ativa, mas o equipamento não dispensa a bebida selecionada.', {
      applicableFamilies: ['Freestyle'], component: 'sistema de dispensação/interface',
      possibleCauses: ['O Phone Fix oficial associa este estado a situações recuperáveis por reinício, mas não estabelece um diagnóstico único.'],
      triageQuestions: ['O ecrã responde?','Acontece com todos os sabores?','Existe mensagem no ecrã?'],
      safeChecks: ['Registar a mensagem apresentada e aplicar apenas procedimentos de operação autorizados.'],
      sourceIds: ['cokesolutions-self-help'], validation: 'OFFICIAL_FAMILY'
    }),
    S('freestyle-diet-unavailable', 'Bebidas diet não dispensam', 'As opções diet deixam de ser dispensadas enquanto outras bebidas podem permanecer disponíveis.', {
      applicableFamilies: ['Freestyle'], component: 'ingrediente NNS',
      possibleCauses: ['Caixa de adoçante NNS vazia','Produto NNS fora da data de utilização indicada'],
      triageQuestions: ['O problema afeta apenas bebidas diet?','Existe indicação de ingrediente indisponível no ecrã?'],
      safeChecks: ['A substituição/validação de ingrediente deve seguir o procedimento operacional Coca-Cola Freestyle aplicável ao estabelecimento.'],
      sourceIds: ['cokesolutions-self-help'], validation: 'OFFICIAL_FAMILY'
    }),
    S('vending-error-code', 'Máquina apresenta código de erro', 'O display da máquina de vending mostra uma condição/código de erro.', {
      applicableFamilies: ['Vending'], confirmedModels: ['Large Glass Front Vender'], component: 'controlador/display',
      possibleCauses: ['O manual Dixie-Narco documenta códigos relacionados com vend, moeda, validador, teclado e alimentação; o código exato deve ser registado antes de qualquer conclusão.'],
      triageQuestions: ['Qual é o texto/código exato no display?','A máquina aceita pagamento?','A seleção e a entrega funcionam?'],
      safeChecks: ['Registar exatamente o código apresentado; não entrar em modos de serviço sem autorização.'],
      sourceIds: ['dixie-glassfront-service','dixie-bevmax4'], validation: 'MANUFACTURER_FAMILY'
    }),
    S('vending-payment-no-vend', 'Pagamento aceite mas produto não dispensado', 'A máquina regista/aceita pagamento, mas o produto selecionado não é entregue.', {
      applicableFamilies: ['Vending'], confirmedModels: ['Large Glass Front Vender'], component: 'seleção/mecanismo de entrega',
      possibleCauses: ['Falha de seleção, estado sold-out ou mecanismo/motor de vend conforme documentação Dixie-Narco da família'],
      triageQuestions: ['O valor foi aceite/retido?','Acontece numa seleção ou em várias?','O display mostra sold out ou código de erro?'],
      safeChecks: ['Registar seleção, valor e mensagem do display; não aceder ao mecanismo interno.'],
      sourceIds: ['dixie-glassfront-service'], validation: 'MANUFACTURER_FAMILY'
    })
  ]);
})();