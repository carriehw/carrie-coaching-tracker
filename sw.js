const C='coaching-v22';
const A=['./','./index.html','./manifest.webmanifest','./icon.svg','./coaching-v10.css?v=14','./polish-v13.css?v=13','./coaching-v15.css?v=1','./form-controls-v19.css?v=1','./appointment-v20.css?v=1','./final-v22.css?v=1','./coaching-v10.js?v=14','./coaching-v15-addon.js?v=2','./appointment-v20.js?v=1','./scroll-reset-v21.js?v=1','./final-v22.js?v=1'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(A)))});
self.addEventListener('activate',e=>e.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==C).map(k=>caches.delete(k)))),self.clients.claim()])));
self.addEventListener('fetch',e=>{
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{const x=r.clone();caches.open(C).then(c=>c.put('./index.html',x));return r}).catch(()=>caches.match('./index.html')))
  }else{
    e.respondWith(fetch(e.request).then(r=>{const x=r.clone();caches.open(C).then(c=>c.put(e.request,x));return r}).catch(()=>caches.match(e.request)))
  }
});