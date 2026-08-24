# Arquitetura — V5.2.0

## Objetivo

A aplicação é uma PWA estática, modular e local-first. O protótipo usa IndexedDB para persistência, mantendo separação suficiente para futura substituição por backend autorizado.

## Camadas

```text
HTML / CSS
    ↓
Módulos de aplicação JavaScript
    ↓
Core de regras puras
    ↓
IndexedDB
    ↓
Backend/API corporativa futura
```

## Runtime principal

- `core.js` — normalização, completude, duplicados, regras PT, diff e templates.
- `db.js` — IndexedDB, exportação, restauro e snapshots.
- `app-shell.js` — navegação, identificação local e arranque direto.
- `app-dashboard.js` — indicadores e atividade recente.
- `app-form-*` — formulário, autosave, validação e gravação.
- `app-record*` — pesquisa, detalhe, arquivo e reabertura.
- `app-directories.js` — diretórios consolidados.
- `app-routing-views.js` — encaminhamento/comunicação e PT.
- `app-activity-productivity.js` — produtividade.
- `app-settings.js` — listas, regras e modelos configuráveis.
- `app-backup.js` — exportação, backup encriptado e recuperação.
- `app-profile-help.js` — identificação local e ajuda; não existe autenticação.
- `app-demo.js` — dados fictícios para demonstração pública.

## Equipamentos V5.2

A área Equipamentos está isolada em `js/equipment/`:

1. `equipment-sources-v5.js` — fontes técnicas externas preservadas.
2. `equipment-symptoms-v5.js` — relações técnicas documentadas preservadas.
3. `equipment-operational-symptoms-v5.js` — matriz original e associação funcional por categoria.
4. `equipment-catalog-data-v5.js` — inventário base e informação existente.
5. `equipment-photo-registry-v5.js` — registo explícito de fotografias reais versionadas.
6. `equipment-store-v5.js` — normalização, descrições por modelo/subcategoria, sintomas e pesquisa.
7. `equipment-local-images-v5.js` — fotografias locais, associação ao equipamento e otimização.
8. `equipment-actions-v5.js` — integração com o formulário.
9. `equipment-components-v5.js` — cartões, fotografia real/pendente e ficha.
10. `equipment-page-v5.js` — composição, pesquisa, categorias, recuperação de runtime e controlo de falha de fotografia.

A UI não apresenta Ficha técnica nem Documentação. Esses dados permanecem preservados na camada de dados quando já existiam.

## Fotografias

A V5.2 removeu a dependência do sprite gerado de referência.

Existem duas fontes permitidas de fotografia real:

- IndexedDB, quando o utilizador associa manualmente uma fotografia ao equipamento;
- assets versionados declarados em `equipment-photo-registry-v5.js` com estado `VERIFIED_REAL`.

O registo versionado associa a fotografia ao slug exato. Sem fotografia válida, o componente apresenta um estado `Fotografia pendente`; não tenta construir nem adivinhar uma imagem.

Uma falha de carregamento da fotografia é isolada no próprio componente e não invalida o restante catálogo.

## Layout mobile

O cartão conserva a grelha de duas colunas no mobile. A coluna visual usa largura proporcional; a coluna de conteúdo é `minmax(0,1fr)`. A página, cartões, conteúdo, listas e botões aplicam `min-width: 0`/limites de largura para evitar overflow horizontal causado por conteúdo intrínseco.

## Persistência

Stores atuais relevantes: `records`, `activities`, `settings`, `snapshots` e `equipmentImages`.

O schema IndexedDB permanece na versão 4; a versão da aplicação/backup é 5.2.0. A store antiga `profiles` é eliminada na migração.

## PWA e build

O Service Worker declara explicitamente os recursos estáticos necessários ao runtime. O build em `scripts/build-static.js` usa essa lista como allowlist e acrescenta as fotografias declaradas no registo. Caminhos de fotografia fora de `assets/equipment/photos/` são rejeitados e um ficheiro declarado mas inexistente faz o build falhar.

O GitHub Pages executa um smoke test depois do deploy para confirmar a versão publicada, os módulos críticos e o contrato CSS mobile.

## Produção

IndexedDB não deve ser a única fonte corporativa. Produção exige backend autorizado, identidade corporativa, autorização no servidor, auditoria protegida, retenção e integrações oficiais.
