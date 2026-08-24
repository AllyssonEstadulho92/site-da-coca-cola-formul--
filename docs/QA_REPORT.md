# QA Report — V5.2.0

## Âmbito

Este relatório descreve a cobertura automática e os testes manuais ainda necessários. Não constitui certificação de ausência de bugs.

## Verificação automática

`npm run check` valida:

- sintaxe JavaScript;
- regras puras do core;
- catálogo com exatamente 53 equipamentos e slugs únicos;
- matriz original com 7 códigos de Vandalismo, 19 de Dispensing, 7 de Vending e 14 de Funcionamento Geral;
- chaves internas contextuais para códigos repetidos entre grupos;
- associação funcional atual por categoria: 18 códigos para Vitrines/Monster, 25 para Vending e 32 para Postmix/Freestyle/módulos auxiliares;
- exclusão de sintomas de saída/seleção de produto em vitrines;
- existência de descrição operacional/técnica para os 53 equipamentos;
- pesquisa por equipamento e por sintomas operacionais;
- renderização dos 53 cartões e ficha de equipamento;
- política de fotografias reais: registo `VERIFIED_REAL`, fotografia local e estado `Fotografia pendente`;
- ausência do sprite de referência gerado no runtime/build;
- associação da fotografia local ao ID, slug, nome e modelo do equipamento;
- contrato de layout mobile: largura controlada, `min-width: 0`, colunas proporcionais e ações sem overflow;
- fotografias locais, IndexedDB e backup;
- recuperação visível quando o runtime está incompleto e degradação isolada quando uma fotografia falha;
- ausência de autenticação;
- PWA/cache V5.2.0 e atualização do Service Worker;
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
- descrição legível e coerente com o tipo/subcategoria;
- abertura e fecho da ficha;
- grupos/códigos de sintomas coerentes com a categoria;
- criação de registo a partir do equipamento;
- fotografia local: adicionar, substituir, remover e restaurar por backup;
- confirmar que uma fotografia real corresponde ao equipamento antes de a adicionar/versionar;
- confirmar que um modelo sem fotografia real apresenta `Fotografia pendente`, sem bloco branco vazio;
- confirmar que uma imagem com falha de carregamento não deixa a página em branco;
- confirmar que Ficha técnica, Documentação e “Fonte desta secção” não reaparecem na interface.

### Responsividade

Validar pelo menos 320, 375/390, 430, 768, 1024 e 1366 px ou superior. Em 320–430 px, a fotografia deve permanecer à esquerda e o conteúdo à direita, sem scroll horizontal, texto cortado fora do viewport ou botões inacessíveis.

### Safari/iPhone

Executar validação visual real em Safari/iPhone: cartões, área da fotografia, ficha mobile, teclado na pesquisa, upload de fotografia, rotação, PWA instalada e atualização do Service Worker. A suite automática protege o contrato CSS, mas não substitui um teste visual em dispositivo Safari real.

### Offline/PWA

- primeiro carregamento online;
- segundo carregamento offline;
- matriz de sintomas e restantes recursos estáticos disponíveis;
- atualização para V5.2.0 quando a rede regressa;
- recuperação da página após cache antigo/incompleto.

### Acessibilidade

- navegação por teclado;
- foco visível;
- labels e diálogo utilizáveis;
- texto alternativo das fotografias;
- contraste e interface não dependente apenas de cor.

## GitHub Pages

Depois do deploy, o workflow verifica diretamente a página publicada e confirma:

- identificação V5.2.0;
- disponibilidade do registo de fotografias;
- disponibilidade da recuperação de runtime e controlo de falha de imagem;
- presença do contrato CSS mobile esperado.

## Limitações conhecidas

Não existe backend central, sincronização multi-dispositivo, autenticação, integração SAP nem envio automático autorizado. O repositório não contém atualmente fotografias reais validadas para todos os 53 modelos; por isso, modelos sem fotografia local/validada apresentam `Fotografia pendente`. A matriz operacional classifica sintomas reportados e não fornece diagnóstico técnico nem causa confirmada.
