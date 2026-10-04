const CHAVE_PERFIL = 'maesDeGatos.perfil';

const formulario = document.querySelector('#formulario-perfil');
const botaoPrincipal = formulario.querySelector('[type="submit"]');
const botaoCancelar = document.querySelector('#botao-cancelar');
const mensagemStatus = document.querySelector('#mensagem-formulario');
const resultadoPerfil = document.querySelector('#resultado-perfil');

const campos = {
  nome: document.querySelector('#nome-gato'),
  idade: document.querySelector('#idade-gato'),
  temperamento: document.querySelector('#temperamento-gato'),
  atividade: document.querySelector('#atividade-gato'),
  apelido: document.querySelector('#apelido-gato'),
};

const mensagensErro = {
  nome: document.querySelector('#erro-nome-gato'),
  idade: document.querySelector('#erro-idade-gato'),
  temperamento: document.querySelector('#erro-temperamento-gato'),
  atividade: document.querySelector('#erro-atividade-gato'),
  apelido: document.querySelector('#erro-apelido-gato'),
};

let modoEdicao = false;

function limparMensagens() {
  mensagemStatus.textContent = '';

  Object.keys(campos).forEach((chave) => {
    campos[chave].removeAttribute('aria-invalid');
    mensagensErro[chave].textContent = '';
  });
}

function mostrarErro(chave, mensagem) {
  campos[chave].setAttribute('aria-invalid', 'true');
  mensagensErro[chave].textContent = mensagem;
}

function validarFormulario() {
  const erros = {};
  const nome = campos.nome.value.trim();
  const idade = campos.idade.value.trim();

  if (nome.length < 2) {
    erros.nome = 'Informe o nome do gato com pelo menos 2 caracteres.';
  }

  if (!idade || !Number.isInteger(Number(idade)) || Number(idade) < 0 || Number(idade) > 40) {
    erros.idade = 'Informe uma idade inteira entre 0 e 40 anos.';
  }

  if (!campos.temperamento.value) {
    erros.temperamento = 'Selecione o temperamento do gato.';
  }

  if (!campos.atividade.value) {
    erros.atividade = 'Selecione a atividade favorita do gato.';
  }

  if (campos.apelido.value.trim().length > 40) {
    erros.apelido = 'O apelido deve ter no máximo 40 caracteres.';
  }

  return erros;
}

function dadosDoFormulario() {
  return {
    nome: campos.nome.value.trim(),
    idade: Number(campos.idade.value),
    temperamento: campos.temperamento.value,
    atividade: campos.atividade.value,
    apelido: campos.apelido.value.trim(),
  };
}

function dadosSalvosSaoValidos(dados) {
  const temperamentos = Array.from(campos.temperamento.options, (opcao) => opcao.value);
  const atividades = Array.from(campos.atividade.options, (opcao) => opcao.value);

  return Boolean(
    dados &&
    typeof dados === 'object' &&
    typeof dados.nome === 'string' &&
    dados.nome.trim().length >= 2 &&
    Number.isInteger(dados.idade) &&
    dados.idade >= 0 &&
    dados.idade <= 40 &&
    temperamentos.includes(dados.temperamento) &&
    atividades.includes(dados.atividade) &&
    typeof dados.apelido === 'string' &&
    dados.apelido.length <= 40,
  );
}

function lerPerfilSalvo() {
  try {
    const perfil = localStorage.getItem(CHAVE_PERFIL);

    if (!perfil) {
      return null;
    }

    const dados = JSON.parse(perfil);

    if (!dadosSalvosSaoValidos(dados)) {
      localStorage.removeItem(CHAVE_PERFIL);
      return null;
    }

    return dados;
  } catch (erro) {
    try {
      localStorage.removeItem(CHAVE_PERFIL);
    } catch (erroAoLimpar) {
      // O navegador pode bloquear o acesso ao armazenamento.
    }
    return null;
  }
}

function salvarPerfil(dados) {
  try {
    localStorage.setItem(CHAVE_PERFIL, JSON.stringify(dados));
    return true;
  } catch (erro) {
    return false;
  }
}

