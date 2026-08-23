# Dados e Segurança

## Classificação atual

A V3 é um protótipo funcional local. Não deve ser confundida com uma solução corporativa já aprovada para tratamento de dados reais.

## Dados potencialmente pessoais

Podem existir campos como:

- nome de cliente/contacto;
- telefone;
- morada/local;
- e-mail;
- nome e e-mail do colaborador;
- histórico de ações.

Em produção devem ser aplicados minimização, finalidade definida, controlo de acesso, política de retenção e procedimentos adequados ao RGPD e às regras internas da organização.

## Password local

A palavra-passe do perfil de protótipo:

- não é guardada em texto simples;
- é derivada com PBKDF2-SHA256 e salt aleatório;
- serve apenas para este browser/dispositivo.

Isto não equivale a autenticação corporativa. Em produção deve ser substituída por Microsoft Entra ID/SSO ou outro serviço aprovado.

## Backups

Existem três mecanismos locais:

1. snapshots IndexedDB;
2. backup JSON legível;
3. backup encriptado AES-GCM-256 com chave derivada por PBKDF2-SHA256.

O backup JSON pode conter informação sensível e deve ser protegido externamente. O backup encriptado não pode ser recuperado se a palavra-passe for perdida.

## Restauro

O restauro:

- valida a estrutura;
- rejeita IDs técnicos ou IDs apresentados duplicados;
- cria snapshot de segurança antes da operação;
- executa substituição dos stores principais numa transação IndexedDB atómica.

## Repositório público

Nunca publicar no GitHub:

- dados reais de clientes;
- exports SAP;
- tokens e chaves;
- passwords;
- matrizes internas confidenciais;
- endereços internos que não devam ser públicos;
- backups da aplicação.

## Produção

Antes de produção são necessários, no mínimo:

- identidade corporativa;
- autorização por função no servidor;
- backend/API com validação server-side;
- logs de auditoria protegidos;
- backups externos e testes de recuperação;
- HTTPS e headers de segurança;
- revisão de CSP;
- política de retenção;
- avaliação de privacidade e conformidade;
- revisão OWASP e testes de segurança.
