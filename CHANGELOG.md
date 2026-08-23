# Changelog

## 3.9.0

- Removido integralmente o ecrã de login; a aplicação abre diretamente no Dashboard.
- Removidos os módulos `app-auth-domain.js` e `app-auth-adaptive.js` e o CSS exclusivo de autenticação.
- Removidas validação de e-mail, palavras-passe, PBKDF2 de login, lockout, expiração de sessão, logout e alteração de palavra-passe.
- A área Perfil passa a `Identificação Local`, opcional e sem controlo de acesso.
- A identificação local usa apenas um nome guardado nas definições para novos registos/atividades.
- IndexedDB atualizado para versão 3; a store antiga `profiles` é eliminada durante a migração.
- Backups novos passam para schema 3 e deixam de exportar/importar perfis de autenticação; backups antigos continuam compatíveis, ignorando `profiles` legado.
- Interface e documentação passam a avisar explicitamente que o protótipo público não tem autenticação e não deve receber dados reais/SAP.
- Cache PWA atualizado para `registo-avarias-v3.9.0`, mantendo network-first para HTML/JavaScript/CSS.
- Testes antigos de autenticação foram removidos e substituídos por `no-auth.test.js`.

## 3.8.0

- Simplificado o ecrã de entrada para apresentar apenas `Entrar`, removendo definitivamente a linguagem visual `Criar perfil de teste`.
- Primeiro passo apresenta apenas o e-mail `@ilunion.es` e a ação `Continuar`.
- No primeiro acesso neste dispositivo, a aplicação apresenta automaticamente a criação e confirmação da `Palavra-passe da aplicação`.
- Nos acessos seguintes, a aplicação pede diretamente a mesma palavra-passe criada para este dispositivo.
- A ação inicial passa a ser `Criar palavra-passe e entrar`, evitando termos técnicos como perfil local ou SSO no ecrã principal.
- Rodapé de entrada reduzido para apenas `Ligação HTTPS` e bloqueio automático por inatividade.
- Mantidas as proteções existentes: Web Crypto, PBKDF2-SHA-256, domínio `@ilunion.es`, lockout local e sessão com expiração.
- Service Worker atualizado para estratégia network-first em HTML, JavaScript e CSS quando existe ligação, com fallback offline.
- Atualização automática do Service Worker alinhada com V3.8 para reduzir permanência de interfaces antigas em cache no iPhone/PWA.
- Adicionado teste `login-copy.test.js` para impedir regressão para a interface antiga.

## 3.7.0

- Reformulado o ecrã de entrada para apresentar apenas `Entrar na aplicação`, sem a escolha visual `Entrar / Criar perfil de teste`.
- Mantido o fluxo adaptativo: e-mail primeiro; depois a aplicação decide automaticamente entre acesso existente e configuração inicial local.
- Primeiro acesso passa a usar a expressão `Configurar acesso e entrar` em vez de `Criar perfil de teste`.
- Simplificados os textos e o rodapé de segurança para reduzir ruído visual no telemóvel.
- Mantida a restrição ao domínio `@ilunion.es` e o aviso para nunca reutilizar a palavra-passe empresarial.
- Adicionado `js/app-sw-refresh.js` para procurar atualizações do Service Worker sem reutilizar cache HTTP.
- Navegação online do Service Worker passa a procurar o HTML atual com `cache: no-store`, mantendo fallback offline.
- Cache PWA atualizado para `registo-avarias-v3.7.0` e testes de autenticação atualizados.

## 3.6.0

- Simplificado o acesso local para um fluxo adaptativo em dois passos: primeiro e-mail, depois palavra-passe.
- Removida da interface a escolha manual entre `Entrar` e `Criar perfil de teste`; a decisão continua separada internamente e passa a ser automática.
- Ao introduzir um e-mail `@ilunion.es`, a aplicação verifica apenas no IndexedDB deste browser se já existe um perfil local.
- Quando o perfil existe, apresenta automaticamente o modo de entrada.
- Quando o perfil ainda não existe, apresenta automaticamente confirmação de palavra-passe e a ação `Criar acesso local e entrar`.
- O e-mail fica bloqueado durante a segunda etapa para evitar inconsistência entre identificação e autenticação; existe ação explícita `Alterar e-mail`.
- Reforçado o texto para distinguir claramente a palavra-passe exclusiva do protótipo da palavra-passe empresarial.
- Mantidas as proteções V3.4/V3.5: HTTPS/Web Crypto, PBKDF2-SHA-256, domínio `@ilunion.es`, lockout local e bloqueio por inatividade.
- Adicionado módulo `js/app-auth-adaptive.js`, incluído no cache offline.
- Adicionado teste `adaptive-auth.test.js` e atualização integral do CI para V3.6.0.

## 3.5.0

- Perfis locais restringidos a endereços exatamente no domínio `@ilunion.es`.
- Regra aplicada tanto ao login como à criação de perfil local e à restauração de sessões existentes.
- Ecrã de acesso atualizado para `E-mail ILUNION` e placeholder `nome@ilunion.es`.
- Adicionado aviso explícito para usar uma palavra-passe exclusiva do protótipo e nunca a palavra-passe empresarial.
- Nenhum endereço individual ou palavra-passe corporativa foi colocado no repositório.
- Adicionado módulo `js/app-auth-domain.js` e teste `email-domain.test.js`.
- Cache PWA e CI atualizados para V3.5.0.

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
