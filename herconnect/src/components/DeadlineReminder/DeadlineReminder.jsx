import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './DeadlineReminder.module.css'

export default function DeadlineReminder({ pendingReminders }) {
  const [showReminder, setShowReminder] = useState(false)

  useEffect(() => {
    if (pendingReminders && pendingReminders.count > 0) {
      setShowReminder(true)
    }
  }, [pendingReminders])

  if (!showReminder || !pendingReminders || pendingReminders.count === 0) return null

  return (
    <div className={styles.reminderOverlay}>
      <div className={styles.reminderModal}>
        <div className={styles.reminderHeader}>
          <h3>⏰ Pending Deadlines</h3>
          <button 
            onClick={() => setShowReminder(false)}
            className={styles.closeBtn}
          >
            ×
          </button>
        </div>
        
        <div className={styles.reminderBody}>
          <p>You have {pendingReminders.count} opportunity{pendingReminders.count > 1 ? 'ies' : 'y'} with upcoming deadlines:</p>
          
          <div className={styles.opportunitiesList}>
            {pendingReminders.opportunities.map(opp => (
              <div key={opp.id} className={styles.opportunityItem}>
                <div className={styles.oppInfo}>
                  <h4>{opp.title}</h4>
                  <p className={styles.oppType}>{opp.message}</p>
                </div>
                <div className={`${styles.deadline} ${opp.isUrgent ? styles.urgent : ''}`}>
                  {opp.daysRemaining === 1 ? 'Tomorrow!' : `${opp.daysRemaining} days left`}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.reminderActions}>
          <Link 
            to="/opportunities" 
            className={styles.viewBtn}
            onClick={() => setShowReminder(false)}
          >
            View Opportunities
          </Link>
          <button 
            onClick={() => setShowReminder(false)}
            className={styles.dismissBtn}
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
}