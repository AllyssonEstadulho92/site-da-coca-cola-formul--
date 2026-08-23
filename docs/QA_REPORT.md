# QA Report — V3

## Âmbito

Este relatório define as verificações automáticas e manuais esperadas para a V3. Não deve ser interpretado como certificação de ausência de bugs.

## Verificações automáticas no repositório

O comando `npm run check` executa:

- `node --check` em todos os ficheiros JavaScript da aplicação e Service Worker;
- testes unitários do `core.js`.

Os testes do core cobrem:

- normalização de REF;
- cálculo de completude;
- deteção de possíveis duplicados;
- seleção de regra PT mais específica;
- deteção de ambiguidade entre regras PT;
- auditoria/diff de campos;
- templates de e-mail;
- escaping CSV.

O workflow GitHub Actions executa estas verificações em Pull Requests para `main`.

## Casos manuais obrigatórios antes de merge para produção

### Autenticação local

- primeiro acesso cria perfil;
- password incorreta é rejeitada;
- alteração de password exige a password atual;
- logout remove a sessão ativa.

### Formulário

- campos obrigatórios vazios;
- REF normalizada sem prefixar `0` artificial;
- rascunho recuperado após refresh;
- edição existente só persiste após Guardar alterações;
- descrição e observações longas;
- caracteres portugueses.

### Duplicados

- mesma REF aberta dentro da janela gera aviso;
- REF diferente não gera aviso;
- registo encerrado não bloqueia;
- próprio registo em edição não é considerado duplicado.

### Encaminhamento

- regra sem critérios não sugere PT;
- regra específica vence regra genérica;
- duas regras diferentes com mesma especificidade geram ambiguidade;
- e-mail/departamento configurados são aplicados apenas após confirmação do utilizador.

### Registos

- pesquisa por ID, cliente, REF, nota e contacto;
- filtros de estado, agente, PT, tratado, e-mail e datas;
- arquivo e reabertura;
- timeline mantém ações anteriores.

### Backup

- JSON exporta e restaura;
- backup encriptado restaura com password correta;
- password errada não desencripta;
- ficheiro inválido é rejeitado;
- snapshot de segurança é criado antes de restauro;
- IDs duplicados no backup são rejeitados.

### Responsividade

Validar pelo menos:

- 320 px;
- 375/390 px;
- 430 px;
- 768 px;
- 1024 px;
- 1366 px ou superior.

Sem scroll horizontal indevido no layout principal.

### Offline/PWA

- primeiro carregamento online;
- segundo carregamento offline;
- recursos estáticos disponíveis;
- rascunhos continuam a ser gravados localmente;
- banner indica modo offline.

### Acessibilidade

- navegação por teclado;
- foco visível;
- labels dos campos;
- dialog utilizável por teclado;
- contraste suficiente;
- interface não depende apenas da cor;
- `prefers-reduced-motion` respeitado.

## Limitações conhecidas do protótipo

- não existe backend central;
- não existe sincronização multi-dispositivo;
- login local não substitui SSO;
- integração SAP não implementada;
- envio real de e-mail não automatizado;
- regras PT oficiais ainda dependem de validação empresarial;
- testes E2E de browser devem ser executados antes de produção.
