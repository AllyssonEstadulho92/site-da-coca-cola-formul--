# Dados e Segurança — V6.0.0

## Classificação atual

Este projeto é um protótipo público sem autenticação. Serve para validação funcional e UX com dados fictícios; não está aprovado para tratamento corporativo de dados reais.

## Dados que o formulário consegue recolher

Existem campos para cliente/contacto, telefone, morada/local, agente, REF, tipo, avaria, sintoma, encaminhamento, notas e histórico de ações. O facto de o formulário aceitar estes campos não significa que devam ser preenchidos com informação real no site público.

## Designer de Formulário

O Designer guarda em `settings.formDesign` preferências de apresentação. Não cria utilizadores, permissões ou novos dados pessoais.

Campos opcionais podem ser ocultados visualmente; campos obrigatórios permanecem disponíveis. Um campo oculto não apaga automaticamente valores existentes num registo.

## Persistência local

IndexedDB guarda registos, atividades, configurações e snapshots. O schema atual é 5.

A migração V6 remove a antiga store `equipmentImages`, que pertencia à área Equipamentos eliminada. Backups atuais identificam `appVersion: 6.0.0` e `schemaVersion: 5`.

## Backups

Existem snapshots locais, backup JSON e backup encriptado AES-GCM. A palavra-passe do backup encriptado protege apenas o ficheiro exportado e não autentica o acesso à aplicação.

Backups podem conter dados introduzidos pelo utilizador e nunca devem ser publicados no GitHub.

## Produção

Antes de produção são necessários minimização e classificação de dados, identidade corporativa, autenticação, RBAC server-side, backend/API autorizado, base de dados central, logs protegidos, backups externos, retenção, revisão RGPD/privacidade e testes de segurança.
