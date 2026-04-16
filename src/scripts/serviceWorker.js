const cacheName = "vidPlayer-v3.1.0";

const filesToCache = [
    '/',
    '/index.html',
    '/devlog.txt',
    '/src/scripts/data.js',
    '/src/scripts/idb-keyval.js',
    '/src/styles/main.css',
    '/src/scripts/pro-player.js',
    '/src/scripts/main.js',
    '/src/scripts/bootstrap.bundle.min.js',
    '/src/styles/bootstrap-icons.min.css',
    '/src/styles/bootstrap.min.css',
    '/favicon.ico',
    '/version.json',
    '/README.md',
    '/src/scripts/serviceWorker.js',
    '/covers/imageBase64.js',
]

self.addEventListener("install", e => {
  console.log("[ServiceWorker] - Install");
  e.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    console.log("[ServiceWorker] - Caching app shell");
    await cache.addAll(filesToCache);
  })());
});

self.addEventListener("activate", e => {
  e.waitUntil((async () => {
    const keyList = await caches.keys();
    await Promise.all(
      keyList.map(key => {
        console.log(key);
        if (key !== cacheName) {
          console.log("[ServiceWorker] - Removing old cache", key);
          return caches.delete(key);
        }
      })
    );
  })());
  e.waitUntil(self.clients.claim());
});