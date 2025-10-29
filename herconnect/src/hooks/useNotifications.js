import { useState, useEffect } from 'react'
import { notificationAPI } from '../services/notificationAPI'

export function useNotifications() {
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchUnreadCount = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setUnreadCount(0)
      return
    }
    
    try {
      const data = await notificationAPI.getUnreadCount()
      if (data.success) {
        setUnreadCount(data.unreadCount)
      }
    } catch (error) {
      if (error.message?.includes('401') || error.message?.includes('Invalid token')) {
        setUnreadCount(0)
        return
      }
      console.error('Failed to fetch unread count:', error)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId)
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead()
      setUnreadCount(0)
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchUnreadCount()
      
      // Poll for updates every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000)
      
      // Listen for logout events
      const handleLogout = () => {
        setUnreadCount(0)
      }
      window.addEventListener('user-logout', handleLogout)
      
      return () => {
        clearInterval(interval)
        window.removeEventListener('user-logout', handleLogout)
      }
    } else {
      setUnreadCount(0)
    }
  }, [])

  return {
    unreadCount,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead
  }
}