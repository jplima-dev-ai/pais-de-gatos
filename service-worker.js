const CACHE_NAME = 'pais-de-gatos-v2';
const CACHE_PREFIX = 'pais-de-gatos-';
const LOCAL_FILES = [
  './index.html', './perfil.html', './agenda.html', './calculadora.html', './quiz.html', './dicas.html', './diario.html', './dados.html',
  './styles.css', './manifest.webmanifest', './service-worker.js', './scripts/pwa.js',
  './scripts/perfil.js', './scripts/agenda.js', './scripts/calculadora.js', './scripts/quiz.js', './scripts/dicas.js', './scripts/diario.js', './scripts/dados.js',
  './assets/icons/pais-de-gatos.svg', './assets/icons/icon-192.png', './assets/icons/icon-512.png',
  './assets/images/hero/mae-com-gato.webp', './assets/images/stories/gato-no-colo.webp',
  './assets/images/cats/gato-preto-curioso.webp', './assets/images/cats/gato-laranja-brincando.webp', './assets/images/cats/gato-cinza-dormindo.webp'
];

self.addEventListener('install', (evento) => {
  evento.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(LOCAL_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(caches.keys().then((nomes) => Promise.all(nomes.filter((nome) => nome.startsWith(CACHE_PREFIX) && nome !== CACHE_NAME).map((nome) => caches.delete(nome)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (evento) => {
  if (evento.request.method !== 'GET' || new URL(evento.request.url).origin !== self.location.origin) return;
  const recursoPermitido = LOCAL_FILES.some((arquivo) => new URL(arquivo, self.location.href).href === evento.request.url);
  if (!recursoPermitido) return;
  if (evento.request.mode === 'navigate') {
    evento.respondWith(fetch(evento.request).then((rede) => { const copia = rede.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(evento.request, copia)); return rede; }).catch(() => caches.match(evento.request).then((resposta) => resposta || caches.match('./index.html'))));
    return;
  }
  evento.respondWith(caches.match(evento.request).then((resposta) => resposta || fetch(evento.request).then((rede) => { const copia = rede.clone(); caches.open(CACHE_NAME).then((cache) => cache.put(evento.request, copia)); return rede; })));
});
