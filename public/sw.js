const CACHE_NAME = 'portex-cache-v4';

const urlsToCache = [
  '/',
  '/calculator.html',
  '/manifest.json'
];

self.addEventListener('install', event => {
  // Force the new SW to activate immediately, don't wait
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', event => {
  // Delete ALL old caches so stale files are never served
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Network-first strategy: always try fresh from server
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache the fresh response for offline use
        if (response.ok && event.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
