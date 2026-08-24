# Catálogo de Equipamentos — V5.2.0

## Objetivo

A área **Equipamentos** é uma consulta operacional rápida para identificação do modelo, fotografia, descrição e classificação do sintoma observado durante a chamada.

O catálogo mantém exatamente **53 equipamentos** e a estrutura visual aprovada: imagem à esquerda e conteúdo à direita, incluindo em smartphone.

## Apresentação atual

A ficha apresenta:

- identificação do equipamento;
- fotografia real validada ou estado `Fotografia pendente`;
- descrição operacional/técnica disponível;
- matriz de sintomas funcionalmente aplicável;
- ação para criar um registo.

As secções Ficha técnica e Documentação não são apresentadas na interface principal. Os dados técnicos e fontes públicas já registados permanecem preservados na camada de dados para rastreabilidade.

## Descrições

Quando existe uma descrição específica suportada pelo inventário/fontes já registadas, ela é preservada. Quando não existe informação específica suficiente, a aplicação utiliza uma descrição operacional da subcategoria, sem inventar especificações, fabricante ou características do modelo.

## Matriz operacional de sintomas

A matriz fornecida ao projeto continua integralmente registada em `equipment-operational-symptoms-v5.js`:

- **Vandalismo** — 7 códigos;
- **Específico Dispensing** — 19 códigos;
- **Específico Vending** — 7 códigos;
- **Funcionamento Geral** — 14 códigos na matriz original.

A apresentação por equipamento filtra a parte de Funcionamento Geral pela capacidade funcional da categoria, para não apresentar sintomas manifestamente incompatíveis com o equipamento.

Associação atual:

- Vitrines e Monster: Vandalismo + 11 sintomas gerais compatíveis = **18 códigos**;
- Vending: Vandalismo + Específico Vending + 11 sintomas gerais compatíveis = **25 códigos**;
- Postmix, Freestyle e módulos auxiliares: Vandalismo + Específico Dispensing + 6 sintomas gerais compatíveis = **32 códigos**.

Exemplo: vitrines não recebem os códigos gerais 048 `Sai produto diferente do selecionado` nem 049 `Não para de sair produto`, pois esses sintomas pressupõem seleção/dispensação de produto.

Os códigos classificam o **sintoma observado**. Não representam diagnóstico nem causa confirmada. Uma causa só deve ser tratada como confirmada depois de validação do técnico em campo.

## Fotografias

A interface deixou de utilizar o sprite de referência gerado das versões anteriores.

Prioridade da fotografia:

1. fotografia real adicionada localmente ao equipamento;
2. fotografia real versionada no repositório e explicitamente marcada `VERIFIED_REAL`;
3. estado `Fotografia pendente`.

O registo versionado encontra-se em `equipment-photo-registry-v5.js`. Uma fotografia versionada deve corresponder ao slug exato do equipamento e usar `assets/equipment/photos/<slug>.<png|jpg|jpeg|webp>`.

O registo pode permanecer vazio enquanto não existirem fotografias cuja correspondência e autorização estejam confirmadas. A aplicação não substitui essa ausência por uma imagem genérica.

Fotografias locais são guardadas no IndexedDB e passam a conservar também slug, nome e modelo associados no momento da seleção.

## Responsividade

O cartão mantém duas colunas no mobile. A coluna de fotografia usa largura proporcional e a coluna de conteúdo usa `minmax(0,1fr)`. Elementos internos usam `min-width: 0`, quebra segura de texto e botões flexíveis, impedindo que nomes, códigos ou sintomas imponham largura superior ao viewport.

## Módulos

- `equipment-sources-v5.js` — fontes externas preservadas.
- `equipment-symptoms-v5.js` — relações técnicas documentadas preservadas.
- `equipment-operational-symptoms-v5.js` — matriz operacional e associação funcional por categoria.
- `equipment-catalog-data-v5.js` — inventário base de 53 equipamentos.
- `equipment-photo-registry-v5.js` — registo explícito de fotografias reais versionadas.
- `equipment-store-v5.js` — normalização, descrições, sintomas e pesquisa.
- `equipment-local-images-v5.js` — fotografias reais locais e otimização.
- `equipment-actions-v5.js` — criação de registo.
- `equipment-components-v5.js` — cartões, estados de fotografia e ficha.
- `equipment-page-v5.js` — composição, interações e recuperação de runtime/fotografia.
- `equipment-v5.css` — estilos e contrato responsivo.

## GitHub Pages

O build publica os recursos declarados no Service Worker e acrescenta automaticamente fotografias reais declaradas no registo. O deploy valida depois da publicação a versão V5.2.0, o registo de fotografias, o módulo de recuperação e o CSS mobile.
