# Sistema de Registo de Avarias — V3

Aplicação web **mobile-first/PWA** para produtividade profissional, registo de ocorrências, acompanhamento de equipamentos, encaminhamentos e histórico operacional.

A V3 implementa a camada funcional local e deixa as integrações corporativas isoladas para posterior ligação a serviços autorizados.

## Estado do projeto

**Protótipo funcional profissional.** Pode ser usado para validação de UX, regras, estrutura de dados e fluxo de trabalho. Ainda não deve ser tratado como sistema corporativo de produção enquanto não existir backend autorizado, identidade corporativa, política formal de retenção e validação das regras internas.

## Funcionalidades implementadas

- Login/perfil local de protótipo com derivação PBKDF2; a palavra-passe não é guardada em texto simples.
- Dashboard com indicadores diários, estados e atividade recente.
- Fluxo visual: Registado → Em andamento → Enviado → Em tratamento → Aguarda resposta → Encerrado.
- Novo registo e edição protegida por buffer local.
- Campos de Data, Agente, Nº Contribuinte, Cliente, Nome do contacto, Contacto, Estabelecimento, Morada/Local, Horário, REF Equipamento, Tipo de equipamento, Categoria, Sintoma, Avaria, Prioridade, PT, Departamento, E-mail, Nº Nota, Tratado e Observações.
- Autosave com IndexedDB e recuperação de rascunhos.
- IDs legíveis `REG-AAAA-000001` e UUID técnico.
- Deteção de possíveis duplicados por REF e janela temporal configurável.
- PT 32 / PT 60 / PT 70 configuráveis, sem inventar regras empresariais.
- Matriz de encaminhamento por equipamento, sintoma e categoria.
- Tratamento de regras ambíguas sem decisão silenciosa.
- Assistente de e-mail: destinatário, assunto, corpo, copiar e abrir cliente de correio.
- Pesquisa global e filtros combinados.
- Diretórios de clientes e equipamentos com histórico.
- Timeline/auditoria das ações e alterações.
- Arquivo lógico e reabertura controlada.
- Produtividade com evolução de 7 dias e distribuição operacional.
- Exportação CSV compatível com Excel.
- Backup JSON e backup encriptado AES-GCM com chave derivada por PBKDF2.
- Snapshots locais automáticos e pré-restauro.
- Validação do backup antes do restauro.
- PWA, Service Worker e modo offline para recursos já armazenados.
- Design responsivo para telemóvel, tablet e desktop.
- Acessibilidade base: labels, teclado, foco visível, contraste, sem dependência exclusiva de cor e suporte a `prefers-reduced-motion`.

## Estrutura

```text
.
├── index.html
├── manifest.json
├── service-worker.js
├── package.json
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── core.js
│   └── db.js
├── assets/
│   └── app-icon.svg
├── tests/
│   └── core.test.js
├── docs/
│   ├── ARQUITETURA.md
│   ├── DADOS_E_SEGURANCA.md
│   ├── GUIA_UTILIZACAO.md
│   ├── QA_REPORT.md
│   └── ROADMAP_PRODUCAO.md
└── .github/workflows/ci.yml
```

## Executar localmente

O Service Worker requer HTTP/HTTPS. Exemplo:

```bash
python -m http.server 8000
```

Depois abrir `http://localhost:8000/`.

## Verificação técnica

```bash
npm run check
```

Inclui validação sintática de JavaScript e testes unitários da lógica central.

## Dados e segurança

O repositório é público. **Não inserir dados reais de clientes, credenciais, endereços internos, tokens, regras confidenciais, informação proveniente do SAP ou e-mails corporativos não destinados a publicação.**

Para produção devem ser adicionados, conforme autorização da organização:

- Microsoft Entra ID/SSO ou outro IdP aprovado;
- backend/API autorizada;
- base de dados central;
- controlo de acesso por função no servidor;
- logs de auditoria protegidos;
- backups independentes do dispositivo;
- política de retenção e eliminação;
- integração Microsoft Lists/SharePoint/Power Automate, se aprovada;
- integração SAP apenas através de mecanismo oficial/autorizado.

## Regras empresariais por confirmar

Antes de uso operacional é necessário confirmar:

- significado e critérios oficiais de PT 32, PT 60 e PT 70;
- destinatários e e-mails autorizados;
- catálogo oficial de equipamentos;
- sintomas e categorias oficiais;
- regras de encaminhamento e exceções;
- formato oficial do Nº Nota;
- campos obrigatórios internos;
- política de retenção, perfis e permissões.

## Princípio de desenvolvimento

Nenhuma regra empresarial é inventada no código. O projeto distingue funcionalidades técnicas implementadas de regras corporativas ainda por validar.
