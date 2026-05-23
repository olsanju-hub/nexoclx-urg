const CACHE_NAME = 'nexoclx-shell-v5';

const getScopedUrl = (path) => new URL(path, self.registration.scope).toString();

const APP_SHELL = [
  getScopedUrl('./'),
  getScopedUrl('./index.html'),
  getScopedUrl('./manifest.webmanifest'),
  getScopedUrl('./branding/app-icon-192.png'),
  getScopedUrl('./branding/app-icon-512.png'),
  getScopedUrl('./branding/apple-touch-icon.png'),
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
    ).then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  const requestUrl = new URL(request.url);

  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match(getScopedUrl('./'))),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response.ok) {
            const clonedResponse = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clonedResponse));
          }

          return response;
        })
        .catch(() => cachedResponse);

      return cachedResponse ?? networkFetch;
    }),
  );
});
