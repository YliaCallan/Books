const CACHE_NAME = 'ylia-callan-books-v1';
const urlsToCache = [
  '/books/',
  '/books/index.html',
  '/books/manifest.json',
  '/books/assets/pwa-icons/icon-192.png',
  '/books/assets/pwa-icons/icon-512.png'
  // Add your main book pages here if you want full offline:
  // '/books/the-architecture-of-silence/',
  // '/books/resonance-fields/',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});