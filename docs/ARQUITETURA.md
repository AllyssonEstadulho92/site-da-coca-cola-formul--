# Arquitetura — V6.0.0

## Objetivo

A aplicação é uma PWA estática, modular e local-first para formulários operacionais, registos e produtividade. O protótipo usa IndexedDB e mantém separação suficiente para futura substituição por backend autorizado.

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
- `app-base.js` — estado, navegação, defaults e `formDesign`.
- `app-shell.js` — arranque, rotas e composição da aplicação.
- `app-form-view.js` — formulário real, consumindo a configuração visual.
- `app-form-designer.js` — Designer, pré-visualização e persistência do layout.
- `app-form-logic.js` — captura, autosave, duplicados e encaminhamento.
- `app-form-save.js` — validação e persistência do registo.
- `app-record*` — pesquisa, detalhe, arquivo e reabertura.
- `app-directories.js` — diretório consolidado de clientes.
- `app-routing-views.js` — PT, comunicação e navegação adicional.
- `app-activity-productivity.js` — atividade e produtividade.
- `app-settings.js` — listas, regras e modelos configuráveis.
- `app-backup.js` — backup e recuperação.
- `app-profile-help.js` — identificação local e ajuda.
- `app-demo.js` — dados fictícios para demonstração pública.

## Designer de Formulário

`settings.formDesign` contém apenas preferências de apresentação:

- `density`;
- `width`;
- `accent`;
- `showSummary`;
- `sectionOrder`;
- `sectionTitles`;
- `hiddenOptionalFields`.

O formulário não é duplicado no Designer. O Designer modifica a configuração e `app-form-view.js` aplica essa configuração ao formulário real.

Campos obrigatórios permanecem visíveis. `captureForm()` só atualiza campos existentes no `FormData`, evitando apagar valores de campos opcionais ocultos durante uma edição.

## Remoção da área Equipamentos

A V6 não possui rota, módulos, assets, CSS, catálogo, fotografias, fontes, documentação ou testes dedicados a Equipamentos.

Os campos `equipmentReference` e `equipmentType` permanecem no modelo de registo por compatibilidade funcional do formulário. Eles são dados da ocorrência, não representam uma secção/catálogo independente.

## Persistência

Stores atuais: `records`, `activities`, `settings` e `snapshots`.

O schema IndexedDB é **5**. Ao migrar de versões anteriores, `profiles` e `equipmentImages` são removidas quando existirem.

Backups V6 usam `schemaVersion: 5` e `appVersion: 6.0.0`.

## PWA e build

O Service Worker declara explicitamente os recursos necessários. `scripts/build-static.js` usa essa lista como allowlist e publica apenas esses recursos em `dist/`.

O workflow Pages executa `npm run check`, build, deploy e smoke test contra a versão publicada do Designer.

## Produção

IndexedDB não deve ser a única fonte corporativa. Produção exige backend autorizado, identidade corporativa, autenticação, autorização server-side, auditoria protegida, retenção e integrações oficiais.
