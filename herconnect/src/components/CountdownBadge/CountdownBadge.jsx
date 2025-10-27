import './CountdownBadge.css'

export default function CountdownBadge({ deadline }) {
  const getCountdown = (deadlineDate) => {
    const now = new Date()
    const deadline = new Date(deadlineDate)
    const diffTime = deadline - now
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (daysLeft < 0) {
      return {
        status: 'Expired',
        urgency: 'expired',
        color: '#6b7280',
        isUrgent: false,
        isExpired: true,
        daysLeft: 0
      }
    } else if (daysLeft === 0) {
      return {
        status: '⚠️ DEADLINE TODAY!',
        urgency: 'critical',
        color: '#dc2626',
        isUrgent: true,
        isExpired: false,
        daysLeft: 0
      }
    } else if (daysLeft === 1) {
      return {
        status: '⚠️ Only 1 day left!',
        urgency: 'high',
        color: '#ea580c',
        isUrgent: true,
        isExpired: false,
        daysLeft: 1
      }
    } else if (daysLeft <= 3) {
      return {
        status: `⏰ Only ${daysLeft} days left!`,
        urgency: 'medium',
        color: '#d97706',
        isUrgent: true,
        isExpired: false,
        daysLeft
      }
    } else if (daysLeft <= 7) {
      return {
        status: `${daysLeft} days left`,
        urgency: 'low',
        color: '#ca8a04',
        isUrgent: false,
        isExpired: false,
        daysLeft
      }
    } else {
      return {
        status: `${daysLeft} days left`,
        urgency: 'normal',
        color: '#059669',
        isUrgent: false,
        isExpired: false,
        daysLeft
      }
    }
  }

  const countdown = getCountdown(deadline)

  return (
    <span 
      className={`countdown-badge ${countdown.urgency}`}
      style={{ backgroundColor: countdown.color }}
    >
      {countdown.status}
    </span>
  )
}