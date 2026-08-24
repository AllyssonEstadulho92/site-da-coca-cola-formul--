# Catálogo de Equipamentos — V5.1.0

## Objetivo

A área **Equipamentos** é uma consulta operacional rápida para identificação do modelo, fotografia, descrição e classificação do sintoma reportado durante a chamada.

O catálogo mantém exatamente **53 equipamentos** e conserva a estrutura visual aprovada: imagem à esquerda e conteúdo à direita.

## Apresentação atual

A interface deixa de expor as secções **Ficha técnica** e **Documentação**. A ficha apresenta:

- identificação do equipamento;
- fotografia real local ou referência visual;
- descrição operacional;
- matriz de sintomas aplicável;
- ação para criar um registo.

Os dados técnicos e fontes públicas já registados permanecem na camada de dados para rastreabilidade, mas não fazem parte da apresentação principal.

## Descrições

Todos os equipamentos recebem uma descrição operacional coerente com a respetiva categoria. Quando existe uma descrição pública específica já validada, essa informação é mantida e complementada com o contexto funcional da categoria. Quando não existe informação específica, a aplicação utiliza apenas uma descrição funcional geral, sem inventar especificações de modelo.

## Matriz operacional de sintomas

A matriz fornecida ao projeto está em `equipment-operational-symptoms-v5.js` e contém quatro grupos:

- **Vandalismo** — 7 códigos;
- **Específico Dispensing** — 19 códigos;
- **Específico Vending** — 7 códigos;
- **Funcionamento Geral** — 14 códigos.

Associação aplicada:

- Vitrines e Monster: Vandalismo + Funcionamento Geral = **21 códigos**;
- Vending: Vandalismo + Específico Vending + Funcionamento Geral = **28 códigos**;
- Postmix, Freestyle e módulos auxiliares: Vandalismo + Específico Dispensing + Funcionamento Geral = **40 códigos**.

A associação é feita pelo tipo/categoria do equipamento. Estes códigos servem para classificar o **sintoma observado** e não representam diagnóstico, causa provável ou instrução de reparação.

## Pesquisa

A pesquisa encontra equipamentos por nome, modelo, código, fabricante, categoria, descrição e pelos códigos/textos da matriz operacional de sintomas.

## Fotografias

Fotografias reais adicionadas pelo utilizador são guardadas no IndexedDB do dispositivo e têm prioridade sobre a referência visual gerada. A fotografia pode ser substituída ou removida sem alterar os restantes dados do equipamento.

## Módulos

- `equipment-sources-v5.js` — fontes externas preservadas.
- `equipment-symptoms-v5.js` — relações técnicas documentadas preservadas na camada de dados.
- `equipment-operational-symptoms-v5.js` — matriz operacional fornecida ao projeto.
- `equipment-catalog-data-v5.js` — inventário base de 53 equipamentos.
- `equipment-store-v5.js` — normalização, descrições, associação de sintomas e pesquisa.
- `equipment-local-images-v5.js` — fotografias reais locais.
- `equipment-actions-v5.js` — criação de registo.
- `equipment-components-v5.js` — cartões e ficha.
- `equipment-page-v5.js` — composição e interações.
- `equipment-v5.css` — estilos da área.

## GitHub Pages

O build estático publica apenas os recursos declarados no Service Worker. A matriz operacional faz parte do runtime e do cache offline da V5.1.0.
