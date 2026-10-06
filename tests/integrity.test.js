const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const dataScript = fs.readFileSync('scripts/my-data.js', 'utf8');
const profileScript = fs.readFileSync('scripts/profile.js', 'utf8');
const keys = ['paisDeGatos.cats', 'paisDeGatos.activeCat', 'paisDeGatos.careAgenda', 'paisDeGatos.catJournal', 'paisDeGatos.favorites'];
const cat = { id: 'g1', nome: 'Luna', idade: 3, temperamento: 'Carinhoso', atividade: 'Brincar', apelido: '' };
const task = { id: 't1', catId: 'g1', titulo: 'Trocar areia', data: '', categoria: 'higiene', concluida: false };
const journal = { id: 'r1', catId: 'g1', data: '2026-01-01', categoria: 'Rotina', humor: 'Tranquilo', energia: 'Normal', alimentacao: 'Comeu normalmente', caixaAreia: 'Normal', observacao: '' };

function estadoValido() {
  return {
    'paisDeGatos.cats': JSON.stringify([cat]),
    'paisDeGatos.activeCat': 'g1',
    'paisDeGatos.careAgenda': JSON.stringify([task]),
    'paisDeGatos.catJournal': JSON.stringify([journal]),
    'paisDeGatos.favorites': JSON.stringify(['agua-fresca']),
  };
}

function criarAmbiente(inicial = {}) {
  const storage = new Map(Object.entries(inicial));
  const listeners = new Map();
  const elementos = new Map();
  const criado = [];
  const elemento = (id) => {
    const valor = { id, hidden: false, files: [], textContent: '', children: [], focus() { this.focado = true; }, replaceChildren(...filhos) { this.children = filhos; }, append(...filhos) { this.children.push(...filhos); }, addEventListener(tipo, fn) { listeners.set(`${id}:${tipo}`, fn); }, dispatch(tipo) { return listeners.get(`${id}:${tipo}`)?.({ target: this }); }, click() { return listeners.get(`${id}:click`)?.({ target: this }); }, setAttribute() {}, removeAttribute() {} };
    elementos.set(id, valor);
    return valor;
  };
  ['arquivo-dados', 'exportar-dados', 'resumo-importacao', 'confirmar-importacao', 'mensagem-dados'].forEach((id) => elemento(id));
  const document = { querySelector(selector) { return elementos.get(selector.slice(1)); }, createElement(tag) { const item = elemento(`${tag}-${criado.length}`); item.tagName = tag; criado.push(item); return item; } };
  const blobClass = class { constructor(partes) { this.conteudo = partes.join(''); } };
  let arquivoExportado = '';
  const contexto = { document, localStorage: { getItem: (chave) => storage.has(chave) ? storage.get(chave) : null, setItem: (chave, valor) => storage.set(chave, String(valor)), removeItem: (chave) => storage.delete(chave), snapshot: () => Object.fromEntries(storage) }, Blob: blobClass, URL: { createObjectURL: (blob) => { arquivoExportado = blob.conteudo; return 'blob:teste'; }, revokeObjectURL() {} }, window: { confirm: () => true }, Intl, Date, JSON, Object, Array, Set, Number, String, RegExp, Error, console };
  const linkOriginal = document.createElement;
  document.createElement = (tag) => { const item = linkOriginal(tag); if (tag === 'a') item.click = () => {}; return item; };
  vm.runInNewContext(dataScript, contexto, { filename: 'scripts/my-data.js' });
  const arquivo = elementos.get('arquivo-dados');
  const confirmar = elementos.get('confirmar-importacao');
  const importar = async (backup) => { arquivo.files = [{ text: async () => JSON.stringify(backup) }]; arquivo.dispatch('change'); await new Promise((resolver) => setImmediate(resolver)); confirmar.click(); return elementos.get('mensagem-dados').textContent; };
  const exportar = () => { elementos.get('exportar-dados').click(); return JSON.parse(arquivoExportado); };
  return { storage: { get: (chave) => storage.get(chave), delete: (chave) => storage.delete(chave), snapshot: () => Object.fromEntries(storage) }, elementos, importar, exportar };
}

function backupReal(dados = estadoValido()) { return { versao: 2, exportadoEm: new Date().toISOString(), dados }; }

