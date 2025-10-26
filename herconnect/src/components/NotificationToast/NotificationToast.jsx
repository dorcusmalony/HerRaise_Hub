import { useState, useEffect } from 'react'
import './NotificationToast.css'

export default function NotificationToast() {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const handleNotification = (event) => {
      const { title, message, type, action, avatar, priority } = event.detail
      const id = Date.now()
      
      const notification = {
        id,
        title,
        message,
        type: type || 'info',
        action,
        avatar,
        priority: priority || 'normal',
        timestamp: new Date()
      }
      
      setNotifications(prev => [notification, ...prev])

      // Auto-remove based on priority
      const duration = priority === 'high' ? 8000 : priority === 'low' ? 3000 : 5000
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id))
      }, duration)
    }

    const handleShowNotification = (event) => {
      handleNotification(event)
    }

    // Listen to both old and new event types
    window.addEventListener('app-notification', handleNotification)
    window.addEventListener('show-notification', handleShowNotification)

    return () => {
      window.removeEventListener('app-notification', handleNotification)
      window.removeEventListener('show-notification', handleShowNotification)
    }
  }, [])

  const handleClick = (notification) => {
    if (notification.action) {
      notification.action()
    }
    setNotifications(prev => prev.filter(n => n.id !== notification.id))
  }

  const formatTime = (timestamp) => {
    const now = new Date()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'now'
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h`
    return `${Math.floor(hours / 24)}d`
  }

  return (
    <div className="notification-container">
      {notifications.map(notif => (
        <div 
          key={notif.id} 
          className={`notification-toast notification-${notif.type} priority-${notif.priority}`}
          onClick={() => handleClick(notif)}
        >
          <div className="notification-content">
            {notif.avatar && (
              <div className="notification-avatar">
                <img src={notif.avatar} alt="User" />
              </div>
            )}
            <div className="notification-text">
              <div className="notification-header">
                <strong>{notif.title}</strong>
                <span className="notification-time">{formatTime(notif.timestamp)}</span>
              </div>
              <div className="notification-body">{notif.message}</div>
            </div>
          </div>
          <button
            className="notification-close"
            onClick={(e) => {
              e.stopPropagation()
              setNotifications(prev => prev.filter(n => n.id !== notif.id))
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
