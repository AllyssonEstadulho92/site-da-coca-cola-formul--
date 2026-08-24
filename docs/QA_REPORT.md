# QA Report — V5.1.0

## Âmbito

Este relatório descreve a cobertura automática e os testes manuais ainda necessários. Não constitui certificação de ausência de bugs.

## Verificação automática

`npm run check` valida:

- sintaxe JavaScript;
- regras puras do core;
- catálogo com exatamente 53 equipamentos e slugs únicos;
- matriz operacional com 7 códigos de Vandalismo, 19 de Dispensing, 7 de Vending e 14 de Funcionamento Geral;
- associação da matriz por categoria: 21, 28 ou 40 códigos conforme o tipo de equipamento;
- existência de descrição operacional para todos os 53 equipamentos;
- pesquisa por equipamento e por sintomas operacionais;
- estrutura visual imagem à esquerda / conteúdo à direita;
- ausência de Ficha técnica e Documentação na UI de Equipamentos;
- fotografias locais, IndexedDB e backup;
- ausência de autenticação;
- PWA/cache V5.1.0 e atualização do Service Worker;
- integridade de referências;
- segurança do conteúdo DEMO;
- limpeza estrutural do repositório;
- build estático de `dist/`.

## Casos manuais obrigatórios

### Formulário e registos

- campos obrigatórios e caracteres portugueses;
- REF sem zero artificial;
- recuperação de rascunho após refresh;
- edição existente só persiste após Guardar alterações;
- pesquisa, filtros, arquivo, reabertura e timeline.

### Equipamentos

- pesquisa por nome, modelo, código, fabricante e sintoma;
- navegação por categorias;
- cartões de duas secções em todos os 53 equipamentos;
- descrição legível e sem corte excessivo;
- abertura e fecho da ficha;
- grupos/códigos de sintomas corretos por categoria;
- criação de registo a partir do equipamento;
- fotografia local: adicionar, substituir, remover e restaurar por backup;
- confirmar que Ficha técnica, Documentação, “Por validar” e “Fonte desta secção” não aparecem na interface.

### Responsividade

Validar pelo menos 320, 375/390, 430, 768, 1024 e 1366 px ou superior, sem scroll horizontal indevido.

### Safari/iPhone

Executar validação visual real em Safari/iPhone: grelha, ficha mobile, teclado na pesquisa, upload de fotografia, rotação, PWA instalada e atualização do Service Worker. Esta etapa não é coberta pela automação atual.

### Offline/PWA

- primeiro carregamento online;
- segundo carregamento offline;
- matriz de sintomas e restantes recursos estáticos disponíveis;
- atualização para a versão mais recente quando a rede regressa.

### Acessibilidade

- navegação por teclado;
- foco visível;
- labels e diálogo utilizáveis;
- contraste e interface não dependente apenas de cor.

## Limitações conhecidas

Não existe backend central, sincronização multi-dispositivo, autenticação, integração SAP nem envio automático autorizado. A matriz operacional classifica sintomas reportados; não fornece diagnóstico técnico.
