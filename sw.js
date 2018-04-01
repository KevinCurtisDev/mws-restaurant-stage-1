let CACHE_NAME = 'mws-restaurant';

self.addEventListener('install', (event) => {
    
    const urlsToCache = [
    '/',
    './css/styles.css',
    './data/restaurants.json',
    './js/main.js',
    './js/dbhelper.js',
    './js/restaurant_info.js',
    './index.html',
    './restaurant.html',
    './img/1_small.jpg',
    './img/2_small.jpg',  
    './img/3_small.jpg',
    './img/4_small.jpg',
    './img/5_small.jpg',
    './img/6_small.jpg',
    './img/7_small.jpg',
    './img/8_small.jpg',
    './img/9_small.jpg',
    './img/10_small.jpg'
  ];

  self.addEventListener('install', (event) => {
    // Perform install steps
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
          return cache.addAll(urlsToCache);
        })
    );
  });
});



self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        let fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          (response) => {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            let responseToCache = response.clone();

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


self.addEventListener('activate', (event) => {

  let cacheWhitelist = ['mws-restaurant'];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
