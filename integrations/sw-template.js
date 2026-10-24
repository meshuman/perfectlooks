// KGF Unisex Saloon service worker. Generated from integrations/sw-template.js at build time;
// edit the template, not dist/sw.js.
const VERSION = '__VERSION__';
const PRECACHE = /* __PRECACHE__ */ [];
const CACHE = `pl-${VERSION}`;
// Pages the customer opened, kept for offline use. Trimmed to the newest MAX_PAGES.
const RUNTIME = 'pl-pages';
const MAX_PAGES = 80;
const OFFLINE = '/offline';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== RUNTIME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(page(request));
  } else if (url.pathname.startsWith('/_astro/')) {
    // File names include a content hash, so a stored copy is never out of date.
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(staleWhileRevalidate(request));
  }
});

/** Pages: always try the network for the latest version; fall back to a stored copy offline. */
async function page(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(RUNTIME);
      await cache.put(stripQuery(request.url), response.clone());
      trim(cache);
    }
    return response;
  } catch {
    const stored =
      (await caches.match(stripQuery(request.url), { cacheName: RUNTIME })) ??
      (await caches.match(stripQuery(request.url))) ??
      (await caches.match(OFFLINE));
    return stored ?? Response.error();
  }
}

async function cacheFirst(request) {
  const stored = await caches.match(request);
  if (stored) return stored;
  const response = await fetch(request);
  if (response.ok) (await caches.open(CACHE)).put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(request) {
  const stored = await caches.match(request);
  const fresh = fetch(request)
    .then(async (response) => {
      if (response.ok) (await caches.open(CACHE)).put(request, response.clone());
      return response;
    })
    .catch(() => stored);
  return stored ?? fresh;
}

/** "?from=/beards" doesn't change the page, so it isn't part of the stored key. */
function stripQuery(href) {
  const url = new URL(href);
  url.search = '';
  url.hash = '';
  return url.href;
}

async function trim(cache) {
  const keys = await cache.keys();
  for (const key of keys.slice(0, Math.max(0, keys.length - MAX_PAGES))) await cache.delete(key);
}
