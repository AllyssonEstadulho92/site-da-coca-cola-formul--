# Catálogo técnico de Equipamentos — V5.0

## Objetivo

A área **Equipamentos** é um catálogo técnico operacional para identificação rápida durante chamadas, consulta de especificações confirmadas, sintomas documentados e acesso à documentação pública associada.

A V5 mantém os **53 modelos/diretórios aprovados do projeto**, mas deixou de utilizar o documento interno fornecido ao projeto como fonte técnica. O inventário de nomes/modelos continua a existir, porém qualquer especificação, sintoma ou possível causa só é apresentado como validado quando existe uma fonte externa identificável e suficientemente específica.

## Regra de evidência

A aplicação distingue:

- **Sintoma observado** — aquilo que o cliente/utilizador consegue relatar;
- **Possível causa documentada** — hipótese descrita por documentação técnica;
- **Diagnóstico** — não é inferido pela aplicação;
- **Consequência** — só deve ser apresentada quando existir suporte documental explícito.

Quando não existe documentação pública suficiente para a referência concreta, a UI apresenta:

> **Não validado para este modelo.**

Não são criados sintomas ou especificações para preencher espaços vazios.

## Fontes externas utilizadas

As fontes são registadas em `js/equipment/equipment-sources-v5.js` e incluem, conforme o modelo:

- **Frigoglass S.A.I.C.** — manuais públicos Plus-450/Plus-900, ICOOL, Retro, Easyreach e fichas públicas FV;
- **European Commission / EPREL** — ficha regulamentar europeia do Plus-450 quando aplicável;
- **Cornelius / Marmon Foodservice** — manuais e documentação pública das famílias Energize e LOOP/LOOP XL;
- **The Coca-Cola Company / CokeSolutions** — Vending, Coca-Cola Freestyle e troubleshooting público;
- **Dixie-Narco / Crane Merchandising Systems** — documentação técnica pública DN5800/BevMax;
- **Royal Vendors** — biblioteca técnica pública para famílias compatíveis.

Cada fonte contém organização, tipo de documento, URL, data de consulta e nível de validação.

## Sintomas documentados

A biblioteca central está em `js/equipment/equipment-symptoms-v5.js`.

Na primeira passagem V5 foram associados sintomas apenas onde existe suporte externo suficiente, incluindo:

- **Plus-450 / Plus-900** — troubleshooting do manual público Frigoglass;
- **ICOOL 300 / 450 / 900** — troubleshooting da documentação pública Frigoglass da série compatível;
- **DN5800 / BevMax** — troubleshooting público Crane/Dixie-Narco;
- **Coca-Cola Freestyle 7100 / 8100 / 9100** — cenários publicados pela Coca-Cola em CokeSolutions, apresentados como relação de família quando a fonte não diferencia o modelo.

Os restantes modelos permanecem explicitamente por validar quando a pesquisa ainda não encontrou documentação pública específica suficiente.

## Arquitetura da V5

A área foi separada em camadas:

- `js/equipment/equipment-catalog-data-v5.js` — inventário normalizado e dados técnicos validados;
- `js/equipment/equipment-sources-v5.js` — registo das fontes externas;
- `js/equipment/equipment-symptoms-v5.js` — biblioteca central de sintomas;
- `js/equipment/equipment-store-v5.js` — pesquisa, filtros, ordenação e resolução de estado;
- `js/equipment/equipment-components-v5.js` — UI reutilizável;
- `js/equipment/equipment-page-v5.js` — composição da página e interações;
- `css/equipment-v5.css` — layout responsivo da área;
- `css/equipment-sources-v5.css` — apresentação das fontes por secção.

## Fotografias

A fotografia real adicionada pelo utilizador continua guardada localmente no IndexedDB e tem prioridade visual sobre a referência gerada do catálogo.

A referência visual gerada é identificada como tal e **não é apresentada como fotografia oficial do fabricante**.

Não copiar automaticamente imagens protegidas da Internet para o repositório público.

## Segurança

Esta aplicação está publicada sem autenticação. Não incluir:

- dados reais de clientes;
- informação SAP;
- credenciais, passwords, tokens ou chaves;
- informação interna/confidencial;
- números de série, QR codes ou etiquetas reais visíveis em fotografias públicas.

Operações elétricas, circuito refrigerante, CO₂, sistemas pressurizados ou desmontagem técnica não são orientadas pela interface. Esses trabalhos pertencem a pessoal qualificado e à documentação oficial aplicável à unidade instalada.

## GitHub Pages

A V5 utiliza um build estático em `dist/`. O workflow Pages valida o projeto, gera o artefacto e publica apenas `dist/`, preservando caminhos relativos e navegação por hash.