self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('push', function (event) {
  if (event.data) {
    let data = {}
    try {
      data = event.data.json()
    } catch (e) {
      data = {
        title: 'Notification',
        body: event.data.text(),
        url: '/'
      }
    }
    
    const options = {
      body: data.body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2',
        url: data.url || '/'
      }
    }
    event.waitUntil(self.registration.showNotification(data.title || 'Notification', options))
  }
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  const targetUrl = event.notification.data?.url || '/'
  event.waitUntil(
    clients.openWindow(targetUrl)
  )
})
