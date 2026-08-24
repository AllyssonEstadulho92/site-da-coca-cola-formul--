# Arquitetura — V5.1.0

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

## Equipamentos V5.1

A área Equipamentos está isolada em `js/equipment/`:

1. `equipment-sources-v5.js` — fontes técnicas externas preservadas.
2. `equipment-symptoms-v5.js` — relações técnicas documentadas preservadas.
3. `equipment-operational-symptoms-v5.js` — matriz operacional de códigos e sintomas fornecida ao projeto.
4. `equipment-catalog-data-v5.js` — inventário base e informação existente.
5. `equipment-store-v5.js` — normalização, descrições operacionais, associação da matriz e pesquisa.
6. `equipment-local-images-v5.js` — fotografias locais e otimização.
7. `equipment-actions-v5.js` — integração com o formulário.
8. `equipment-components-v5.js` — cartões e ficha focados em descrição e sintomas.
9. `equipment-page-v5.js` — composição, pesquisa, categorias e eventos.

A UI de Equipamentos não apresenta Ficha técnica nem Documentação. Esses dados permanecem preservados na camada de dados quando já existiam, mas estão desacoplados da experiência atual.

## Persistência

Stores atuais relevantes: `records`, `activities`, `settings`, `snapshots` e `equipmentImages`.

O schema IndexedDB permanece na versão 4; a versão da aplicação/backup é 5.1.0. A store antiga `profiles` é eliminada na migração.

## PWA e build

O Service Worker declara explicitamente os recursos necessários ao runtime, incluindo a matriz operacional. O build em `scripts/build-static.js` usa essa lista como allowlist e publica apenas esses recursos em `dist/`.

## Produção

IndexedDB não deve ser a única fonte corporativa. Produção exige backend autorizado, identidade corporativa, autorização no servidor, auditoria protegida, retenção e integrações oficiais.
