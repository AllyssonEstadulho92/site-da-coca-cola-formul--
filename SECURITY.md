# Segurança

## Repositório público

Este repositório é público e deve conter apenas código, documentação e dados fictícios de demonstração.

Não publicar credenciais, passwords, tokens, chaves API, dados reais de clientes ou colaboradores, NIF, moradas, telefones, referências operacionais reais, exportações SAP, e-mails internos, backups da aplicação ou ficheiros `.env` reais.

## V6.0.0 — sem autenticação

A aplicação abre diretamente no Dashboard. Não existe login, password de acesso, lockout, logout nem autorização de utilizadores.

Existe apenas uma identificação local opcional para novos registos e atividades. Essa identificação não controla acesso.

Qualquer pessoa que consiga abrir o endereço público consegue abrir a aplicação. HTTPS protege o transporte, mas não substitui autenticação ou autorização.

## Formulários e Designer

O Designer altera apenas a apresentação configurável do formulário: ordem e títulos das secções, visibilidade de campos opcionais, densidade, largura, destaque e resumo lateral.

Campos obrigatórios não podem ser ocultados pelo Designer. Ocultar um campo opcional não elimina automaticamente valores já guardados no registo.

A antiga área Equipamentos foi removida. Não existem catálogo, fotografias de equipamentos ou documentação técnica no runtime V6.

## Dados locais e backups

IndexedDB guarda registos, atividades, configurações e snapshots. O schema atual é 5. A migração remove a antiga store `equipmentImages`.

Backups JSON e snapshots podem conter tudo o que o utilizador introduziu. Nunca devem ser adicionados ao repositório ou enviados para canais públicos.

O backup encriptado protege apenas o ficheiro exportado e não cria controlo de acesso ao site.

## Frontend e PWA

O `index.html` mantém Content Security Policy e `no-referrer`. O Service Worker usa network-first para HTML, JavaScript e CSS quando existe ligação e fallback offline para recursos armazenados.

O build do GitHub Pages publica apenas recursos de runtime declarados no Service Worker e executa validação pós-deploy do Designer.

## Produção

Antes de permitir dados reais são necessários identidade corporativa aprovada, backend autorizado, autenticação, RBAC server-side, base de dados central, logging/auditoria protegida, backups, retenção e revisão formal de segurança e privacidade.
