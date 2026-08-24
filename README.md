# Sistema de Registo de Avarias — V5.0.1

PWA estática e mobile-first para produtividade profissional, registo de ocorrências e catálogo técnico operacional de equipamentos.

## Estado atual

**Protótipo público sem autenticação.** A aplicação abre diretamente no Dashboard e destina-se apenas a validação funcional, UX e demonstração com dados fictícios.

Não utilizar dados reais de clientes, informação SAP, credenciais, e-mails internos, referências operacionais ou outra informação interna/confidencial.

## Funcionalidades

- Dashboard e fluxo de estados operacional.
- Novo registo, edição, autosave e histórico local em IndexedDB.
- Pesquisa, filtros, arquivo, reabertura e timeline de atividade.
- PT 32 / 60 / 70 configuráveis, sem regras empresariais inventadas.
- Assistente de e-mail iniciado pelo utilizador.
- Produtividade, CSV, backup JSON, backup encriptado e snapshots locais.
- PWA com funcionamento offline após primeiro carregamento.
- Catálogo técnico V5 com 53 equipamentos.
- Pesquisa por nome, modelo, código, fabricante e tipo.
- Filtros por categoria, fabricante, fotografia, documentação, sintomas e validação.
- 21 fontes técnicas externas registadas e 16 relações documentadas de sintomas.
- Fotografias reais adicionadas localmente, com prioridade sobre a referência visual gerada.

## Equipamentos V5

A área de equipamentos utiliza exclusivamente a camada `js/equipment/`:

- `equipment-sources-v5.js`
- `equipment-symptoms-v5.js`
- `equipment-catalog-data-v5.js`
- `equipment-store-v5.js`
- `equipment-local-images-v5.js`
- `equipment-actions-v5.js`
- `equipment-components-v5.js`
- `equipment-page-v5.js`

Dados técnicos e sintomas só são apresentados como validados quando existe fonte pública identificável e suficientemente específica. Uma possível causa documentada nunca é apresentada como diagnóstico.

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
  equipment-sources-v5.css
js/
  ...módulos gerais da aplicação...
  equipment/
scripts/
tests/
docs/
```

Ficheiros legados de Equipamentos V3/V4/V4.6 e dados técnicos antigos não utilizados foram removidos da árvore ativa. O histórico continua disponível no Git.

## Executar localmente

O Service Worker requer HTTP/HTTPS:

```bash
python -m http.server 8000
```

Depois abrir `http://localhost:8000/`.

## Verificação técnica

```bash
npm run check
npm run build
```

O build é determinístico: publica em `dist/` apenas os recursos declarados no Service Worker, em vez de copiar integralmente as pastas de desenvolvimento.

## Produção

Antes de permitir dados reais são necessários, conforme aprovação da organização: identidade corporativa, backend/API autorizado, base de dados central, RBAC server-side, auditoria protegida, backups independentes do dispositivo, retenção formal e integrações oficiais.

## Princípio de desenvolvimento

O projeto distingue funcionalidades técnicas implementadas de regras empresariais ainda por confirmar. Não são inventados dados técnicos, sintomas, diagnósticos ou regras corporativas para preencher lacunas.
