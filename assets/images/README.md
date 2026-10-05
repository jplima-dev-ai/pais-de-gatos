# Organização das imagens

Esta pasta reúne as imagens do projeto Pais de Gatos. As pastas estão separadas por finalidade para facilitar a manutenção, a acessibilidade e o crescimento do site.

## Pastas

### `brand/`

Identidade visual do projeto, como logotipos, símbolos e variações da marca.

### `hero/`

Imagens de destaque usadas na apresentação principal de páginas, campanhas ou chamadas importantes.

### `cats/`

Fotos e ilustrações de gatos usadas em cartões, perfis, cuidados, brincadeiras e outros conteúdos sobre os animais.

### `stories/`

Imagens relacionadas a histórias, depoimentos, artigos, adoção e experiências de pais de gatos.

### `icons/`

Ícones e pequenos elementos gráficos de apoio. Ícones não devem ser a única forma de transmitir uma informação.

### `social/`

Imagens preparadas para compartilhamento em redes sociais e prévias de links.

## Convenção de nomes

- Use apenas letras minúsculas, números e hífens.
- Não use espaços, acentos ou caracteres especiais.
- Prefira nomes descritivos e específicos.
- Inclua a finalidade ou o contexto quando isso ajudar na identificação.
- Use sufixos de variação quando necessário, como `-claro`, `-escuro`, `-mobile` ou `-quadrado`.

Exemplos:

```text
brand-logo.svg
hero-woman-with-cat.webp
playful-orange-cat.webp
historia-adocao-ana.jpg
icone-cuidado.svg
preview-home-social.jpg
```

## Formatos preferidos

- `SVG`: logotipos, ícones e ilustrações vetoriais simples.
- `WebP`: fotos e imagens rasterizadas para uso no site, quando houver suporte ao fluxo do projeto.
- `AVIF`: fotos ou ilustrações que precisem de maior compressão, quando o suporte for adequado.
- `JPEG`: fotografias sem transparência que precisem de compatibilidade ampla.
- `PNG`: imagens com transparência ou que precisem preservar detalhes sem compressão com perdas.

Prefira formatos modernos e leves, mas mantenha uma alternativa quando a compatibilidade for necessária.

## Regras de otimização

- Redimensione a imagem para o maior tamanho real em que ela será exibida.
- Comprima os arquivos antes de adicioná-los ao projeto.
- Evite imagens muito maiores do que o espaço de uso.
- Remova metadados desnecessários quando isso não prejudicar o uso da imagem.
- Preserve a qualidade suficiente para que textos e detalhes importantes continuem legíveis.
- Não substitua uma informação textual importante por uma imagem.
- Considere versões adequadas para telas pequenas e telas grandes quando necessário.

## Texto alternativo

Use `alt` quando a imagem transmitir informação relevante para compreender o conteúdo da página. O texto deve ser curto, específico e descrever a finalidade da imagem no contexto.

Exemplo:

```html
<img src="assets/images/cats/playful-orange-cat.webp" alt="Gato laranja brincando com uma bolinha de tecido">
```

Não repita no `alt` informações que já estejam imediatamente disponíveis no texto ao redor. Evite começar com “imagem de” ou “foto de”, a menos que isso seja relevante.

## Imagens decorativas

Trate a imagem como decorativa quando ela apenas enfeitar a página e não acrescentar informação ao conteúdo. Nesse caso, use `alt=""` em elementos `<img>`.

Para elementos decorativos feitos com CSS ou HTML, use `aria-hidden="true"` quando necessário para que não sejam anunciados pelo leitor de tela.

Uma imagem decorativa não deve receber uma descrição que faça o leitor de tela anunciá-la como conteúdo informativo.
