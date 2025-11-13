import { useState } from 'react'
import { toast } from 'react-toastify'
import './PendingOpportunitiesPopup.css'

export default function PendingOpportunitiesPopup({ opportunities, onClose, onViewOpportunity }) {
  const [closing, setClosing] = useState(false)
  const [completingIds, setCompletingIds] = useState(new Set())

  const handleClose = () => {
    setClosing(true)
    setTimeout(onClose, 200)
  }

  const handleViewOpportunity = (opportunityId) => {
    setClosing(true)
    setTimeout(() => onViewOpportunity(opportunityId), 200)
  }

  const handleApplyYes = async (opportunity) => {
    if (completingIds.has(opportunity.id)) return
    
    setCompletingIds(prev => new Set([...prev, opportunity.id]))
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || ''
      const response = await fetch(`${API_URL}/api/opportunities/${opportunity.id}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        // Open application link if available
        if (opportunity.applicationLink) {
          window.open(opportunity.applicationLink, '_blank')
        }
        
        toast.success('Opportunity completed and removed from your list!')
        
        // Close popup after short delay
        setTimeout(() => {
          setClosing(true)
          setTimeout(onClose, 200)
        }, 1000)
      } else {
        throw new Error('Failed to complete opportunity')
      }
    } catch (error) {
      console.error('Error completing opportunity:', error)
      toast.error('Failed to update opportunity status')
    } finally {
      setCompletingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(opportunity.id)
        return newSet
      })
    }
  }

  return (
    <div className={`popup-overlay ${closing ? 'closing' : ''}`}>
      <div className={`popup-content ${closing ? 'closing' : ''}`}>
        <div className="popup-header">
          <h3>⚠️ Pending Applications</h3>
          <button onClick={handleClose} className="close-btn">×</button>
        </div>
        
        <div className="popup-body">
          <p>You have {opportunities.length} opportunity{opportunities.length > 1 ? 'ies' : 'y'} with approaching deadlines:</p>
          
          {opportunities.map(opp => (
            <div key={opp.id} className={`opportunity-item ${opp.priority}`}>
              <div className="opp-info">
                <h4>{opp.title}</h4>
                <p>{opp.organization} • {opp.type}</p>
                <span className="deadline-warning">{opp.message}</span>
              </div>
              <div className="opportunity-actions">
                <button 
                  onClick={() => handleApplyYes(opp)}
                  className="yes-btn"
                  disabled={completingIds.has(opp.id)}
                >
                  {completingIds.has(opp.id) ? 'Processing...' : "Yes, I'll Apply"}
                </button>
                <button 
                  onClick={() => handleViewOpportunity(opp.id)}
                  className="view-btn"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="popup-footer">
          <button onClick={handleClose} className="later-btn">Remind Me Later</button>
        </div>
      </div>
    </div>
  )
}