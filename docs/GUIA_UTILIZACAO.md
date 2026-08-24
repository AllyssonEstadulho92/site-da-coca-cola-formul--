# Guia de Utilização — V5.1.0

## 1. Entrada

A aplicação abre diretamente no Dashboard. Não existe login nem palavra-passe.

Pode definir uma **Identificação Local** opcional para o nome usado em novos registos e atividades. Esta identificação não controla acesso.

Use apenas dados fictícios neste protótipo público.

## 2. Novo registo

Preencha os campos necessários ao contexto da ocorrência. Enquanto cria um registo, o rascunho é guardado localmente. Ao editar um registo existente, utilize **Guardar alterações** para confirmar a edição.

## 3. Duplicados

Ao introduzir uma REF Equipamento, o sistema procura ocorrências abertas recentes dessa referência. O aviso é informativo e não substitui validação humana.

## 4. Encaminhamento PT

PT 32, 60 e 70 são configuráveis. A aplicação não inventa regras oficiais. Uma sugestão só é apresentada quando existe correspondência inequívoca e deve ser confirmada pelo utilizador.

## 5. E-mail

O assistente gera destinatário, assunto e corpo a partir do modelo configurado. O envio continua a ser iniciado pelo utilizador.

## 6. Estados

Fluxo principal: Registado → Em andamento → Enviado → Em tratamento → Aguarda resposta → Encerrado. Arquivado preserva o registo fora da lista ativa.

## 7. Pesquisa e filtros

A área Registos permite pesquisa e filtros por estado, agente, PT, tratado, e-mail e intervalo de datas.

## 8. Equipamentos

A área Equipamentos contém 53 modelos. Cada cartão apresenta fotografia à esquerda e conteúdo à direita.

Pode pesquisar por nome, modelo, código, fabricante ou sintoma e filtrar por categoria.

No cartão são mostrados:

- categoria e código do equipamento;
- nome, modelo e fabricante quando disponível;
- descrição operacional;
- alguns sintomas representativos e a indicação dos restantes;
- `Ver ficha` e `Criar registo`.

Ao abrir **Ver ficha**, a consulta contém apenas **Descrição** e **Sintomas**. As antigas secções Ficha técnica e Documentação deixaram de fazer parte da interface.

Os sintomas aparecem agrupados por categoria operacional e com o respetivo código. A matriz serve para classificar o que foi reportado pelo cliente; não constitui diagnóstico nem indicação de reparação.

Pode adicionar uma fotografia real do equipamento. A imagem é otimizada e guardada apenas no dispositivo, em IndexedDB, e acompanha o backup.

## 9. Backup e restauro

Use snapshots locais para recuperação rápida e backup JSON/encriptado para cópia externa. O restauro substitui os dados atuais e cria previamente uma cópia local de segurança.

## 10. Produção

Antes de uso corporativo real devem ser validadas regras PT, destinatários, taxonomias, permissões, identidade, backend, retenção, segurança e integrações SAP/Microsoft 365.
