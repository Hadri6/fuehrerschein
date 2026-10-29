'use strict';
const CACHE_NAME = 'theorie-b-shell-v3';
const SHELL = ['./', './index.html', './styles.css', './data.js', './notes.js', './app.js', './manifest.webmanifest', './icon.svg'];
const shellPaths = new Set(SHELL.map(path => new URL(path, self.location).pathname));

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('theorie-b-shell-') && key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (!shellPaths.has(url.pathname) && request.mode !== 'navigate') return;
  // Network-first so content fixes reach the phone; the cache is the offline fallback.
  event.respondWith(caches.open(CACHE_NAME).then(async cache => {
    try {
      const response = await fetch(request, { cache: 'no-cache' });
      if (response.ok && shellPaths.has(url.pathname)) await cache.put(request, response.clone());
      return response;
    } catch (error) {
      const cached = await cache.match(request, { ignoreSearch: true });
      if (cached) return cached;
      if (request.mode === 'navigate') {
        const fallback = await cache.match('./index.html');
        if (fallback) return fallback;
      }
      throw error;
    }
  }));
});
