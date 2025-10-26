// Push Notification Service for real-world notifications
class PushNotificationService {
  constructor() {
    this.vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY
    this.API = import.meta.env.VITE_API_URL || ''
  }

  // Request permission and register service worker
  async initialize() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications not supported')
      return false
    }

    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('Service Worker registered:', registration)

      // Request notification permission
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        console.warn('Notification permission denied')
        return false
      }

      // Subscribe to push notifications
      await this.subscribeToPush(registration)
      return true
    } catch (error) {
      console.error('Push notification setup failed:', error)
      return false
    }
  }

  // Subscribe user to push notifications
  async subscribeToPush(registration) {
    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
      })

      // Send subscription to backend
      await this.sendSubscriptionToServer(subscription)
      console.log('Push subscription successful')
    } catch (error) {
      console.error('Push subscription failed:', error)
    }
  }

  // Send subscription to backend
  async sendSubscriptionToServer(subscription) {
    const token = localStorage.getItem('token')
    try {
      await fetch(`${this.API}/api/notifications/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(subscription)
      })
    } catch (error) {
      console.error('Failed to send subscription to server:', error)
    }
  }

  // Show local notification
  showNotification(title, options = {}) {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        ...options
      })
    }
  }

  // Utility function
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }
}

export const pushNotificationService = new PushNotificationService()
export default pushNotificationService