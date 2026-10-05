# Pais de Gatos

Pais de Gatos é um projeto de portfólio criado durante um curso de desenvolvimento web com VS Code, NVDA e agentes de IA. O objetivo é oferecer uma experiência acolhedora, útil e acessível para pessoas que cuidam e convivem com gatos.

**Versão atual: 1.0.0 — primeira versão estável do projeto.**

## Objetivo

Reunir ferramentas simples para organizar cuidados, registrar observações e celebrar a relação com os gatos, mantendo os dados no próprio navegador.

## Funcionalidades

- Home com apresentação do projeto e acesso às ferramentas;
- Perfil do Meu Gato;
- Agenda de Cuidados;
- Calculadora de Idade Felina;
- Quiz de entretenimento;
- Dicas e Favoritos;
- Diário do Gato para acontecimentos e observações passadas.

## Arquitetura

O projeto usa uma arquitetura multipágina tradicional. Cada ferramenta possui seu próprio documento HTML e, quando necessário, seu próprio arquivo JavaScript em `scripts/`. O `styles.css` é compartilhado por todas as páginas para preservar a identidade visual.

## Tecnologias

- HTML semântico;
- CSS puro;
- JavaScript puro;
- `localStorage` para persistência local;
- PWA simples com `manifest.webmanifest` e service worker;
- nenhuma biblioteca, framework, bundler ou dependência externa.

## Privacidade

Os dados de Perfil, Agenda, Dicas e Diário ficam armazenados somente no navegador da pessoa. O projeto não possui backend e não envia informações para servidores externos.

## Vários gatos

O Perfil permite cadastrar e selecionar vários gatos. A Agenda e o Diário usam o gato ativo e armazenam cada tarefa ou registro com seu respectivo `catId`; Calculadora, Quiz e Dicas continuam ferramentas globais. O gato ativo é mantido em `paisDeGatos.activeCat`.

## Meus dados e backups

A página “Meus dados” permite exportar um backup JSON local e restaurá-lo depois. A importação valida o formato de múltiplos gatos, os `catId` e as referências antes de alterar o armazenamento, e solicita confirmação. Backups anteriores à versão atual são rejeitados.

## PWA e funcionamento offline

O projeto possui um manifesto e um service worker com cache versionado dos arquivos locais essenciais. Depois de carregados em um contexto compatível, os documentos, estilos, scripts, imagens e ícones básicos podem continuar disponíveis offline.

Os recursos básicos também funcionam como site estático sem a instalação da PWA. A instalação e o service worker precisam ser testados em `localhost`, HTTPS ou outro contexto seguro compatível. Abrir `index.html` diretamente com `file://` não é suficiente para validar registro, instalação, atualização de cache ou funcionamento offline.

Ainda não declaramos a PWA como instalável em todos os navegadores: essa confirmação depende de testes reais de manifesto, service worker, HTTPS, ícones e critérios de instalação de cada navegador.

## Acessibilidade

O projeto prioriza:

- navegação por teclado;
- compatibilidade com NVDA;
- link para pular ao conteúdo principal;
- títulos e landmarks semânticos;
- labels associados aos controles;
- foco visível;
- mensagens de erro e sucesso acessíveis;
- uso controlado de `aria-current`, `aria-live`, `aria-invalid` e `aria-pressed`;
- criação segura de conteúdo dinâmico com APIs DOM e `textContent`.

## Testes

As verificações de código podem ser executadas com:

```text
node --check scripts/nome-do-arquivo.js
git diff --check
```

Também é recomendado testar cada página manualmente no navegador, com teclado e NVDA, incluindo foco, mensagens, formulários, persistência e responsividade.

### Auditoria automática

Execute na raiz do projeto:

```text
node scripts/audit.js
```

O script verifica páginas HTML esperadas, `main`, `h1`, idioma, títulos, meta descriptions, links e anchors locais, imagens, scripts, folhas CSS, IDs duplicados, referências ao antigo `script.js`, navegação, `aria-current`, manifesto, ícones, service worker e recursos de “Meus dados”. Ele não modifica arquivos e não usa dependências externas.

Essa auditoria não substitui testes com NVDA, inspeção visual, testes funcionais reais no navegador nem a validação da PWA em `localhost`, HTTPS ou outro contexto compatível.

## Execução local

Como o projeto usa apenas arquivos estáticos, pode ser aberto localmente em um navegador. Para uma experiência mais próxima de hospedagem, também pode ser servido por qualquer servidor HTTP local simples.

## Limitações atuais

- os dados dependem do armazenamento disponível no navegador;
- não há sincronização entre dispositivos;
- o Quiz é apenas entretenimento;
- a Calculadora oferece uma estimativa educativa;
- o Diário não diagnostica condições de saúde e não substitui avaliação veterinária;
- ainda são necessários testes manuais completos com NVDA em diferentes navegadores.

## Changelog

### v1.0.0

Primeira versão estável, com suporte a múltiplos gatos, Perfil, Agenda de Cuidados, Diário do Gato, Calculadora de Idade Felina, Quiz, Dicas e Favoritos, backup e importação locais, PWA com funcionamento offline e acessibilidade com foco em navegação por teclado e NVDA.

## Roadmap

- ampliar a cobertura de testes automatizados;
- realizar uma regressão completa com NVDA e teclado;
- revisar continuamente contraste e responsividade;
- evoluir as ferramentas sem comprometer a privacidade local;
