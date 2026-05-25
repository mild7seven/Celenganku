// Ganti nama versi ini (misal ke v3) jika Anda melakukan perubahan pada index.html di masa depan
const CACHE_NAME = 'keuangan-cache-v2'; 
const urlsToCache = [
  './index.html',
  './manifest.json'
];

// Tahap Install: Memasukkan file ke dalam cache memori HP
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  // Memaksa service worker baru untuk langsung aktif tanpa menunggu
  self.skipWaiting(); 
});

// Tahap Activate: Membersihkan cache versi lama jika ada pembaruan versi
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // Hapus cache lama
          }
        })
      );
    })
  );
  // Mengambil kontrol penuh atas halaman yang sedang terbuka
  self.clients.claim(); 
});

// Tahap Fetch: Mengambil data. Jika offline, ambil dari cache. Jika online, tetap ambil dari cache agar cepat.
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Kembalikan file dari cache jika ada, jika tidak, download dari jaringan
        return response || fetch(event.request);
      })
  );
});