function preencherFormulario(dados) {
  campos.nome.value = dados.nome;
  campos.idade.value = dados.idade;
  campos.temperamento.value = dados.temperamento;
  campos.atividade.value = dados.atividade;
  campos.apelido.value = dados.apelido;
}

function criarItemFicha(rotulo, valor) {
  const item = document.createElement('div');
  const titulo = document.createElement('dt');
  const conteudo = document.createElement('dd');

  titulo.textContent = rotulo;
  conteudo.textContent = valor;
  item.append(titulo, conteudo);

  return item;
}

function criarFicha(dados, moverFoco = true) {
  resultadoPerfil.replaceChildren();
  resultadoPerfil.hidden = false;

  const ficha = document.createElement('article');
  const titulo = document.createElement('h3');
  const lista = document.createElement('dl');
  const acoes = document.createElement('div');
  const botaoEditar = document.createElement('button');
  const botaoApagar = document.createElement('button');

  ficha.className = 'ficha-gato';
  titulo.tabIndex = -1;
  titulo.textContent = `Perfil de ${dados.nome}`;

  lista.append(
    criarItemFicha('Idade', `${dados.idade} ${dados.idade === 1 ? 'ano' : 'anos'}`),
    criarItemFicha('Temperamento', dados.temperamento),
    criarItemFicha('Atividade favorita', dados.atividade),
  );

  if (dados.apelido) {
    lista.append(criarItemFicha('Apelido', dados.apelido));
  }

  acoes.className = 'acoes-ficha';

  botaoEditar.className = 'botao botao-editar';
  botaoEditar.type = 'button';
  botaoEditar.textContent = 'Editar perfil';
  botaoEditar.addEventListener('click', () => iniciarEdicao(dados));

  botaoApagar.className = 'botao-apagar';
  botaoApagar.type = 'button';
  botaoApagar.textContent = 'Apagar perfil';
  botaoApagar.addEventListener('click', apagarPerfil);

  acoes.append(botaoEditar, botaoApagar);
  ficha.append(titulo, lista, acoes);
  resultadoPerfil.append(ficha);

  if (moverFoco) {
    titulo.focus();
  }
}

function mostrarEstadoSemPerfil() {
  modoEdicao = false;
  formulario.hidden = false;
  resultadoPerfil.hidden = true;
  botaoPrincipal.textContent = 'Criar perfil';
  botaoCancelar.hidden = true;
}

function mostrarEstadoComPerfil(dados, moverFoco = false) {
  modoEdicao = false;
  formulario.hidden = true;
  botaoCancelar.hidden = true;
  criarFicha(dados, moverFoco);
}

function iniciarEdicao(dados) {
  modoEdicao = true;
  preencherFormulario(dados);
  limparMensagens();
  formulario.hidden = false;
  resultadoPerfil.hidden = true;
  botaoPrincipal.textContent = 'Salvar alterações';
  botaoCancelar.hidden = false;
  campos.nome.focus();
}

function cancelarEdicao() {
  const dados = lerPerfilSalvo();

  if (!dados) {
    mostrarEstadoSemPerfil();
    campos.nome.focus();
    return;
  }

  preencherFormulario(dados);
  limparMensagens();
  mostrarEstadoComPerfil(dados);
  mensagemStatus.textContent = 'Edição cancelada.';
  resultadoPerfil.querySelector('.botao-editar').focus();
}

