# Catálogo técnico de Equipamentos — V5.0.1

## Objetivo

A área **Equipamentos** é um catálogo operacional para identificação rápida durante chamadas, consulta da ficha do modelo, sintomas documentados e acesso à documentação associada.

O catálogo mantém 53 equipamentos. A camada visual foi reconstruída com uma base mais simples: cada equipamento usa um grid interno de duas secções, com fotografia à esquerda e conteúdo à direita.

## Regra de evidência

A aplicação não inventa dados técnicos, sintomas ou diagnósticos. Quando não existe informação associada ao modelo, a interface apresenta uma indicação curta de ausência de dados em vez de criar conteúdo por inferência.

## Fontes

As fontes externas continuam registadas em `equipment-sources-v5.js`. A nova interface evita repetir blocos de fonte em cada secção; a documentação associada ao equipamento continua acessível na ficha.

## Sintomas

As relações técnicas já registadas permanecem em `equipment-symptoms-v5.js`. Na interface, a secção Sintomas apresenta apenas os sintomas efetivamente associados ao modelo. Modelos sem relação registada mostram uma mensagem simples de ausência de sintomas específicos.

## Módulos V5

- `equipment-catalog-data-v5.js` — inventário e dados técnicos.
- `equipment-sources-v5.js` — fontes externas registadas.
- `equipment-symptoms-v5.js` — sintomas documentados.
- `equipment-store-v5.js` — pesquisa e dados derivados.
- `equipment-local-images-v5.js` — fotografias reais locais.
- `equipment-actions-v5.js` — criação de registo a partir do catálogo.
- `equipment-components-v5.js` — componentes reconstruídos do catálogo e da ficha.
- `equipment-page-v5.js` — composição, pesquisa, categorias e interações.
- `equipment-v5.css` — único ficheiro de estilos específico da área.

## Fotografias

A fotografia ocupa a secção esquerda de cada cartão. Fotografias reais adicionadas localmente têm prioridade visual. Quando não existe fotografia real, é apresentada a referência visual já versionada no projeto.

No detalhe, a fotografia pode ser adicionada, substituída ou removida sem alterar os dados técnicos do equipamento.

## Estrutura visual

### Catálogo

- pesquisa no topo;
- categorias em chips horizontais;
- grelha de dois cartões por linha em ecrãs largos;
- um cartão por linha em portátil/tablet;
- cada cartão mantém duas secções: imagem à esquerda e conteúdo à direita, inclusive no smartphone com proporção reduzida.

### Ficha

A ficha abre de forma simples e contínua, sem separadores redundantes. O topo repete a mesma lógica de duas áreas e o conteúdo técnico fica organizado em Ficha técnica, Sintomas e Documentação.

## GitHub Pages

O build estático publica em `dist/` apenas os recursos declarados no Service Worker. Ficheiros de desenvolvimento, testes e documentação não entram no artefacto publicado.
