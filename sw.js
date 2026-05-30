const CACHE_NAME = 'cucharon-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './app_icon.png',
  './chifle_salado.jpeg',
  './chifle_grande.jpeg',
  './chifle grande 02.jpeg',
  './chifle grande 03.jpeg',
  './chifle_dulce.jpeg',
  './chifles de ajo.jpeg',
  './chifles leche de tigre.jpeg',
  './chifles pollo a la brasa.jpeg',
  './chifles salado.jpeg',
  './cocoliche 2.jpeg',
  './mani_acaramelado.jpeg',
  './camote.jpeg',
  './arrocillo.jpeg',
  './orejas.jpeg',
  './chifle_con_carne_seca.jpeg',
  './chifles 3x10.jpeg',
  './qr.png'
];

// Instalar Service Worker y cachear recursos
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activar y limpiar cachés antiguos
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia de caché: Network First (Red primero, si falla usar caché)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).then((res) => {
      const resClone = res.clone();
      caches.open(CACHE_NAME).then((cache) => {
        if (e.request.method === 'GET' && e.request.url.startsWith(self.location.origin)) {
          cache.put(e.request, resClone);
        }
      });
      return res;
    }).catch(() => {
      return caches.match(e.request);
    })
  );
});
