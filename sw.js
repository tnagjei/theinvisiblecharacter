/**
 * Service Worker for The Invisible Character
 * Provides offline support and caching strategies
 */

const CACHE_NAME = 'tic-v1.3.0';
const urlsToCache = [
    '/',
    '/index-fr',
    '/tools',
    '/tiktok-invisible-username-generator',
    '/invisible-name-generator',
    '/blank-text-generator',
    '/discord-invisible-name-generator',
    '/whatsapp-blank-message-generator',
    '/fortnite-invisible-name-generator',
    '/instagram-invisible-character-generator',
    '/fr/caractere-invisible',
    '/fr/pseudo-invisible-tiktok',
    '/fr/message-vide-whatsapp',
    '/fr/saut-de-ligne-instagram',
    '/fr/pseudo-invisible-discord',
    '/assets/css/theme.css',
    '/assets/css/tailwind.css',
    '/assets/css/style.css',
    '/assets/css/mobile-optimization.css',
    '/assets/js/characters.js',
    '/assets/js/clipboard.js',
    '/assets/js/detector.js',
    '/assets/js/main.js',
    '/assets/js/mobile-optimization.js',
    '/assets/js/link-titles.js',
    '/assets/js/blank-text-generator.js',
    '/assets/css/blank-text-generator.css'
];

// Install event - cache resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                
                // Not in cache - fetch from network
                return fetch(event.request).then(
                    response => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone the response since it's a stream
                        const responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    }
                );
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Handle background sync for offline functionality
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync') {
        event.waitUntil(
            // Handle background sync operations
            Promise.resolve()
        );
    }
});

// Handle push notifications (if needed)
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/assets/icons/favicon.svg',
            badge: '/assets/icons/favicon.svg'
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Error handling
self.addEventListener('error', event => {
    console.error('Service Worker error:', event.error);
});
