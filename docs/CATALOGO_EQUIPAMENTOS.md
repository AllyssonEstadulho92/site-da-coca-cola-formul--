# Catálogo técnico de Equipamentos — V5.0.1

## Objetivo

A área **Equipamentos** é um catálogo técnico operacional para identificação rápida durante chamadas, consulta de especificações confirmadas, sintomas documentados e acesso à documentação pública associada.

A V5 mantém 53 equipamentos do inventário aprovado. O manual interno anteriormente usado no projeto não participa no runtime nem é fonte técnica da V5.

## Regra de evidência

A aplicação distingue:

- **Sintoma observado** — aquilo que pode ser relatado durante a chamada.
- **Possível causa documentada** — possibilidade descrita por documentação técnica.
- **Diagnóstico** — não é inferido pela aplicação.
- **Consequência** — só deve ser apresentada quando existir suporte documental explícito.

Quando não existe documentação pública suficientemente específica, a UI apresenta **Não validado para este modelo**.

## Fontes

Existem atualmente 21 fontes externas registadas em `equipment-sources-v5.js`, incluindo Frigoglass, Cornelius/Marmon Foodservice, Coca-Cola/CokeSolutions, Dixie-Narco/Crane, Royal Vendors e Comissão Europeia/EPREL.

Cada registo contém organização, documento, URL, idioma, data de consulta e nível de validação.

## Sintomas

Existem 16 relações documentadas em `equipment-symptoms-v5.js`. A apresentação segue:

**Sintoma observado → perguntas de triagem → verificações básicas permitidas → possíveis causas documentadas → assistência → fonte.**

Uma possível causa nunca é apresentada como diagnóstico.

## Módulos V5

- `equipment-catalog-data-v5.js` — inventário e dados técnicos validados.
- `equipment-sources-v5.js` — fontes externas.
- `equipment-symptoms-v5.js` — sintomas documentados.
- `equipment-store-v5.js` — pesquisa, filtros, ordenação e estados.
- `equipment-local-images-v5.js` — fotografias reais locais.
- `equipment-actions-v5.js` — criação de registo a partir do catálogo.
- `equipment-components-v5.js` — UI.
- `equipment-page-v5.js` — composição e interações.
- `equipment-v5.css` e `equipment-sources-v5.css` — estilos da área.

## Fotografias

A referência visual do catálogo é uma imagem gerada no projeto e não uma fotografia oficial do fabricante. A fotografia real adicionada pelo utilizador fica localmente no IndexedDB, é incluída no backup e tem prioridade visual.

A antiga árvore de pastas vazias por modelo foi removida porque já não participa no runtime nem no fluxo de fotografias.

## GitHub Pages

O build estático publica em `dist/` apenas os recursos declarados no Service Worker. Ficheiros de desenvolvimento, testes e documentação não entram no artefacto publicado.
