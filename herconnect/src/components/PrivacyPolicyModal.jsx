import { useState, useEffect } from 'react'

export default function PrivacyPolicyModal() {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('privacyPolicyAccepted')
    if (!accepted) {
      setShowModal(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('privacyPolicyAccepted', 'true')
    setShowModal(false)
  }

  const handleReject = () => {
    localStorage.setItem('privacyPolicyRejected', 'true')
    setShowModal(false)
  }

  if (!showModal) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: '#FFC107',
      borderTop: '3px solid #FF9800',
      padding: '20px',
      boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
      zIndex: 9998,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '15px'
    }}>
      <p style={{
        margin: '0',
        fontSize: '14px',
        color: '#333',
        lineHeight: '1.5',
        textAlign: 'center',
        maxWidth: '600px'
      }}>
        We care about your privacy. HerRaise Hub only collects your display name and email. 
        <a 
          href="/privacy-policy" 
          style={{
            color: '#d32f2f',
            textDecoration: 'none',
            fontWeight: '700',
            marginLeft: '4px'
          }}
          onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
          onMouseOut={(e) => e.target.style.textDecoration = 'none'}
        >
          Read full policy →
        </a>
      </p>

      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'center'
      }}>
        <button
          onClick={handleReject}
          style={{
            padding: '10px 24px',
            background: '#fff',
            color: '#333',
            border: '2px solid #333',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#f0f0f0'
            e.target.style.transform = 'translateY(-2px)'
          }}
          onMouseOut={(e) => {
            e.target.style.background = '#fff'
            e.target.style.transform = 'translateY(0)'
          }}
        >
          No
        </button>
        <button
          onClick={handleAccept}
          style={{
            padding: '10px 24px',
            background: '#e91e63',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#c2185b'
            e.target.style.transform = 'translateY(-2px)'
          }}
          onMouseOut={(e) => {
            e.target.style.background = '#e91e63'
            e.target.style.transform = 'translateY(0)'
          }}
        >
          Yes
        </button>
      </div>
    </div>
  )
}
