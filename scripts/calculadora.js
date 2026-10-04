(() => {
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

})();

