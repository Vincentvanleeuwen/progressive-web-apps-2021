var CACHE_NAME = 'combinify-cache-v3';

// Install the service worker
self.addEventListener('install', event => {

  console.log('Installed Service Worker')

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

  // Cache each page upon visiting
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

