# Changelog

## 5.2.0

- Corrigido o layout mobile da página Equipamentos para impedir corte horizontal dos cartões no iPhone/Android.
- Mantida a composição aprovada imagem à esquerda / conteúdo à direita também em ecrãs estreitos, com colunas proporcionais e `min-width: 0` nos elementos críticos.
- Removido o sprite visual gerado utilizado como referência; imagens genéricas deixam de ocupar a área de fotografia.
- Adicionado estado profissional `Fotografia pendente` quando ainda não existe fotografia real validada.
- Criado `equipment-photo-registry-v5.js` para associar fotografias reais versionadas ao slug exato do equipamento e só aceitar estado `VERIFIED_REAL`.
- Fotografias locais passam a guardar também slug, nome, modelo e estado da associação ao equipamento.
- Falha de carregamento de uma fotografia degrada apenas a imagem para estado pendente, sem quebrar o catálogo.
- Descrições genéricas passaram a respeitar a subcategoria do equipamento em vez de repetir uma descrição ampla de categoria.
- A matriz operacional continua preservada integralmente, mas a associação de Funcionamento Geral passa a ser filtrada pela capacidade funcional da categoria; vitrines deixam de receber sintomas de saída/seleção de produto próprios de dispensing.
- Build passa a publicar automaticamente fotografias reais declaradas no registo e rejeita caminhos fora da pasta autorizada.
- Adicionado contrato automático de layout mobile e reforçado o smoke test pós-deploy do GitHub Pages.
- Cache PWA, backup e identificação visual alinhados com V5.2.0.

## 5.1.1

- Corrigida a modelação interna dos códigos operacionais: códigos iguais em grupos diferentes passam a ter chave contextual única (`GRUPO:CÓDIGO`) sem alterar o código apresentado ao utilizador.
- A página Equipamentos deixa de poder falhar silenciosamente: se houver recursos incompletos ou erro de runtime, apresenta recuperação visível com ação para atualizar a aplicação.
- Cache PWA renovado para forçar a substituição de recursos antigos em dispositivos que já tinham a aplicação aberta/instalada.
- Testes de Equipamentos passam a executar uma renderização real dos 53 cartões e da ficha do 300 RAX, além de validar a ordem dos módulos.
- Workflow de GitHub Pages passa a validar a página e os módulos de Equipamentos depois do deploy, evitando considerar concluída uma versão que não esteja efetivamente publicada.

## 5.1.0

- Reconstruído o conteúdo da página Equipamentos para uma consulta operacional mais simples.
- Mantidos os 53 equipamentos com layout imagem à esquerda / conteúdo à direita.
- Adicionada descrição operacional para todos os modelos; descrições públicas específicas existentes são preservadas e complementadas.
- Integrada a matriz operacional fornecida ao projeto: 7 códigos de Vandalismo, 19 de Dispensing, 7 de Vending e 14 de Funcionamento Geral.
- Pesquisa passa a encontrar equipamentos também por código ou texto de sintoma.
- Removidas da interface as secções Ficha técnica e Documentação.
- Fotografias locais e criação de registo continuam funcionais.

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
