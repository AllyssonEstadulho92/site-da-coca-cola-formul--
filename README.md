# Sistema de Registo de Avarias — V5.1.0

PWA estática e mobile-first para produtividade profissional, registo de ocorrências e consulta operacional de equipamentos.

## Estado atual

**Protótipo público sem autenticação.** A aplicação abre diretamente no Dashboard e destina-se a validação funcional, UX e demonstração com dados fictícios.

Não utilizar dados reais de clientes, informação SAP, credenciais, e-mails internos, referências operacionais ou outra informação interna/confidencial.

## Funcionalidades

- Dashboard e fluxo de estados operacional.
- Novo registo, edição, autosave e histórico local em IndexedDB.
- Pesquisa, arquivo, reabertura e timeline de atividade.
- PT 32 / 60 / 70 configuráveis, sem regras empresariais inventadas.
- Assistente de e-mail iniciado pelo utilizador.
- Produtividade, CSV, backup JSON, backup encriptado e snapshots locais.
- PWA com funcionamento offline após primeiro carregamento.
- Catálogo com **53 equipamentos**.
- Pesquisa por nome, modelo, código, fabricante e também por texto/código de sintoma.
- Navegação simples por categorias.
- Cartões em duas secções: fotografia à esquerda e conteúdo à direita.
- Descrição operacional completa para todos os 53 equipamentos; quando existe descrição pública específica ela é preservada e complementada pelo contexto operacional da categoria.
- Matriz operacional de sintomas fornecida ao projeto, separada em Vandalismo, Funcionamento Geral, Específico Dispensing e Específico Vending.
- Fotografias reais adicionadas localmente, com prioridade sobre a referência visual gerada.

## Equipamentos V5.1

A interface foi simplificada para consulta durante uma chamada. **Ficha técnica** e **Documentação** deixaram de ser secções visíveis da ficha. A consulta apresenta essencialmente:

1. fotografia;
2. identificação do equipamento;
3. descrição operacional;
4. sintomas aplicáveis por código;
5. ações `Ver ficha` e `Criar registo`.

Os dados técnicos/fontes já registados continuam preservados na camada de dados para rastreabilidade e evolução futura, mas não poluem a apresentação atual.

A área utiliza a camada `js/equipment/`:

- `equipment-sources-v5.js`
- `equipment-symptoms-v5.js`
- `equipment-operational-symptoms-v5.js`
- `equipment-catalog-data-v5.js`
- `equipment-store-v5.js`
- `equipment-local-images-v5.js`
- `equipment-actions-v5.js`
- `equipment-components-v5.js`
- `equipment-page-v5.js`

A matriz operacional serve para **classificação do sintoma reportado**. Não é apresentada como diagnóstico técnico nem como causa da avaria.

## Estrutura do projeto

```text
index.html
service-worker.js
manifest.json
assets/
  app-icon.svg
  equipment/
    reference-sprite-v46.jpg
css/
  styles.css
  base.css
  features.css
  theme.css
  equipment-v5.css
js/
  ...módulos gerais da aplicação...
  equipment/
scripts/
tests/
docs/
```

## Executar localmente

```bash
python -m http.server 8000
```

Depois abrir `http://localhost:8000/`.

## Verificação técnica

```bash
npm run check
npm run build
```

O build publica em `dist/` apenas os recursos declarados no Service Worker.

## Produção

Antes de permitir dados reais são necessários, conforme aprovação da organização: identidade corporativa, backend/API autorizado, base de dados central, RBAC server-side, auditoria protegida, backups independentes do dispositivo, retenção formal e integrações oficiais.
