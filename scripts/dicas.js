(() => {
const dicas = [
  { id: 'agua-fresca', titulo: 'Água fresca pela casa', texto: 'Mantenha água limpa e fresca disponível em um local tranquilo.', categoria: 'alimentação' },
  { id: 'rotina-refeicoes', titulo: 'Uma rotina para as refeições', texto: 'Ofereça a alimentação em horários previsíveis, respeitando as orientações específicas para o seu gato.', categoria: 'alimentação' },
  { id: 'potes-limpos', titulo: 'Potes sempre limpos', texto: 'Lave os potes regularmente e observe se o material e o tamanho são confortáveis para o gato.', categoria: 'alimentação' },
  { id: 'caixa-limpa', titulo: 'Caixa de areia limpa', texto: 'Retire os resíduos com frequência e mantenha a caixa em um local tranquilo e acessível.', categoria: 'higiene' },
  { id: 'escovacao-suave', titulo: 'Escovação com calma', texto: 'Faça sessões curtas e suaves, respeitando os sinais de conforto do gato.', categoria: 'higiene' },
  { id: 'unhas-sem-pressa', titulo: 'Unhas sem pressa', texto: 'Se precisar cortar as unhas, faça isso aos poucos e procure orientação profissional quando houver dúvida.', categoria: 'higiene' },
  { id: 'observacao-diaria', titulo: 'Observe pequenas mudanças', texto: 'Perceba alterações no apetite, na disposição, no comportamento ou nos hábitos do gato.', categoria: 'saúde' },
  { id: 'consulta-preventiva', titulo: 'Acompanhamento veterinário', texto: 'Mantenha consultas de acompanhamento conforme a recomendação do médico-veterinário.', categoria: 'saúde' },
  { id: 'medicamento-orientado', titulo: 'Medicamento só com orientação', texto: 'Não ofereça medicamentos por conta própria e siga corretamente as orientações recebidas.', categoria: 'saúde' },
  { id: 'brincadeira-diaria', titulo: 'Um tempo para brincar', texto: 'Reserve alguns minutos para brincadeiras adequadas ao ritmo e à idade do seu gato.', categoria: 'brincadeira' },
  { id: 'brinquedos-variados', titulo: 'Varie os brinquedos', texto: 'Alterne brinquedos seguros para manter a curiosidade e evitar que a brincadeira fique repetitiva.', categoria: 'brincadeira' },
  { id: 'cantinho-seguro', titulo: 'Um cantinho seguro', texto: 'Ofereça um espaço confortável onde o gato possa descansar e se afastar quando quiser.', categoria: 'bem-estar' },
];
const CHAVE_DICAS_FAVORITAS = 'maesDeGatos.dicasFavoritas';
const mensagemDicas = document.querySelector('#mensagem-dicas');
const estadoVazioDicas = document.querySelector('#estado-vazio-dicas');
const listaDicas = document.querySelector('#lista-dicas');
const filtroFavoritas = document.querySelector('#filtro-favoritas');
const filtrosDicas = document.querySelectorAll('.filtro-dica');
let filtroDicasAtual = 'todas';
let favoritosDicas = new Set();
function salvarFavoritosDicas() { try { localStorage.setItem(CHAVE_DICAS_FAVORITAS, JSON.stringify([...favoritosDicas])); return true; } catch (erro) { return false; } }
function carregarFavoritosDicas() { try { const valorSalvo = localStorage.getItem(CHAVE_DICAS_FAVORITAS); if (!valorSalvo) return; const dados = JSON.parse(valorSalvo); if (!Array.isArray(dados)) { localStorage.removeItem(CHAVE_DICAS_FAVORITAS); mensagemDicas.textContent = 'Os favoritos salvos eram inválidos e foram removidos.'; return; } const idsValidos = new Set(dicas.map((dica) => dica.id)); const favoritosValidos = dados.filter((id) => typeof id === 'string' && idsValidos.has(id)); favoritosDicas = new Set(favoritosValidos); if (favoritosValidos.length !== dados.length) { salvarFavoritosDicas(); mensagemDicas.textContent = 'Alguns favoritos inválidos foram descartados.'; } } catch (erro) { try { localStorage.removeItem(CHAVE_DICAS_FAVORITAS); } catch (erroAoLimpar) {} mensagemDicas.textContent = 'Os favoritos salvos estavam corrompidos e foram removidos.'; } }
function dicasFiltradas() { if (filtroDicasAtual === 'favoritas') return dicas.filter((dica) => favoritosDicas.has(dica.id)); if (filtroDicasAtual === 'todas') return dicas; return dicas.filter((dica) => dica.categoria === filtroDicasAtual); }
function criarCardDica(dica) { const item = document.createElement('li'); const card = document.createElement('article'); const categoria = document.createElement('p'); const titulo = document.createElement('h3'); const texto = document.createElement('p'); const favorito = favoritosDicas.has(dica.id); const botao = document.createElement('button'); card.className = 'dica-card'; categoria.className = 'dica-categoria'; categoria.textContent = dica.categoria; titulo.textContent = dica.titulo; texto.textContent = dica.texto; botao.className = 'botao-favorito'; botao.type = 'button'; botao.dataset.dicaId = dica.id; botao.setAttribute('aria-pressed', String(favorito)); botao.textContent = favorito ? `Remover “${dica.titulo}” dos favoritos` : `Adicionar “${dica.titulo}” aos favoritos`; card.append(categoria, titulo, texto, botao); item.append(card); return item; }
function atualizarEstadoVazioDicas(lista) { estadoVazioDicas.textContent = lista.length > 0 ? '' : (filtroDicasAtual === 'favoritas' ? 'Você ainda não adicionou nenhuma dica aos favoritos.' : 'Não encontramos dicas nesta categoria.'); }
function renderizarDicas() { const lista = dicasFiltradas(); listaDicas.replaceChildren(...lista.map(criarCardDica)); atualizarEstadoVazioDicas(lista); }
function atualizarFiltroDicas(filtroSelecionado) { filtroDicasAtual = filtroSelecionado.dataset.filtroDica; filtrosDicas.forEach((filtro) => { const ativo = filtro === filtroSelecionado; filtro.classList.toggle('ativo', ativo); filtro.setAttribute('aria-pressed', String(ativo)); }); renderizarDicas(); mensagemDicas.textContent = `Filtro ${filtroSelecionado.textContent.toLowerCase()} aplicado.`; }
listaDicas.addEventListener('click', (evento) => { const botao = evento.target.closest('.botao-favorito'); if (!botao) return; const dica = dicas.find((item) => item.id === botao.dataset.dicaId); const eraFavorita = favoritosDicas.has(dica.id); if (eraFavorita) favoritosDicas.delete(dica.id); else favoritosDicas.add(dica.id); if (!salvarFavoritosDicas()) { if (eraFavorita) favoritosDicas.add(dica.id); else favoritosDicas.delete(dica.id); mensagemDicas.textContent = 'Não foi possível atualizar os favoritos neste navegador.'; return; } renderizarDicas(); if (filtroDicasAtual === 'favoritas' && eraFavorita) { filtroFavoritas.setAttribute('aria-pressed', 'true'); filtroFavoritas.focus(); mensagemDicas.textContent = 'Dica removida dos favoritos.'; return; } if (filtroDicasAtual !== 'favoritas') { const novoBotao = listaDicas.querySelector('button[data-dica-id="' + dica.id + '"]'); if (novoBotao) novoBotao.focus(); } mensagemDicas.textContent = eraFavorita ? 'Dica removida dos favoritos.' : 'Dica adicionada aos favoritos.'; });
filtrosDicas.forEach((filtro) => { filtro.addEventListener('click', () => atualizarFiltroDicas(filtro)); });
carregarFavoritosDicas(); renderizarDicas();
})();

