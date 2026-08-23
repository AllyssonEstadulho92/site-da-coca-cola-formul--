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

## Dados de demonstração

A aplicação inclui um modo DEMO destinado a validação pública. Esses registos:

- usam o prefixo `DEMO`;
- são marcados internamente com `demo: true`;
- utilizam o domínio reservado `example.invalid`;
- não representam clientes, estabelecimentos, equipamentos ou regras empresariais reais.

Dados reais nunca devem ser convertidos em “demo” apenas alterando o nome. Para demonstração pública devem ser usados registos inteiramente fictícios.

## Perfil local do protótipo

O perfil local serve apenas para controlar o acesso aos dados guardados neste browser durante a validação do protótipo. Não é uma conta corporativa nem um mecanismo de autorização de servidor.

Na V3.4:

- `Entrar` e `Criar perfil de teste` são fluxos separados;
- novos perfis exigem confirmação da palavra-passe e política mínima de 12 caracteres com pelo menos 3 tipos de caracteres;
- o hash local é derivado com PBKDF2-SHA-256, salt aleatório e 210 000 iterações para novos perfis;
- perfis com um número inferior de iterações são rederivados após autenticação válida;
- cinco tentativas falhadas consecutivas provocam um bloqueio local temporário de cinco minutos;
- a sessão é bloqueada após 15 minutos de inatividade;
- logout/bloqueio removem a sessão e buffers transitórios do `sessionStorage`;
- a gestão do perfil exige contexto seguro (`HTTPS` ou contexto equivalente de desenvolvimento) e Web Crypto.

Estes controlos são de defesa em profundidade para um protótipo local. Um utilizador com controlo do browser/dispositivo pode eliminar armazenamento, modificar JavaScript ou contornar proteções exclusivamente client-side. Por isso, estes mecanismos **não devem ser usados para proteger dados corporativos reais**.

Nunca reutilizar neste protótipo uma palavra-passe utilizada em Microsoft 365, SAP, e-mail, VPN ou qualquer outro serviço corporativo/pessoal.

## Backups

Os backups JSON e os snapshots podem conter dados pessoais, dados operacionais e informação de autenticação local do protótipo. Não devem ser adicionados ao GitHub, enviados para canais públicos ou usados como dados de demonstração.

Quando o conteúdo for sensível, preferir o backup encriptado disponibilizado pela aplicação e manter a palavra-passe fora do ficheiro.

## Frontend

O `index.html` aplica uma Content Security Policy restritiva e política `no-referrer`. Estas medidas reduzem superfície de ataque, mas não substituem controlos do servidor.

O GitHub Pages fornece transporte HTTPS quando a publicação está corretamente configurada. HTTPS protege o transporte entre browser e site, mas não transforma o frontend estático num sistema de autenticação corporativa.

## Protótipo vs. produção

O login local é exclusivamente de protótipo. Em produção, autenticação e autorização devem ser executadas por um serviço de identidade/backend aprovado, por exemplo Microsoft Entra ID quando aplicável, com autorização por função no servidor.

IndexedDB melhora continuidade local, mas não substitui uma base de dados central, controlo de acesso no servidor, auditoria protegida, política de retenção ou backup corporativo.

Antes de permitir NIF, contactos, moradas, dados SAP ou outros dados reais, a arquitetura deve incluir pelo menos identidade corporativa, backend autorizado, RBAC server-side, base de dados central, logging/auditoria protegida e política formal de retenção.

## Reporte

Problemas de segurança que incluam informação sensível devem ser tratados de forma privada e não publicados em issues públicas.
