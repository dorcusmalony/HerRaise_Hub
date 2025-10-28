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
        <div className={styles.successIcon}>🎉</div>
        <h2 className={styles.title}>{t('Welcome to HerRaise Hub!')}</h2>
        <p className={styles.subtitle}>{t('Your account has been created successfully.')}</p>
        
        <div className={styles.emailNotification}>
          <div className={styles.emailIcon}>📧</div>
          <p>
            {t('We\'ve sent a welcome email to')} <strong>{userEmail}</strong> 
            {t(' with everything you need to get started.')}
          </p>
        </div>
        
        <div className={styles.nextSteps}>
          <h3>{t('What\'s Next?')}</h3>
          <ul>
            <li>✅ {t('Check your email inbox')}</li>
            <li>🔍 {t('Explore opportunities')}</li>
            <li>💬 {t('Join forum discussions')}</li>
            <li>👥 {t('Connect with mentors')}</li>
          </ul>
        </div>
        
        <button 
          className={styles.getStartedBtn}
          onClick={() => navigate('/dashboard')}
        >
          {t('Get Started')} 🚀
        </button>

        <div className={styles.emailReminder}>
          <p>📧 {t('Didn\'t receive the email?')}</p>
          <ul>
            <li>{t('Check your spam/junk folder')}</li>
            <li>{t('Make sure you entered the correct email')}</li>
            <li>{t('Contact support if needed')}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}