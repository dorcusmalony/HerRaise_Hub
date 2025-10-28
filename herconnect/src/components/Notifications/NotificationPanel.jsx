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
      loadNotifications()
    }
  }, [isOpen])

  const loadNotifications = async (pageNum = 1) => {
    setLoading(true)
    try {
      const data = await notificationAPI.getNotifications(pageNum, 20)
      if (data.success) {
        if (pageNum === 1) {
          setNotifications(data.notifications)
        } else {
          setNotifications(prev => [...prev, ...data.notifications])
        }
        setHasMore(data.pagination.currentPage < data.pagination.totalPages)
        setPage(pageNum)
      }
    } catch (error) {
      console.error('Failed to load notifications:', error)
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
      forum_like: '❤️',
      forum_comment: '💬',
      opportunity_new: '🎯',
      application_reminder: '⏰',
      system: '🔔'
    }
    return icons[type] || '📢'
  }

  if (!isOpen) return null

  return (
    <div className="notification-panel">
      <div className="notification-header">
        <h5>🔔 Notifications</h5>
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
            <div className="empty-icon">🔕</div>
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
            
            {hasMore && (
              <button 
                onClick={() => loadNotifications(page + 1)}
                className="load-more-btn"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}