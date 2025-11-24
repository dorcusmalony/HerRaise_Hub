import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function PrivacyPolicy() {
  const navigate = useNavigate()
  const [showBanner, setShowBanner] = useState(true)

  const handleAccept = () => {
    localStorage.setItem('privacyPolicyAccepted', 'true')
    setShowBanner(false)
  }

  const handleReject = () => {
    setShowBanner(false)
    navigate('/')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5e6f0 0%, #fff 100%)',
      paddingBottom: showBanner ? '120px' : '0'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(233, 30, 99, 0.1)',
        overflow: 'hidden',
        marginTop: '40px',
        marginBottom: '40px'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)',
          color: 'white',
          padding: '40px 30px',
          textAlign: 'center'
        }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', fontWeight: '700' }}>
            How to Break Through Fear and Become a Leader
          </h1>
          <p style={{ margin: '0', fontSize: '16px', opacity: 0.9 }}>
            Valerie Montgomery Rice | TED
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: '40px 30px' }}>
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: '#e91e63', fontSize: '20px', marginBottom: '12px' }}>
               Data Collection
            </h2>
            <ul style={{ margin: '0', paddingLeft: '20px', color: '#555', lineHeight: '1.8' }}>
              <li>✓ Display name (not your real full name)</li>
              <li>✓ Email address (for account verification only)</li>
              <li>✗ We NEVER collect: phone number, location, tribe, school name, or personal details</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: '#e91e63', fontSize: '20px', marginBottom: '12px' }}>
               How We Use Your Data
            </h2>
            <ul style={{ margin: '0', paddingLeft: '20px', color: '#555', lineHeight: '1.8' }}>
              <li>✓ Email: Account verification only</li>
              <li>✓ Display name: Community interactions</li>
              <li>✗ We NEVER share or sell your data to third parties</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: '#e91e63', fontSize: '20px', marginBottom: '12px' }}>
               Data Security & Protection
            </h2>
            <ul style={{ margin: '0', paddingLeft: '20px', color: '#555', lineHeight: '1.8' }}>
              <li>✓ All data handled according to industry security standards</li>
              <li>✓ Data is encrypted and securely stored</li>
              <li>✓ All reports are 100% anonymous</li>
              <li>✓ We do NOT track your location or browsing activity</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: '#e91e63', fontSize: '20px', marginBottom: '12px' }}>
               Your Rights
            </h2>
            <ul style={{ margin: '0', paddingLeft: '20px', color: '#555', lineHeight: '1.8' }}>
              <li>✓ Right to request data deletion anytime</li>
              <li>✓ Right to withdraw consent at any time</li>
              <li>✓ Right to access your personal data</li>
              <li>✓ Right to request data correction</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: '#e91e63', fontSize: '20px', marginBottom: '12px' }}>
               Consent & Registration
            </h2>
            <ul style={{ margin: '0', paddingLeft: '20px', color: '#555', lineHeight: '1.8' }}>
              <li>✓ Consent is required before registration</li>
              <li>✓ You can withdraw consent anytime from your profile</li>
              <li>✓ Withdrawing consent will delete your account and all data</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: '#e91e63', fontSize: '20px', marginBottom: '12px' }}>
               Third-Party Disclaimer
            </h2>
            <p style={{ color: '#555', lineHeight: '1.8', margin: '0' }}>
              HerRaise Hub is not responsible for third-party actions or external links. We are only responsible for data we collect and control.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: '#e91e63', fontSize: '20px', marginBottom: '12px' }}>
               Delete Your Account
            </h2>
            <p style={{ color: '#555', lineHeight: '1.8', margin: '0' }}>
              You can delete your account anytime from your profile settings. All your personal data will be permanently removed from our servers.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ color: '#e91e63', fontSize: '20px', marginBottom: '12px' }}>
               For Young Women Under 18
            </h2>
            <p style={{ color: '#555', lineHeight: '1.8', margin: '0' }}>
              We strongly encourage you to show this platform to your parent, guardian, or teacher. Your safety and privacy are our priority.
            </p>
          </section>

          <div style={{
            background: '#fff3e0',
            border: '1px solid #ff9800',
            borderRadius: '6px',
            padding: '12px 16px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <p style={{ margin: '0', color: '#e65100', fontSize: '13px', lineHeight: '1.5' }}>
               <strong>HerRaise Hub was built to protect South Sudanese girls.</strong><br/>
              Your safety and privacy are everything to us.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Banner */}
      {showBanner && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#E84393',
          padding: '16px 20px',
          boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <p style={{ margin: '0', color: 'white', fontSize: '14px', fontWeight: '500' }}>
              We care about your privacy. Please review our <span style={{ fontWeight: '600' }}>Privacy Policy</span> before continuing.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={handleReject}
              style={{
                padding: '8px 16px',
                background: 'transparent',
                color: 'white',
                border: '1px solid white',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'white'
                e.target.style.color = '#E84393'
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent'
                e.target.style.color = 'white'
              }}
            >
              Reject
            </button>
            <button 
              onClick={handleAccept}
              style={{
                padding: '8px 16px',
                background: 'white',
                color: '#E84393',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.opacity = '0.9'}
              onMouseOut={(e) => e.target.style.opacity = '1'}
            >
              Accept & Continue
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
