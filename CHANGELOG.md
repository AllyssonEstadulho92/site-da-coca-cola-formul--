# Changelog

## 6.0.0

- Projeto reposicionado como **Formulários Operacionais**.
- Removida integralmente a área Equipamentos: rota, catálogo, fotografias, sintomas técnicos, fontes, CSS, assets, módulos JavaScript, documentação dedicada e testes específicos.
- Removido o diretório técnico de equipamentos consolidado por REF; as referências continuam disponíveis dentro dos registos e no contexto do cliente.
- Criado **Designer de Formulário** funcional com pré-visualização.
- O Designer permite reordenar secções, alterar títulos, ocultar campos opcionais, escolher densidade, largura, cor de destaque e resumo lateral.
- Campos obrigatórios ficam protegidos contra ocultação.
- A captura do formulário passa a preservar dados de campos opcionais ocultos durante uma edição.
- Formulário real passa a consumir `settings.formDesign` sem duplicar o modelo de dados.
- IndexedDB atualizado para schema 5; a store `equipmentImages` é removida durante a migração.
- Backups passam a identificar `appVersion: 6.0.0` e deixam de exportar dados exclusivos da área eliminada.
- Service Worker/cache renovado como `formularios-operacionais-v6.0.0`.
- Build deixou de conter lógica específica de fotografias/equipamentos.
- Testes de limpeza impedem a reintrodução de `js/equipment`, `assets/equipment`, `equipment-v5.css` e suites antigas.
- GitHub Pages passa a executar smoke test pós-deploy do Designer de Formulário.

## 5.2.0

- Corrigido layout mobile do catálogo de Equipamentos e criada política para fotografias reais verificadas.
- Removida a referência visual gerada e reforçados PWA, build e testes do catálogo.

## 5.1.0–5.1.1

- Simplificada a consulta de Equipamentos e reforçada a estabilidade de runtime/cache.
- Integrada matriz operacional de sintomas por categoria.

## 5.0.0–5.0.1

- Reconstrução do catálogo técnico e posterior limpeza do runtime legado.

## 3.9.0

- Removida a autenticação local do protótipo; acesso direto ao Dashboard.

O detalhe das versões anteriores permanece disponível no histórico Git.
