importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js","https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");
firebase.initializeApp({apiKey:"AIzaSyCh-kdQmnpGckoYkKKHSD27ZFmcVhYjuXs",authDomain:"sunnah-daily-5c841.firebaseapp.com",projectId:"sunnah-daily-5c841",storageBucket:"sunnah-daily-5c841.firebasestorage.app",messagingSenderId:"1049259702323",appId:"1:1049259702323:web:1a543bb005453def2d4b46"});
firebase.messaging();
var C="sunnah-v2";
var F=["./","index.html","manifest.json","icon-192.png","icon-512.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(C).then(function(c){return c.addAll(F)}));self.skipWaiting()});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==C}).map(function(x){return caches.delete(x)}))}));self.clients.claim()});
self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET")return;
  e.respondWith(fetch(e.request).then(function(r){var c=r.clone();caches.open(C).then(function(x){x.put(e.request,c)});return r}).catch(function(){return caches.match(e.request)}));
});
