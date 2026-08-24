(() => {
  'use strict';

  const makeGroup = (id, title, items) => Object.freeze({
    id,
    title,
    items: Object.freeze(items.map(([code, symptom]) => Object.freeze({
      key: `${id}:${code}`,
      groupId: id,
      code,
      symptom
    })))
  });

  const groups = Object.freeze({
    VANDALISMO: makeGroup('VANDALISMO', 'Vandalismo', [
      ['01', 'Equipamento vandalizado'],
      ['02', 'Equipamento deslocado'],
      ['03', 'Equipamento colocado no lixo'],
      ['04', 'Equipamento queimado'],
      ['05', 'Danos por introdução de líquidos'],
      ['06', 'Fechadura forçada'],
      ['07', 'Máquina aberta/roubo em máquina']
    ]),
    ESPECIFICO_DISPENSING: makeGroup('ESPECIFICO_DISPENSING', 'Específico Dispensing', [
      ['020', 'Não funciona (não específica avaria)'],
      ['029', 'Falha de iluminação'],
      ['044', 'Fuga de água'],
      ['049', 'Não para de sair produto'],
      ['054', 'Bebida sem gás'],
      ['055', 'Fuga CO2'],
      ['056', 'Fuga de xarope/produto'],
      ['057', 'Muita espuma'],
      ['058', 'Sabor ou odor estranho'],
      ['059', 'BIB inchados'],
      ['060', 'Problema na tanqueta KEG'],
      ['061', 'Problema na garrafa CO2'],
      ['064', 'Roubo de torneiras/acessórios'],
      ['065', 'Grafo não funciona'],
      ['066', 'Bebida aguada'],
      ['067', 'Só sai xarope'],
      ['068', 'Só sai água'],
      ['069', 'Não funciona extração de gelo'],
      ['070', 'Não sai produto']
    ]),
    ESPECIFICO_VENDING: makeGroup('ESPECIFICO_VENDING', 'Específico Vending', [
      ['065', 'Venda múltipla ou livre'],
      ['066', 'Canal encravado/não funciona'],
      ['068', 'Recusa moedas/notas'],
      ['069', 'Retém moedas/moedeiro encravado'],
      ['070', 'Não devolve troco'],
      ['071', 'Aceita moedas falsas'],
      ['073', 'Não sai produto']
    ]),
    FUNCIONAMENTO_GERAL: makeGroup('FUNCIONAMENTO_GERAL', 'Funcionamento Geral', [
      ['020', 'Não funciona (não específica avaria)'],
      ['029', 'Iluminação não funciona'],
      ['030', 'Salta em automático'],
      ['031', 'Descarga elétrica'],
      ['032', 'Não faz frio'],
      ['033', 'Faz frio em excesso'],
      ['041', 'Faz ruído'],
      ['042', 'Porta não fecha/fecha mal'],
      ['043', 'Não funciona chave'],
      ['044', 'Fuga de água'],
      ['047', 'Manete/asa rota ou solta'],
      ['048', 'Sai produto diferente do selecionado'],
      ['049', 'Não para de sair produto'],
      ['051', 'Não funciona telemetria']
    ])
  });

  function groupsForItem(item) {
    const selected = [groups.VANDALISMO];
    if (item?.category === 'Postmix' || item?.category === 'Freestyle' || item?.category === 'Outros') {
      selected.push(groups.ESPECIFICO_DISPENSING);
    }
    if (item?.category === 'Vending') selected.push(groups.ESPECIFICO_VENDING);
    selected.push(groups.FUNCIONAMENTO_GERAL);
    return Object.freeze(selected);
  }

  function groupsForCategory(category) {
    return groupsForItem({ category });
  }

  window.EquipmentOperationalSymptomsV5 = Object.freeze({
    groups,
    groupsForItem,
    groupsForCategory,
    origin: 'Matriz operacional fornecida ao projeto'
  });
})();
