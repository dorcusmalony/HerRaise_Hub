import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function NotificationItem({ notification, onMarkRead, onViewOpportunity }) {
  const navigate = useNavigate()
  
  const handleApplyYes = async (e) => {
    e.stopPropagation()
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || ''
      const response = await fetch(`${API_URL}/api/opportunities/${notification.data.opportunityId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        // Mark notification as read
        onMarkRead(notification.id)
        
        // Open application link if available
        if (notification.data?.applicationLink) {
          window.open(notification.data.applicationLink, '_blank')
        }
        
        toast.success('Opportunity completed and removed from your list!')
      } else {
        throw new Error('Failed to complete opportunity')
      }
    } catch (error) {
      console.error('Error completing opportunity:', error)
      toast.error('Failed to update opportunity status')
    }
  }

  const handleClick = () => {
    onMarkRead(notification.id)
    
    if (notification.type === 'deadline_reminder' && notification.data?.opportunityId) {
      onViewOpportunity(notification.data.opportunityId)
    } else if (notification.type === 'opportunity' && notification.data?.opportunityId) {
      navigate(`/opportunities/${notification.data.opportunityId}`)
    }
  }

  const getIcon = () => {
    switch (notification.type) {
      case 'deadline_reminder': return '⏰'
      case 'opportunity': return '💼'
      case 'forum_like': return '👍'
      case 'forum_comment': return '💬'
      case 'application_reminder': return '📝'
      default: return '🔔'
    }
  }

  const getPriorityClass = () => {
    if (notification.data?.priority === 'critical') return 'critical'
    if (notification.data?.priority === 'high') return 'high'
    return 'normal'
  }

  return (
    <div 
      className={`notification-item ${getPriorityClass()} ${!notification.readStatus ? 'unread' : ''}`}
      onClick={handleClick}
    >
      <div className="notification-icon">{getIcon()}</div>
      <div className="notification-content">
        <h4>{notification.title}</h4>
        <p>{notification.message}</p>
        <span className="notification-time">
          {new Date(notification.createdAt).toLocaleDateString()}
        </span>
        {notification.type === 'deadline_reminder' && (
          <div className="notification-actions">
            <button 
              onClick={handleApplyYes}
              className="notification-yes-btn"
            >
              Yes, I'll Apply
            </button>
          </div>
        )}
      </div>
      {!notification.readStatus && <div className="unread-dot"></div>}
    </div>
  )
}