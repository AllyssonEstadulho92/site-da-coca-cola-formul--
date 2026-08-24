# Changelog

## 5.0.1

- Isolado definitivamente o runtime de Equipamentos na camada `js/equipment/`.
- Removidos do runtime e do cache PWA os módulos antigos de catálogo e imagens.
- Gestão de fotografias locais movida para `equipment-local-images-v5.js`.
- Criação de registo a partir do catálogo movida para `equipment-actions-v5.js`.
- Cache PWA e identificação de backup alinhados com V5.0.1.
- Removidos ficheiros JS/CSS legados de Equipamentos V3/V4/V4.6.
- Removida a árvore `data/equipment/`, que continha dados técnicos antigos não utilizados pela V5.
- Removida a estrutura de 53 pastas vazias reservadas a imagens; a V5 utiliza apenas a referência visual versionada e fotografias locais em IndexedDB.
- Documentação principal revista para eliminar instruções antigas de autenticação e referências V3 desatualizadas.
- Build estático tornado determinístico: `dist/` recebe apenas recursos declarados no Service Worker.
- Adicionado teste de limpeza estrutural para impedir reintrodução de ficheiros legados.

## 5.0.0

- Reconstruída a página Equipamentos como catálogo técnico operacional responsivo.
- Mantidos 53 equipamentos do inventário aprovado.
- Registadas 21 fontes técnicas externas identificáveis.
- Criadas 16 relações documentadas de sintomas, sem inferir diagnóstico.
- Adicionados pesquisa, filtros, ordenação, contador, estado vazio e ficha lateral/mobile.
- Separadores: Visão geral, Especificações, Sintomas, Documentação e Fotografias.
- Removida a utilização do manual interno como fonte técnica da V5.
- GitHub Pages passou a publicar apenas o build validado de `dist/`.

## 3.9.0

- Removida integralmente a autenticação local do protótipo.
- A aplicação passou a abrir diretamente no Dashboard.
- Removidos perfis de autenticação dos novos backups e da base local.
- Reforçados os avisos de segurança para utilização apenas com dados fictícios.

O detalhe das versões anteriores permanece disponível no histórico Git.