function apagarPerfil() {
  const confirmou = window.confirm(
    'Tem certeza de que deseja apagar o perfil deste gato? Essa ação remove os dados salvos neste navegador.',
  );

  if (!confirmou) {
    return;
  }

  try {
    localStorage.removeItem(CHAVE_PERFIL);
  } catch (erro) {
    mensagemStatus.textContent = 'Não foi possível apagar o perfil salvo neste navegador.';
    return;
  }

  formulario.reset();
  limparMensagens();
  resultadoPerfil.replaceChildren();
  mostrarEstadoSemPerfil();
  mensagemStatus.textContent = 'Perfil apagado com sucesso.';
  campos.nome.focus();
}

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  limparMensagens();
  resultadoPerfil.replaceChildren();

  const erros = validarFormulario();
  const chavesComErro = Object.keys(erros);

  if (chavesComErro.length > 0) {
    chavesComErro.forEach((chave) => mostrarErro(chave, erros[chave]));
    mensagemStatus.textContent = 'Revise os campos indicados antes de criar o perfil.';
    campos[chavesComErro[0]].focus();
    return;
  }

  const dados = dadosDoFormulario();

  if (!salvarPerfil(dados)) {
    mensagemStatus.textContent = 'Não foi possível salvar o perfil neste navegador.';
    return;
  }

  const mensagem = modoEdicao ? 'Perfil atualizado com sucesso.' : 'Perfil criado com sucesso.';
  mensagemStatus.textContent = mensagem;
  mostrarEstadoComPerfil(dados, true);
});

botaoCancelar.addEventListener('click', cancelarEdicao);

const perfilSalvo = lerPerfilSalvo();

if (perfilSalvo) {
  preencherFormulario(perfilSalvo);
  mostrarEstadoComPerfil(perfilSalvo);
} else {
  mostrarEstadoSemPerfil();
}

const CHAVE_AGENDA = 'maesDeGatos.agendaCuidados';
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

const formularioIdadeFelina = document.querySelector('#formulario-idade-felina');
const idadeAnos = document.querySelector('#idade-anos');
const idadeMeses = document.querySelector('#idade-meses');
const idadeDias = document.querySelector('#idade-dias');
const erroIdadeFelina = document.querySelector('#erro-idade-felina');
const mensagemCalculadora = document.querySelector('#mensagem-calculadora');
const resultadoIdadeFelina = document.querySelector('#resultado-idade-felina');

function preencherOpcoes(select, limite) {
  for (let valor = 0; valor <= limite; valor += 1) {
    const opcao = document.createElement('option');
    opcao.value = String(valor);
    opcao.textContent = String(valor);
    select.append(opcao);
  }
}

preencherOpcoes(idadeAnos, 40);
preencherOpcoes(idadeMeses, 11);
preencherOpcoes(idadeDias, 30);

function calcularIdadeHumana(idade) {
  if (idade <= 1) {
    return idade * 15;
  }

  if (idade < 2) {
    return 15 + (idade - 1) * 9;
  }

  return 24 + (idade - 2) * 4;
}

function classificarFaseFelina(idade) {
  if (idade < 1) {
    return 'Filhote';
  }

  if (idade < 3) {
    return 'Jovem';
  }

  if (idade < 7) {
    return 'Adulto';
  }

  if (idade <= 10) {
    return 'Maduro';
  }

  return 'Sênior';
}

function formatarResultadoHumano(idadeHumana) {
  return Number(idadeHumana.toFixed(1)).toLocaleString('pt-BR', {
    maximumFractionDigits: 1,
  });
}

function formatarAnosHumanos(idadeHumana) {
  const valor = formatarResultadoHumano(idadeHumana);
  const unidade = Number(idadeHumana.toFixed(1)) === 1 ? 'ano humano' : 'anos humanos';
  return `${valor} ${unidade}`;
}

function mostrarResultadoIdade(idadeTexto, idadeHumana, fase) {
  resultadoIdadeFelina.replaceChildren();

  const titulo = document.createElement('h3');
  const equivalencia = document.createElement('p');
  const classificacao = document.createElement('p');
  const aviso = document.createElement('p');

  titulo.tabIndex = -1;
  titulo.textContent = 'Resultado da idade felina';
  equivalencia.textContent = `A idade informada, ${idadeTexto}, equivale a aproximadamente ${formatarAnosHumanos(idadeHumana)}.`;
  classificacao.textContent = `Fase de vida: ${fase}.`;
  aviso.className = 'aviso-calculadora';
  aviso.textContent = 'Esta é uma estimativa educativa e não substitui a avaliação de um médico-veterinário.';

  resultadoIdadeFelina.append(titulo, equivalencia, classificacao, aviso);
  resultadoIdadeFelina.hidden = false;
  titulo.focus();
}

