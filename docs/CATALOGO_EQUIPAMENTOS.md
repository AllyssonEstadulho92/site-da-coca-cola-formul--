# Catálogo de Equipamentos — V3.2

## Objetivo

A área **Equipamentos** passa a ter um catálogo técnico para apoiar identificação e abertura de registos de avaria. O catálogo não substitui a ficha oficial do equipamento instalado nem documentação interna da CCEP.

## Estrutura de cada ficha

Cada equipamento contém:

- categoria;
- nome e modelo/família;
- descrição funcional;
- ficha técnica de referência;
- sintomas frequentes;
- possíveis consequências/danos associados à falha;
- estado de verificação da informação;
- fonte pública, quando existe;
- nota regional;
- campo preparado para fotografia local autorizada.

## Equipamentos incluídos

- Mini vitrine / Cooler Countertop;
- Vitrine 1 porta — pequena;
- Vitrine 1 porta — grande;
- Vitrine 2 portas — média;
- Vending Glass Front pequena;
- Vending Glass Front grande;
- Postmix Counter Electric — 6 válvulas;
- Postmix Drop-In — 8 válvulas;
- Coca-Cola Freestyle 7100;
- Coca-Cola Freestyle 8100;
- Coca-Cola Freestyle 9100;
- Monster/Moster — entrada provisória até confirmação do equipamento real.

## Fontes públicas utilizadas

As fichas foram construídas a partir de referências públicas da Coca-Cola/CokeSolutions:

- Coolers: https://www.cokesolutions.com/equipment/coolers
- Vending: https://www.cokesolutions.com/equipment/vending-machines
- Fountains/Postmix: https://www.cokesolutions.com/equipment/fountains/
- Coca-Cola Freestyle: https://www.cokesolutions.com/equipment/coca-cola-freestyle
- Freestyle 7100: https://www.cokesolutions.com/coca-cola-freestyle/pdfs/CCFS_7100_specsheet.pdf
- Freestyle 9100: https://www.cokesolutions.com/coca-cola-freestyle/pdfs/CCFS_9100_specsheet.pdf
- Small Glass Front Vender: https://www.cokesolutions.com/content/dam/cokesolutions/us/documents/cokesolutions/Equipment/Equipment-Vending-Small-Glass-Front.pdf
- Large Glass Front Vender: https://www.cokesolutions.com/content/dam/cokesolutions/us/documents/cokesolutions/Equipment/Equipment-Vending-Large-Glass-Front.pdf

## Limite regional

Grande parte das fichas públicas acima é destinada ao mercado dos EUA. Valores de alimentação elétrica, certificações, capacidade, configuração de água, CO₂, refrigerante e instalação **não devem ser aplicados automaticamente em Portugal**.

Para uma ficha operacional CCEP deve ser confirmada, por equipamento:

1. REF do equipamento;
2. fabricante;
3. modelo completo;
4. número de série;
5. fotografia da placa técnica;
6. manual/ficha CCEP aplicável;
7. regras internas de encaminhamento.

## Fotografias

O repositório é público. Fotografias oficiais ou internas só devem ser adicionadas quando existir autorização para publicação. O catálogo aceita fotografias locais através da propriedade `photo` em `js/equipment-data.js`, usando caminhos dentro de `assets/equipment/`.

Exemplo conceptual:

```text
assets/equipment/freestyle-9100.webp
```

Não colocar fotografias com dados de clientes, moradas, números de série reais, QR codes, etiquetas de inventário ou informação interna visível.

## Segurança técnica

A secção de sintomas serve para triagem e registo, não para orientar reparações perigosas. Circuitos elétricos, refrigeração, CO₂ e sistemas pressurizados devem ser intervencionados apenas por pessoal habilitado e de acordo com a documentação oficial do modelo.
