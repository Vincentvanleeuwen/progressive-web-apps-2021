var CACHE_NAME = 'combinify-cache-v1';
var urlsToCache = [
  '/',
  '/css/index.css',
  '/js/bundle.min.js'
];
const OFFLINE_URL = '../offline.html';

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(function(cache) {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {

  var cacheAllowlist = ['combinify-cache-v1'];

  event.waitUntil((async () => {

    if ('navigationPreload' in self.registration) {
      await self.registration.navigationPreload.enable();
    }

    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheAllowlist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  }));

  // Tell the active service worker to take control of the page immediately.
  self.clients.claim();

});


self.addEventListener('fetch', function(event) {
  if (!(event.request.url.indexOf('http') === 0)) return; // skip the request. if request is not made with http protocol
  event.respondWith(
    caches.match(event.request)
    .then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }

      return fetch(event.request).then(
        (response) => {
          // Check if we received a valid response
          if(!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // IMPORTANT: Clone the response. A response is a stream
          // and because we want the browser to consume the response
          // as well as the cache consuming the response, we need
          // to clone it so we have two streams.
          var responseToCache = response.clone();

          caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        }
      );
    })
  );
});

