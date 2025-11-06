import { useState } from 'react'
import styles from './OpportunityReminder.module.css'

const API_URL = import.meta.env.VITE_API_URL || ''

export default function OpportunityReminder({ reminders, onClose }) {
  const [completedIds, setCompletedIds] = useState(new Set())

  if (!reminders || reminders.count === 0) return null

  const markCompleted = async (opportunityId) => {
    try {
      const token = localStorage.getItem('token')
      await fetch(`${API_URL}/api/reminders/mark-completed/${opportunityId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      setCompletedIds(prev => new Set([...prev, opportunityId]))
    } catch (error) {
      console.error('Error marking opportunity as completed:', error)
    }
  }

  const activeOpportunities = reminders.opportunities.filter(
    opp => !completedIds.has(opp.id)
  )

  if (activeOpportunities.length === 0) {
    setTimeout(onClose, 1000)
    return null
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.header}>
          <h3>⏰ Deadline Reminders</h3>
          <button onClick={onClose} className={styles.closeBtn}>×</button>
        </div>
        
        <div className={styles.content}>
          <p className={styles.message}>
            You have {activeOpportunities.length} liked opportunities with approaching deadlines!
          </p>
          
          <div className={styles.opportunitiesList}>
            {activeOpportunities.map(opp => (
              <div key={opp.id} className={`${styles.opportunityCard} ${opp.isUrgent ? styles.urgent : ''}`}>
                <div className={styles.oppInfo}>
                  <h4>{opp.title}</h4>
                  <p>{opp.organization} • {opp.type}</p>
                  <div className={styles.deadline}>
                    {opp.isUrgent ? '🚨' : '⏰'} {opp.daysRemaining} days remaining
                  </div>
                </div>
                
                <div className={styles.actions}>
                  <button 
                    onClick={() => window.open(opp.applicationLink, '_blank')}
                    className={styles.applyBtn}
                  >
                    Apply Now
                  </button>
                  <button 
                    onClick={() => markCompleted(opp.id)}
                    className={styles.completeBtn}
                  >
                    Mark Complete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.footer}>
          <button onClick={onClose} className={styles.dismissBtn}>
            Remind Me Later
          </button>
        </div>
      </div>
    </div>
  )
}