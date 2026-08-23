# Segurança

## Repositório público

Este repositório é público e deve conter apenas código, documentação e dados explicitamente fictícios de demonstração.

Não publicar:

- credenciais, passwords, tokens, chaves API ou segredos;
- dados reais de clientes, colaboradores ou contactos;
- números de contribuinte, moradas, telefones ou referências de equipamentos reais;
- exportações SAP;
- endereços de e-mail internos/confidenciais;
- matrizes internas de encaminhamento não autorizadas;
- backups da aplicação com informação operacional;
- ficheiros `.env` reais.

## V3.9 — sem autenticação

A V3.9 remove a autenticação local do protótipo. A aplicação abre diretamente no Dashboard e não solicita e-mail nem palavra-passe.

Foram removidos do frontend:

- formulário de login;
- validação de domínio de e-mail;
- criação/verificação de palavras-passe;
- hashes PBKDF2 usados para login;
- bloqueio por tentativas falhadas;
- expiração de sessão associada a autenticação;
- ações de logout e alteração de palavra-passe;
- módulos e CSS exclusivos de autenticação.

A migração IndexedDB V3 elimina também a store antiga `profiles`. Backups novos já não exportam perfis de autenticação. Backups antigos continuam a poder ser validados/restaurados, mas o campo legado `profiles`, quando presente, é ignorado.

A aplicação mantém apenas um nome de operador local opcional para identificar novos registos e atividades. Esse nome **não é autenticação nem autorização**.

## Consequência de segurança

Qualquer pessoa que consiga abrir o endereço público consegue abrir a aplicação. HTTPS protege o transporte, mas não controla quem pode aceder ao conteúdo da aplicação.

Por isso, esta versão destina-se exclusivamente a prototipagem e demonstração com dados fictícios. **Não introduzir NIF, nomes reais, contactos, moradas, dados SAP, referências operacionais, e-mails internos ou outra informação corporativa real.**

## Dados de demonstração

A aplicação inclui um modo DEMO destinado a validação pública. Esses registos:

- usam o prefixo `DEMO`;
- são marcados internamente com `demo: true`;
- utilizam o domínio reservado `example.invalid`;
- não representam clientes, estabelecimentos, equipamentos ou regras empresariais reais.

Dados reais nunca devem ser convertidos em “demo” apenas alterando o nome.

## Backups

Os backups JSON e snapshots podem conter informação introduzida pelo utilizador. Não devem ser adicionados ao GitHub ou enviados para canais públicos.

O backup encriptado protege o ficheiro exportado com uma palavra-passe própria do backup; isto é independente de autenticação da aplicação e não cria controlo de acesso ao site.

## Frontend

O `index.html` mantém Content Security Policy e política `no-referrer`. O Service Worker usa atualização network-first para HTML, JavaScript e CSS quando existe ligação e fallback offline para recursos previamente armazenados.

Estas medidas reduzem superfície de ataque e problemas de cache, mas não substituem controlos de servidor.

## Produção

Antes de permitir dados reais, a arquitetura deve incluir identidade corporativa aprovada, backend autorizado, RBAC server-side, base de dados central, logging/auditoria protegida, backups, retenção e revisão de segurança/privacidade.

Quando aplicável e autorizado, a autenticação de produção poderá usar Microsoft Entra ID/SSO ou outro IdP corporativo. Não deve ser simulada no frontend público.

## Reporte

Problemas de segurança que incluam informação sensível devem ser tratados de forma privada e não publicados em issues públicas.
