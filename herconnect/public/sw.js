// Service Worker for Push Notifications
self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json()
    
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      image: data.image,
      data: data.data,
      actions: [
        {
          action: 'view',
          title: 'View',
          icon: '/icon-view.png'
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
          icon: '/icon-dismiss.png'
        }
      ],
      requireInteraction: true,
      tag: data.tag || 'default'
    }

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
  event.notification.close()

  if (event.action === 'view') {
    // Open the app to specific page
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    )
  } else if (event.action === 'dismiss') {
    // Just close the notification
    return
  } else {
    // Default click - open app
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    )
  }
})

// Background sync for offline notifications
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

function doBackgroundSync() {
  // Sync notifications when back online
  return fetch('/api/notifications/sync')
    .then(response => response.json())
    .then(data => {
      // Process any missed notifications
      console.log('Background sync completed')
    })
    .catch(error => {
      console.error('Background sync failed:', error)
    })
}