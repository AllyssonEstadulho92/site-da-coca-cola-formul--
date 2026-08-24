# Roadmap para produção

## Fase 1 — Validação funcional

- Validar campos obrigatórios com utilizadores reais.
- Validar o Designer: ordem, títulos, campos opcionais, densidade, largura, destaque e resumo.
- Definir quais personalizações devem ser permitidas por perfil em produção.
- Confirmar PT 32 / PT 60 / PT 70 e respetivas exceções.
- Confirmar listas configuráveis de tipo, sintomas e categorias.
- Validar fluxo de estados e responsabilidades.
- Rever terminologia e mensagens.

## Fase 2 — Identidade e autorização

- Integrar Microsoft Entra ID/SSO ou IdP aprovado.
- Definir perfis Agente, Supervisor e Administrador.
- Aplicar autorização também no servidor.
- Definir quem pode alterar o design/modelo do formulário.
- Definir política de sessão.

## Fase 3 — Backend e persistência central

- Criar API autorizada ou integração Microsoft Lists/SharePoint.
- Migrar a fonte oficial de dados de IndexedDB para backend.
- Versionar os modelos/configurações de formulário no servidor.
- Implementar controlo de concorrência e resolução de conflitos.
- Implementar auditoria imutável/administrativamente protegida.

## Fase 4 — Comunicações

- Confirmar destinatários autorizados.
- Integrar Outlook/Graph ou Power Automate se permitido.
- Registar envio e resultado no backend.
- Evitar envio automático sem validação das regras.

## Fase 5 — SAP

- Definir se existe API, integração oficial ou outro mecanismo autorizado.
- Não automatizar credenciais nem scraping do SAP.
- Mapear campos SAP → modelo de dados da aplicação.

## Fase 6 — RGPD e segurança

- Inventário e minimização de dados pessoais.
- Base legal/finalidade e política de retenção.
- Direitos dos titulares e procedimentos de resposta.
- Revisão OWASP, CSP, headers de segurança e dependências.
- Backups, recuperação e plano de incidentes.

## Fase 7 — QA e piloto

- Testes Android/iOS/Windows/macOS nos browsers suportados.
- Testes offline/online, falhas de rede, restauro e conflitos.
- Testes de acessibilidade WCAG 2.2.
- Piloto com dados fictícios antes de dados reais.
- Critérios formais de aceitação e aprovação para produção.
