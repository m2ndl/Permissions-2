const CACHE_NAME = 'permission-tracker-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/assets/css/style.css',
  '/assets/js/app.js',
  '/assets/js/calendar.js',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png',
  '/manifest.json'
];

// Install event: cache all the assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Fetch event: serve assets from cache if available
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Not in cache - fetch from network
        return fetch(event.request);
      })
  );
});
