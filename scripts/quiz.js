(() => {
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

})();

