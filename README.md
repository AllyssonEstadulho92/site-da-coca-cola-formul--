# Formulários Operacionais — V6.3.0

PWA estática e mobile-first para criação, registo e acompanhamento de ocorrências através de um formulário operacional personalizável.

## Estado atual

**Protótipo público sem autenticação.** A aplicação serve para validação funcional e UX com dados fictícios. Não utilizar dados reais de clientes, informação SAP, credenciais, e-mails internos ou outra informação confidencial.

## Direção V6

A V6 é centrada em formulários, registos, acompanhamento e análise operacional. A antiga área **Equipamentos** e o respetivo runtime de catálogo foram removidos.

A referência e o tipo de equipamento continuam disponíveis como **campos do formulário**, porque podem fazer parte do registo da ocorrência. Não existe catálogo, ficha, fotografia, documentação ou diretório próprio de equipamentos.

## Formulário e Designer

A rota **Designer de Formulário** está ligada ao formulário real. Permite reordenar secções, alterar títulos, mostrar ou ocultar campos opcionais, escolher densidade/largura/destaque visual, controlar o resumo lateral e pré-visualizar antes de guardar. Campos obrigatórios permanecem protegidos e ocultar um campo opcional não apaga o respetivo valor existente.

## Centro de Atenção

O Centro de Atenção reúne notificações das interações e trabalho por concluir. O autosave protege rascunhos sem poluir o histórico de auditoria.

Nos cartões de pendências, o gesto mobile mantém o padrão de swipe: direita para editar/abrir e esquerda para eliminar ou retirar o lembrete, com proteção para não apagar silenciosamente registos operacionais confirmados.

A V6.3.0 introduz um motor de feedback mais robusto:

- `AudioContext` persistente, reutilizado entre alertas;
- desbloqueio do áudio no primeiro gesto do utilizador, importante em Safari/PWA;
- tentativa de recuperação quando a aplicação regressa do segundo plano;
- som de confirmação e som de erro distintos;
- vibração apenas quando `navigator.vibrate` é realmente suportado;
- diagnóstico visível em **Definições → Atenção, som e vibração**;
- estados explícitos para som pronto, a ativar, bloqueado ou indisponível;
- botão **Testar alerta agora** para validar o dispositivo.

A aplicação não promete vibração em navegadores que não exponham a Vibration API. Nesses dispositivos mantém-se o feedback visual e, quando permitido pelo navegador, o som.

## Funcionalidades principais

- Dashboard e estatísticas de avarias.
- Novo registo e edição com revisão antes da gravação final.
- Autosave e rascunhos.
- Registos, pesquisa e filtros.
- Clientes e histórico por referências guardadas nos registos.
- Encaminhamento PT 32 / PT 60 / PT 70 configurável.
- Assistente de e-mail iniciado pelo utilizador.
- Histórico de atividade e produtividade.
- Centro de notificações e lembretes de trabalho pendente.
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
  attention.css
  attention-audio.css
  base.css
  coca-cola-ui.css
  features.css
  form-designer.css
  styles.css
  theme.css
js/
  app-base.js
  app-shell.js
  app-form-view.js
  app-form-designer.js
  app-notifications.js
  app-attention-audio.js
  ...restantes módulos ativos...
scripts/
tests/
docs/
```

Não existe `js/equipment/`, `assets/equipment/` ou CSS específico de catálogo.

## Persistência

O schema IndexedDB atual é **6**. As stores principais incluem registos, atividades, definições, snapshots e notificações. Backups V6.3.0 usam `schemaVersion: 6` e `appVersion: 6.3.0`.

Backups anteriores continuam a ser aceites quando a estrutura principal é compatível.

## Verificação técnica

```bash
npm test
npm run check
npm run build
```

`npm run check` valida sintaxe, regras core, Designer de Formulário, Centro de Atenção, motor de áudio, ausência da antiga área Equipamentos, segurança pública, PWA e build determinístico.

O build publica em `dist/` apenas os recursos declarados no Service Worker. O workflow do GitHub Pages executa também um smoke test pós-deploy dos módulos de notificações e atenção.

## Produção

Antes de utilizar dados reais são necessários identidade corporativa autorizada, backend/API aprovado, autenticação, autorização server-side, auditoria protegida, retenção, backups externos e revisão formal de segurança/privacidade.