formularioIdadeFelina.addEventListener('submit', (evento) => {
  evento.preventDefault();
  erroIdadeFelina.textContent = '';
  [idadeAnos, idadeMeses, idadeDias].forEach((controle) => {
    controle.removeAttribute('aria-invalid');
  });
  mensagemCalculadora.textContent = '';

  const anos = Number(idadeAnos.value);
  const meses = Number(idadeMeses.value);
  const dias = Number(idadeDias.value);
  const idade = anos + meses / 12 + dias / 365;

  if (anos === 0 && meses === 0 && dias === 0) {
    erroIdadeFelina.textContent = 'Informe a idade do gato selecionando pelo menos anos, meses ou dias.';
    [idadeAnos, idadeMeses, idadeDias].forEach((controle) => {
      controle.setAttribute('aria-invalid', 'true');
    });
    mensagemCalculadora.textContent = 'Revise a idade informada.';
    resultadoIdadeFelina.hidden = true;
    idadeAnos.focus();
    return;
  }

  const idadeHumana = calcularIdadeHumana(idade);
  const fase = classificarFaseFelina(idade);
  const partesIdade = [];

  if (anos > 0) {
    partesIdade.push(`${anos} ${anos === 1 ? 'ano' : 'anos'}`);
  }

  if (meses > 0) {
    partesIdade.push(`${meses} ${meses === 1 ? 'mês' : 'meses'}`);
  }

  if (dias > 0) {
    partesIdade.push(`${dias} ${dias === 1 ? 'dia' : 'dias'}`);
  }

  const idadeTexto = partesIdade.join(', ').replace(/, ([^,]*)$/, ' e $1');

  mensagemCalculadora.textContent = 'Cálculo concluído.';
  mostrarResultadoIdade(idadeTexto, idadeHumana, fase);
});

const perguntasQuiz = [
  {
    pergunta: 'O que você faz quando percebe algo diferente no comportamento do seu gato?',
    alternativas: [
      { texto: 'Observo com atenção para entender o que está acontecendo.', perfil: 'observadora' },
      { texto: 'Vou até ele com carinho e verifico se está tudo bem.', perfil: 'protetora' },
      { texto: 'Tento distrair com uma brincadeira para ver se ele se anima.', perfil: 'brincalhona' },
      { texto: 'Sento por perto e ofereço colo, se ele quiser.', perfil: 'aconchego' },
    ],
  },
  {
    pergunta: 'Qual momento do dia vocês mais gostam de compartilhar?',
    alternativas: [
      { texto: 'O momento tranquilo de observar a casa lado a lado.', perfil: 'observadora' },
      { texto: 'O momento de conferir comida, água e todo o conforto.', perfil: 'protetora' },
      { texto: 'Aquela hora em que a casa vira pista de corrida.', perfil: 'brincalhona' },
      { texto: 'O fim do dia, com carinho e descanso no sofá.', perfil: 'aconchego' },
    ],
  },
  {
    pergunta: 'Como você reage quando ele começa a correr pela casa?',
    alternativas: [
      { texto: 'Acompanho o trajeto com os olhos e tento descobrir o motivo.', perfil: 'observadora' },
      { texto: 'Confiro se o caminho está seguro para a aventura.', perfil: 'protetora' },
      { texto: 'Entro na brincadeira e incentivo a corrida.', perfil: 'brincalhona' },
      { texto: 'Espero a energia passar e depois ofereço um carinho.', perfil: 'aconchego' },
    ],
  },
  {
    pergunta: 'Qual presente você mais gosta de oferecer?',
    alternativas: [
      { texto: 'Um brinquedo que também desperte a curiosidade.', perfil: 'observadora' },
      { texto: 'Algo útil para deixar a rotina mais segura e confortável.', perfil: 'protetora' },
      { texto: 'Um brinquedo divertido para gastar energia.', perfil: 'brincalhona' },
      { texto: 'Uma caminha macia ou uma manta para o descanso.', perfil: 'aconchego' },
    ],
  },
  {
    pergunta: 'Qual situação mais combina com vocês?',
    alternativas: [
      { texto: 'Nós dois observando o mundo pela janela.', perfil: 'observadora' },
      { texto: 'Eu cuidando de cada detalhe para ele ficar bem.', perfil: 'protetora' },
      { texto: 'Nós dois inventando uma nova brincadeira.', perfil: 'brincalhona' },
      { texto: 'Um momento calmo de colo, ronronar e carinho.', perfil: 'aconchego' },
    ],
  },
];

