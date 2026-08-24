# Changelog

## 5.1.0

- Reconstruído o conteúdo da página Equipamentos para uma consulta operacional mais simples.
- Mantidos os 53 equipamentos com layout imagem à esquerda / conteúdo à direita.
- Adicionada descrição operacional para todos os modelos; descrições públicas específicas existentes são preservadas e complementadas.
- Integrada a matriz operacional fornecida ao projeto: 7 códigos de Vandalismo, 19 de Dispensing, 7 de Vending e 14 de Funcionamento Geral.
- Aplicação da matriz por categoria: Vitrines/Monster = 21 códigos; Vending = 28; Postmix/Freestyle/módulos auxiliares = 40.
- Pesquisa passa a encontrar equipamentos também por código ou texto de sintoma.
- Removidas da interface as secções Ficha técnica e Documentação.
- Removidos da apresentação os estados “Por validar” e “Sem sintomas específicos associados”.
- Fotografias locais e criação de registo continuam funcionais.
- Service Worker, backup, build e testes alinhados com V5.1.0.

## 5.0.1

- Isolado definitivamente o runtime de Equipamentos na camada `js/equipment/`.
- Removidos do runtime e do cache PWA os módulos antigos de catálogo e imagens.
- Gestão de fotografias locais movida para `equipment-local-images-v5.js`.
- Criação de registo a partir do catálogo movida para `equipment-actions-v5.js`.
- Removidos ficheiros JS/CSS legados de Equipamentos V3/V4/V4.6.
- Removida a árvore `data/equipment/`, que continha dados técnicos antigos não utilizados pela V5.
- Build estático tornado determinístico: `dist/` recebe apenas recursos declarados no Service Worker.

## 5.0.0

- Reconstruída a página Equipamentos como catálogo técnico operacional responsivo.
- Mantidos 53 equipamentos do inventário aprovado.
- Registadas fontes técnicas externas identificáveis e relações documentadas de sintomas.
- Removida a utilização do manual interno como fonte técnica da V5.

## 3.9.0

- Removida integralmente a autenticação local do protótipo.
- A aplicação passou a abrir diretamente no Dashboard.
- Removidos perfis de autenticação dos novos backups e da base local.

O detalhe das versões anteriores permanece disponível no histórico Git.
