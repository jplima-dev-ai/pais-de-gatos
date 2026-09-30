const CHAVE_PERFIL = 'maesDeGatos.perfil';

const formulario = document.querySelector('#formulario-perfil');
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
  formulario.querySelector('[type="submit"]').textContent = 'Criar perfil';
  mensagemStatus.textContent = 'Perfil apagado com sucesso.';
  campos.nome.focus();
}

function criarFicha(dados, moverFoco = true) {
  resultadoPerfil.replaceChildren();

  const ficha = document.createElement('article');
  const titulo = document.createElement('h3');
  const lista = document.createElement('dl');
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

  botaoApagar.className = 'botao-apagar';
  botaoApagar.type = 'button';
  botaoApagar.textContent = 'Apagar perfil';
  botaoApagar.addEventListener('click', apagarPerfil);

  ficha.append(titulo, lista, botaoApagar);
  resultadoPerfil.append(ficha);

  if (moverFoco) {
    titulo.focus();
  }
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

  formulario.querySelector('[type="submit"]').textContent = 'Atualizar perfil';
  mensagemStatus.textContent = 'Perfil salvo com sucesso.';
  criarFicha(dados);
});

const perfilSalvo = lerPerfilSalvo();

if (perfilSalvo) {
  preencherFormulario(perfilSalvo);
  formulario.querySelector('[type="submit"]').textContent = 'Atualizar perfil';
  criarFicha(perfilSalvo, false);
}
