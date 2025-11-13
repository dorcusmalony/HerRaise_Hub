import { useState } from 'react'
import './PendingOpportunitiesPopup.css'

export default function PendingOpportunitiesPopup({ opportunities, onClose, onViewOpportunity }) {
  const [closing, setClosing] = useState(false)

  const handleClose = () => {
    setClosing(true)
    setTimeout(onClose, 200)
  }

  const handleViewOpportunity = (opportunityId) => {
    setClosing(true)
    setTimeout(() => onViewOpportunity(opportunityId), 200)
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
              <button 
                onClick={() => handleViewOpportunity(opp.id)}
                className="apply-btn"
              >
                Apply Now
              </button>
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