// Simple PWA service worker for Les Traîtres
const CACHE_NAME = 'traitres-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/traitor_vote.html',
  '/announce_auto.html',
  '/announce_reveal_auto.html',
  '/announce_reveal_auto_medieval.html',
  '/traitor_vote_pretty.html',
  '/announce_pretty.html',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

// Cache-first fetch with network fallback
self.addEventListener('fetch', (event) => {
  const req = event.request;
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).catch(() => caches.match('/index.html')))
  );
});