self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('chatbot-cache').then(cache => {
      return cache.addAll([
        './index.html',
        './script.js',
        './botdata.js',
        './manifest.json',
        './icon-192.png',
        './icon-512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respond