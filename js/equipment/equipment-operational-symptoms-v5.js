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

  const generalCodesByCategory = Object.freeze({
    Vitrines: Object.freeze(['020','029','030','031','032','033','041','042','043','044','047']),
    Monster: Object.freeze(['020','029','030','031','032','033','041','042','043','044','047']),
    Vending: Object.freeze(['020','029','030','031','032','033','041','042','043','044','051']),
    Postmix: Object.freeze(['030','031','032','033','041','051']),
    Freestyle: Object.freeze(['030','031','032','033','041','051']),
    Outros: Object.freeze(['030','031','032','033','041','051'])
  });

  function selectCodes(group, codes) {
    const allowed = new Set(codes || []);
    return Object.freeze({
      id: group.id,
      title: group.title,
      items: Object.freeze(group.items.filter(item => allowed.has(item.code)))
    });
  }

  function groupsForItem(item) {
    const category = item?.category || '';
    const selected = [groups.VANDALISMO];

    if (category === 'Postmix' || category === 'Freestyle' || category === 'Outros') {
      selected.push(groups.ESPECIFICO_DISPENSING);
    }
    if (category === 'Vending') selected.push(groups.ESPECIFICO_VENDING);

    const generalCodes = generalCodesByCategory[category] || generalCodesByCategory.Vitrines;
    const general = selectCodes(groups.FUNCIONAMENTO_GERAL, generalCodes);
    if (general.items.length) selected.push(general);

    return Object.freeze(selected);
  }

  function groupsForCategory(category) {
    return groupsForItem({ category });
  }

  window.EquipmentOperationalSymptomsV5 = Object.freeze({
    groups,
    generalCodesByCategory,
    groupsForItem,
    groupsForCategory,
    origin: 'Matriz operacional fornecida ao projeto; associação por capacidade funcional da categoria'
  });
})();
