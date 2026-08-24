# QA Report — V5.0.1

## Âmbito

Este relatório descreve a cobertura automática e os testes manuais ainda necessários. Não constitui certificação de ausência de bugs.

## Verificação automática

`npm run check` valida:

- sintaxe JavaScript;
- regras puras do core;
- catálogo Equipamentos V5;
- 53 equipamentos e unicidade dos slugs;
- fontes técnicas externas e relações de sintomas;
- pesquisa, filtros e estados de validação;
- fotografias locais, IndexedDB e backup;
- ausência de autenticação;
- PWA/cache e atualização do Service Worker;
- integridade de referências;
- segurança do conteúdo DEMO;
- limpeza estrutural do repositório;
- build estático de `dist/`.

O teste de limpeza impede a reintrodução das camadas antigas de Equipamentos e da árvore de dados técnicos obsoleta.

## Casos manuais obrigatórios

### Formulário e registos

- campos obrigatórios e caracteres portugueses;
- REF sem zero artificial;
- recuperação de rascunho após refresh;
- edição existente só persiste após Guardar alterações;
- pesquisa, filtros, arquivo, reabertura e timeline.

### Encaminhamento e e-mail

- regra sem critérios não sugere PT;
- regra específica vence regra genérica;
- ambiguidade não é resolvida silenciosamente;
- e-mail só é marcado como enviado após ação real.

### Equipamentos

- pesquisa por nome, modelo, código, fabricante e tipo;
- todos os filtros e ordenações;
- abertura/fecho da ficha e separadores;
- criação de registo a partir de equipamento;
- fotografia local: adicionar, substituir, remover e restaurar por backup;
- fonte visível em cada secção;
- modelos sem fonte específica mostram estado não validado;
- possíveis causas nunca aparecem como diagnóstico.

### Responsividade

Validar pelo menos 320, 375/390, 430, 768, 1024 e 1366 px ou superior, sem scroll horizontal indevido.

### Safari/iPhone

Executar validação visual real em Safari/iPhone: grelha, drawer mobile, teclado na pesquisa, upload de fotografia, rotação, PWA instalada e atualização do Service Worker. Esta etapa não é coberta pela automação atual.

### Offline/PWA

- primeiro carregamento online;
- segundo carregamento offline;
- recursos estáticos disponíveis;
- atualização para a versão mais recente quando a rede regressa.

### Acessibilidade

- navegação por teclado;
- foco visível;
- labels e dialogs utilizáveis;
- contraste e interface não dependente apenas de cor.

## Limitações conhecidas

Não existe backend central, sincronização multi-dispositivo, autenticação, integração SAP nem envio automático autorizado. Regras empresariais continuam dependentes de validação formal.
