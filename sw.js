// input: Existing browser registrations and caches created by earlier site releases.
// output: Deletes tic-* caches and unregisters this retired Service Worker.
// pos: One-release retirement worker（更新规则：确认线上注销后从构建清单移除本文件）。

self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil((async () => {
        const cacheNames = await caches.keys();
        await Promise.all(
            cacheNames
                .filter(cacheName => cacheName.startsWith('tic-'))
                .map(cacheName => caches.delete(cacheName))
        );
        await self.registration.unregister();
        await self.clients.claim();
    })());
});
