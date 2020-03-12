var CACHE_VERSION = 'v1';

this.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_VERSION).then(function (cache) {
            return cache.addAll([
                'style.css',
                'font.css',
                'main.js'
            ]).catch(function (error) {
                console.error('Error in install handler:', error);
            });
        })
    );
});