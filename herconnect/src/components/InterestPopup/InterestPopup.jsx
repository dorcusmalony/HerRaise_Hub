import React, { useState } from 'react'
import { markAsInterested } from '../../services/opportunityTracking'
import styles from './InterestPopup.module.css'

export default function InterestPopup({ opportunity, onClose, onSuccess }) {
  const [wantsReminder, setWantsReminder] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleInterested = async () => {
    setLoading(true)
    try {
      const result = await markAsInterested(opportunity.id, wantsReminder)
      if (result.success) {
        onSuccess?.(result.message || 'Thanks for your interest!')
        onClose()
      } else {
        console.error('Failed to mark as interested')
      }
    } catch (error) {
      console.error('Interest tracking failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNotInterested = () => {
    onClose()
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            How was your experience with {opportunity.title}?
          </h3>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>
        
        <div className={styles.content}>
          <p className={styles.question}>Did you find this opportunity interesting?</p>
          
          <div className={styles.reminderOption}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={wantsReminder}
                onChange={(e) => setWantsReminder(e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>
                📅 Remind me 3 days before the deadline
              </span>
            </label>
          </div>
          
          <div className={styles.actions}>
            <button
              onClick={handleInterested}
              disabled={loading}
              className={styles.interestedBtn}
            >
              {loading ? 'Saving...' : '💖 Yes, I\'m Interested!'}
            </button>
            <button
              onClick={handleNotInterested}
              className={styles.notInterestedBtn}
            >
              Not This Time
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}