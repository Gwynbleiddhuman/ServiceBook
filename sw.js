const CACHE_NAME = 'carbook-nuke-v2.1';

self.addEventListener('install', event => {
  self.skipWaiting(); // Принудительно убиваем старый Service Worker
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json'
      ]);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Удаляем старый кэш:', cacheName);
            return caches.delete(cacheName); // Выжигаем старые файлы
          }
        })
      );
    }).then(() => self.clients.claim()) // Мгновенно перехватываем контроль
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Если сеть есть, обновляем кэш на лету
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        return response;
      })
      .catch(() => caches.match(event.request)) // Если сети нет, берем из кэша
  );
});
