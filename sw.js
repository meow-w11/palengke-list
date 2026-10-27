const CACHE = "palengke-v20";
const FILES = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png", "icon-maskable-192.png", "icon-maskable-512.png", "barcode-detector.js", "zxing_reader.wasm", "firebase-app-compat.js", "firebase-auth-compat.js", "firebase-firestore-compat.js"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== self.location.origin && !e.request.url.includes("fonts.g")) return;
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
    const copy = res.clone();
    if (res.ok || res.type === "opaque") caches.open(CACHE).then(c => c.put(e.request, copy));
    return res;
  }).catch(() => caches.match("index.html"))));
});
