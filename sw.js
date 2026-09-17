// Delta Air Solutions — service worker
//
// ── CACHE-BUSTING ──────────────────────────────────────────────────────
// Bump CACHE_VERSION on every deploy that changes ANY cached file
// (index.html, manifest, icons, or this file itself). Browsers compare
// this file byte-for-byte against the previously installed copy; changing
// the string below is what makes that comparison fail and triggers the
// browser to fetch + install the new version. Keep this in sync with the
// "app-version" meta tag in index.html and version.json — same value in
// all three, bumped together, every deploy.
const CACHE_VERSION = 'delta-air-v61';
const PRECACHE_URLS = [
  './',
  './index.html',
  './shared.css',
  './solutions.html',
  './calculator.html',
  './calculator.webmanifest',
  './manifest.webmanifest',
  './favicon.ico',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  // cache.addAll() is atomic: a single 404, redirect or odd caching header
  // aborts the whole install, and a service worker that never installs means
  // the browser will not offer "Install app" at all. Cache each URL on its
  // own instead, so one bad asset can't block installability.
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      Promise.all(PRECACHE_URLS.map((url) =>
        cache.add(url).catch((err) => {
          console.warn('[sw] skipped precache:', url, err);
        })
      ))
    )
  );
  // Deliberately NOT calling skipWaiting() here. The new worker sits in
  // "waiting" until the page explicitly tells it to take over (see the
  // message handler below) — so an update never yanks the page out from
  // under someone mid-way through filling in the quote form. The page
  // shows a small "update available" banner and only reloads once the
  // person taps it.
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Lets the page force this waiting worker to activate immediately,
// once the person has confirmed they want the update.
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

// Network-first for the HTML document (so updates show up quickly),
// cache-first for everything else (icons, manifest).
// version.json is deliberately never cached here — the page fetches it with
// cache: 'no-store' specifically to detect deploys the SW itself hasn't
// noticed yet, so it always has to go to the network.
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.pathname.endsWith('/version.json')) {
    event.respondWith(fetch(request));
    return;
  }

  const isHTML = request.mode === 'navigate' ||
    (request.headers.get('accept') || '').includes('text/html');

  if (isHTML) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then((cached) =>
          // start_url is "/", so fall back to that first — Chrome checks the
          // worker can serve start_url offline before offering installation.
          cached || caches.match('/') || caches.match('/index.html')
        ))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
