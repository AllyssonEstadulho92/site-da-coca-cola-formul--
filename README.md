# Sistema de Registo de Avarias — V5.2.0

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
- Pesquisa por nome, modelo, código, fabricante e texto/código de sintoma.
- Cartões em duas secções: fotografia à esquerda e conteúdo à direita, incluindo em smartphone.
- Descrições específicas preservadas quando suportadas; nos restantes modelos é usada descrição operacional coerente com a subcategoria, sem inventar especificações.
- Matriz operacional separada em Vandalismo, Funcionamento Geral, Específico Dispensing e Específico Vending.
- Associação dos sintomas gerais filtrada pela capacidade funcional da categoria, evitando sintomas de dispensing em vitrines.
- Fotografias reais locais e suporte a fotografias reais versionadas com validação explícita.

## Equipamentos V5.2

A página mantém os 53 equipamentos e foi reforçada para consulta rápida em iPhone, Android e computador.

Cada cartão apresenta:

1. fotografia real validada ou estado profissional **Fotografia pendente**;
2. categoria, código, nome, modelo e fabricante quando confirmado;
3. descrição operacional/técnica disponível;
4. resumo de sintomas operacionais coerentes com a categoria;
5. ações `Ver ficha` e `Criar registo`.

A aplicação **não utiliza mais o sprite de referência gerado**. Uma imagem genérica ou de referência não é apresentada como fotografia real.

### Política de fotografias

A prioridade visual é:

1. fotografia real adicionada localmente ao equipamento;
2. fotografia real versionada e marcada `VERIFIED_REAL` no registo;
3. estado `Fotografia pendente`.

Fotografias versionadas devem ser registadas em `js/equipment/equipment-photo-registry-v5.js` e usar `assets/equipment/photos/<slug>.<ext>`. O build valida os caminhos e publica automaticamente os ficheiros declarados.

O registo versionado pode permanecer vazio enquanto não existirem fotografias cuja correspondência e autorização tenham sido confirmadas. Isto evita associar fotografias erradas aos 53 modelos.

### Sintomas e causas

A matriz serve para **classificação do sintoma observado**. Códigos repetidos entre grupos possuem chaves internas contextuais para não colidirem.

A interface não converte sintomas em diagnóstico. Uma hipótese técnica só pode ser tratada como **causa confirmada** depois de confirmação do técnico em campo.

## Robustez mobile e PWA

A V5.2.0 reforça `min-width: 0`, `max-width: 100%`, quebra segura de texto e colunas móveis proporcionais para impedir overflow horizontal. A imagem continua à esquerda e o conteúdo à direita nos breakpoints móveis.

Se um módulo de Equipamentos não carregar, a página mostra uma ação de recuperação em vez de ficar branca. Se uma fotografia real falhar, apenas a fotografia degrada para `Fotografia pendente`; o catálogo continua funcional.

O Service Worker usa cache V5.2.0 e o GitHub Pages executa smoke test pós-deploy da versão, registo de fotografias, runtime e CSS mobile.

## Módulos de Equipamentos

- `equipment-sources-v5.js`
- `equipment-symptoms-v5.js`
- `equipment-operational-symptoms-v5.js`
- `equipment-catalog-data-v5.js`
- `equipment-photo-registry-v5.js`
- `equipment-store-v5.js`
- `equipment-local-images-v5.js`
- `equipment-actions-v5.js`
- `equipment-components-v5.js`
- `equipment-page-v5.js`

## Estrutura relevante

```text
index.html
service-worker.js
manifest.json
assets/
  app-icon.svg
  equipment/
    README.md
    photos/                 # apenas quando existirem fotos reais validadas
css/
  equipment-v5.css
js/
  equipment/
scripts/
tests/
docs/
```

## Verificação técnica

```bash
npm run check
npm run build
```

O build publica em `dist/` apenas recursos de runtime e fotografias reais declaradas. O deploy Pages valida a versão pública antes de considerar a publicação concluída.

## Produção

Antes de permitir dados reais são necessários, conforme aprovação da organização: identidade corporativa, backend/API autorizado, base de dados central, RBAC server-side, auditoria protegida, backups independentes do dispositivo, retenção formal e integrações oficiais.