function criarAmbientePerfil(inicial, falhaNaGravacao = null) {
  const storage = new Map(Object.entries(inicial));
  const elementos = new Map();
  let gravacoes = 0;
  let falhaAtiva = falhaNaGravacao;
  function elemento(id) {
    const listeners = new Map();
    const item = { id, hidden: false, value: '', textContent: '', children: [], dataset: {}, attributes: {}, className: '', disabled: false, focus() { this.focado = true; }, append(...filhos) { this.children.push(...filhos); }, replaceChildren(...filhos) { this.children = filhos; }, addEventListener(tipo, funcao) { listeners.set(tipo, funcao); }, click() { return listeners.get('click')?.({ target: this }); }, setAttribute(nome, valor) { this.attributes[nome] = valor; }, removeAttribute(nome) { delete this.attributes[nome]; }, querySelector(seletor) { return seletor === '[type="submit"]' ? elementos.get('submit') : null; }, reset() { this.value = ''; } };
    elementos.set(id, item);
    return item;
  }
  ['formulario-perfil', 'submit', 'botao-cancelar', 'mensagem-formulario', 'lista-gatos', 'estado-sem-gatos', 'gato-ativo', 'adicionar-gato', 'adicionar-outro-gato', 'nome-gato', 'idade-gato', 'temperamento-gato', 'atividade-gato', 'apelido-gato', 'erro-nome-gato', 'erro-idade-gato', 'erro-temperamento-gato', 'erro-atividade-gato', 'erro-apelido-gato'].forEach(elemento);
  const document = { querySelector(seletor) { return elementos.get(seletor.slice(1)); }, createElement(tag) { const item = elemento(`${tag}-${elementos.size}`); item.tagName = tag; return item; } };
  const contexto = { document, localStorage: { getItem: (chave) => storage.has(chave) ? storage.get(chave) : null, setItem: (chave, valor) => { gravacoes += 1; if (falhaAtiva === gravacoes) { falhaAtiva = null; throw new Error('falha simulada'); } storage.set(chave, String(valor)); }, removeItem: (chave) => storage.delete(chave), snapshot: () => Object.fromEntries(storage) }, window: { confirm: () => true }, console, Date, Math };
  vm.runInNewContext(profileScript, contexto, { filename: 'scripts/profile.js' });
  const excluir = (nome) => { const card = elementos.get('lista-gatos').children.find((item) => item.children[0].textContent === nome); const botao = card.children.flatMap((item) => item.children || []).find((item) => item.attributes['aria-label'] === `Apagar ${nome}`); botao.click(); };
  return { storage: contexto.localStorage, elementos, excluir };
}

