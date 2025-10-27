// Real-world notification service like Facebook/WhatsApp
import { getSocket } from './socketService'

class NotificationService {
  constructor() {
    this.API = import.meta.env.VITE_API_URL || ''
    this.notifications = []
    this.listeners = []
  }

  // Initialize notification system
  async initialize() {
    await this.requestPermission()
    this.setupSocketListeners()
    this.loadNotifications()
  }

  // Request browser notification permission
  async requestPermission() {
    if (!('Notification' in window)) {
      console.warn('Browser does not support notifications')
      return false
    }

    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  // Setup real-time socket listeners
  setupSocketListeners() {
    const socket = getSocket()
    if (!socket) return

    // Forum question notifications
    socket.on('forum:new_question', (data) => {
      this.handleNotification({
        type: 'forum_question',
        title: '❓ New Question Posted',
        message: `${data.author.name}: ${data.title}`,
        data: { postId: data.id, url: `/forum` },
        timestamp: new Date(),
        avatar: data.author.avatar,
        priority: 'normal'
      })
    })

    // Answer notifications
    socket.on('forum:new_answer', (data) => {
      this.handleNotification({
        type: 'forum_answer',
        title: '💡 Someone Answered Your Question',
        message: `${data.author.name} answered: ${data.questionTitle}`,
        data: { postId: data.questionId, url: `/forum` },
        timestamp: new Date(),
        avatar: data.author.avatar,
        priority: 'high'
      })
    })

    // Comment notifications
    socket.on('forum:new_comment', (data) => {
      this.handleNotification({
        type: 'forum_comment',
        title: '💬 New Comment',
        message: `${data.author.name} commented: "${data.content.substring(0, 50)}..."`,
        data: { postId: data.postId, url: `/forum` },
        timestamp: new Date(),
        avatar: data.author.avatar,
        priority: 'normal'
      })
    })

    // Like/reaction notifications
    socket.on('forum:post_liked', (data) => {
      this.handleNotification({
        type: 'forum_like',
        title: '❤️ Someone Liked Your Post',
        message: `${data.author.name} liked your post: ${data.postTitle}`,
        data: { postId: data.postId, url: `/forum` },
        timestamp: new Date(),
        avatar: data.author.avatar,
        priority: 'low'
      })
    })

    // Opportunity notifications
    socket.on('opportunity:new', (data) => {
      this.handleNotification({
        type: 'opportunity',
        title: '🎓 New Opportunity',
        message: `${data.title} - ${data.organization}`,
        data: { opportunityId: data.id, url: `/opportunities` },
        timestamp: new Date()
      })
    })

    // Application status updates
    socket.on('application:status_update', (data) => {
      this.handleNotification({
        type: 'application',
        title: '📋 Application Update',
        message: `Your application for ${data.opportunity.title} is ${data.status}`,
        data: { applicationId: data.id, url: `/opportunities` },
        timestamp: new Date()
      })
    })

    // Deadline reminders
    socket.on('opportunity:deadline_reminder', (data) => {
      this.handleNotification({
        type: 'reminder',
        title: '⏰ Deadline Reminder',
        message: `${data.title} deadline is in ${data.daysLeft} days`,
        data: { opportunityId: data.id, url: `/opportunities` },
        timestamp: new Date()
      })
    })

    // Mentorship notifications
    socket.on('mentorship:request', (data) => {
      this.handleNotification({
        type: 'mentorship',
        title: '🤝 Mentorship Request',
        message: `${data.mentee.name} wants to connect with you`,
        data: { requestId: data.id, url: `/dashboard` },
        timestamp: new Date()
      })
    })

    // Opportunity update notifications
    socket.on('opportunity:updated', (data) => {
      this.handleNotification({
        type: 'opportunity_update',
        title: '📢 Opportunity Updated',
        message: `${data.title} has been updated - Check new requirements`,
        data: { opportunityId: data.id, url: `/opportunities` },
        timestamp: new Date(),
        priority: 'normal'
      })
    })

    // New application notifications (for opportunity creators)
    socket.on('application:new', (data) => {
      this.handleNotification({
        type: 'application_new',
        title: '📝 New Application Received',
        message: `${data.applicant.name} applied to ${data.opportunityTitle}`,
        data: { applicationId: data.id, url: `/dashboard` },
        timestamp: new Date(),
        avatar: data.applicant.avatar,
        priority: 'high'
      })
    })
  }

  // Handle incoming notifications
  handleNotification(notification) {
    // Add to local notifications array
    this.notifications.unshift(notification)
    
    // Limit to 50 notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50)
    }

    // Show browser notification
    this.showBrowserNotification(notification)
    
    // Show in-app notification
    this.showInAppNotification(notification)
    
    // Notify listeners (for UI updates)
    this.notifyListeners()
    
    // Save to localStorage
    this.saveNotifications()
  }

  // Show browser push notification
  showBrowserNotification(notification) {
    if (Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        tag: notification.type,
        data: notification.data,
        requireInteraction: false
      })

      // Handle click
      browserNotification.onclick = () => {
        window.focus()
        if (notification.data?.url) {
          window.location.href = notification.data.url
        }
        browserNotification.close()
      }

      // Auto close after 5 seconds
      setTimeout(() => browserNotification.close(), 5000)
    }
  }

  // Show in-app toast notification
  showInAppNotification(notification) {
    // Dispatch custom event for NotificationToast component
    window.dispatchEvent(new CustomEvent('show-notification', {
      detail: {
        type: this.getNotificationType(notification.type),
        title: notification.title,
        message: notification.message,
        action: notification.data?.url ? () => window.location.href = notification.data.url : null
      }
    }))
  }

  // Get notification type for styling
  getNotificationType(type) {
    const types = {
      forum_question: 'info',
      forum_answer: 'success',
      forum_comment: 'info',
      forum_like: 'primary',
      opportunity: 'success',
      opportunity_update: 'warning',
      application: 'warning',
      application_new: 'success',
      reminder: 'warning',
      mentorship: 'primary'
    }
    return types[type] || 'info'
  }

  // Load notifications from API
  async loadNotifications() {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`${this.API}/api/notifications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        this.notifications = data.notifications || []
        this.notifyListeners()
      }
    } catch (error) {
      console.error('Failed to load notifications:', error)
    }
  }

  // Mark notification as read
  async markAsRead(notificationId) {
    const token = localStorage.getItem('token')
    try {
      await fetch(`${this.API}/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      // Update local state
      this.notifications = this.notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
      this.notifyListeners()
      this.saveNotifications()
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  // Mark all as read
  async markAllAsRead() {
    const token = localStorage.getItem('token')
    try {
      await fetch(`${this.API}/api/notifications/read-all`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      this.notifications = this.notifications.map(n => ({ ...n, read: true }))
      this.notifyListeners()
      this.saveNotifications()
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  // Get unread count
  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length
  }

  // Get all notifications
  getNotifications() {
    return this.notifications
  }

  // Subscribe to notification updates
  subscribe(callback) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback)
    }
  }

  // Notify all listeners
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.notifications))
  }

  // Save to localStorage
  saveNotifications() {
    localStorage.setItem('notifications', JSON.stringify(this.notifications))
  }

  // Load from localStorage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem('notifications')
      if (stored) {
        this.notifications = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load notifications from storage:', error)
    }
  }
}

export const notificationService = new NotificationService()
export default notificationService