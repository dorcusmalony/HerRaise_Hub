const API_URL = import.meta.env.VITE_API_URL || ''

const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
})

export const notificationAPI = {
  // Get notifications with pagination
  async getNotifications(page = 1, limit = 20) {
    const response = await fetch(`${API_URL}/api/notifications?page=${page}&limit=${limit}`, {
      headers: getAuthHeaders()
    })
    return response.json()
  },

  // Get unread count
  async getUnreadCount() {
    const response = await fetch(`${API_URL}/api/notifications/unread-count`, {
      headers: getAuthHeaders()
    })
    return response.json()
  },

  // Mark notification as read
  async markAsRead(notificationId) {
    const response = await fetch(`${API_URL}/api/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: getAuthHeaders()
    })
    return response.json()
  },

  // Mark all notifications as read
  async markAllAsRead() {
    const response = await fetch(`${API_URL}/api/notifications/read-all`, {
      method: 'PUT',
      headers: getAuthHeaders()
    })
    return response.json()
  },

  // Subscribe to push notifications
  async subscribeToPush(subscription) {
    const response = await fetch(`${API_URL}/api/notifications/subscribe`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth
        }
      })
    })
    return response.json()
  },

  // Unsubscribe from push notifications
  async unsubscribeFromPush() {
    const response = await fetch(`${API_URL}/api/notifications/unsubscribe`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    return response.json()
  }
}