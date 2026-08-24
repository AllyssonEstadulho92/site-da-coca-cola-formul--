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

  window.EquipmentSymptomsV5 = Object.freeze([
    symptom({
      id:'plus450-no-cooling', name:'Ligada mas sem frio',
      appliesToModels:['plus-450'], component:'Refrigeração / circulação de ar', sourceId:'project-manual', sourceSection:'62. PLUS 450',
      possibleCauses:['Condensador obstruído','Sensor de temperatura com falha','Porta desalinhada ou borracha gasta','Ventoinha interna bloqueada','Produtos mal posicionados a bloquear circulação de ar'],
      triageQuestions:['A iluminação está ligada?','O problema afeta todas as prateleiras ou apenas uma zona?','A porta fecha completamente?'],
      safeChecks:['Confirmar se a porta fica totalmente fechada','Confirmar se os produtos não estão encostados às saídas de ar']
    }),
    symptom({
      id:'plus450-lower-shelf-warm', name:'Bebidas da prateleira inferior quentes',
      appliesToModels:['plus-450'], component:'Circulação de ar', sourceId:'project-manual', sourceSection:'62. PLUS 450',
      possibleCauses:['Ventoinha interna bloqueada','Produtos mal posicionados a bloquear circulação de ar','Condensador obstruído'],
      triageQuestions:['As prateleiras superiores estão frias?','Existe excesso de produto encostado ao fundo?'],
      safeChecks:['Confirmar visualmente se as saídas de ar não estão tapadas por produto']
    }),
    symptom({
      id:'icool300-light-on-no-cold', name:'Luz acesa mas não está fria',
      appliesToModels:['icool-300'], component:'Refrigeração', sourceId:'project-manual', sourceSection:'4 / 40 / 59. ICOOL 300',
      possibleCauses:['Falha na ventoinha de circulação','Grelha do condensador obstruída','Compressor a trabalhar continuamente por problema no termóstato','Vedação da porta danificada','Sensor de temperatura avariado'],
      triageQuestions:['A luz interior mantém-se acesa?','O equipamento está frio em alguma zona?','A porta fecha corretamente?'],
      safeChecks:['Confirmar se os produtos não bloqueiam as saídas de ar','Confirmar se a porta fecha completamente']
    }),
    symptom({
      id:'icool300-noise', name:'Motor faz muito barulho / barulho estranho',
      appliesToModels:['icool-300'], component:'Ventilação / refrigeração', sourceId:'project-manual', sourceSection:'4 / 59. ICOOL 300',
      possibleCauses:['Ventoinha solta ou avariada','Condensador sem manutenção'],
      triageQuestions:['O ruído é contínuo ou intermitente?','O equipamento continua a arrefecer?'],
      safeChecks:['Registar quando o ruído ocorre; não abrir painéis nem remover proteções']
    }),
    symptom({
      id:'icool450-top-cold-bottom-warm', name:'Parte de cima fria e parte de baixo quente',
      appliesToModels:['icool-450'], component:'Circulação de ar', sourceId:'project-manual', sourceSection:'10. ICOOL 450',
      possibleCauses:['Obstrução das saídas de ar inferior','Ventoinha avariada','Condensador sujo ou com poeira acumulada','Termóstato desregulado'],
      triageQuestions:['A diferença de temperatura é clara entre topo e base?','Há produto a bloquear as grelhas inferiores?'],
      safeChecks:['Confirmar visualmente se as grelhas internas não estão obstruídas']
    }),
    symptom({
      id:'icool450-door', name:'Porta não fecha bem',
      appliesToModels:['icool-450'], component:'Porta / vedação', sourceId:'project-manual', sourceSection:'10. ICOOL 450',
      possibleCauses:['Borracha de vedação solta ou rasgada'],
      triageQuestions:['A porta fica aberta sozinha?','A borracha apresenta folga ou dano visível?'],
      safeChecks:['Inspecionar apenas visualmente a vedação; não desmontar a porta']
    }),
    symptom({
      id:'icool900-zone-temperature', name:'Bebidas de cima frias e de baixo quentes',
      appliesToModels:['icool-900'], component:'Circulação de ar / degelo', sourceId:'project-manual', sourceSection:'5. ICOOL 900',
      possibleCauses:['Obstrução das saídas de ar interno','Ventoinha inferior avariada','Acumulação de gelo por falha de degelo automático','Termóstato em loop contínuo'],
      triageQuestions:['O problema está concentrado na parte inferior?','Existe gelo visível?','O equipamento está muito carregado?'],
      safeChecks:['Confirmar se a carga não bloqueia as saídas de ar']
    }),
    symptom({
      id:'icool900-door', name:'Porta não fecha bem',
      appliesToModels:['icool-900'], component:'Porta / vedação', sourceId:'project-manual', sourceSection:'5. ICOOL 900',
      possibleCauses:['Borracha da porta deformada'],
      triageQuestions:['Qual das portas não fecha?','Existe deformação visível na borracha?'],
      safeChecks:['Inspecionar visualmente a vedação sem desmontagem']
    }),
    symptom({
      id:'retro-not-cooling', name:'Vitrine não gela corretamente',
      appliesToModels:['retro'], component:'Refrigeração estática', sourceId:'project-manual', sourceSection:'2. RETRO',
      possibleCauses:['Respiro entupido','Gás refrigerante insuficiente','Tampa com vedação danificada','Obstrução no evaporador','Sujidade acumulada no condensador'],
      triageQuestions:['A tampa fecha completamente?','Existe formação anormal de gelo?','O equipamento deixou de arrefecer por completo ou apenas perdeu rendimento?'],
      safeChecks:['Confirmar apenas se a tampa fecha corretamente e registar gelo visível']
    }),
    symptom({
      id:'retro-noise', name:'Barulho estranho',
      appliesToModels:['retro'], component:'Refrigeração', sourceId:'project-manual', sourceSection:'2. RETRO',
      possibleCauses:['Obstrução no evaporador','Sujidade acumulada no condensador'],
      triageQuestions:['O ruído começou recentemente?','O equipamento continua a arrefecer?'],
      safeChecks:['Não remover tampas técnicas; registar o tipo e momento do ruído']
    }),
    symptom({
      id:'v544-bottom-warm', name:'Parte inferior quente',
      appliesToModels:['v-544'], component:'Circulação de ar', sourceId:'project-manual', sourceSection:'26. V-544',
      possibleCauses:['Falha numa das ventoinhas','Temperatura descalibrada','Condensador com poeira acumulada','Sensor de temperatura inativo'],
      triageQuestions:['A parte superior continua fria?','Há produto a bloquear circulação de ar?'],
      safeChecks:['Confirmar visualmente a disposição dos produtos']
    }),
    symptom({
      id:'v544-door', name:'Porta não fecha corretamente',
      appliesToModels:['v-544'], component:'Porta / vedação', sourceId:'project-manual', sourceSection:'26. V-544',
      possibleCauses:['Borracha da porta ressequida ou deslocada'],
      triageQuestions:['A porta fica entreaberta?','A vedação apresenta folga visível?'],
      safeChecks:['Inspecionar visualmente a borracha sem desmontagem']
    }),
    symptom({
      id:'v545-irregular-cooling', name:'Frio irregular nas prateleiras',
      appliesToModels:['v-545-8'], component:'Circulação de ar', sourceId:'project-manual', sourceSection:'57. V 545/8',
      possibleCauses:['Ventoinha inativa ou desgastada','Sensor de temperatura mal posicionado','Grelhas obstruídas por excesso de produto','Condensador sujo ou sem espaço de ventilação'],
      triageQuestions:['Quais prateleiras apresentam menor refrigeração?','Existe excesso de produto encostado ao fundo?'],
      safeChecks:['Confirmar visualmente que os produtos não bloqueiam as grelhas']
    }),
    symptom({
      id:'v545-fogged-door', name:'Porta embaciada',
      appliesToModels:['v-545-8'], component:'Porta / vedação', sourceId:'project-manual', sourceSection:'57. V 545/8',
      possibleCauses:['Borracha da porta com folga'],
      triageQuestions:['O embaciamento é permanente ou ocorre apenas em determinados períodos?'],
      safeChecks:['Verificar visualmente se a porta fecha por completo']
    }),
    symptom({
      id:'loopxl-horizontal-ice', name:'Gelo nas laterais',
      appliesToModels:['loop-xl-horizontal'], component:'Refrigeração estática / vedação', sourceId:'project-manual', sourceSection:'58. LOOP XL horizontal',
      possibleCauses:['Tampa com falha na vedação','Termóstato desregulado','Excesso de produto acumulado no fundo','Instalação sem nivelamento correto'],
      triageQuestions:['O gelo aparece em ambas as laterais?','As tampas fecham completamente?'],
      safeChecks:['Registar a localização do gelo e confirmar se as tampas fecham']
    }),
    symptom({
      id:'loopxl-horizontal-water', name:'Água acumulada na base',
      appliesToModels:['loop-xl-horizontal'], component:'Drenagem', sourceId:'project-manual', sourceSection:'58. LOOP XL horizontal',
      possibleCauses:['Dreno obstruído','Instalação sem nivelamento correto'],
      triageQuestions:['A água aparece continuamente ou após degelo?','O equipamento parece nivelado?'],
      safeChecks:['Não desmontar o dreno; registar a localização da água e escalar se existir risco no piso']
    }),
    symptom({
      id:'s78-no-cooling', name:'Ligado mas sem arrefecer',
      appliesToModels:['s-78'], component:'Refrigeração estática', sourceId:'project-manual', sourceSection:'64. S-78',
      possibleCauses:['Termóstato com defeito','Evaporador com gelo acumulado','Falta de manutenção no condensador','Fuga parcial de gás refrigerante','Vedação da porta danificada'],
      triageQuestions:['O equipamento mantém algum frio?','Existe gelo visível?','A porta fecha corretamente?'],
      safeChecks:['Confirmar visualmente gelo e vedação; não intervir no circuito de refrigeração']
    }),
    symptom({
      id:'s78-excessive-ice', name:'Formação excessiva de gelo',
      appliesToModels:['s-78'], component:'Evaporador / controlo de temperatura', sourceId:'project-manual', sourceSection:'64. S-78',
      possibleCauses:['Termóstato com defeito','Evaporador com gelo acumulado','Vedação da porta danificada'],
      triageQuestions:['Onde se forma o gelo?','A porta fecha completamente?'],
      safeChecks:['Registar a zona de formação de gelo e escalar para assistência']
    }),
    symptom({
      id:'energize3-only-gas', name:'Sai só gás',
      appliesToModels:['energize-3'], component:'Xarope / CO₂ / mistura', sourceId:'project-manual', sourceSection:'8. ENERGIZE 3',
      possibleCauses:['Tubagem de xarope com entrada de ar','Bomba desativada ou com falha','CO₂ esgotado','Torneira entupida ou válvula de mistura avariada'],
      triageQuestions:['O problema afeta todas as torneiras ou apenas uma?','Sai água ou apenas gás?'],
      safeChecks:['Registar quais sabores são afetados; não abrir linhas ou válvulas técnicas']
    }),
    symptom({
      id:'energize3-no-flavour', name:'Refrigerante sem sabor',
      appliesToModels:['energize-3'], component:'Xarope / mistura', sourceId:'project-manual', sourceSection:'8. ENERGIZE 3',
      possibleCauses:['Tubagem de xarope com entrada de ar','Bomba desativada ou com falha','Válvula de mistura avariada','Filtros ou serpentina sujos'],
      triageQuestions:['A falta de sabor ocorre em todos os produtos?','O problema começou após troca de xarope?'],
      safeChecks:['Registar os sabores afetados e escalar se persistir']
    }),
    symptom({
      id:'energize3-valve', name:'Uma torneira não funciona',
      appliesToModels:['energize-3'], component:'Válvula / torneira', sourceId:'project-manual', sourceSection:'8. ENERGIZE 3',
      possibleCauses:['Torneira entupida ou válvula de mistura avariada','Bomba desativada ou com falha'],
      triageQuestions:['As restantes torneiras funcionam normalmente?'],
      safeChecks:['Não desmontar a válvula; registar a posição/sabor afetado']
    }),
    symptom({
      id:'energize4-water-or-gas', name:'Sai apenas água ou apenas gás',
      appliesToModels:['energize-4'], component:'Xarope / CO₂ / mistura', sourceId:'project-manual', sourceSection:'6. ENERGIZE 4',
      possibleCauses:['Bombas dos concentrados desligadas ou avariadas','Nível de CO₂ insuficiente','Tubagem do xarope entupida ou com ar','Válvulas de mistura desreguladas','Sensor de nível da cuba principal com falha'],
      triageQuestions:['A anomalia ocorre em todos os sabores?','Sai água, gás ou nenhum líquido?'],
      safeChecks:['Registar exatamente o que sai de cada seleção; não alterar pressões ou válvulas']
    }),
    symptom({
      id:'energize4-taste', name:'Sabor estranho ou aguado',
      appliesToModels:['energize-4'], component:'Mistura água/xarope', sourceId:'project-manual', sourceSection:'6. ENERGIZE 4',
      possibleCauses:['Tubagem do xarope entupida ou com ar','Válvulas de mistura desreguladas','Bombas dos concentrados desligadas ou avariadas'],
      triageQuestions:['Quais produtos apresentam alteração de sabor?','O problema é constante?'],
      safeChecks:['Registar sabores afetados e escalar para calibração técnica']
    }),
    symptom({
      id:'energize4-no-dispense', name:'Não sai bebida',
      appliesToModels:['energize-4'], component:'Dispensação / pressão', sourceId:'project-manual', sourceSection:'6. ENERGIZE 4',
      possibleCauses:['Bombas dos concentrados desligadas ou avariadas','Nível de CO₂ insuficiente','Sensor de nível da cuba principal com falha'],
      triageQuestions:['Nenhuma seleção funciona ou apenas algumas?'],
      safeChecks:['Registar seleções afetadas; não intervir em circuitos pressurizados']
    }),
    symptom({
      id:'loopxl-postmix-gas', name:'Bebida sai só com gás',
      appliesToModels:['loop-xl-postmix'], component:'Xarope / CO₂', sourceId:'project-manual', sourceSection:'7. LOOP XL Post-Mix',
      possibleCauses:['Bomba de xarope avariada ou desligada','CO₂ com pressão fraca ou garrafa vazia','Misturador desregulado'],
      triageQuestions:['O problema afeta todas as válvulas?','Sai água juntamente com o gás?'],
      safeChecks:['Registar válvulas afetadas; não ajustar pressão de CO₂']
    }),
    symptom({
      id:'loopxl-postmix-no-flavour', name:'Sai água mas sem sabor',
      appliesToModels:['loop-xl-postmix'], component:'Xarope / mistura', sourceId:'project-manual', sourceSection:'7. LOOP XL Post-Mix',
      possibleCauses:['Bomba de xarope avariada ou desligada','Misturador desregulado'],
      triageQuestions:['Quais sabores são afetados?'],
      safeChecks:['Registar sabores afetados sem abrir linhas de xarope']
    }),
    symptom({
      id:'loopxl-postmix-warm', name:'Bebidas quentes',
      appliesToModels:['loop-xl-postmix'], component:'Refrigeração / gelo', sourceId:'project-manual', sourceSection:'7. LOOP XL Post-Mix',
      possibleCauses:['Falta de gelo na cuba','Sensor de temperatura ou de nível com falha'],
      triageQuestions:['Existe gelo disponível no equipamento?','Todas as bebidas saem quentes?'],
      safeChecks:['Confirmar visualmente a disponibilidade de gelo sem desmontar o equipamento']
    }),
    symptom({
      id:'energize5-10p-controls', name:'Botões não respondem',
      appliesToModels:['energize-5-10p'], component:'Painel / controlo eletrónico', sourceId:'project-manual', sourceSection:'39. ENERGIZE 5 10P',
      possibleCauses:['Painel com erro de programação','Problema na placa eletrónica de comando'],
      triageQuestions:['Nenhum botão responde ou apenas algumas seleções?','Existe mensagem ou código no visor?'],
      safeChecks:['Registar mensagem/código apresentado e escalar; não abrir o painel']
    }),
    symptom({
      id:'energize5-10p-warm-watery', name:'Bebida morna ou aguada',
      appliesToModels:['energize-5-10p'], component:'Refrigeração / xarope / CO₂', sourceId:'project-manual', sourceSection:'39. ENERGIZE 5 10P',
      possibleCauses:['Nível de gelo insuficiente na cuba','Bomba de xarope avariada','CO₂ com pressão irregular'],
      triageQuestions:['O problema afeta todos os sabores?','Existe gelo disponível?'],
      safeChecks:['Confirmar visualmente a disponibilidade de gelo; não ajustar pressões']
    }),
    symptom({
      id:'freestyle-screen-frozen', name:'Ecrã bloqueado ou sem resposta',
      appliesToCategories:['Freestyle'], component:'Interface / sistema', sourceId:'cokesolutions-troubleshooting', sourceSection:'Coca-Cola Freestyle Not Dispensing or Screen Frozen and Not Responding', validationLevel:'FAMILY_OFFICIAL',
      possibleCauses:[],
      triageQuestions:['O ecrã está totalmente congelado ou responde parcialmente?','A máquina também deixou de dispensar bebidas?','Existe alguma mensagem visível?'],
      safeChecks:['Registar a mensagem apresentada e o alcance da falha. Utilizar apenas o procedimento oficial autorizado para reinício se aplicável no local.'],
      note:'Sintoma validado para a família Coca-Cola Freestyle; não equivale a diagnóstico específico do 7100/8100/9100.'
    }),
    symptom({
      id:'freestyle-not-dispensing', name:'Máquina não dispensa bebida',
      appliesToCategories:['Freestyle'], component:'Dispensação', sourceId:'cokesolutions-troubleshooting', sourceSection:'Coca-Cola Freestyle Not Dispensing or Screen Frozen and Not Responding', validationLevel:'FAMILY_OFFICIAL',
      possibleCauses:[],
      triageQuestions:['A falha afeta todos os sabores?','O ecrã continua a responder?'],
      safeChecks:['Registar sabores/seleções afetados e mensagens no ecrã antes de escalar.'],
      note:'Validado ao nível da família, não como causa específica de cada modelo.'
    }),
    symptom({
      id:'freestyle-diet-unavailable', name:'Bebidas diet/sem açúcar não são dispensadas',
      appliesToCategories:['Freestyle'], component:'Ingrediente / adoçante NNS', sourceId:'cokesolutions-troubleshooting', sourceSection:'Coca-Cola Freestyle Not Dispensing Diet Drinks', validationLevel:'FAMILY_OFFICIAL',
      possibleCauses:['Adoçante NNS vazio','Adoçante NNS fora da data de utilização indicada'],
      triageQuestions:['As bebidas regulares funcionam?','A falha afeta apenas opções diet/sem açúcar?'],
      safeChecks:['Confirmar apenas o estado indicado pelo sistema e seguir o procedimento operacional oficial autorizado para consumíveis.'],
      note:'Causas descritas pela fonte oficial para o cenário de bebidas diet; confirmar sempre o estado real no equipamento.'
    }),
    symptom({
      id:'dixie-selection-no-vend', name:'Seleção não entrega produto',
      appliesToCategories:['Vending'], manufacturerIncludes:'Dixie Narco', component:'Mecanismo de venda', sourceId:'dixie-narco-glassfront', sourceSection:'Troubleshooting — Selection will not vend', validationLevel:'MANUFACTURER_FAMILY',
      possibleCauses:['Preço configurado incorretamente','Crédito insuficiente','Produto/gate incompatível','Gate preso','Inserto da bandeja sujo ou gasto','Ligação solta','Solenoide, cabo ou controlador com defeito'],
      triageQuestions:['A falha ocorre numa seleção específica ou em todas?','O pagamento/crédito é reconhecido?','O produto está visivelmente preso?'],
      safeChecks:['Não abrir nem intervir no mecanismo durante a chamada; registar seleção e comportamento observado.'],
      note:'Aplicável a famílias Dixie-Narco compatíveis; não assumir causa sem diagnóstico técnico.'
    }),
    symptom({
      id:'dixie-payment-no-vend', name:'Pagamento aceite mas produto não dispensado',
      appliesToCategories:['Vending'], manufacturerIncludes:'Dixie Narco', component:'Pagamento / controlador / venda', sourceId:'dixie-narco-siid', sourceSection:'SIID Coin/Currency — Accepts coins and displays, but will not vend', validationLevel:'MANUFACTURER_FAMILY',
      possibleCauses:['Mecanismo de moedas','Ligações entre validador/trocador e placa de controlo','Alimentação do controlador','Placa de controlo'],
      triageQuestions:['O crédito aparece no visor?','A falha ocorre em todas as seleções?'],
      safeChecks:['Registar o valor aceite e a seleção tentada; não abrir o compartimento técnico.']
    }),
    symptom({
      id:'dixie-payment-rejected', name:'Não aceita moedas ou notas',
      appliesToCategories:['Vending'], manufacturerIncludes:'Dixie Narco', component:'Pagamento', sourceId:'dixie-narco-siid', sourceSection:'SIID Coin/Currency — Will not accept coins or bills', validationLevel:'MANUFACTURER_FAMILY',
      possibleCauses:['Alavanca de devolução acionada','Falha no mecanismo/validador','Mau contacto ou cablagem','Placa de controlo'],
      triageQuestions:['Não aceita moedas, notas ou ambos?','O visor apresenta algum estado de indisponibilidade?'],
      safeChecks:['Confirmar se o equipamento indica indisponibilidade de pagamento; não aceder a fusíveis ou cablagem.']
    })
  ]);
})();
