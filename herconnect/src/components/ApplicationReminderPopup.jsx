import { useState, useEffect } from 'react'

export default function ApplicationReminderPopup({ notification, onDismiss }) {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onDismiss()
    }, 5000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  if (!isVisible) return null

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: '#fff',
      borderLeft: '4px solid #ff6b6b',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 9999,
      maxWidth: '350px',
      animation: 'slideIn 0.3s ease-out'
    }}>
      <h3 style={{
        margin: '0 0 8px 0',
        fontSize: '16px',
        fontWeight: '600',
        color: '#333'
      }}>
        {notification.title}
      </h3>
      
      <p style={{
        margin: '0 0 8px 0',
        fontSize: '14px',
        color: '#666',
        lineHeight: '1.4'
      }}>
        {notification.message}
      </p>
      
      <p style={{
        margin: '8px 0',
        fontSize: '13px',
        fontWeight: '600',
        color: notification.data.daysRemaining <= 3 ? '#d32f2f' : '#ff9800'
      }}>
         {notification.data.daysRemaining} days remaining
      </p>
      
      <div style={{
        display: 'flex',
        gap: '8px',
        marginTop: '12px'
      }}>
        <button
          onClick={() => {
            setIsVisible(false)
            onDismiss()
          }}
          style={{
            width: '100%',
            padding: '8px 12px',
            background: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500'
          }}
        >
          Got it
        </button>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