const perfisQuiz = {
  protetora: {
    nome: 'Mãe Protetora',
    descricao: 'Você tem radar para qualquer detalhe e transforma cuidado em um abraço invisível.',
    recomendacao: 'Sua missão divertida: prepare um cantinho seguro e faça uma ronda de carinho.',
  },
  brincalhona: {
    nome: 'Mãe Brincalhona',
    descricao: 'Com você, qualquer caixa vira brinquedo e qualquer corredor pode virar uma grande aventura.',
    recomendacao: 'Sua missão divertida: reserve alguns minutos para uma brincadeira escolhida pelo seu gato.',
  },
  observadora: {
    nome: 'Mãe Observadora',
    descricao: 'Você percebe os pequenos sinais e conhece cada olhar, miado e movimento do seu companheiro.',
    recomendacao: 'Sua missão divertida: observe hoje qual é o lugar favorito dele para descansar.',
  },
  aconchego: {
    nome: 'Mãe Aconchego',
    descricao: 'Você entende que os melhores momentos podem ser silenciosos, macios e cheios de ronronar.',
    recomendacao: 'Sua missão divertida: ofereça um cantinho confortável e deixe o carinho acontecer no ritmo dele.',
  },
};

const formularioQuiz = document.querySelector('#formulario-quiz');
const legendaPergunta = document.querySelector('#legenda-pergunta');
const textoPergunta = document.querySelector('#texto-pergunta');
const alternativasQuiz = document.querySelector('#alternativas-quiz');
const progressoQuiz = document.querySelector('#progresso-quiz');
const erroQuiz = document.querySelector('#erro-quiz');
const mensagemQuiz = document.querySelector('#mensagem-quiz');
const voltarQuiz = document.querySelector('#voltar-quiz');
const proximaQuiz = document.querySelector('#proxima-quiz');
const resultadoQuiz = document.querySelector('#resultado-quiz');

let perguntaAtualQuiz = 0;
let respostasQuiz = Array(perguntasQuiz.length).fill(null);

function renderizarPerguntaQuiz(moverFoco = true) {
  const pergunta = perguntasQuiz[perguntaAtualQuiz];
  const respostaAnterior = respostasQuiz[perguntaAtualQuiz];

  legendaPergunta.textContent = `Pergunta ${perguntaAtualQuiz + 1} de ${perguntasQuiz.length}`;
  progressoQuiz.textContent = `Pergunta ${perguntaAtualQuiz + 1} de ${perguntasQuiz.length}`;
  textoPergunta.textContent = pergunta.pergunta;
  alternativasQuiz.replaceChildren();
  erroQuiz.textContent = '';
  proximaQuiz.textContent = perguntaAtualQuiz === perguntasQuiz.length - 1 ? 'Ver meu resultado' : 'Próxima pergunta';
  voltarQuiz.hidden = perguntaAtualQuiz === 0;

  pergunta.alternativas.forEach((alternativa, indice) => {
    const idAlternativa = `quiz-resposta-${perguntaAtualQuiz}-${indice}`;
    const item = document.createElement('div');
    const input = document.createElement('input');
    const label = document.createElement('label');

    item.className = 'alternativa-quiz';
    input.type = 'radio';
    input.id = idAlternativa;
    input.name = 'resposta-quiz';
    input.value = alternativa.perfil;
    input.checked = respostaAnterior === alternativa.perfil;
    label.htmlFor = idAlternativa;
    label.textContent = alternativa.texto;
    item.append(input, label);
    alternativasQuiz.append(item);
  });

  if (moverFoco) {
    textoPergunta.focus();
  }
}

