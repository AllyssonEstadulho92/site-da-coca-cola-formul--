(() => {
  'use strict';

  const COMMON = {
    coolerSymptoms: ['Não liga', 'Não refrigera', 'Temperatura instável', 'Ruído ou vibração anormal', 'Condensação excessiva', 'Gelo excessivo', 'Porta não fecha/vedante danificado', 'Iluminação não funciona'],
    coolerConsequences: ['Produto fora da temperatura de serviço', 'Possível sobrecarga do compressor/ventilação', 'Aumento do consumo energético', 'Condensação ou água no piso', 'Redução da qualidade de exposição e possível perda de stock'],
    vendingSymptoms: ['Não liga', 'Produto não é entregue', 'Produto preso', 'Não aceita pagamento', 'Display/teclado sem resposta', 'Produto não refrigera', 'Motor/mecanismo com ruído', 'Porta, fechadura ou sensor com anomalia'],
    vendingConsequences: ['Indisponibilidade de venda', 'Produto danificado ou retido', 'Perdas por transação não concluída', 'Sobrecarga de motor/mecanismo se a falha persistir', 'Produto fora da temperatura de serviço', 'Maior exposição a vandalismo se a porta/fecho estiver comprometido'],
    postmixSymptoms: ['Não dispensa bebida', 'Bebida sem gás', 'Excesso de espuma', 'Sabor/ratio incorreto', 'Bebida demasiado quente', 'Fuga de água/xarope', 'Baixa pressão/indicação de CO₂', 'Dreno obstruído ou válvula presa'],
    postmixConsequences: ['Bebida fora do padrão de qualidade', 'Desperdício de xarope/água', 'Derrame e risco de piso escorregadio', 'Interrupção parcial ou total do serviço', 'Possível contaminação se a higiene/manutenção não for cumprida'],
    freestyleSymptoms: ['Ecrã sem resposta ou offline', 'Ingrediente indisponível', 'Erro de cartucho/RFID', 'Não dispensa', 'Problema no nozzle/injetor', 'Gelo não dispensa', 'Pressão de água/CO₂ insuficiente', 'Falha de conectividade/estado'],
    freestyleConsequences: ['Indisponibilidade de sabores/serviço', 'Bebida fora do padrão de qualidade', 'Derrame ou desperdício de produto', 'Interrupção por falta de água, CO₂, gelo ou ingredientes', 'Risco higiénico se nozzle e zonas de contacto não forem limpos conforme o procedimento do fabricante']
  };

  const data = [
    {
      id: 'cooler-countertop', category: 'Vitrines', visual: 'mini-cooler', formType: 'Equipamento de frio',
      name: 'Mini vitrine / Cooler Countertop', model: 'Countertop — referência pública', verification: 'PUBLIC_REFERENCE',
      description: 'Vitrine refrigerada compacta para exposição e refrigeração de bebidas, destinada a locais com pouco espaço de implantação.',
      technicalFacts: [['Fabricantes de referência', 'True / Imbera'], ['Altura pública', '35.63–39.25 in'], ['Profundidade pública', '24.25–27.63 in'], ['Capacidade de referência', '84–112 garrafas de 20 oz'], ['Certificação indicada', 'ENERGY STAR / UL 471 (conforme modelo público)']],
      symptoms: COMMON.coolerSymptoms, consequences: COMMON.coolerConsequences,
      sourceLabel: 'CokeSolutions — Coolers', sourceUrl: 'https://www.cokesolutions.com/equipment/coolers',
      regionalNote: 'Valores de referência publicados para equipamento Coca-Cola no mercado dos EUA. Confirmar sempre a placa/modelo instalado e a ficha CCEP aplicável em Portugal.', photo: ''
    },
    {
      id: 'cooler-single-small', category: 'Vitrines', visual: 'single-cooler', formType: 'Equipamento de frio',
      name: 'Vitrine 1 porta — pequena', model: 'Single Door Small', verification: 'PUBLIC_REFERENCE',
      description: 'Vitrine vertical refrigerada de uma porta para merchandising e conservação de bebidas em exposição.',
      technicalFacts: [['Fabricantes de referência', 'True / Imbera'], ['Dimensões públicas', 'H 53.25–53.5 × W 24.88–25 × D 23 in'], ['Capacidade de referência', '126 garrafas de 20 oz'], ['Prateleiras', '3'], ['Porta', 'Swing'], ['Corrente indicada', '3–4.2 A (referência EUA)']],
      symptoms: COMMON.coolerSymptoms, consequences: COMMON.coolerConsequences,
      sourceLabel: 'CokeSolutions — Coolers', sourceUrl: 'https://www.cokesolutions.com/equipment/coolers',
      regionalNote: 'A alimentação elétrica e restantes características devem ser confirmadas na ficha do modelo efetivamente instalado em Portugal.', photo: ''
    },
    {
      id: 'cooler-single-large', category: 'Vitrines', visual: 'single-cooler', formType: 'Equipamento de frio',
      name: 'Vitrine 1 porta — grande', model: 'Single Door Large', verification: 'PUBLIC_REFERENCE',
      description: 'Vitrine vertical de maior capacidade, usada para exposição refrigerada de uma gama alargada de bebidas.',
      technicalFacts: [['Fabricantes de referência', 'True / Imbera'], ['Dimensões públicas', 'H 78.63–80.50 × W 29.50–30.00 × D 27.50–29.88 in'], ['Capacidade de referência', '270–360 garrafas de 20 oz'], ['Prateleiras', '5'], ['Facing por prateleira', '8'], ['Porta', 'Swing']],
      symptoms: COMMON.coolerSymptoms, consequences: COMMON.coolerConsequences,
      sourceLabel: 'CokeSolutions — Coolers', sourceUrl: 'https://www.cokesolutions.com/equipment/coolers',
      regionalNote: 'Ficha pública de referência. Confirmar fabricante, número de série, refrigerante, tensão e capacidade da unidade real.', photo: ''
    },
    {
      id: 'cooler-double-medium', category: 'Vitrines', visual: 'double-cooler', formType: 'Equipamento de frio',
      name: 'Vitrine 2 portas — média', model: 'Double Door Medium', verification: 'PUBLIC_REFERENCE',
      description: 'Vitrine refrigerada de duas portas, adequada a pontos com maior necessidade de exposição e capacidade.',
      technicalFacts: [['Fabricantes de referência', 'True / Imbera'], ['Dimensões públicas', 'H 78.63–79 × W 47–47.13 × D 29.63–30 in'], ['Capacidade de referência', '420–490 garrafas de 20 oz'], ['Prateleiras', '5'], ['Porta', 'Swing / Slide'], ['Corrente indicada', '6.8–10 A (referência EUA)']],
      symptoms: COMMON.coolerSymptoms, consequences: COMMON.coolerConsequences,
      sourceLabel: 'CokeSolutions — Coolers', sourceUrl: 'https://www.cokesolutions.com/equipment/coolers',
      regionalNote: 'Os valores variam por fabricante e modelo. Usar a placa da unidade para diagnóstico e encaminhamento.', photo: ''
    },
    {
      id: 'vending-glassfront-small', category: 'Vending', visual: 'vending', formType: 'Máquina',
      name: 'Vending — Glass Front pequena', model: 'GFV Slim', verification: 'PUBLIC_REFERENCE',
      description: 'Máquina automática com frente em vidro, destinada à venda e exposição de várias referências de bebidas.',
      technicalFacts: [['Fabricantes de referência', 'Dixie Narco / Royal'], ['Dimensões públicas', 'H 72 × W 37–42 × D 32–35 in'], ['Capacidade lata', '270–320'], ['Capacidade garrafa 20 oz', '240–280'], ['Marcas por máquina', '12'], ['Segurança indicada', 'UL 541; construção orientada a dissuadir vandalismo']],
      symptoms: COMMON.vendingSymptoms, consequences: COMMON.vendingConsequences,
      sourceLabel: 'CokeSolutions — Small Glass Front Vender', sourceUrl: 'https://www.cokesolutions.com/content/dam/cokesolutions/us/documents/cokesolutions/Equipment/Equipment-Vending-Small-Glass-Front.pdf',
      regionalNote: 'Meios de pagamento, tensão, telemetria e configuração de seleção dependem da máquina e do mercado.', photo: ''
    },
    {
      id: 'vending-glassfront-large', category: 'Vending', visual: 'vending-wide', formType: 'Máquina',
      name: 'Vending — Glass Front grande', model: 'GFV', verification: 'PUBLIC_REFERENCE',
      description: 'Máquina automática de maior capacidade com produtos visíveis através de frente em vidro.',
      technicalFacts: [['Fabricante de referência', 'Dixie Narco'], ['Dimensões públicas', 'H 72 × W 47–52 × D 32–35 in'], ['Capacidade lata', '405'], ['Capacidade garrafa 20 oz', '360']],
      symptoms: COMMON.vendingSymptoms, consequences: COMMON.vendingConsequences,
      sourceLabel: 'CokeSolutions — Large Glass Front Vender', sourceUrl: 'https://www.cokesolutions.com/content/dam/cokesolutions/us/documents/cokesolutions/Equipment/Equipment-Vending-Large-Glass-Front.pdf',
      regionalNote: 'Confirmar configuração de pagamento, refrigeração, elevador/motores e sensores do modelo instalado.', photo: ''
    },
    {
      id: 'postmix-counter-6', category: 'Postmix', visual: 'postmix', formType: 'Dispensador',
      name: 'Postmix — Counter Electric', model: '6 válvulas', verification: 'PUBLIC_REFERENCE',
      description: 'Dispensador post-mix de bancada com refrigeração integrada, banho de água e válvulas de serviço para bebidas.',
      technicalFacts: [['Válvulas', '6'], ['Dimensões públicas', 'H 25.38 × W 19.19 × D 24.00 in'], ['Peso de expedição', '150 lb'], ['Construção', 'Armário inox / banho de água / drip tray'], ['Refrigerante indicado na referência', 'R134A (documentação pública histórica)']],
      symptoms: COMMON.postmixSymptoms, consequences: COMMON.postmixConsequences,
      sourceLabel: 'CokeSolutions — Fountains / Counter Electric', sourceUrl: 'https://www.cokesolutions.com/equipment/fountains/',
      regionalNote: 'Não usar a referência histórica de refrigerante ou elétrica para intervenção. Confirmar placa, manual e procedimento técnico do modelo real.', photo: ''
    },
    {
      id: 'postmix-dropin-8', category: 'Postmix', visual: 'dropin', formType: 'Dispensador',
      name: 'Postmix — Drop-In', model: '8 válvulas', verification: 'PUBLIC_REFERENCE',
      description: 'Dispensador post-mix integrado no balcão, com reservatório de gelo/cold plate e conjunto de válvulas.',
      technicalFacts: [['Válvulas', '8'], ['Dimensões públicas', 'H 36.25–42.25 × W 23–30 × D 23 in'], ['Capacidade de gelo', '80 ou 100 lb'], ['Peso de expedição', '240–300 lb'], ['Dreno', '3/4 in com filtro, na referência pública']],
      symptoms: COMMON.postmixSymptoms, consequences: COMMON.postmixConsequences,
      sourceLabel: 'CokeSolutions — Fountains / Drop In', sourceUrl: 'https://www.cokesolutions.com/equipment/fountains/',
      regionalNote: 'Configuração de linhas, BIB, água, CO₂ e válvulas varia por instalação. Não desmontar circuitos pressurizados sem técnico habilitado.', photo: ''
    },
    {
      id: 'freestyle-7100', category: 'Freestyle', visual: 'freestyle-counter', formType: 'Dispensador',
      name: 'Coca-Cola Freestyle® 7100', model: 'Self-Serve 7100', verification: 'PUBLIC_REFERENCE',
      description: 'Dispensador Freestyle de bancada/self-service com interface digital e sistema de ingredientes para ampla variedade de bebidas.',
      technicalFacts: [['Dimensões públicas c/ pernas e drip pan', 'W 30.1 × D 35.8 × H 44.8 in'], ['Peso carregado', '625 lb'], ['Ecrã', '24 in HD'], ['Água', 'mín. 40 psi na referência EUA'], ['Filtro', 'NSF Standard 42 indicado'], ['Alimentação publicada', '115 V / 20 A — apenas referência EUA']],
      symptoms: COMMON.freestyleSymptoms, consequences: COMMON.freestyleConsequences,
      sourceLabel: 'CokeSolutions — Freestyle 7100 Spec Sheet', sourceUrl: 'https://www.cokesolutions.com/coca-cola-freestyle/pdfs/CCFS_7100_specsheet.pdf',
      regionalNote: 'A ficha elétrica acima é dos EUA e não deve ser aplicada à instalação portuguesa. Confirmar ficha europeia/CCEP e placa de características.', photo: ''
    },
    {
      id: 'freestyle-8100', category: 'Freestyle', visual: 'freestyle-tower', formType: 'Dispensador',
      name: 'Coca-Cola Freestyle® 8100', model: 'Crew-Serve 8100', verification: 'PUBLIC_REFERENCE',
      description: 'Sistema Freestyle orientado ao serviço pela equipa, combinando interface digital, ingredientes e operação de alto fluxo.',
      technicalFacts: [['Tipo', 'Crew-Serve'], ['Dimensões públicas', 'H 72 × W 25 × D 33 in'], ['Peso de expedição publicado', '620 lb'], ['Capacidade de gelo publicada', '100 lb'], ['Referência de utilização publicada', '100 bebidas/dia']],
      symptoms: COMMON.freestyleSymptoms, consequences: COMMON.freestyleConsequences,
      sourceLabel: 'CokeSolutions — Coca-Cola Freestyle', sourceUrl: 'https://www.cokesolutions.com/equipment/coca-cola-freestyle',
      regionalNote: 'Características publicadas podem corresponder a variantes de mercado. Confirmar modelo completo e configuração instalada.', photo: ''
    },
    {
      id: 'freestyle-9100', category: 'Freestyle', visual: 'freestyle-tower', formType: 'Dispensador',
      name: 'Coca-Cola Freestyle® 9100', model: 'Self-Serve 9100', verification: 'PUBLIC_REFERENCE',
      description: 'Dispensador Freestyle self-service de grande capacidade com ecrã tátil, cartuchos de ingredientes, gelo e conectividade.',
      technicalFacts: [['Dimensões públicas', 'W 25.25 × D 39.25 × H 74.75 in'], ['Peso com produto e gelo', '925 lb'], ['Ecrã', '24 in HD'], ['Gelo', '255 lb total / 220 lb utilizável'], ['Ingredientes', '36 portas microdosing + até 5 BIB'], ['Conectividade', '4G ou Wi‑Fi'], ['Alimentação publicada', '115 V / 20 A — apenas referência EUA']],
      symptoms: COMMON.freestyleSymptoms, consequences: COMMON.freestyleConsequences,
      sourceLabel: 'CokeSolutions — Freestyle 9100 Spec Sheet', sourceUrl: 'https://www.cokesolutions.com/coca-cola-freestyle/pdfs/CCFS_9100_specsheet.pdf',
      regionalNote: 'Usar a documentação CCEP/europeia para qualquer intervenção. A referência pública lista também água, filtragem, dreno, CO₂ e componentes de backroom.', photo: ''
    },
    {
      id: 'monster-cooler-unconfirmed', category: 'Outros', visual: 'single-cooler', formType: 'Equipamento de frio',
      name: 'Monster / “Moster” — cooler associado', model: 'Modelo exato por confirmar', verification: 'TO_CONFIRM',
      description: 'Entrada reservada para o equipamento referido como Monster/Moster. O nome comercial, fabricante e ficha técnica não são assumidos sem fotografia da placa ou referência oficial.',
      technicalFacts: [['Classe provisória', 'Vitrine/cooler de bebidas'], ['Fabricante', 'Por confirmar'], ['Modelo', 'Por confirmar'], ['Nº de série / REF', 'Ler na placa do equipamento']],
      symptoms: COMMON.coolerSymptoms, consequences: COMMON.coolerConsequences,
      sourceLabel: 'Sem ficha pública confirmada para o termo fornecido', sourceUrl: '',
      regionalNote: 'Enviar uma fotografia frontal e da placa técnica para substituir esta entrada por uma ficha correta.', photo: ''
    }
  ];

  if (typeof module !== 'undefined' && module.exports) module.exports = data;
  if (typeof window !== 'undefined') window.EquipmentCatalogData = data;
})();
