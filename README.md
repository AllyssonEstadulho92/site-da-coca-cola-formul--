# Sistema de Registo de Avarias — V3.9

Aplicação web **mobile-first/PWA** para produtividade profissional, registo de ocorrências, catálogo de equipamentos, encaminhamentos e histórico operacional.

## Estado do projeto

**Protótipo funcional público sem autenticação.** A aplicação abre diretamente no Dashboard. Deve ser usada apenas para validação de UX, estrutura, regras e fluxos com dados fictícios.

Não utilizar como sistema corporativo de produção enquanto não existir backend autorizado, identidade corporativa, controlo de acesso no servidor, política formal de retenção e validação das regras internas.

## Alteração principal da V3.9

A autenticação local foi removida integralmente:

- não existe ecrã de login;
- não é solicitado e-mail ou palavra-passe;
- não existe criação/verificação de password;
- módulos de autenticação foram removidos;
- a store IndexedDB `profiles` é eliminada na migração da base local;
- backups novos deixam de incluir perfis de autenticação;
- a aplicação entra diretamente no Dashboard.

Existe apenas uma **Identificação Local** opcional para definir o nome usado em novos registos e atividades. Essa identificação não controla acesso.

## Funcionalidades principais

- Dashboard com indicadores diários, estados e atividade recente.
- Fluxo: Registado → Em andamento → Enviado → Em tratamento → Aguarda resposta → Encerrado.
- Novo registo, edição e autosave com IndexedDB.
- Deteção de possíveis duplicados por REF.
- PT 32 / PT 60 / PT 70 configuráveis, sem inventar regras empresariais.
- Assistente de e-mail manual.
- Pesquisa e filtros combinados.
- Diretórios de clientes e equipamentos com histórico.
- Catálogo visual de vitrines, vending, postmix, Freestyle e outros equipamentos.
- Timeline/auditoria das ações e alterações.
- Arquivo e reabertura.
- Produtividade.
- Exportação CSV compatível com Excel.
- Backup JSON e backup encriptado AES-GCM.
- Snapshots locais automáticos e pré-restauro.
- PWA e modo offline.
- Design responsivo para telemóvel, tablet e desktop.
- Content Security Policy e política `no-referrer`.
- Modo de demonstração pública com dados fictícios.

## Demonstração pública segura

Na área **Configurações → Demonstração pública segura** podem ser carregados registos fictícios para testar a aplicação.

Os dados DEMO usam prefixo `DEMO`, são marcados com `demo: true` e utilizam e-mails no domínio reservado `example.invalid`.

## Segurança

O repositório e a aplicação publicada são públicos. Como não existe autenticação, qualquer pessoa com acesso ao endereço pode abrir a interface.

**Não inserir dados reais de clientes, credenciais, NIF, contactos, moradas, referências operacionais, informação SAP, e-mails internos ou regras confidenciais.**

HTTPS protege a comunicação com o site, mas não substitui autenticação ou autorização.

## Executar localmente

O Service Worker requer HTTP/HTTPS. Exemplo:

```bash
python -m http.server 8000
```

Depois abrir `http://localhost:8000/`.

## Verificação técnica

```bash
npm run check
```

A validação inclui sintaxe JavaScript, lógica central, catálogo de equipamentos, remoção de autenticação, atualização PWA, integridade de referências e segurança do repositório público.

## Produção

Antes de permitir dados reais devem ser adicionados, conforme autorização da organização:

- Microsoft Entra ID/SSO ou outro IdP aprovado;
- backend/API autorizada;
- base de dados central;
- controlo de acesso por função no servidor;
- logs de auditoria protegidos;
- backups independentes do dispositivo;
- política de retenção e eliminação;
- integrações Microsoft/SAP apenas através de mecanismos oficiais e autorizados.

## Regras empresariais por confirmar

Continuam por confirmar o significado e critérios oficiais de PT 32/60/70, destinatários autorizados, catálogo oficial de equipamentos, sintomas/categorias, formato do Nº Nota, campos obrigatórios, retenção e permissões.

## Princípio de desenvolvimento

Nenhuma regra empresarial é inventada no código. O projeto distingue funcionalidades técnicas implementadas de regras corporativas ainda por validar.
