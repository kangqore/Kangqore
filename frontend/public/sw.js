// Kangqore OS Service Worker — S75 PWA
const CACHE_NAME = 'kangqore-os-v1'
const OIS_CACHE  = 'kangqore-ois-v1'

// Static shell cache (install)
const SHELL_URLS = [
  '/kangqore-view',
  '/manifest.json',
  '/favicon.ico',
]

// OIS/Gate8 API routes to cache for offline
const OIS_PATTERNS = [
  '/api/admin/kangqore-immp/gate8',
  '/api/admin/kangqore-immp/briefing',
  '/api/admin/kangqore-immp/ois',
]

self.addEventListener('install', event => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL_URLS).catch(() => {}))
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME && k !== OIS_CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Cache OIS/Gate8 API responses (stale-while-revalidate)
  if (OIS_PATTERNS.some(p => url.pathname.startsWith(p)) && request.method === 'GET') {
    event.respondWith(
      caches.open(OIS_CACHE).then(async cache => {
        const cached = await cache.match(request)
        const fetchPromise = fetch(request).then(res => {
          if (res.ok) cache.put(request, res.clone())
          return res
        }).catch(() => null)
        return cached || fetchPromise || new Response(JSON.stringify({ offline: true }), {
          headers: { 'Content-Type': 'application/json' }
        })
      })
    )
    return
  }

  // Network-first for API, cache-first for static assets
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match(request).then(r => r || new Response(JSON.stringify({ offline: true }), { headers: { 'Content-Type': 'application/json' } }))
      )
    )
  } else {
    event.respondWith(
      caches.match(request).then(cached => cached || fetch(request).catch(() => caches.match('/kangqore-view')))
    )
  }
})

// Push notification handler
self.addEventListener('push', event => {
  if (!event.data) return
  const data = event.data.json()
  event.waitUntil(
    self.registration.showNotification(data.title || 'Kangqore OS', {
      body: data.body || data.summary || '',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: data.type || 'kimmp-signal',
      data: { url: data.url || '/kangqore-view' },
    })
  )
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  const url = event.notification.data?.url || '/kangqore-view'
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then(clients => {
      const existing = clients.find(c => c.url.includes('kangqore-view'))
      if (existing) { existing.focus(); existing.navigate(url) }
      else self.clients.openWindow(url)
    })
  )
})
