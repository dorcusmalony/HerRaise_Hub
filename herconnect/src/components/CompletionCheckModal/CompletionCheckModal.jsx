import { useState } from 'react'
import './CompletionCheckModal.css'

const API_URL = import.meta.env.VITE_API_URL || ''

export default function CompletionCheckModal({ pendingCount, onClose }) {
  const [loading, setLoading] = useState(false)

  const handleResponse = async (completed) => {
    setLoading(true)
    try {
      await fetch(`${API_URL}/api/tracking/complete-pending`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed })
      })
      
      // Clear the pending notification from notification bar
      window.dispatchEvent(new CustomEvent('remove-notification', {
        detail: { id: 'pending-opportunities' }
      }))
      
      onClose()
    } catch (error) {
      console.error('Error updating completion status:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="completion-modal-overlay">
      <div className="completion-modal">
        <h3>Opportunity Status Update</h3>
        <p>You have {pendingCount} pending opportunities.</p>
        <p>Have you completed any of the opportunities you liked?</p>
        
        <div className="completion-buttons">
          <button 
            onClick={() => handleResponse(true)}
            disabled={loading}
            className="yes-btn"
          >
            Yes, I completed them
          </button>
          <button 
            onClick={() => handleResponse(false)}
            disabled={loading}
            className="no-btn"
          >
            No, still pending
          </button>
        </div>
      </div>
    </div>
  )
}