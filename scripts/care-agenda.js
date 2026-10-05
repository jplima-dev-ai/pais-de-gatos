(() => {
const CHAVE_AGENDA = 'paisDeGatos.careAgenda';
const CATEGORIAS_TAREFA = ['alimentação', 'higiene', 'saúde', 'brincadeira', 'outros'];

const formularioTarefa = document.querySelector('#formulario-tarefa');
const adicionarTarefa = document.querySelector('#adicionar-tarefa');
const tituloTarefa = document.querySelector('#titulo-tarefa');
const dataTarefa = document.querySelector('#data-tarefa');
const categoriaTarefa = document.querySelector('#categoria-tarefa');
const botaoTarefa = document.querySelector('#botao-tarefa');
const cancelarEdicaoTarefa = document.querySelector('#cancelar-edicao-tarefa');
const mensagemAgenda = document.querySelector('#mensagem-agenda');
const listaTarefas = document.querySelector('#lista-tarefas');
const estadoVazio = document.querySelector('#estado-vazio');
const tituloAgenda = document.querySelector('#titulo-agenda');
const filtros = document.querySelectorAll('.filtro');

const errosTarefa = {
  titulo: document.querySelector('#erro-titulo-tarefa'),
  data: document.querySelector('#erro-data-tarefa'),
  categoria: document.querySelector('#erro-categoria-tarefa'),
};

let tarefas = [];
let filtroAtual = 'todas';
let idTarefaEmEdicao = null;

function gerarIdTarefa() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }

  if (window.crypto && typeof window.crypto.getRandomValues === 'function') {
    const valores = new Uint32Array(4);
    window.crypto.getRandomValues(valores);
    return Array.from(valores, (valor) => valor.toString(16).padStart(8, '0')).join('-');
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

function dataTarefaValida(data) {
  if (data === '') {
    return true;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    return false;
  }

  const [ano, mes, dia] = data.split('-').map(Number);
  const dataVerificada = new Date(Date.UTC(ano, mes - 1, dia));

  return dataVerificada.getUTCFullYear() === ano &&
    dataVerificada.getUTCMonth() === mes - 1 &&
    dataVerificada.getUTCDate() === dia;
}

function tarefaValida(tarefa) {
  return Boolean(
    tarefa &&
    typeof tarefa === 'object' &&
    typeof tarefa.id === 'string' &&
    tarefa.id.length > 0 &&
    typeof tarefa.titulo === 'string' &&
    tarefa.titulo.trim().length > 0 &&
    tarefa.titulo.length <= 100 &&
    typeof tarefa.data === 'string' &&
    dataTarefaValida(tarefa.data) &&
    CATEGORIAS_TAREFA.includes(tarefa.categoria) &&
    typeof tarefa.concluida === 'boolean'
  );
}

function salvarTarefas() {
  try {
    localStorage.setItem(CHAVE_AGENDA, JSON.stringify(tarefas));
    return true;
  } catch (erro) {
    return false;
  }
}

function carregarTarefas() {
  try {
    const tarefasSalvas = localStorage.getItem(CHAVE_AGENDA);

    if (!tarefasSalvas) {
      return;
    }

    const dados = JSON.parse(tarefasSalvas);

    if (!Array.isArray(dados)) {
      localStorage.removeItem(CHAVE_AGENDA);
      mensagemAgenda.textContent = 'Os dados salvos da agenda eram inválidos e foram removidos.';
      return;
    }

    const tarefasValidas = dados.filter(tarefaValida);

    if (tarefasValidas.length !== dados.length) {
      tarefas = tarefasValidas;
      salvarTarefas();
      mensagemAgenda.textContent = 'Algumas tarefas inválidas foram descartadas; as tarefas válidas foram preservadas.';
    } else {
      tarefas = tarefasValidas;
    }
  } catch (erro) {
    try {
      localStorage.removeItem(CHAVE_AGENDA);
    } catch (erroAoLimpar) {
      // O navegador pode bloquear o acesso ao armazenamento.
    }
    mensagemAgenda.textContent = 'Os dados salvos da agenda estavam corrompidos e foram removidos.';
  }
}

function limparErrosTarefa() {
  Object.values(errosTarefa).forEach((mensagem) => {
    mensagem.textContent = '';
  });

  [tituloTarefa, dataTarefa, categoriaTarefa].forEach((campo) => {
    campo.removeAttribute('aria-invalid');
  });
}

function validarFormularioTarefa() {
  const erros = {};
  const titulo = tituloTarefa.value.trim();

  if (!titulo) {
    erros.titulo = 'Informe um título para a tarefa.';
  }

  if (titulo.length > 100) {
    erros.titulo = 'O título deve ter no máximo 100 caracteres.';
  }

  if (!dataTarefaValida(dataTarefa.value)) {
    erros.data = 'Informe uma data válida.';
  }

  if (!CATEGORIAS_TAREFA.includes(categoriaTarefa.value)) {
    erros.categoria = 'Selecione uma categoria válida.';
  }

  return erros;
}

function mostrarErrosTarefa(erros) {
  Object.entries(erros).forEach(([campo, mensagem]) => {
    const elemento = campo === 'titulo' ? tituloTarefa : campo === 'data' ? dataTarefa : categoriaTarefa;
    elemento.setAttribute('aria-invalid', 'true');
    errosTarefa[campo].textContent = mensagem;
  });
}

function formatarData(data) {
  if (!data) {
    return 'Sem data definida';
  }

  const [ano, mes, dia] = data.split('-').map(Number);
  return new Intl.DateTimeFormat('pt-BR').format(new Date(ano, mes - 1, dia));
}

function textoCategoria(categoria) {
  return categoria.charAt(0).toUpperCase() + categoria.slice(1);
}

function tarefasFiltradas() {
  if (filtroAtual === 'pendentes') {
    return tarefas.filter((tarefa) => !tarefa.concluida);
  }

  if (filtroAtual === 'concluidas') {
    return tarefas.filter((tarefa) => tarefa.concluida);
  }

  return tarefas;
}

function criarBotaoTarefa(texto, acao, tarefa) {
  const botao = document.createElement('button');
  botao.className = 'botao-tarefa';
  botao.type = 'button';
  botao.dataset.acao = acao;
  botao.dataset.id = tarefa.id;
  botao.textContent = texto;
  return botao;
}

function criarElementoTarefa(tarefa) {
  const item = document.createElement('li');
  const conteudo = document.createElement('div');
  const titulo = document.createElement('h3');
  const meta = document.createElement('p');
  const status = document.createElement('p');
  const acoes = document.createElement('div');

  item.className = tarefa.concluida ? 'tarefa concluida' : 'tarefa';
  item.dataset.id = tarefa.id;
  titulo.tabIndex = -1;
  titulo.textContent = tarefa.titulo;
  meta.className = 'tarefa-meta';
  meta.textContent = `${formatarData(tarefa.data)} · ${textoCategoria(tarefa.categoria)}`;
  status.className = 'tarefa-status';
  status.textContent = tarefa.concluida ? 'Status: concluída' : 'Status: pendente';
  acoes.className = 'acoes-tarefa';

  const botaoStatus = tarefa.concluida
    ? criarBotaoTarefa(`Voltar tarefa ${tarefa.titulo} para pendente`, 'pendente', tarefa)
    : criarBotaoTarefa(`Marcar tarefa ${tarefa.titulo} como concluída`, 'concluir', tarefa);

  acoes.append(
    botaoStatus,
    criarBotaoTarefa(`Editar tarefa ${tarefa.titulo}`, 'editar', tarefa),
    criarBotaoTarefa(`Apagar tarefa ${tarefa.titulo}`, 'apagar', tarefa),
  );
  conteudo.append(titulo, meta, status);
  item.append(conteudo, acoes);

  return item;
}

function atualizarEstadoVazio(lista) {
  if (lista.length > 0) {
    estadoVazio.textContent = '';
    return;
  }

  if (filtroAtual === 'pendentes') {
    estadoVazio.textContent = 'Não há tarefas pendentes.';
  } else if (filtroAtual === 'concluidas') {
    estadoVazio.textContent = 'Não há tarefas concluídas.';
  } else {
    estadoVazio.textContent = 'Você ainda não cadastrou nenhuma tarefa de cuidado.';
  }
}

function renderizarTarefas(idParaFocar = null) {
  const lista = tarefasFiltradas();
  listaTarefas.replaceChildren(...lista.map(criarElementoTarefa));
  atualizarEstadoVazio(lista);

  if (idParaFocar) {
    const tarefaParaFocar = listaTarefas.querySelector(`[data-id="${idParaFocar}"] h3`);

    if (tarefaParaFocar) {
      tarefaParaFocar.focus();
    } else {
      tituloAgenda.focus();
    }
  }
}

function redefinirFormularioTarefa() {
  formularioTarefa.reset();
  limparErrosTarefa();
  idTarefaEmEdicao = null;
  botaoTarefa.textContent = 'Criar tarefa';
  cancelarEdicaoTarefa.hidden = true;
}

function mostrarFormularioTarefa() {
  redefinirFormularioTarefa();
  formularioTarefa.hidden = false;
  adicionarTarefa.hidden = true;
  tituloTarefa.focus();
}

function esconderFormularioTarefa() {
  formularioTarefa.hidden = true;
  adicionarTarefa.hidden = false;
}

function iniciarEdicaoTarefa(tarefa) {
  idTarefaEmEdicao = tarefa.id;
  tituloTarefa.value = tarefa.titulo;
  dataTarefa.value = tarefa.data;
  categoriaTarefa.value = tarefa.categoria;
  limparErrosTarefa();
  formularioTarefa.hidden = false;
  adicionarTarefa.hidden = true;
  botaoTarefa.textContent = 'Salvar alterações';
  cancelarEdicaoTarefa.hidden = false;
  tituloTarefa.focus();
}

function cancelarEdicaoTarefaAtual() {
  const idCancelado = idTarefaEmEdicao;
  redefinirFormularioTarefa();
  esconderFormularioTarefa();
  mensagemAgenda.textContent = 'Edição cancelada.';
  renderizarTarefas(idCancelado);
}

function excluirTarefa(tarefa) {
  const confirmou = window.confirm(`Tem certeza de que deseja apagar a tarefa “${tarefa.titulo}”?`);

  if (!confirmou) {
    return;
  }

  const indice = tarefasFiltradas().findIndex((item) => item.id === tarefa.id);
  tarefas = tarefas.filter((item) => item.id !== tarefa.id);

  if (!salvarTarefas()) {
    mensagemAgenda.textContent = 'Não foi possível atualizar as tarefas neste navegador.';
    return;
  }

  const tarefasVisiveis = tarefasFiltradas();
  const proximaTarefa = tarefasVisiveis[indice] || tarefasVisiveis[indice - 1];
  mensagemAgenda.textContent = 'Tarefa apagada com sucesso.';
  renderizarTarefas(proximaTarefa ? proximaTarefa.id : null);

  if (!proximaTarefa) {
    tituloAgenda.focus();
  }
}

function alternarStatusTarefa(tarefa) {
  tarefa.concluida = !tarefa.concluida;

  if (!salvarTarefas()) {
    tarefa.concluida = !tarefa.concluida;
    mensagemAgenda.textContent = 'Não foi possível atualizar o status neste navegador.';
    return;
  }

  mensagemAgenda.textContent = tarefa.concluida
    ? 'Tarefa marcada como concluída.'
    : 'Tarefa voltou para pendente.';
  renderizarTarefas(tarefa.id);
}

listaTarefas.addEventListener('click', (evento) => {
  const botao = evento.target.closest('button[data-acao]');

  if (!botao) {
    return;
  }

  const tarefa = tarefas.find((item) => item.id === botao.dataset.id);

  if (!tarefa) {
    return;
  }

  if (botao.dataset.acao === 'editar') {
    iniciarEdicaoTarefa(tarefa);
  } else if (botao.dataset.acao === 'apagar') {
    excluirTarefa(tarefa);
  } else {
    alternarStatusTarefa(tarefa);
  }
});

formularioTarefa.addEventListener('submit', (evento) => {
  evento.preventDefault();
  limparErrosTarefa();

  const erros = validarFormularioTarefa();
  const chavesComErro = Object.keys(erros);

  if (chavesComErro.length > 0) {
    mostrarErrosTarefa(erros);
    mensagemAgenda.textContent = 'Revise os campos indicados antes de salvar a tarefa.';
    const primeiroCampo = chavesComErro[0] === 'titulo' ? tituloTarefa : chavesComErro[0] === 'data' ? dataTarefa : categoriaTarefa;
    primeiroCampo.focus();
    return;
  }

  let idParaFocar;

  let tarefaEditada;
  let tarefaAnterior;

  if (idTarefaEmEdicao) {
    const tarefa = tarefas.find((item) => item.id === idTarefaEmEdicao);
    tarefaAnterior = { ...tarefa };
    tarefa.titulo = tituloTarefa.value.trim();
    tarefa.data = dataTarefa.value;
    tarefa.categoria = categoriaTarefa.value;
    tarefaEditada = tarefa;
    idParaFocar = tarefa.id;
    mensagemAgenda.textContent = 'Tarefa atualizada com sucesso.';
  } else {
    const tarefa = {
      id: gerarIdTarefa(),
      titulo: tituloTarefa.value.trim(),
      data: dataTarefa.value,
      categoria: categoriaTarefa.value,
      concluida: false,
    };
    tarefaEditada = tarefa;
    tarefas.push(tarefa);
    idParaFocar = tarefa.id;
    mensagemAgenda.textContent = 'Tarefa criada com sucesso.';
  }

  if (!salvarTarefas()) {
    if (tarefaAnterior) {
      const indice = tarefas.findIndex((item) => item.id === tarefaAnterior.id);
      tarefas[indice] = tarefaAnterior;
    } else {
      tarefas = tarefas.filter((item) => item.id !== tarefaEditada.id);
    }
    mensagemAgenda.textContent = 'Não foi possível salvar a tarefa neste navegador.';
    return;
  }

  redefinirFormularioTarefa();
  esconderFormularioTarefa();
  renderizarTarefas(idParaFocar);
});

adicionarTarefa.addEventListener('click', mostrarFormularioTarefa);
cancelarEdicaoTarefa.addEventListener('click', cancelarEdicaoTarefaAtual);

filtros.forEach((filtro) => {
  filtro.addEventListener('click', () => {
    filtroAtual = filtro.dataset.filtro;
    filtros.forEach((item) => {
      const ativo = item === filtro;
      item.classList.toggle('ativo', ativo);
      item.setAttribute('aria-pressed', String(ativo));
    });
    renderizarTarefas();
    mensagemAgenda.textContent = `Filtro ${filtro.textContent.toLowerCase()} aplicado.`;
  });
});

carregarTarefas();
esconderFormularioTarefa();
renderizarTarefas();

})();

