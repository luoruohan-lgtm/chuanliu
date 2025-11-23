// Minimal Service Worker to allow PWA installation
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  // Just pass through requests to the network
  e.respondWith(fetch(e.request));
});