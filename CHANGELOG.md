# Changelog

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
