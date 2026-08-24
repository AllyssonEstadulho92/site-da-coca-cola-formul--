# Dados e Segurança — V5.1.0

## Classificação atual

Este projeto é um protótipo público sem autenticação. Serve para validação funcional e demonstração com dados fictícios; não está aprovado para tratamento corporativo de dados reais.

## Dados que a interface consegue recolher

Existem campos para cliente/contacto, telefone, morada/local, e-mail, agente e histórico de ações. O facto de o formulário aceitar estes campos não significa que devam ser preenchidos com informação real no site público.

## Acesso

Não existe password de acesso, perfil autenticado ou autorização. Qualquer pessoa com o endereço consegue abrir a aplicação.

A identificação local opcional serve apenas para preencher o nome do operador em novos registos e atividades.

## Persistência local

IndexedDB guarda registos, atividades, configurações, snapshots e fotografias de equipamentos. Os dados permanecem no dispositivo/browser até serem eliminados, restaurados ou limpos pelo utilizador.

O schema IndexedDB mantém-se na versão 4. Os backups criados pela versão atual identificam `appVersion: 5.1.0`.

## Equipamentos

A V5.1.0 mantém 53 equipamentos. A interface mostra fotografia, descrição operacional e códigos de sintomas aplicáveis por categoria. Ficha técnica e Documentação deixaram de ser apresentadas na página de Equipamentos.

A matriz operacional serve para classificação do sintoma reportado; não é diagnóstico. Dados técnicos e fontes anteriormente registados permanecem preservados na camada de dados para rastreabilidade e futura evolução.

## Backups

Existem snapshots locais, backup JSON e backup encriptado AES-GCM. A palavra-passe do backup encriptado protege apenas o ficheiro exportado e não autentica o acesso à aplicação.

Backups podem conter dados introduzidos pelo utilizador e nunca devem ser publicados no GitHub.

## Produção

Antes de produção são necessários minimização e classificação de dados, identidade corporativa, RBAC server-side, backend/API autorizado, base de dados central, logs protegidos, backups externos, retenção, revisão RGPD/privacidade e testes de segurança.
