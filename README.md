# Transportes Lucas — site institucional

Site estático da **Transportes Lucas Ltda**, transportadora rodoviária de cargas
com matriz em Taboão da Serra/SP e filial em Gravataí/RS.

HTML, CSS e JavaScript puro. Sem framework, sem build, sem dependências.

## Estrutura

```
index.html          página única
css/style.css       estilos
js/config.js        telefone, WhatsApp, e-mails, endereço, horário, números e frota
js/main.js          comportamento
assets/img/         logo, fotos e mapa
assets/video/       vídeos do banner
```

## Como alterar os dados de contato

Tudo em `js/config.js`. O bloco JSON-LD no `<head>` do `index.html` repete
telefone, endereço e horário para o Google — se mudar um, mude o outro.

## Recursos

- Banner com vídeo em loop, trocando entre versão horizontal (desktop) e
  vertical (celular) por media query
- Carrossel de serviços, seção de frota com troca de foto e mapa de cobertura
  em SVG com os estados atendidos
- Pedido de orçamento por modal, que monta a mensagem e abre o WhatsApp
- Responsivo de 320px a 1920px, contraste AA e suporte a
  `prefers-reduced-motion`; legível com JavaScript desligado
