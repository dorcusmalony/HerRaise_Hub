import React, { useState, useEffect } from 'react'
import styles from './ToastNotification.module.css'

export default function ToastNotification({ message, type = 'success', duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for animation to complete
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success': return ''
      case 'error': return ''
      case 'warning': return ''
      case 'info': return ''
      default: return ''
    }
  }

  return (
    <div className={`${styles.toast} ${styles[type]} ${!isVisible ? styles.fadeOut : ''}`}>
      <div className={styles.content}>
        <span className={styles.icon}>{getIcon()}</span>
        <span className={styles.message}>{message}</span>
      </div>
      <button className={styles.closeBtn} onClick={() => setIsVisible(false)}>
        ×
      </button>
    </div>
  )
}

