# Pais de Gatos

Aplicação web estática, acolhedora e acessível para pessoas que cuidam e convivem com gatos.

**Versão atual: 1.0.2.**

A série 1.0 representa a primeira versão estável do projeto. Esta versão acrescenta a licença MIT e aprimora a documentação de portfólio, sem alterar a aplicação.

## Produto

Pais de Gatos reúne ferramentas locais para acompanhar cuidados, registrar momentos e explorar a relação especial entre pessoas e gatos. A experiência funciona diretamente no navegador, sem backend e sem envio de dados para servidores.

## Funcionalidades

- Home com apresentação do produto, ferramentas e seção editorial “Momentos felinos”;
- gerenciamento de múltiplos gatos, com gato ativo, edição e exclusão;
- Agenda de Cuidados isolada por gato, com tarefas pendentes e concluídas;
- Diário do Gato isolado por gato, com registros, filtros e pesquisa;
- Calculadora de Idade Felina com estimativa educativa;
- Quiz de entretenimento sobre formas de cuidar de gatos;
- Dicas e Favoritos com filtros e persistência local;
- Meus dados, com exportação e restauração de backup JSON versão 2;
- PWA simples com cache local e suporte progressivo a funcionamento offline.

## Demo

O projeto pode ser executado localmente como site estático. Para testar o service worker, o funcionamento offline e os critérios de instalação da PWA, use `localhost`, HTTPS ou outro contexto seguro compatível.

## Arquitetura

O projeto usa arquitetura multipágina tradicional, sem SPA. Cada ferramenta possui uma página HTML própria e, quando necessário, um script específico em `scripts/`. O `styles.css` é compartilhado para manter a identidade visual.

As páginas principais são:

- `index.html` — Home;
- `profile.html` — Perfil e gerenciamento de gatos;
- `care-agenda.html` — Agenda de Cuidados;
- `cat-age-calculator.html` — Calculadora de Idade Felina;
- `quiz.html` — Quiz;
- `tips.html` — Dicas e Favoritos;
- `cat-journal.html` — Diário do Gato;
- `my-data.html` — Meus dados.

## Tecnologias

- HTML semântico;
- CSS puro;
- JavaScript puro;
- `localStorage` para persistência local;
- `manifest.webmanifest` e service worker para a PWA;
- APIs DOM seguras e `textContent` para conteúdo dinâmico;
- nenhuma biblioteca, framework, bundler ou dependência externa.

## Privacidade e dados locais

Os dados permanecem no navegador. O projeto não possui backend, login, sincronização em nuvem ou telemetria própria.

As principais chaves atuais são:

- `paisDeGatos.cats`;
- `paisDeGatos.activeCat`;
- `paisDeGatos.careAgenda`;
- `paisDeGatos.catJournal`;
- `paisDeGatos.favorites`.

Agenda e Diário usam `catId` para separar os dados de cada gato. Calculadora, Quiz e Dicas são ferramentas gerais.

## Backup e restauração

A página “Meus dados” exporta um JSON local com versão do formato, data de exportação, gatos, gato ativo, Agenda, Diário e favoritos.

A importação valida o backup inteiro antes de modificar o armazenamento, verifica referências `catId`, aceita o formato real de `activeCat` como string crua e exige confirmação. Em caso de falha durante a restauração, o sistema tenta recuperar o snapshot anterior.

## Acessibilidade

O projeto prioriza:

- navegação completa por teclado;
- compatibilidade com NVDA;
- link para pular ao conteúdo principal;
- landmarks e hierarquia de títulos semânticos;
- labels associados aos controles;
- foco visível e previsível;
- mensagens de erro e sucesso acessíveis;
- uso controlado de `aria-current`, `aria-live`, `aria-invalid` e `aria-pressed`;
- conteúdo dinâmico criado sem `innerHTML` com dados variáveis.

Testes manuais com navegador, teclado e NVDA continuam importantes para confirmar foco, anúncios, formulários e comportamento em diferentes ambientes.

## PWA e funcionamento offline

O manifesto e o service worker usam cache versionado de arquivos locais essenciais, removem versões antigas e aplicam network-first para navegação HTML com fallback para a Home.

Os recursos básicos também funcionam como site estático sem instalação. Abrir `index.html` com `file://` não valida registro, instalação, atualização do cache ou funcionamento offline. Esses recursos precisam ser testados em `localhost`, HTTPS ou contexto compatível.

## Execução local

O projeto não exige instalação de dependências. Para uma execução simples, sirva a pasta por um servidor HTTP local e abra `index.html` no navegador.

## Testes e auditoria

Execute na raiz do projeto:

```text
node --test tests/integrity.test.js
node scripts/audit.js
node --check service-worker.js
git diff --check
```

Também é possível verificar todos os scripts:

```text
node --check scripts/nome-do-arquivo.js
```

Os testes de integridade executam os fluxos de backup e exclusão com o código real em `node:vm`. A auditoria verifica páginas HTML, títulos, idioma, meta descriptions, links, anchors, imagens, scripts, CSS, IDs, navegação, `aria-current`, manifesto, ícones, service worker e recursos de “Meus dados”.

As verificações automatizadas não substituem teste visual, teste funcional no navegador, teste manual com NVDA ou validação real da PWA.

## Limitações

- os dados dependem do armazenamento disponível no navegador;
- não há sincronização entre dispositivos;
- o Quiz é apenas entretenimento;
- a Calculadora oferece uma estimativa educativa e não substitui avaliação veterinária;
- o Diário não diagnostica condições de saúde;
- a instalação e o offline da PWA dependem do navegador e do contexto de publicação;
- ainda são recomendados testes manuais completos com NVDA em diferentes navegadores.

## Changelog

### v1.0.2

- documentação reorganizada para apresentação profissional de portfólio;
- licença MIT adicionada;
- informações de arquitetura, privacidade, backup, acessibilidade, PWA e testes consolidadas.

### v1.0.1

- correções de integridade de backup e restauração;
- tratamento correto de `activeCat`;
- exclusão consistente de gatos e dados relacionados, com rollback;
- testes automatizados contra código real.

### v1.0.0

Primeira versão estável, com suporte a múltiplos gatos, Perfil, Agenda de Cuidados, Diário do Gato, Calculadora de Idade Felina, Quiz, Dicas e Favoritos, backup e importação locais, PWA e acessibilidade com foco em teclado e NVDA.

## Licença

Este projeto está disponível sob a [licença MIT](LICENSE).
