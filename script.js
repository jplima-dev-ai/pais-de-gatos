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

function criarItemFicha(rotulo, valor) {
  const item = document.createElement('div');
  const titulo = document.createElement('dt');
  const conteudo = document.createElement('dd');

  titulo.textContent = rotulo;
  conteudo.textContent = valor;
  item.append(titulo, conteudo);

  return item;
}

function criarFicha(dados) {
  resultadoPerfil.replaceChildren();

  const ficha = document.createElement('article');
  const titulo = document.createElement('h3');
  const lista = document.createElement('dl');

  ficha.className = 'ficha-gato';
  titulo.tabIndex = -1;
  titulo.textContent = `Perfil de ${dados.nome}`;

  lista.append(
    criarItemFicha('Idade', `${dados.idade} ${dados.idade === '1' ? 'ano' : 'anos'}`),
    criarItemFicha('Temperamento', dados.temperamento),
    criarItemFicha('Atividade favorita', dados.atividade),
  );

  if (dados.apelido) {
    lista.append(criarItemFicha('Apelido', dados.apelido));
  }

  ficha.append(titulo, lista);
  resultadoPerfil.append(ficha);
  titulo.focus();
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

  const dados = {
    nome: campos.nome.value.trim(),
    idade: campos.idade.value.trim(),
    temperamento: campos.temperamento.value,
    atividade: campos.atividade.value,
    apelido: campos.apelido.value.trim(),
  };

  mensagemStatus.textContent = 'Perfil criado com sucesso.';
  criarFicha(dados);
});
