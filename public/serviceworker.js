const CACHE_NAME = "1000-hours-offline-cache-v1";
const urlsToCache = [
  "/", // Root
  "/assets/application.css", // Precompiled CSS (processed via the Rails asset pipeline)
  "/assets/application.js", // Precompiled JS (processed via the Rails asset pipeline)
  "/manifest.json", // Now in `public/`
  "/images/1000_hours_outdoors_tracker_icon_192x192.png", // Now in `public/images/`
  "/images/1000_hours_outdoors_tracker_icon_512x512.png" // Now in `public/images/`
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((error) => {
        console.error("Failed to cache resources:", error);
      });
    })
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only cache GET requests
  if (request.method === "GET") {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, networkResponse.clone());
              return networkResponse;
            });
          }
          return networkResponse;
        });
      })
    );
  }
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log(`Deleting old cache: ${key}`);
            return caches.delete(key);
          }
        })
      );
    })
  );
});
