// Service worker self-destructs — was intercepting API POST requests
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', event => {
  event.waitUntil(
    self.registration.unregister().then(() =>
      self.clients.matchAll({ includeUncontrolled: true, type: 'window' })
    ).then(clients => {
      clients.forEach(c => c.navigate(c.url))
    })
  )
})
