(() => {
  const VERSAO_BACKUP = 1;
  const CHAVES = ['paisDeGatos.cats', 'paisDeGatos.careAgenda', 'paisDeGatos.favorites', 'paisDeGatos.catJournal'];
  const TEMPERAMENTOS = ['Carinhoso', 'Brincalhão', 'Tranquilo', 'Curioso', 'Independente'];
  const ATIVIDADES = ['Dormir', 'Brincar', 'Explorar a casa', 'Observar a janela', 'Ganhar carinho'];
  const CATEGORIAS_AGENDA = ['alimentação', 'higiene', 'saúde', 'brincadeira', 'outros'];
  const IDS_DICAS = ['agua-fresca', 'rotina-refeicoes', 'potes-limpos', 'caixa-limpa', 'escovacao-suave', 'unhas-sem-pressa', 'observacao-diaria', 'consulta-preventiva', 'medicamento-orientado', 'brincadeira-diaria', 'brinquedos-variados', 'cantinho-seguro'];
  const CATEGORIAS_DIARIO = ['Rotina', 'Saúde', 'Alimentação', 'Comportamento', 'Medicação', 'Veterinário', 'Momento especial'];
  const HUMORES_DIARIO = ['Tranquilo', 'Carinhoso', 'Brincalhão', 'Curioso', 'Assustado', 'Irritado', 'Mais quieto que o normal'];
  const ENERGIAS_DIARIO = ['Baixa', 'Normal', 'Alta'];
  const ALIMENTACOES_DIARIO = ['Comeu normalmente', 'Comeu menos que o normal', 'Comeu mais que o normal', 'Não comeu', 'Não observado'];
  const CAIXAS_DIARIO = ['Normal', 'Diferente do habitual', 'Não usou', 'Não observado'];
  const formularioArquivo = document.querySelector('#arquivo-dados');
  const exportar = document.querySelector('#exportar-dados');
  const resumo = document.querySelector('#resumo-importacao');
  const confirmar = document.querySelector('#confirmar-importacao');
  const mensagem = document.querySelector('#mensagem-dados');
  let backupPendente = null;

  function lerDadosAtuais() {
    const dados = {};
    CHAVES.forEach((chave) => { dados[chave] = localStorage.getItem(chave); });
    return dados;
  }

  function nomeDaChave(chave) {
    return { 'paisDeGatos.cats': 'Perfil', 'paisDeGatos.careAgenda': 'Agenda', 'paisDeGatos.favorites': 'Dicas favoritas', 'paisDeGatos.catJournal': 'Diário' }[chave];
  }

  function dataExportacao() { return new Date().toISOString(); }

  function exportarDados() {
    try {
      const backup = { versao: VERSAO_BACKUP, exportadoEm: dataExportacao(), dados: lerDadosAtuais() };
      const arquivo = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(arquivo);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pais-de-gatos-backup-${dataExportacao().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      mensagem.textContent = 'Backup exportado para este dispositivo.';
    } catch (erro) {
      mensagem.textContent = 'Não foi possível exportar os dados neste navegador.';
    }
  }

  function jsonSeguro(valor) { return valor === null || typeof valor === 'string' || typeof valor === 'number' || typeof valor === 'boolean' || Array.isArray(valor) || (typeof valor === 'object' && valor !== null); }
  function dataValida(data) {
    if (data === '') return true;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;
    const [ano, mes, dia] = data.split('-').map(Number);
    const verificada = new Date(Date.UTC(ano, mes - 1, dia));
    return verificada.getUTCFullYear() === ano && verificada.getUTCMonth() === mes - 1 && verificada.getUTCDate() === dia;
  }

  function dataDiarioValida(data) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;
    const [ano, mes, dia] = data.split('-').map(Number);
    const verificada = new Date(Date.UTC(ano, mes - 1, dia));
    const hoje = new Date();
    const hojeNumero = hoje.getFullYear() * 10000 + (hoje.getMonth() + 1) * 100 + hoje.getDate();
    return verificada.getUTCFullYear() === ano && verificada.getUTCMonth() === mes - 1 && verificada.getUTCDate() === dia && ano * 10000 + mes * 100 + dia <= hojeNumero;
  }

  function conteudoValido(chave, valor) {
    if (valor === null) return true;
    if (chave === 'paisDeGatos.cats') return typeof valor === 'object' && !Array.isArray(valor) && typeof valor.nome === 'string' && valor.nome.trim().length >= 2 && Number.isInteger(valor.idade) && valor.idade >= 0 && valor.idade <= 40 && TEMPERAMENTOS.includes(valor.temperamento) && ATIVIDADES.includes(valor.atividade) && typeof valor.apelido === 'string' && valor.apelido.length <= 40;
    if (chave === 'paisDeGatos.careAgenda') { const ids = new Set(); return Array.isArray(valor) && valor.every((item) => item && typeof item === 'object' && typeof item.id === 'string' && item.id && !ids.has(item.id) && (ids.add(item.id), true) && typeof item.titulo === 'string' && item.titulo.trim().length > 0 && item.titulo.length <= 100 && typeof item.data === 'string' && dataValida(item.data) && CATEGORIAS_AGENDA.includes(item.categoria) && typeof item.concluida === 'boolean'); }
    if (chave === 'paisDeGatos.favorites') return Array.isArray(valor) && new Set(valor).size === valor.length && valor.every((item) => IDS_DICAS.includes(item));
    if (chave === 'paisDeGatos.catJournal') { const ids = new Set(); return Array.isArray(valor) && valor.every((item) => item && typeof item === 'object' && typeof item.id === 'string' && item.id && !ids.has(item.id) && (ids.add(item.id), true) && dataDiarioValida(item.data) && CATEGORIAS_DIARIO.includes(item.categoria) && HUMORES_DIARIO.includes(item.humor) && ENERGIAS_DIARIO.includes(item.energia) && ALIMENTACOES_DIARIO.includes(item.alimentacao) && CAIXAS_DIARIO.includes(item.caixaAreia) && typeof item.observacao === 'string' && item.observacao.length <= 1000); }
    return false;
  }

  function estruturaValida(backup) {
    if (!backup || typeof backup !== 'object' || backup.versao !== VERSAO_BACKUP || typeof backup.exportadoEm !== 'string' || Number.isNaN(Date.parse(backup.exportadoEm)) || !backup.dados || typeof backup.dados !== 'object' || Array.isArray(backup.dados)) return false;
    if (!CHAVES.every((chave) => Object.prototype.hasOwnProperty.call(backup.dados, chave))) return false;
    if (!CHAVES.every((chave) => backup.dados[chave] === null || typeof backup.dados[chave] === 'string')) return false;
    return CHAVES.every((chave) => backup.dados[chave] === null || (() => { try { const valor = JSON.parse(backup.dados[chave]); return jsonSeguro(valor) && conteudoValido(chave, valor); } catch (erro) { return false; } })());
  }

  function resumoDoBackup(backup) {
    resumo.replaceChildren();
    const titulo = document.createElement('h3');
    titulo.textContent = 'Resumo do backup';
    const lista = document.createElement('ul');
    CHAVES.forEach((chave) => { const item = document.createElement('li'); let quantidade = 'sem dados'; if (backup.dados[chave]) { try { const valor = JSON.parse(backup.dados[chave]); quantidade = Array.isArray(valor) ? `${valor.length} registro(s)` : '1 conjunto de dados'; } catch (erro) {} } item.textContent = `${nomeDaChave(chave)}: ${quantidade}`; lista.append(item); });
    const dataTexto = document.createElement('p');
    dataTexto.textContent = `Exportado em: ${new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(backup.exportadoEm))}`;
    resumo.append(titulo, lista, dataTexto);
    resumo.hidden = false;
  }

  function limparImportacao() { backupPendente = null; resumo.replaceChildren(); resumo.hidden = true; confirmar.hidden = true; }
  function selecionarArquivo() { limparImportacao(); const arquivo = formularioArquivo.files[0]; if (!arquivo) return; arquivo.text().then((texto) => { let backup; try { backup = JSON.parse(texto); } catch (erro) { mensagem.textContent = 'O arquivo não contém um JSON válido.'; formularioArquivo.focus(); return; } if (!estruturaValida(backup)) { mensagem.textContent = 'O arquivo não tem um formato de backup válido.'; formularioArquivo.focus(); return; } backupPendente = backup; resumoDoBackup(backup); confirmar.hidden = false; mensagem.textContent = 'Confira o resumo e confirme a restauração.'; confirmar.focus(); }).catch(() => { mensagem.textContent = 'Não foi possível ler o arquivo selecionado.'; formularioArquivo.focus(); }); }
  function restaurarDados() { if (!backupPendente) return; const atuais = lerDadosAtuais(); try { CHAVES.forEach((chave) => { const valor = backupPendente.dados[chave]; if (valor === null) localStorage.removeItem(chave); else localStorage.setItem(chave, valor); }); limparImportacao(); mensagem.textContent = 'Dados restaurados com sucesso neste navegador.'; exportar.focus(); } catch (erro) { try { CHAVES.forEach((chave) => { const valor = atuais[chave]; if (valor === null) localStorage.removeItem(chave); else localStorage.setItem(chave, valor); }); } catch (erroRollback) {} mensagem.textContent = 'Não foi possível restaurar os dados. Os dados anteriores foram preservados.'; } }
  exportar.addEventListener('click', exportarDados);
  formularioArquivo.addEventListener('change', selecionarArquivo);
  confirmar.addEventListener('click', () => { if (window.confirm('Restaurar este backup substituirá os dados atuais destas ferramentas. Deseja continuar?')) restaurarDados(); });
})();
