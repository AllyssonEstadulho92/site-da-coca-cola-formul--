# Arquitetura — Sistema de Registo de Avarias V3

## Objetivo

A V3 foi estruturada para separar interface, regras funcionais e persistência. O protótipo funciona localmente, mas a camada de dados pode ser substituída por um backend autorizado sem reconstruir a interface.

## Camadas

```text
Interface HTML/CSS
      ↓
Módulos de aplicação JavaScript
      ↓
Core de regras puras
      ↓
Serviço de persistência IndexedDB
      ↓
Backend/API corporativa futura
```

## Módulos principais

- `core.js`: normalização, duplicados, completude, regras PT, diff e templates.
- `db.js`: IndexedDB, exportação, restauro atómico e snapshots.
- `app-shell.js`: sessão, navegação e ciclo de arranque.
- `app-dashboard.js`: indicadores e atividade recente.
- `app-form-*`: formulário, autosave, validação e gravação.
- `app-record*`: pesquisa, detalhe, auditoria, arquivo e reabertura.
- `app-directories.js`: clientes e equipamentos consolidados.
- `app-routing-views.js`: fila de comunicação e PT.
- `app-settings.js`: matriz configurável, listas e modelos de e-mail.
- `app-backup.js`: CSV, JSON, AES-GCM e recuperação.
- `app-profile-help.js`: perfil local, password e guia.

## Modelo conceptual

```text
Profile
Record
Activity
Settings
Snapshot
```

O `Record` mantém os dados operacionais. `Activity` preserva ações e alterações para timeline/auditoria. `Settings` contém listas e regras configuráveis. `Snapshot` é uma cópia local de recuperação.

## Persistência

### Protótipo

IndexedDB é a fonte local de dados e permite:

- autosave;
- rascunhos;
- continuidade offline;
- histórico;
- exportação;
- recuperação.

### Produção

A fonte oficial deve passar para uma solução autorizada, por exemplo:

- API + base de dados relacional;
- Microsoft Lists/SharePoint, quando adequado;
- serviços Microsoft 365 integrados por mecanismos oficiais.

IndexedDB continuará útil como cache/fila offline, mas não deve ser a única fonte corporativa.

## Regras PT

A matriz `equipmentType + symptom + faultCategory` pode sugerir PT 32, 60 ou 70. Uma regra sem critérios não é considerada automática. Se duas regras diferentes tiverem a mesma especificidade, a aplicação sinaliza ambiguidade e não escolhe silenciosamente.

## Comunicação

O protótipo gera um rascunho de e-mail configurável. O envio é deliberadamente iniciado pelo utilizador. Em produção poderá ser integrado Outlook/Graph/Power Automate se existir autorização.

## PWA

O Service Worker guarda a aplicação estática para funcionamento offline após o primeiro carregamento. Não existe atualmente sincronização cloud real; esse comportamento depende do backend futuro.
