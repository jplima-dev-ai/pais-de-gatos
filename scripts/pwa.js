(() => {
  function removerDadosLegados() {
    try {
      const prefixoLegado = ['maes', 'De', 'Gatos', '.'].join('');
      const prefixoAtual = ['pais', 'De', 'Gatos', '.'].join('');
      const chavesLegadas = ['perfil', 'agendaCuidados', 'dicasFavoritas', 'diario'].map((nome) => `${prefixoAtual}${nome}`);
      for (let indice = localStorage.length - 1; indice >= 0; indice -= 1) {
        const chave = localStorage.key(indice);
        if (chave && (chave.startsWith(prefixoLegado) || chavesLegadas.includes(chave))) localStorage.removeItem(chave);
      }
    } catch (erro) {
      // O navegador pode bloquear o acesso ao armazenamento.
    }
  }

  removerDadosLegados();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./service-worker.js', { updateViaCache: 'none' }).catch(() => {});
    });
  }
})();
