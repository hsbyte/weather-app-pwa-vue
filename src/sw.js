self.addEventListener("install",function(e){console.log("service worker is installed."),e.waitUntil(caches.open("static").then(function(e){e.addAll(["/","/index.html","/js/app.js","/css/style.css","https://fonts.googleapis.com/css?family=Roboto"])}))}),self.addEventListener("activate",function(){console.log("service worker is activated.")}),self.addEventListener("fetch",function(t){t.respondWith(caches.match(t.request).then(function(e){return e||fetch(t.request)}))});