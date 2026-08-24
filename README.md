# Formulários Operacionais — V6.0.0

PWA estática e mobile-first para criação, registo e acompanhamento de ocorrências através de um formulário operacional personalizável.

## Estado atual

**Protótipo público sem autenticação.** A aplicação serve para validação funcional e UX com dados fictícios. Não utilizar dados reais de clientes, informação SAP, credenciais, e-mails internos ou outra informação confidencial.

## Direção V6

A V6 remove integralmente a antiga área **Equipamentos** e todo o runtime específico do catálogo. O projeto passa a ser centrado em formulários e registos.

A referência e o tipo de equipamento continuam a poder existir como **campos do formulário**, porque fazem parte do registo de ocorrência. Já não existe catálogo, ficha, fotografia, documentação ou diretório próprio de equipamentos.

## Designer de Formulário

A rota **Designer de Formulário** é um protótipo funcional ligado ao formulário real. Permite:

- reordenar as cinco secções do formulário;
- alterar o título de cada secção;
- mostrar ou ocultar campos opcionais;
- manter campos obrigatórios sempre visíveis;
- escolher densidade confortável ou compacta;
- escolher largura padrão ou ampla;
- escolher destaque vermelho, azul ou grafite;
- mostrar ou ocultar o resumo lateral;
- pré-visualizar as alterações antes de guardar;
- repor o design padrão.

As preferências ficam em `settings.formDesign` no IndexedDB. Ocultar um campo opcional não apaga o valor existente de um registo em edição.

## Funcionalidades preservadas

- Dashboard.
- Novo registo e edição.
- Autosave e rascunhos.
- Registos, pesquisa e filtros.
- Clientes e histórico por referências guardadas nos registos.
- Encaminhamento PT 32 / PT 60 / PT 70 configurável.
- Assistente de e-mail iniciado pelo utilizador.
- Atividade e produtividade.
- Arquivo e reabertura.
- Configurações locais.
- Backup JSON, backup encriptado e snapshots.
- PWA/offline após o primeiro carregamento.

## Estrutura principal

```text
index.html
manifest.json
service-worker.js
css/
  base.css
  features.css
  form-designer.css
  styles.css
  theme.css
js/
  app-base.js
  app-shell.js
  app-form-view.js
  app-form-designer.js
  app-form-logic.js
  app-form-save.js
  ...restantes módulos ativos...
scripts/
tests/
docs/
```

Não existe `js/equipment/`, `assets/equipment/` ou CSS específico de catálogo na V6.

## Persistência e migração

O schema IndexedDB passa para **5**. Durante a migração, a store antiga `equipmentImages` é removida porque pertencia exclusivamente à área eliminada. Backups V6 usam `schemaVersion: 5` e `appVersion: 6.0.0`.

Backups antigos continuam a ser aceites quando a estrutura principal é compatível; dados antigos exclusivos de fotografias de equipamentos não são importados para a V6.

## Verificação técnica

```bash
npm test
npm run check
npm run build
```

`npm run check` valida sintaxe, regras core, Designer de Formulário, ausência da área Equipamentos, segurança pública, PWA e build determinístico.

O build publica em `dist/` apenas os recursos declarados no Service Worker. O GitHub Pages executa também um smoke test pós-deploy do Designer.

## Produção

Antes de utilizar dados reais são necessários identidade corporativa, backend/API autorizado, autenticação, autorização server-side, auditoria protegida, retenção, backups externos e revisão formal de segurança/privacidade.
