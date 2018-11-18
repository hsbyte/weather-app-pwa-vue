
/* service worker */
self.addEventListener('install', function(e) {
	console.log('service worker is installed.');
	e.waitUntil(
		/* manage your own cache */
		caches.open('static') // cache name: static
			.then(function(cache) {
				cache.addAll([
					'/',
					'/index.html',
					'/js/app.js',
					'/css/style.css',
					'https://fonts.googleapis.com/css?family=Roboto'
				]);
			})
	);
});

self.addEventListener('activate', function() {
	console.log('service worker is activated.');
});

self.addEventListener('fetch', function(e) {
	/* prevent the default, and handle the request ourselves. */
	e.respondWith(
		caches.match(e.request)
			.then(function(res) {
				if (res) {
					return res;
				} else {
					return fetch(e.request);
				}
			})
	);
});