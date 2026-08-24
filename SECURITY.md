# Segurança

## Repositório público

Este repositório é público e deve conter apenas código, documentação e dados explicitamente fictícios de demonstração.

Não publicar credenciais, passwords, tokens, chaves API, dados reais de clientes ou colaboradores, NIF, moradas, telefones, referências operacionais, exportações SAP, e-mails internos, matrizes confidenciais, backups da aplicação ou ficheiros `.env` reais.

## V5.2.0 — sem autenticação

A aplicação abre diretamente no Dashboard. Não existe formulário de login, validação de domínio, password de acesso, lockout, logout nem autorização de utilizadores.

Existe apenas uma identificação local opcional usada para novos registos e atividades. Essa identificação não controla acesso.

Qualquer pessoa que consiga abrir o endereço público consegue abrir a aplicação. HTTPS protege o transporte, mas não substitui autenticação ou autorização.

## Dados de demonstração

Os registos DEMO usam prefixo `DEMO`, são marcados com `demo: true` e utilizam o domínio reservado `example.invalid`.

## Equipamentos

A V5.2.0 apresenta descrições operacionais/técnicas e uma matriz de sintomas filtrada pela capacidade funcional da categoria. Os códigos destinam-se à classificação do sintoma observado e não constituem diagnóstico ou causa confirmada.

Dados técnicos/fontes já registados permanecem preservados no código, mas não são apresentados como Ficha técnica/Documentação na interface atual.

A referência visual gerada foi removida. Uma fotografia só recebe a etiqueta `Fotografia real` quando foi adicionada localmente ao equipamento ou quando existe um asset versionado explicitamente marcado `VERIFIED_REAL` no registo de fotografias.

Fotografias versionadas devem corresponder ao slug exato do equipamento, ter autorização de utilização e não expor números de série, QR codes, etiquetas operacionais, dados de cliente, geolocalização sensível ou informação interna. O repositório não deve usar imagens remotas de terceiros diretamente no frontend.

Fotografias adicionadas pelo utilizador permanecem no IndexedDB do dispositivo e não são publicadas automaticamente no GitHub.

## Backups

Backups JSON e snapshots podem conter tudo o que o utilizador introduziu. Não devem ser adicionados ao repositório ou enviados para canais públicos.

O backup encriptado utiliza uma palavra-passe própria do ficheiro. Isto é independente de autenticação da aplicação e não cria controlo de acesso ao site.

## Frontend e PWA

O `index.html` mantém Content Security Policy e `no-referrer`. O Service Worker usa network-first para HTML, JavaScript e CSS quando existe ligação e fallback offline para recursos previamente armazenados.

O build de GitHub Pages publica apenas recursos de runtime e fotografias reais explicitamente declaradas no registo autorizado. O deploy executa verificação pós-publicação dos módulos e do contrato mobile de Equipamentos.

## Produção

Antes de permitir dados reais são necessários identidade corporativa aprovada, backend autorizado, RBAC server-side, base de dados central, logging/auditoria protegida, backups, retenção e revisão formal de segurança e privacidade.
