import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import styles from './RegistrationSuccess.module.css'

export default function RegistrationSuccess({ userEmail }) {
  const navigate = useNavigate()
  const { t } = useLanguage()

  return (
    <div className={styles.container}>
      <div className={styles.successCard}>
        <div className={styles.successIcon}></div>
        <h2 className={styles.title}>{t('Welcome to HerRaise Hub!')}</h2>
        
        
        <div className={styles.emailNotification}>
          <div className={styles.emailIcon}></div>
          <p>
            <strong>Please verify your email to complete registration!</strong>
          </p>
          <p>
            We've sent a verification link to <strong>{userEmail}</strong>. 
            Click the link in your email to verify your account.
          </p>
        </div>
        
        <div className={styles.nextSteps}>
          <h3>Next Steps:</h3>
          <ul>
            <li> <strong>Check your email inbox</strong> for verification link</li>
            <li> <strong>Click the verification link</strong> in the email</li>
            <li> <strong>verify your email</strong> to create your account and login</li>
            
          </ul>
        </div>
        
        <button 
          className={styles.getStartedBtn}
          onClick={() => navigate('/login')}
          disabled
          style={{ opacity: 0.6, cursor: 'not-allowed' }}
        >
          Verify Email First
        </button>

        <div className={styles.emailReminder}>
          <p><strong>Didn't receive the verification email?</strong></p>
          <ul>
            <li> Check your <strong>spam</strong></li>
            <li> Wait a few minutes - emails can take time to arrive</li>
            <li> Make sure you entered the correct email address</li>
            <li> Try registering again if the email is wrong</li>
          </ul>
        </div>
      </div>
    </div>
  )
}