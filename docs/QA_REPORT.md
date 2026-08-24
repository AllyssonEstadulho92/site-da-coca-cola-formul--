# QA Report — V6.0.0

## Âmbito

Este relatório descreve a cobertura automática e os testes manuais ainda necessários. Não constitui certificação de ausência de bugs.

## Verificação automática

`npm run check` valida:

- sintaxe JavaScript;
- regras puras do core;
- existência e integração do Designer de Formulário;
- ordem configurável das cinco secções;
- proteção dos campos obrigatórios;
- visibilidade configurável de campos opcionais;
- preservação de valores quando um campo opcional está oculto;
- densidade, largura, destaque e resumo lateral;
- remoção da rota e runtime Equipamentos;
- ausência de `js/equipment`, `assets/equipment` e `equipment-v5.css`;
- migração IndexedDB schema 5 sem `equipmentImages`;
- ausência de autenticação;
- PWA/cache V6.0.0;
- integridade e segurança do conteúdo DEMO;
- limpeza estrutural do repositório;
- build estático de `dist/`.

## Casos manuais obrigatórios

### Designer

- reordenar todas as secções e confirmar a nova ordem no formulário real;
- alterar títulos das secções;
- ocultar e reativar cada campo opcional;
- confirmar que campos obrigatórios não podem ser ocultados;
- testar densidade confortável/compacta;
- testar largura padrão/ampla;
- testar destaques vermelho/azul/grafite;
- mostrar e ocultar resumo lateral;
- guardar, recarregar e confirmar persistência;
- repor padrão.

### Formulário e registos

- criar registo com design padrão;
- criar registo com campos opcionais ocultos;
- editar registo com valor pré-existente num campo posteriormente oculto e confirmar que o valor não é apagado;
- campos obrigatórios e caracteres portugueses;
- normalização da REF;
- recuperação de rascunho após refresh;
- edição existente só persiste após `Guardar alterações`;
- pesquisa, filtros, arquivo, reabertura e timeline.

### Responsividade

Validar pelo menos 320, 375/390, 430, 768, 1024 e 1366 px ou superior, sem scroll horizontal indevido. Em mobile, o Designer deve passar para uma única coluna e o formulário para uma coluna legível.

### Safari/iPhone

Executar validação visual real em Safari/iPhone: Designer, formulário, teclado, selects, rotação, PWA instalada e atualização do Service Worker. Esta etapa não é coberta por browser E2E real no repositório.

### Offline/PWA

- primeiro carregamento online;
- segundo carregamento offline;
- acesso ao Designer e ao formulário;
- atualização para a versão mais recente quando a rede regressa.

## Limitações conhecidas

Não existe backend central, sincronização multi-dispositivo, autenticação, integração SAP nem envio automático autorizado. O Designer V6 personaliza a apresentação do formulário; não é ainda um construtor arbitrário de novos tipos de campo ou regras de negócio.
