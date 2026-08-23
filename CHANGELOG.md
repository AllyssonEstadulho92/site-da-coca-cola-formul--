# Changelog

## 3.4.0

- Separados os fluxos `Entrar` e `Criar perfil de teste`; o primeiro acesso deixa de criar perfil implicitamente.
- Ecrã de acesso identifica explicitamente o ambiente como `Protótipo local` e proíbe o uso de dados reais/credenciais corporativas.
- Adicionado indicador de contexto seguro HTTPS/Web Crypto.
- Novos perfis exigem palavra-passe com pelo menos 12 caracteres e combinação de pelo menos 3 tipos de caracteres.
- Adicionada confirmação de palavra-passe e indicador de robustez na criação do perfil.
- Novos hashes PBKDF2-SHA-256 usam 210 000 iterações; perfis existentes são rederivados após login válido quando usam iteração inferior.
- Adicionado bloqueio local de 5 minutos após 5 tentativas falhadas consecutivas.
- Mensagens de autenticação inválida passam a ser neutras para reduzir enumeração do perfil.
- Sessão local bloqueia após 15 minutos de inatividade e exige nova autenticação.
- Logout e bloqueio removem estado transitório de sessão, buffers temporários e seleção transitória do catálogo.
- Adicionado CSS dedicado para o ecrã de segurança e cache PWA atualizado para V3.4.0.
- Adicionado teste automático `auth-security.test.js` ao `npm run check`.
- Mantido explicitamente o limite arquitetural: estas proteções são locais e não substituem SSO, backend, RBAC ou auditoria de produção.

## 3.3.0

- Redesenhada a área Equipamentos para corresponder ao protótipo visual aprovado.
- Catálogo e ficha do equipamento passam a coexistir numa área de trabalho em duas colunas no desktop.
- Equipamentos agrupados por Vitrines, Postmix, Vending, Freestyle e Outros.
- Adicionadas referências visuais legíveis como `VIT-2P01`, `PM-DROPIN-08`, `VEN-GF-GDE` e `FS-9100`.
- Adicionados separadores Visão Geral, Ficha Técnica, Sintomas, Consequências e Documentos.
- Pesquisa, filtro por categoria e alternância grelha/lista funcionais.
- Mantida a vista Meus Equipamentos com os equipamentos provenientes dos registos operacionais.
- A ação Criar Registo continua a transportar a seleção do catálogo para o formulário de avaria.
- Melhorada a adaptação a tablet e telemóvel sem remover informação técnica.
- Reforçado o teste automático do catálogo para validar integrações e classes essenciais da V3.3.
- Atualizado o cache da PWA para `registo-avarias-v3.3.0`.

## 3.2.0

- Criado Catálogo de Equipamentos dentro da área Equipamentos.
- Adicionadas categorias Vitrines, Vending, Postmix, Freestyle e Outros.
- Incluídas fichas públicas de referência para coolers, vending, postmix e Coca-Cola Freestyle 7100/8100/9100.
- Cada ficha apresenta descrição, dados técnicos, sintomas frequentes e possíveis consequências/danos.
- Valores regionais dos EUA são explicitamente distinguidos da documentação aplicável em Portugal/CCEP.
- Entrada Monster/Moster mantida como modelo por confirmar, sem inventar fabricante ou ficha técnica.
- Adicionado filtro por categoria e pesquisa textual por nome, modelo e sintomas.
- Adicionada vista detalhada e ação “Criar registo deste equipamento”.
- Seleção do catálogo pré-preenche o tipo de equipamento no Novo Registo quando compatível.
- Mantida a vista anterior de equipamentos encontrados nos registos.
- Preparada pasta `assets/equipment/` para fotografias autorizadas; enquanto não existirem, são apresentadas ilustrações neutras.
- Catálogo incluído no cache offline da PWA.
- Adicionado teste de integridade específico do catálogo ao CI.

## 3.1.0

- Adicionado modo de demonstração pública segura com cinco registos totalmente fictícios.
- E-mails de demonstração usam o domínio reservado `example.invalid`.
- Registos DEMO podem ser carregados e removidos sem afetar os restantes dados locais.
- Adicionada Content Security Policy restritiva ao frontend.
- Adicionada política `no-referrer`.
- Reforçada a documentação de segurança para repositório público e backups.
- Atualizado o cache PWA para incluir o módulo de demonstração.
- Alinhada a versão dos backups e do pacote com V3.1.0.

## 3.0.0

- Evolução do protótipo local para estrutura de projeto profissional.
- Novo acabamento visual alinhado com o protótipo aprovado: sidebar clara, ação principal vermelha e superfícies neutras.
- Adicionado fluxo visual de estados ao formulário.
- Atualizados manifest e Service Worker.
- Ícone SVG versionável no Git.
- Adicionado CI para validação sintática e testes.
- Adicionadas políticas de segurança e roadmap para produção.
- Mantida separação entre funcionalidades técnicas e regras corporativas por confirmar.
