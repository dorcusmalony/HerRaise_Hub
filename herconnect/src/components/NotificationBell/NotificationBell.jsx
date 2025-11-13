import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import NotificationItem from '../Notifications/NotificationItem'
import './NotificationBell.css'

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchNotifications()
    fetchUnreadCount()
    
    // Listen for real-time notifications
    const handleNewNotification = (event) => {
      const newNotification = event.detail
      setNotifications(prev => {
        const updated = [newNotification, ...prev]
        const unreadCount = updated.filter(n => !n.readStatus).length
        setUnreadCount(unreadCount)
        return updated
      })
      
      // Show popup for deadline reminders
      if (newNotification.type === 'deadline_reminder') {
        showDeadlinePopup(newNotification)
      }
    }
    
    window.addEventListener('new-notification', handleNewNotification)
    
    return () => {
      window.removeEventListener('new-notification', handleNewNotification)
    }
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/unread-count`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        const count = notifications.filter(n => !n.readStatus).length
        setUnreadCount(count)
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
    }
  }

  const toggleNotifications = () => {
    setShowDropdown(!showDropdown)
  }

  const markAllAsRead = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/mark-read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      setUnreadCount(0)
      setNotifications(prev => prev.map(n => ({ ...n, readStatus: true })))
    } catch (error) {
      console.error('Failed to mark notifications as read:', error)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, readStatus: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const showDeadlinePopup = (notification) => {
    toast.error(notification.message, {
      duration: 10000,
      action: {
        label: 'Apply Now',
        onClick: () => navigate(`/opportunities/${notification.data.opportunityId}`)
      }
    })
  }

  const handleViewOpportunity = (opportunityId) => {
    setShowDropdown(false)
    navigate(`/opportunities/${opportunityId}`)
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div className="notification-bell">
      <button onClick={toggleNotifications} className="bell-button">
        🔔
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>
      
      {showDropdown && (
        <div className="notifications-dropdown">
          <div className="dropdown-header">
            <h4>Notifications</h4>
          </div>
          <div className="notifications-list">
            {notifications.length > 0 ? (
              notifications.map(notif => (
                <NotificationItem
                  key={notif.id || Math.random()}
                  notification={notif}
                  onMarkRead={markAsRead}
                  onViewOpportunity={handleViewOpportunity}
                />
              ))
            ) : (
              <div className="no-notifications">
                <p>No notifications yet</p>
              </div>
            )}
            {notifications.length > 0 && (
              <button onClick={markAllAsRead} className="mark-all-btn">
                Mark All Read
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell