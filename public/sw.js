var CACHE_NAME = 'combinify-cache-v2';
var urlsToCache = [
  '/',
  '/home',
  '/create',
  '/css/index.css',
  '/js/bundle.min.js'
];
const OFFLINE_URL = '../offline.html';

// Install the service worker
self.addEventListener('install', event => {

  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache => {
      console.log('Service Worker: Caching Files')
      return cache.addAll(urlsToCache)
    }).then(() => self.skipWaiting())
  );

});

self.addEventListener('activate', event => {
  
  // Tell the active service worker to take control of the page immediately.
  self.clients.claim();

  event.waitUntil(
    // Check for old caches, delete if old.
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .map(cacheName => {
            if(cacheName !== CACHE_NAME) return caches.delete(cacheName)
          })
      );
    })
  )

});


self.addEventListener('fetch', event =>{

  // skip the request. if request is not made with http protocol
  if (event.request.method !== 'GET') return event.respondWith(fetch(event.request));

  event.respondWith(
    caches.match(event.request)
    .then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }

      return fetch(event.request)
              .then(
                response => {
                  // Check if we received a valid response
                  if(!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                  }

                  // Clone the response
                  var responseToCache = response.clone();

                  // Cache the page
                  caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(event.request, responseToCache);
                  });

                  return response;
                }
              )
            })
  );
});

