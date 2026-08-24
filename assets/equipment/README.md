# Ativos de Equipamentos

A V5.2 mantém neste diretório apenas recursos necessários à política de fotografias reais do catálogo.

A referência visual gerada utilizada em versões anteriores foi removida do runtime. A interface já não apresenta imagens genéricas como substituto de uma fotografia real.

Fotografias reais versionadas no repositório devem seguir estas regras:

- caminho `assets/equipment/photos/<slug>.<png|jpg|jpeg|webp>`;
- correspondência exata entre o `slug` do ficheiro e o equipamento;
- entrada explícita em `js/equipment/equipment-photo-registry-v5.js`;
- estado `VERIFIED_REAL` apenas depois de confirmar que a fotografia corresponde ao modelo e que existe autorização para utilização;
- não incluir números de série, QR codes, etiquetas operacionais, dados de clientes, informação SAP ou conteúdo interno/confidencial.

O build copia automaticamente as fotografias declaradas no registo e falha se um caminho declarado não existir.

Fotografias adicionadas pelo utilizador na aplicação continuam guardadas localmente em IndexedDB e têm prioridade sobre fotografias versionadas.

A lista canónica de equipamentos, matriz operacional, registo de fotografias e restantes bases estão em `js/equipment/`.