test('round-trip real aceita activeCat cru e tarefa sem data', async () => { const ambiente = criarAmbiente(estadoValido()); const backup = ambiente.exportar(); assert.equal(backup.dados['paisDeGatos.activeCat'], 'g1'); keys.forEach((chave) => ambiente.storage.delete(chave)); const mensagem = await ambiente.importar(backup); assert.match(mensagem, /sucesso/); assert.deepEqual(ambiente.storage.snapshot(), estadoValido()); });
test('instalação sem dados e valores nulos são aceitos pelo código real', async () => { const ambiente = criarAmbiente(); const backup = ambiente.exportar(); assert.deepEqual(backup.dados, Object.fromEntries(keys.map((chave) => [chave, null]))); const mensagem = await ambiente.importar(backup); assert.match(mensagem, /sucesso/); });
test('arrays vazios são aceitos pelo código real', async () => { const dados = { 'paisDeGatos.cats': '[]', 'paisDeGatos.activeCat': null, 'paisDeGatos.careAgenda': '[]', 'paisDeGatos.catJournal': '[]', 'paisDeGatos.favorites': '[]' }; const mensagem = await criarAmbiente().importar(backupReal(dados)); assert.match(mensagem, /sucesso/); });
test('Diário válido é aceito e Diário inválido é rejeitado', async () => { const valido = await criarAmbiente().importar(backupReal(estadoValido())); assert.match(valido, /sucesso/); const invalido = await criarAmbiente().importar(backupReal({ ...estadoValido(), 'paisDeGatos.catJournal': JSON.stringify([{ ...journal, humor: 'inválido' }]) })); assert.match(invalido, /inválido|inconsistente/); });
test('Diário futuro, favorito desconhecido e catId inexistente são rejeitados', async () => { for (const dados of [{ ...estadoValido(), 'paisDeGatos.catJournal': JSON.stringify([{ ...journal, data: '2999-01-01' }]) }, { ...estadoValido(), 'paisDeGatos.favorites': JSON.stringify(['desconhecido']) }, { ...estadoValido(), 'paisDeGatos.careAgenda': JSON.stringify([{ ...task, catId: 'ausente' }]) }]) { const ambiente = criarAmbiente({ preservado: 'sim' }); const mensagem = await ambiente.importar(backupReal(dados)); assert.match(mensagem, /inválido|inconsistente/); assert.equal(ambiente.storage.get('preservado'), 'sim'); } });
test('dados inválidos de gato e IDs duplicados são rejeitados', async () => { const ambiente = criarAmbiente(); const mensagem = await ambiente.importar(backupReal({ ...estadoValido(), 'paisDeGatos.cats': JSON.stringify([{ ...cat, temperamento: 'inválido' }]) })); assert.match(mensagem, /inválido|inconsistente/); const duplicado = await criarAmbiente().importar(backupReal({ ...estadoValido(), 'paisDeGatos.careAgenda': JSON.stringify([task, { ...task, id: 't1' }]) })); assert.match(duplicado, /inválido|inconsistente/); });
test('exclusão real remove somente os dados do gato escolhido e mantém outro ativo', () => { const gato2 = { ...cat, id: 'g2', nome: 'Milo' }; const inicial = { 'paisDeGatos.cats': JSON.stringify([cat, gato2]), 'paisDeGatos.activeCat': 'g1', 'paisDeGatos.careAgenda': JSON.stringify([task, { ...task, id: 't2', catId: 'g2' }]), 'paisDeGatos.catJournal': JSON.stringify([journal, { ...journal, id: 'r2', catId: 'g2' }]) }; const ambiente = criarAmbientePerfil(inicial); ambiente.excluir('Luna'); const final = ambiente.storage.snapshot(); assert.deepEqual(JSON.parse(final['paisDeGatos.cats']).map((g) => g.id), ['g2']); assert.equal(final['paisDeGatos.activeCat'], 'g2'); assert.deepEqual(JSON.parse(final['paisDeGatos.careAgenda']).map((i) => i.catId), ['g2']); assert.deepEqual(JSON.parse(final['paisDeGatos.catJournal']).map((i) => i.catId), ['g2']); assert.match(ambiente.elementos.get('mensagem-formulario').textContent, /sucesso/); });
test('exclusão real do último gato remove activeCat e dados relacionados', () => { const inicial = { 'paisDeGatos.cats': JSON.stringify([cat]), 'paisDeGatos.activeCat': 'g1', 'paisDeGatos.careAgenda': JSON.stringify([task]), 'paisDeGatos.catJournal': JSON.stringify([journal]) }; const ambiente = criarAmbientePerfil(inicial); ambiente.excluir('Luna'); const final = ambiente.storage.snapshot(); assert.deepEqual(JSON.parse(final['paisDeGatos.cats']), []); assert.equal(Object.prototype.hasOwnProperty.call(final, 'paisDeGatos.activeCat'), false); assert.deepEqual(JSON.parse(final['paisDeGatos.careAgenda']), []); assert.deepEqual(JSON.parse(final['paisDeGatos.catJournal']), []); });
test('falha real de persistência não anuncia sucesso e restaura o snapshot', () => { const gato2 = { ...cat, id: 'g2', nome: 'Milo' }; const inicial = { 'paisDeGatos.cats': JSON.stringify([cat, gato2]), 'paisDeGatos.activeCat': 'g1', 'paisDeGatos.careAgenda': JSON.stringify([task, { ...task, id: 't2', catId: 'g2' }]), 'paisDeGatos.catJournal': JSON.stringify([journal, { ...journal, id: 'r2', catId: 'g2' }]) }; const ambiente = criarAmbientePerfil(inicial, 3); ambiente.excluir('Luna'); assert.deepEqual(ambiente.storage.snapshot(), inicial); assert.doesNotMatch(ambiente.elementos.get('mensagem-formulario').textContent, /sucesso/); assert.equal(ambiente.elementos.get('lista-gatos').children.length, 2); });
