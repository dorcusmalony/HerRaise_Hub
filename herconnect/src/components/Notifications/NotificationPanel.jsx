import { useState, useEffect } from 'react'
import { notificationAPI } from '../../services/notificationAPI'
import './NotificationPanel.css'

export default function NotificationPanel({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    if (isOpen) {
      // Reset state when opening
      setPage(1)
      setHasMore(true)
      setNotifications([])
      loadNotifications(1)
    }
  }, [isOpen])

  const loadNotifications = async (pageNum = 1) => {
    setLoading(true)
    try {
      const data = await notificationAPI.getNotifications(pageNum, 20)
      if (data.success) {
        const newNotifications = data.notifications || []
        
        if (pageNum === 1) {
          setNotifications(newNotifications)
        } else {
          // Only add new notifications that aren't already in the list
          setNotifications(prev => {
            const existingIds = new Set(prev.map(n => n.id))
            const uniqueNew = newNotifications.filter(n => !existingIds.has(n.id))
            return [...prev, ...uniqueNew]
          })
        }
        
        // Check if there are more notifications
        const hasMoreNotifications = data.pagination ? 
          (data.pagination.currentPage < data.pagination.totalPages) :
          (newNotifications.length === 20) // If no pagination data, assume more if we got full page
        
        // If we got fewer notifications than requested, there are no more
        if (newNotifications.length < 20) {
          setHasMore(false)
        } else {
          setHasMore(hasMoreNotifications)
        }
        
        setPage(pageNum)
      }
    } catch (error) {
      console.error('Failed to load notifications:', error)
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId)
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      )
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  const getNotificationIcon = (type) => {
    const icons = {
      forum_like: '',
      forum_comment: '',
      opportunity_new: '',
      opportunity: '',
      application_reminder: '',
      deadline_reminder: '',
      reminder: '',
      opportunity_deadline: '',
      weekly_reminder: '',
      system: ''
    }
    return icons[type] || ''
  }

  if (!isOpen) return null

  return (
    <div className="notification-panel">
      <div className="notification-header">
        <h5> Notifications</h5>
        <div className="notification-actions">
          <button onClick={handleMarkAllAsRead} className="btn-mark-all">
            Mark All Read
          </button>
          <button onClick={onClose} className="btn-close">×</button>
        </div>
      </div>

      <div className="notification-list">
        {loading && page === 1 ? (
          <div className="notification-loading">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="notification-empty">
            <div className="empty-icon"></div>
            <p>No notifications yet</p>
          </div>
        ) : (
          <>
            {notifications.map(notification => (
              <div 
                key={notification.id}
                className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <div className="notification-title">{notification.title}</div>
                  <div className="notification-message">{notification.message}</div>
                  <div className="notification-time">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </div>
                </div>
                {!notification.isRead && <div className="unread-dot"></div>}
              </div>
            ))}
            
            {hasMore ? (
              <button 
                onClick={() => loadNotifications(page + 1)}
                className="load-more-btn"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            ) : notifications.length > 0 && (
              <div className="no-more-notifications">
                
                <small>No more notifications</small>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}