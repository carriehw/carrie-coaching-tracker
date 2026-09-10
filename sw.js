const CACHE='coaching-v2';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon.svg','./pin-ux.js'];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>cache.addAll(ASSETS))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

async function injectPinUx(response){
  if(!response) return response;
  const text=await response.text();
  const html=text.includes('pin-ux.js')
    ? text
    : text.replace('</body>','<script src="./pin-ux.js?v=2"></script></body>');
  return new Response(html,{
    status:response.status,
    statusText:response.statusText,
    headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}
  });
}

self.addEventListener('fetch',event=>{
  if(event.request.mode==='navigate'){
    event.respondWith(
      fetch(event.request,{cache:'no-store'})
        .then(injectPinUx)
        .catch(async()=>injectPinUx(await caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{
      const copy=response.clone();
      caches.open(CACHE).then(cache=>cache.put(event.request,copy));
      return response;
    }))
  );
});
