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
        const notifs = data.notifications || []
        setNotifications(notifs)
        const unreadCount = notifs.filter(n => !n.readStatus).length
        setUnreadCount(unreadCount)
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
        setUnreadCount(data.count || 0)
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
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
        </svg>
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