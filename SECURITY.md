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

## Backups

Os backups JSON e os snapshots podem conter dados pessoais, dados operacionais e informação de autenticação local do protótipo. Não devem ser adicionados ao GitHub, enviados para canais públicos ou usados como dados de demonstração.

Quando o conteúdo for sensível, preferir o backup encriptado disponibilizado pela aplicação e manter a palavra-passe fora do ficheiro.

## Frontend

O `index.html` aplica uma Content Security Policy restritiva e política `no-referrer`. Estas medidas reduzem superfície de ataque, mas não substituem controlos do servidor.

## Protótipo vs. produção

O login local é exclusivamente de protótipo. Em produção, autenticação e autorização devem ser executadas por um serviço de identidade/backend aprovado.

IndexedDB melhora continuidade local, mas não substitui uma base de dados central, controlo de acesso no servidor nem backup corporativo.

## Reporte

Problemas de segurança que incluam informação sensível devem ser tratados de forma privada e não publicados em issues públicas.
