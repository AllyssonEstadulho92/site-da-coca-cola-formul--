# Segurança

## Dados reais

Este repositório é público e contém apenas código e dados de demonstração. Não publicar:

- credenciais, passwords, tokens ou chaves;
- dados de clientes ou colaboradores;
- exportações SAP;
- endereços de e-mail internos/confidenciais;
- matrizes internas de encaminhamento não autorizadas;
- backups da aplicação com informação operacional.

## Protótipo vs. produção

O login local é exclusivamente de protótipo. Em produção, autenticação e autorização devem ser executadas por um serviço de identidade/backend aprovado.

IndexedDB melhora continuidade local, mas não substitui uma base de dados central nem um backup corporativo.

## Reporte

Problemas de segurança devem ser tratados de forma privada e não publicados em issues quando incluírem informação sensível.
