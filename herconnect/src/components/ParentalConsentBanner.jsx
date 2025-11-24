import { useState } from 'react'

export default function ParentalConsentBanner({ user, onAcknowledge }) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible || !user?.isMinor) return null

  const consentDate = user.parentalConsentDate 
    ? new Date(user.parentalConsentDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Not recorded'

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: '#fff3e0',
      border: '2px solid #ff9800',
      borderRadius: '8px',
      padding: '16px',
      maxWidth: '500px',
      zIndex: 9998,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '24px', flexShrink: 0 }}></span>
        <div style={{ flex: 1 }}>
          <h3 style={{
            margin: '0 0 8px 0',
            fontSize: '16px',
            fontWeight: '600',
            color: '#e65100'
          }}>
            Parental Consent Notice
          </h3>
          <p style={{
            margin: '0 0 8px 0',
            fontSize: '14px',
            color: '#333',
            lineHeight: '1.4'
          }}>
            This account is registered for a minor (under 18).
          </p>
          <div style={{
            background: 'white',
            padding: '8px',
            borderRadius: '4px',
            fontSize: '13px',
            color: '#555',
            marginBottom: '8px'
          }}>
            <p style={{ margin: '0 0 4px 0' }}>
              <strong>Guardian:</strong> {user.guardianName || 'Not specified'}
            </p>
            <p style={{ margin: '0' }}>
              <strong>Consent Date:</strong> {consentDate}
            </p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false)
              onAcknowledge?.()
            }}
            style={{
              background: '#ff9800',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  )
}
