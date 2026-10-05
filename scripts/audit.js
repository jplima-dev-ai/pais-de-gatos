const fs = require('fs');
const path = require('path');

const raiz = path.resolve(__dirname, '..');
const paginasEsperadas = ['index.html', 'profile.html', 'care-agenda.html', 'cat-age-calculator.html', 'quiz.html', 'tips.html', 'cat-journal.html', 'my-data.html'];
const paginas = fs.readdirSync(raiz).filter((arquivo) => arquivo.endsWith('.html')).sort();
const erros = [];

function ler(caminho) { return fs.readFileSync(path.join(raiz, caminho), 'utf8'); }
function existeRelativo(referencia) { return fs.existsSync(path.join(raiz, referencia.replace(/^\.\//, '').split('#')[0])); }
function atributos(html, nome) { return [...html.matchAll(new RegExp(`${nome}=["']([^"']+)["']`, 'gi'))].map((match) => match[1]); }
function relatorio(mensagem) { console.log(`- ${mensagem}`); }

console.log('Auditoria automática do projeto Pais de Gatos');
console.log(`Páginas encontradas: ${paginas.length}`);

for (const esperada of paginasEsperadas) {
  if (!fs.existsSync(path.join(raiz, esperada))) erros.push(`arquivo HTML esperado ausente: ${esperada}`);
}

for (const pagina of paginas) {
  const html = ler(pagina);
  const ids = atributos(html, 'id');
  const idsDuplicados = ids.filter((id, indice) => ids.indexOf(id) !== indice);
  if ((html.match(/<main\b/gi) || []).length !== 1) erros.push(`${pagina}: deve possuir exatamente um <main>`);
  if ((html.match(/<h1\b/gi) || []).length !== 1) erros.push(`${pagina}: deve possuir exatamente um <h1>`);
  if (!/<html\b[^>]*lang=["']pt-BR["']/i.test(html)) erros.push(`${pagina}: falta lang="pt-BR"`);
  if (!/<title\b[^>]*>[^<]+<\/title>/i.test(html)) erros.push(`${pagina}: falta <title>`);
  if (!/<meta\b[^>]*name=["']description["'][^>]*content=["'][^"']+["']/i.test(html)) erros.push(`${pagina}: falta meta description`);
  if (idsDuplicados.length) erros.push(`${pagina}: IDs duplicados: ${[...new Set(idsDuplicados)].join(', ')}`);
  if (/script\.js/i.test(html)) erros.push(`${pagina}: referência ao antigo script.js`);
  if ((html.match(/aria-current=["']page["']/gi) || []).length > 1) erros.push(`${pagina}: mais de um aria-current="page"`);

  for (const href of atributos(html, 'href')) {
    if (href.startsWith('#')) {
      const id = href.slice(1);
      if (!ids.includes(id)) erros.push(`${pagina}: anchor #${id} aponta para ID inexistente`);
    } else if (!/^(https?:|mailto:|tel:|data:|javascript:)/i.test(href) && !existeRelativo(href)) {
      erros.push(`${pagina}: link local inexistente: ${href}`);
    }
  }
  for (const src of atributos(html, 'src')) {
    if (!/^(https?:|data:)/i.test(src) && !existeRelativo(src)) erros.push(`${pagina}: recurso local inexistente: ${src}`);
  }
  for (const src of atributos(html, 'src')) {
    if (/\.js(?:\?|#|$)/i.test(src) && !existeRelativo(src)) erros.push(`${pagina}: script local inexistente: ${src}`);
  }
  for (const href of atributos(html, 'href')) {
    if (/\.css(?:\?|#|$)/i.test(href) && !existeRelativo(href)) erros.push(`${pagina}: folha CSS inexistente: ${href}`);
  }
  for (const src of atributos(html, 'src')) {
    if (/\.(?:png|jpe?g|webp|svg|gif)(?:\?|#|$)/i.test(src) && !existeRelativo(src)) erros.push(`${pagina}: imagem local inexistente: ${src}`);
  }
}

const paginasSet = new Set(paginasEsperadas);
for (const pagina of paginas) {
  const html = ler(pagina);
  for (const href of atributos(html, 'href')) {
    const correspondencia = href.match(/^(index|profile|care-agenda|cat-age-calculator|quiz|tips|cat-journal|my-data)\.html$/);
    if (correspondencia && !paginasSet.has(`${correspondencia[1]}.html`)) erros.push(`${pagina}: link de navegação sem página correspondente: ${href}`);
  }
}

const manifestPath = path.join(raiz, 'manifest.webmanifest');
if (!fs.existsSync(manifestPath)) erros.push('manifest.webmanifest ausente');
else {
  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    for (const icone of manifest.icons || []) if (!existeRelativo(icone.src)) erros.push(`ícone citado no manifest inexistente: ${icone.src}`);
  } catch (erro) { erros.push('manifest.webmanifest não contém JSON válido'); }
}
for (const recurso of ['service-worker.js', 'scripts/pwa.js', 'my-data.html', 'scripts/my-data.js']) if (!fs.existsSync(path.join(raiz, recurso))) erros.push(`recurso PWA ou Meus dados ausente: ${recurso}`);

const serviceWorker = fs.existsSync(path.join(raiz, 'service-worker.js')) ? ler('service-worker.js') : '';
for (const recurso of serviceWorker.matchAll(/['"](\.\/[^'"]+)['"]/g)) if (!existeRelativo(recurso[1])) erros.push(`arquivo listado no service worker inexistente: ${recurso[1]}`);

if (erros.length) {
  console.log('\nProblemas encontrados:');
  erros.forEach(relatorio);
  console.log(`\nResultado: falhou com ${erros.length} problema(s).`);
  process.exitCode = 1;
} else {
  console.log('\nResultado: tudo correto nas verificações automáticas.');
  process.exitCode = 0;
}
