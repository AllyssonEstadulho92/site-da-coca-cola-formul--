# Arquitetura — V5.0.1

## Objetivo

A aplicação é uma PWA estática, modular e local-first. O protótipo usa IndexedDB para persistência, mas a arquitetura mantém separação suficiente para futura substituição por backend autorizado.

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

## Equipamentos V5

A área Equipamentos está isolada em `js/equipment/`:

1. `equipment-sources-v5.js` — fontes técnicas externas.
2. `equipment-symptoms-v5.js` — relações documentadas de sintomas.
3. `equipment-catalog-data-v5.js` — inventário e especificações validadas.
4. `equipment-store-v5.js` — normalização, pesquisa, filtros e ordenação.
5. `equipment-local-images-v5.js` — fotografias locais e otimização.
6. `equipment-actions-v5.js` — ações de integração com o formulário.
7. `equipment-components-v5.js` — componentes de apresentação.
8. `equipment-page-v5.js` — composição e eventos da página.

As camadas V3/V4/V4.6 de Equipamentos foram removidas da árvore ativa.

## Persistência

Stores atuais relevantes: `records`, `activities`, `settings`, `snapshots` e `equipmentImages`.

A store antiga `profiles` é eliminada na migração. Não existe autenticação local.

## PWA e build

O Service Worker declara explicitamente os recursos necessários ao runtime. O build em `scripts/build-static.js` usa essa lista como allowlist e publica apenas esses recursos em `dist/`.

Isto evita que documentação, testes, ficheiros legados ou materiais auxiliares sejam publicados por acidente.

## Produção

IndexedDB não deve ser a única fonte corporativa. Produção exige backend autorizado, identidade corporativa, autorização no servidor, auditoria protegida, retenção e integrações oficiais.
