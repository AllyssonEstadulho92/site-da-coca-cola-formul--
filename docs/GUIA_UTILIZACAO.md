# Guia de Utilização

## 1. Entrada

No primeiro acesso, introduza e-mail e uma palavra-passe com pelo menos 8 caracteres. O perfil criado é local ao browser e serve apenas para protótipo.

## 2. Novo registo

Preencha primeiro:

- Data;
- Agente;
- Cliente;
- Estabelecimento;
- Morada/Local;
- REF Equipamento;
- Categoria da avaria;
- Descrição da avaria.

Os restantes campos aumentam a qualidade do registo e do histórico.

## 3. Autosave

Enquanto preenche um registo novo, as alterações são guardadas automaticamente. Se fechar ou mudar de página, o rascunho permanece no IndexedDB.

Ao editar um registo já existente, as alterações ficam protegidas num buffer local até selecionar **Guardar alterações**. Isto evita que uma edição incompleta substitua silenciosamente o registo confirmado.

## 4. Duplicados

Quando introduz uma REF Equipamento, o sistema procura ocorrências abertas recentes dessa referência. O aviso não impede a criação; serve para verificar se deve continuar o registo existente.

## 5. Encaminhamento PT

A aplicação não contém regras oficiais pré-inventadas. Na área Configurações, pode definir PT 32, PT 60 e PT 70 com:

- descrição;
- departamento;
- e-mail;
- tipo de equipamento;
- sintoma;
- categoria de avaria.

Se existir uma correspondência inequívoca, o formulário apresenta uma sugestão. O utilizador deve confirmá-la.

## 6. E-mail

O assistente de e-mail usa o modelo configurado para gerar destinatário, assunto e corpo. Pode copiar o texto ou abrir o cliente de e-mail do dispositivo.

Só marque o e-mail como enviado depois de efetuar realmente a comunicação.

## 7. Estados

Fluxo principal:

1. Registado;
2. Em andamento;
3. Enviado;
4. Em tratamento;
5. Aguarda resposta;
6. Encerrado.

Rascunho é um estado de preparação. Arquivado preserva o registo fora da lista ativa.

## 8. Pesquisa e filtros

Na área Registos pode pesquisar e filtrar por:

- texto global;
- estado;
- agente;
- PT;
- Tratado;
- e-mail;
- data inicial;
- data final.

## 9. Clientes e equipamentos

Clientes consolida ocorrências por cliente. Equipamentos consolida por REF e permite ver o histórico técnico cronológico.

## 10. Backup

Use regularmente:

- Snapshot local, para recuperação rápida no mesmo browser;
- Backup JSON, para cópia externa legível;
- Backup encriptado, para transporte/arquivo mais protegido.

Não guarde backups com dados reais num repositório público.

## 11. Restauro

Ao restaurar um ficheiro ou snapshot, os dados atuais são substituídos. A aplicação cria uma cópia local de segurança antes de iniciar a operação.

## 12. Produção

Antes de uso corporativo real, validar regras PT, destinatários, taxonomias, permissões, autenticação, backend, retenção de dados e integração SAP/Microsoft 365.
