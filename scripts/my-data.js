(() => {
  const VERSAO_BACKUP = 2;
  const CHAVES = ['paisDeGatos.cats', 'paisDeGatos.activeCat', 'paisDeGatos.careAgenda', 'paisDeGatos.catJournal', 'paisDeGatos.favorites'];
  const formularioArquivo = document.querySelector('#arquivo-dados');
  const exportar = document.querySelector('#exportar-dados');
  const resumo = document.querySelector('#resumo-importacao');
  const confirmar = document.querySelector('#confirmar-importacao');
  const mensagem = document.querySelector('#mensagem-dados');
  let backupPendente = null;
  const ler = () => Object.fromEntries(CHAVES.map((chave) => [chave, localStorage.getItem(chave)]));
  const nome = (chave) => ({ 'paisDeGatos.cats': 'Gatos', 'paisDeGatos.activeCat': 'Gato ativo', 'paisDeGatos.careAgenda': 'Agenda', 'paisDeGatos.catJournal': 'Diário', 'paisDeGatos.favorites': 'Dicas favoritas' }[chave]);
  function json(chave, valor) { try { return valor === null ? null : JSON.parse(valor); } catch (erro) { return undefined; } }
  function dataValida(valor) { if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false; const [a, m, d] = valor.split('-').map(Number); const dias = [31, (a % 4 === 0 && (a % 100 !== 0 || a % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; return m >= 1 && m <= 12 && d >= 1 && d <= dias[m - 1]; }
  function estruturaValida(backup) {
    if (!backup || backup.versao !== VERSAO_BACKUP || typeof backup.exportadoEm !== 'string' || Number.isNaN(Date.parse(backup.exportadoEm)) || !backup.dados || typeof backup.dados !== 'object') return false;
    if (CHAVES.some((chave) => !Object.prototype.hasOwnProperty.call(backup.dados, chave))) return false;
    const dados = Object.fromEntries(CHAVES.map((chave) => [chave, json(chave, backup.dados[chave])]));
    if (Object.values(dados).some((valor) => valor === undefined)) return false;
    const gatos = dados['paisDeGatos.cats']; const ids = new Set();
    if (!Array.isArray(gatos) || gatos.some((g) => !g || typeof g.id !== 'string' || !g.id || ids.has(g.id) || typeof g.nome !== 'string' || g.nome.trim().length < 2 || !Number.isInteger(g.idade) || g.idade < 0 || g.idade > 40 || typeof g.temperamento !== 'string' || typeof g.atividade !== 'string' || typeof g.apelido !== 'string')) return false;
    gatos.forEach((g) => ids.add(g.id));
    const ativo = dados['paisDeGatos.activeCat']; if (ativo !== null && (typeof ativo !== 'string' || !ids.has(ativo))) return false;
    const agenda = dados['paisDeGatos.careAgenda']; if (!Array.isArray(agenda) || agenda.some((t) => !t || typeof t.id !== 'string' || typeof t.catId !== 'string' || !ids.has(t.catId) || typeof t.titulo !== 'string' || !t.titulo.trim() || typeof t.data !== 'string' || !dataValida(t.data) || typeof t.concluida !== 'boolean')) return false;
    const diario = dados['paisDeGatos.catJournal']; if (!Array.isArray(diario) || diario.some((r) => !r || typeof r.id !== 'string' || typeof r.catId !== 'string' || !ids.has(r.catId) || !dataValida(r.data) || typeof r.observacao !== 'string' || r.observacao.length > 1000)) return false;
    const favoritos = dados['paisDeGatos.favorites']; if (!Array.isArray(favoritos) || favoritos.some((id) => typeof id !== 'string')) return false;
    return true;
  }
  function exportarDados() { try { const dados = ler(); const backup = { versao: VERSAO_BACKUP, exportadoEm: new Date().toISOString(), dados }; const arquivo = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(arquivo); const link = document.createElement('a'); link.href = url; link.download = `pais-de-gatos-backup-${backup.exportadoEm.slice(0, 10)}.json`; link.click(); URL.revokeObjectURL(url); mensagem.textContent = 'Backup exportado para este dispositivo.'; } catch (erro) { mensagem.textContent = 'Não foi possível exportar os dados neste navegador.'; } }
  function limparImportacao() { backupPendente = null; resumo.replaceChildren(); resumo.hidden = true; confirmar.hidden = true; }
  function selecionarArquivo() { limparImportacao(); const arquivo = formularioArquivo.files[0]; if (!arquivo) return; arquivo.text().then((texto) => { let backup; try { backup = JSON.parse(texto); } catch (erro) { mensagem.textContent = 'O arquivo não contém um JSON válido.'; formularioArquivo.focus(); return; } if (!estruturaValida(backup)) { mensagem.textContent = 'O backup é antigo, inválido ou inconsistente. Nenhum dado foi alterado.'; formularioArquivo.focus(); return; } backupPendente = backup; const titulo = document.createElement('h3'); titulo.textContent = 'Resumo do backup'; const lista = document.createElement('ul'); CHAVES.forEach((chave) => { const item = document.createElement('li'); const valor = json(chave, backup.dados[chave]); item.textContent = `${nome(chave)}: ${Array.isArray(valor) ? `${valor.length} item(ns)` : valor === null ? 'não definido' : 'definido'}`; lista.append(item); }); resumo.append(titulo, lista); resumo.hidden = false; confirmar.hidden = false; mensagem.textContent = 'Confira o resumo e confirme a restauração.'; confirmar.focus(); }).catch(() => { mensagem.textContent = 'Não foi possível ler o arquivo selecionado.'; formularioArquivo.focus(); }); }
  function restaurar() { if (!backupPendente) return; const atuais = ler(); try { CHAVES.forEach((chave) => { const valor = backupPendente.dados[chave]; if (valor === null) localStorage.removeItem(chave); else localStorage.setItem(chave, valor); }); limparImportacao(); mensagem.textContent = 'Dados restaurados com sucesso neste navegador.'; exportar.focus(); } catch (erro) { try { CHAVES.forEach((chave) => { if (atuais[chave] === null) localStorage.removeItem(chave); else localStorage.setItem(chave, atuais[chave]); }); } catch (rollback) {} mensagem.textContent = 'Não foi possível restaurar os dados. Os dados anteriores foram preservados.'; } }
  exportar.addEventListener('click', exportarDados); formularioArquivo.addEventListener('change', selecionarArquivo); confirmar.addEventListener('click', () => { if (window.confirm('Restaurar este backup substituirá os dados atuais. Deseja continuar?')) restaurar(); });
})();
