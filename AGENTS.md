# Orientações para agentes de IA

## Projeto

Pais de Gatos é uma aplicação web multipágina para pessoas que cuidam e convivem com gatos. O projeto prioriza uma experiência acolhedora, simples, privada e acessível.

## Tecnologias e arquitetura

- use somente HTML, CSS e JavaScript puros;
- preserve a arquitetura multipágina;
- não adicione frameworks, bibliotecas, bundlers, backend, login ou nuvem;
- mantenha o `styles.css` compartilhado quando não houver benefício concreto em separar estilos;
- respeite o manifesto e o service worker existentes;
- não altere chaves ou formatos do `localStorage` sem solicitação explícita.

## Dados e privacidade

- os dados pertencem ao navegador e não devem ser enviados para serviços externos;
- preserve as chaves `paisDeGatos.*` existentes;
- trate `activeCat` como string crua no `localStorage`;
- valide backups completos antes de alterar qualquer chave;
- preserve rollback e feedback em falhas de persistência;
- não remova dados existentes automaticamente sem requisito claro e documentado.

## Acessibilidade

O projeto é desenvolvido com foco em teclado e NVDA. Preserve:

- HTML semântico, landmarks e hierarquia correta de títulos;
- labels associados e controles nativos quando apropriado;
- foco visível e previsível;
- nomes acessíveis claros;
- `aria-current`, `aria-live`, `aria-invalid` e `aria-pressed` somente quando necessários;
- mensagens de erro e sucesso compreensíveis;
- conteúdo dinâmico seguro, sem `innerHTML` para dados variáveis.

Ao alterar a interface, descreva o impacto visual e o comportamento esperado para leitores de tela.

## Processo de mudança

Antes de uma mudança importante:

1. explique o objetivo e os arquivos envolvidos;
2. confirme o escopo e preserve alterações existentes;
3. faça a menor alteração suficiente;
4. não refatore por preferência estética;
5. execute as verificações disponíveis;
6. informe o que foi testado e o que ainda exige teste manual.

Correções objetivas devem permanecer separadas de redesign, novas funcionalidades e melhorias futuras.

## Testes

Quando aplicável, execute:

- `node --test tests/integrity.test.js`;
- `node scripts/audit.js`;
- `node --check` nos JavaScripts;
- `git diff --check`.

Os testes devem verificar comportamento e, sempre que possível, exercitar o código real de produção. Não crie testes que apenas repitam uma implementação paralela sem proteger o fluxo verdadeiro.

## Git e segurança

- não crie commit sem autorização explícita;
- não crie tag, release ou faça push sem solicitação explícita;
- não execute comandos destrutivos sem autorização;
- não use `git reset --hard`, `git checkout --` ou equivalentes para descartar trabalho;
- não inclua segredos, credenciais ou dados pessoais no código;
- informe claramente arquivos criados, modificados ou removidos.

## Idioma

Explique o trabalho ao proprietário em português do Brasil, com linguagem clara e acessível para leitura com NVDA.
