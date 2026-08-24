# Segurança

## Repositório público

Este repositório é público e deve conter apenas código, documentação e dados explicitamente fictícios de demonstração.

Não publicar credenciais, passwords, tokens, chaves API, dados reais de clientes ou colaboradores, NIF, moradas, telefones, referências operacionais, exportações SAP, e-mails internos, matrizes confidenciais, backups da aplicação ou ficheiros `.env` reais.

## V5.1.0 — sem autenticação

A aplicação abre diretamente no Dashboard. Não existe formulário de login, validação de domínio, password de acesso, lockout, logout nem autorização de utilizadores.

Existe apenas uma identificação local opcional usada para novos registos e atividades. Essa identificação não controla acesso.

Qualquer pessoa que consiga abrir o endereço público consegue abrir a aplicação. HTTPS protege o transporte, mas não substitui autenticação ou autorização.

## Dados de demonstração

Os registos DEMO usam prefixo `DEMO`, são marcados com `demo: true` e utilizam o domínio reservado `example.invalid`.

## Equipamentos

A V5.1.0 apresenta descrições operacionais e uma matriz de sintomas por categoria. Os códigos da matriz destinam-se à classificação do sintoma reportado e não constituem diagnóstico técnico.

Dados técnicos/fontes já registados permanecem preservados no código, mas não são apresentados na interface atual de Equipamentos.

Fotografias reais adicionadas pelo utilizador permanecem no IndexedDB do dispositivo e não são publicadas automaticamente no GitHub. Não publicar fotografias que exponham números de série, QR codes, etiquetas, dados de cliente ou informação interna.

## Backups

Backups JSON e snapshots podem conter tudo o que o utilizador introduziu. Não devem ser adicionados ao repositório ou enviados para canais públicos.

O backup encriptado utiliza uma palavra-passe própria do ficheiro. Isto é independente de autenticação da aplicação e não cria controlo de acesso ao site.

## Frontend e PWA

O `index.html` mantém Content Security Policy e `no-referrer`. O Service Worker usa network-first para HTML, JavaScript e CSS quando existe ligação e fallback offline para recursos previamente armazenados.

O build de GitHub Pages publica apenas os recursos de runtime declarados no Service Worker.

## Produção

Antes de permitir dados reais são necessários identidade corporativa aprovada, backend autorizado, RBAC server-side, base de dados central, logging/auditoria protegida, backups, retenção e revisão formal de segurança e privacidade.
