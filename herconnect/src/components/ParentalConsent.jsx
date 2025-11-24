import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ParentalConsent({ dateOfBirth, onConsent, onCancel }) {
  const { t } = useTranslation()
  const [guardianName, setGuardianName] = useState('')
  const [understood, setUnderstood] = useState(false)

  const calculateAge = (dob) => {
    const today = new Date()
    const birthDate = new Date(dob)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const age = calculateAge(dateOfBirth)
  const isMinor = age < 18

  if (!isMinor) {
    onConsent()
    return null
  }

  const handleConsent = () => {
    if (!understood) {
      alert(t('Please confirm you understand the safety guidelines'))
      return
    }
    onConsent(guardianName)
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        maxWidth: '500px',
        width: '100%',
        padding: '40px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
        animation: 'slideUp 0.3s ease-out'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{
            color: '#e91e63',
            fontSize: '28px',
            marginBottom: '8px',
            fontWeight: '600'
          }}>
            {t('Welcome to HerRaise Hub')}
          </h2>
          <p style={{
            color: '#666',
            fontSize: '14px',
            margin: 0
          }}>
            {t('A Safe Space for Young Women')}
          </p>
        </div>

        <div style={{
          background: '#fff3e0',
          border: '1px solid #ffe0b2',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '24px',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-start'
        }}>
          <span style={{ fontSize: '20px', flexShrink: 0 }}>⚠️</span>
          <span style={{ color: '#e65100', fontSize: '14px' }}>
            {t('You are under 18. We recommend parental awareness.')}
          </span>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{
            color: '#333',
            fontSize: '16px',
            marginBottom: '12px',
            fontWeight: '600'
          }}>
            {t('Why We Care About Your Safety')}
          </h3>
          <ul style={{
            margin: 0,
            paddingLeft: '20px',
            color: '#555',
            fontSize: '14px',
            lineHeight: '1.6'
          }}>
            <li>{t('HerRaise Hub is a supportive community for women of all ages')}</li>
            <li>{t('We maintain strict safety and moderation standards')}</li>
            <li>{t('Your privacy and well-being are our top priority')}</li>
            <li>{t('We encourage open communication with trusted adults')}</li>
          </ul>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            color: '#333',
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '8px'
          }}>
            {t('Guardian/Parent Name (Optional)')}
          </label>
          <input
            type="text"
            placeholder={t('Enter parent or guardian name')}
            value={guardianName}
            onChange={(e) => setGuardianName(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '14px',
              boxSizing: 'border-box',
              fontFamily: 'inherit'
            }}
          />
          <small style={{
            display: 'block',
            color: '#999',
            fontSize: '12px',
            marginTop: '4px'
          }}>
            {t('Helps us know who to contact if needed')}
          </small>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          marginBottom: '24px',
          padding: '12px',
          background: '#f5f5f5',
          borderRadius: '6px'
        }}>
          <input
            type="checkbox"
            id="understood"
            checked={understood}
            onChange={(e) => setUnderstood(e.target.checked)}
            style={{
              marginTop: '2px',
              cursor: 'pointer',
              width: '18px',
              height: '18px',
              flexShrink: 0
            }}
          />
          <label htmlFor="understood" style={{
            color: '#333',
            fontSize: '14px',
            cursor: 'pointer',
            margin: 0
          }}>
            {t('I understand the safety guidelines and agree to follow community standards')}
          </label>
        </div>

        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '16px'
        }}>
          <button
            onClick={handleConsent}
            disabled={!understood}
            style={{
              flex: 1,
              padding: '12px 24px',
              background: understood ? '#e91e63' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: understood ? 'pointer' : 'not-allowed',
              transition: 'background 0.3s'
            }}
          >
            {t('I Understand - Continue')}
          </button>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '12px 24px',
              background: '#f0f0f0',
              color: '#333',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.3s'
            }}
          >
            {t('Cancel')}
          </button>
        </div>

        <p style={{
          textAlign: 'center',
          color: '#999',
          fontSize: '12px',
          margin: 0,
          lineHeight: '1.5'
        }}>
          {t('By continuing, you confirm you have permission from a parent or guardian to use this platform.')}
        </p>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
