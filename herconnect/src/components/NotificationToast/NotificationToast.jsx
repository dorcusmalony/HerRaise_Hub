import { useState, useEffect } from 'react'
import './NotificationToast.css'

export default function NotificationToast() {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const handleNotification = (event) => {
      const { title, message } = event.detail
      const id = Date.now()
      
      setNotifications(prev => [...prev, { id, title, message }])

      // Auto-remove after 5 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id))
      }, 5000)
    }

    window.addEventListener('app-notification', handleNotification)

    return () => {
      window.removeEventListener('app-notification', handleNotification)
    }
  }, [])

  return (
    <div className="notification-container">
      {notifications.map(notif => (
        <div key={notif.id} className="notification-toast">
          <div className="notification-header">
            <strong>{notif.title}</strong>
            <button
              className="notification-close"
              onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))}
            >
              ×
            </button>
          </div>
          <div className="notification-body">{notif.message}</div>
        </div>
      ))}
    </div>
  )
}
