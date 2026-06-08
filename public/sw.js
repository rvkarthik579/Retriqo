// Project QR — Service Worker for Offline Scan Support
const CACHE_NAME = 'project-qr-scan-v1'
const STATIC_ASSETS = ['/']

// Install: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

// Fetch: cache-first for scan pages and files, network-first for API
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Cache scan pages (network-first with offline fallback)
  if (url.pathname.startsWith('/scan/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache successful responses
          if (response.ok) {
            const responseClone = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone)
            })
          }
          return response
        })
        .catch(() => {
          // Offline fallback: serve from cache
          return caches.match(event.request).then((cached) => {
            if (cached) return cached
            // Return a basic offline page if no cache
            return new Response(
              `<!DOCTYPE html>
              <html>
                <head>
                  <title>Project QR — Offline</title>
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <style>
                    body { background: #07080f; color: #f0eeff; font-family: system-ui; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; text-align: center; }
                    h1 { font-size: 1.5rem; margin-bottom: 12px; }
                    p { color: #9896b8; }
                  </style>
                </head>
                <body>
                  <div>
                    <h1>You're offline</h1>
                    <p>Connect to the internet to view this QR report.<br>If you've viewed it before, refresh the page.</p>
                  </div>
                </body>
              </html>`,
              { headers: { 'Content-Type': 'text/html' } }
            )
          })
        })
    )
    return
  }

  // Cache file downloads (cache-first)
  if (
    url.pathname.includes('project-qr-files') ||
    url.hostname.includes('supabase.co')
  ) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached
        return fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone)
            })
          }
          return response
        })
      })
    )
    return
  }

  // Default: network only for everything else (API, dashboard)
  event.respondWith(fetch(event.request))
})
