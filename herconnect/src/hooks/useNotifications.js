import { useState, useEffect } from 'react'
import { notificationService } from '../services/notificationService'

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Subscribe to notification updates
    const unsubscribe = notificationService.subscribe((newNotifications) => {
      setNotifications(newNotifications)
      setUnreadCount(notificationService.getUnreadCount())
    })

    // Load initial notifications
    setNotifications(notificationService.getNotifications())
    setUnreadCount(notificationService.getUnreadCount())

    return unsubscribe
  }, [])

  const markAsRead = (notificationId) => {
    notificationService.markAsRead(notificationId)
  }

  const markAllAsRead = () => {
    notificationService.markAllAsRead()
  }

  const showNotification = (title, message, type = 'info', priority = 'normal') => {
    window.dispatchEvent(new CustomEvent('show-notification', {
      detail: { title, message, type, priority }
    }))
  }

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    showNotification
  }
}