function recalcularPontuacaoQuiz() {
  const pontuacao = Object.keys(perfisQuiz).reduce((resultado, perfil) => {
    resultado[perfil] = 0;
    return resultado;
  }, {});

  respostasQuiz.forEach((perfil) => {
    if (perfil) {
      pontuacao[perfil] += 1;
    }
  });

  return pontuacao;
}

function juntarNomesPerfis(nomes) {
  if (nomes.length === 2) {
    return `${nomes[0]} e ${nomes[1]}`;
  }

  return `${nomes.slice(0, -1).join(', ')} e ${nomes[nomes.length - 1]}`;
}

function mostrarResultadoQuiz() {
  const pontuacao = recalcularPontuacaoQuiz();
  const maiorPontuacao = Math.max(...Object.values(pontuacao));
  const perfisVencedores = Object.keys(pontuacao).filter((perfil) => pontuacao[perfil] === maiorPontuacao);
  const nomes = perfisVencedores.map((perfil) => perfisQuiz[perfil].nome);
  const titulo = document.createElement('h3');
  const descricao = document.createElement('p');
  const recomendacao = document.createElement('p');
  const aviso = document.createElement('p');
  const refazer = document.createElement('button');

  resultadoQuiz.replaceChildren();
  titulo.tabIndex = -1;

  if (perfisVencedores.length === 1) {
    const perfil = perfisQuiz[perfisVencedores[0]];
    titulo.textContent = perfil.nome;
    descricao.textContent = perfil.descricao;
    recomendacao.textContent = perfil.recomendacao;
  } else {
    titulo.textContent = `Seu resultado ficou entre ${juntarNomesPerfis(nomes)}.`;
    descricao.textContent = `Você mistura o cuidado de ${nomes.join(' com ')}: tem atenção, carinho e muita personalidade na convivência com seu gato.`;
    recomendacao.textContent = 'Sua missão divertida: combine um momento de cuidado, uma brincadeira e um bom aconchego hoje.';
  }

  aviso.className = 'aviso-quiz';
  aviso.textContent = 'Este resultado é apenas uma brincadeira e não é um teste científico ou psicológico.';
  refazer.className = 'botao-refazer-quiz';
  refazer.type = 'button';
  refazer.textContent = 'Refazer quiz';
  refazer.addEventListener('click', reiniciarQuiz);

  resultadoQuiz.append(titulo, descricao, recomendacao, aviso, refazer);
  resultadoQuiz.hidden = false;
  formularioQuiz.hidden = true;
  mensagemQuiz.textContent = 'Resultado calculado.';
  titulo.focus();
}

function reiniciarQuiz() {
  perguntaAtualQuiz = 0;
  respostasQuiz = Array(perguntasQuiz.length).fill(null);
  resultadoQuiz.replaceChildren();
  resultadoQuiz.hidden = true;
  formularioQuiz.hidden = false;
  mensagemQuiz.textContent = '';
  renderizarPerguntaQuiz();
}

formularioQuiz.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const selecionada = alternativasQuiz.querySelector('input[name="resposta-quiz"]:checked');

  if (!selecionada) {
    erroQuiz.textContent = 'Escolha uma opção antes de continuar.';
    mensagemQuiz.textContent = 'Escolha uma opção antes de continuar.';
    alternativasQuiz.querySelector('input[name="resposta-quiz"]').focus();
    return;
  }

  respostasQuiz[perguntaAtualQuiz] = selecionada.value;
  erroQuiz.textContent = '';

  if (perguntaAtualQuiz === perguntasQuiz.length - 1) {
    mostrarResultadoQuiz();
    return;
  }

  perguntaAtualQuiz += 1;
  renderizarPerguntaQuiz();
});

voltarQuiz.addEventListener('click', () => {
  const selecionada = alternativasQuiz.querySelector('input[name="resposta-quiz"]:checked');

  if (selecionada) {
    respostasQuiz[perguntaAtualQuiz] = selecionada.value;
  }

  perguntaAtualQuiz -= 1;
  renderizarPerguntaQuiz();
});

renderizarPerguntaQuiz(false);
