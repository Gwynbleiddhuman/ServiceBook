const CACHE_NAME = 'autobook-cache-v4'; // Изменили на v2, чтобы телефон скачал новую версию!

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Кэш открыт, загружаем файлы');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // 1. Если файл есть в кэше (оффлайн режим) — отдаем его
      if (response) {
        return response;
      }
      
      // 2. Иначе пытаемся скачать из интернета
      return fetch(event.request).catch(() => {
        // 3. ЕСЛИ ИНТЕРНЕТА НЕТ: принудительно отдаем главную страницу, 
        // чтобы приложение не зависало на белом экране или логотипе
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
