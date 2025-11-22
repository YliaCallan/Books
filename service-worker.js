const CACHE_NAME = 'ylia-books-pwa-v1';
const urlsToCache = [
  './',  // Homepage
  './index.html',
  './manifest.json',
  './install-pwa.js',
  './pwa-icons/icon-192.png',
  './pwa-icons/icon-512.png',
  // Add book pages for offline (optional)
  './the-architecture-of-silence/',
  // './resonance-fields/',  // Uncomment as needed
];

self.addEventListener('install', event => {
  self.skipWaiting();  // Force immediate activation
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching files...');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('Cache addAll failed:', err))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request).catch(() => caches.match('./')))  // Fallback to homepage
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
