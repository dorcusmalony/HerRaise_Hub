import { useState } from 'react'
import axios from 'axios'
import ApplicationModal from '../ApplicationTracker/ApplicationModal'
import CountdownBadge from '../CountdownBadge/CountdownBadge'
import './OpportunityCard.css'

export default function OpportunityCard({ opportunity, currentUser }) {
  const [bookmarked, setBookmarked] = useState(
    opportunity.interestedUsers?.includes(currentUser?.id) || false
  )
  const [showTrackModal, setShowTrackModal] = useState(false)

  const handleApplyClick = async () => {
    try {
      // Track click
      await axios.post(`${import.meta.env.VITE_API_URL}/api/opportunity-board/${opportunity.id}/apply`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
    } catch (error) {
      console.error('Error tracking click:', error)
    }
    
    // Open external link
    window.open(opportunity.applicationLink, '_blank')
    
    // Show tracking modal after a delay
    setTimeout(() => {
      setShowTrackModal(true)
    }, 2000)
  }

  const handleSaveApplication = async (applicationData) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/applications`, {
        ...applicationData,
        opportunity
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
    } catch (error) {
      console.error('Error saving application:', error)
    }
  }

  const handleBookmark = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/opportunity-board/${opportunity.id}/bookmark`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setBookmarked(response.data.bookmarked)
    } catch (error) {
      console.error('Bookmark failed:', error)
    }
  }



  return (
    <div className="opportunity-card">
      {opportunity.isFeatured && (
        <div className="featured-badge">⭐ Featured</div>
      )}
      
      <div className="opportunity-header">
        <h3 className="opportunity-title">{opportunity.title}</h3>
        <button 
          className={`bookmark-btn ${bookmarked ? 'bookmarked' : ''}`}
          onClick={handleBookmark}
        >
          {bookmarked ? '💖' : '🤍'}
        </button>
      </div>

      <div className="opportunity-meta">
        <span className={`type type-${opportunity.type}`}>{opportunity.type}</span>
        <span className="organization">{opportunity.organization}</span>
        {opportunity.amount && (
          <span className="amount">{opportunity.amount}</span>
        )}
      </div>

      <p className="description">{opportunity.description}</p>

      <div className="opportunity-details">
        <div className="deadline">
          📅 Deadline: {new Date(opportunity.applicationDeadline).toLocaleDateString()}
          <CountdownBadge deadline={opportunity.applicationDeadline} />
        </div>
        <div className="location">📍 {opportunity.location}</div>
      </div>

      <div className="opportunity-actions">
        <button 
          className="apply-btn"
          onClick={handleApplyClick}
        >
          🚀 Apply Now
        </button>
        <div className="stats">
          👀 {opportunity.views || 0} views • 🔗 {opportunity.clickCount || 0} applications
        </div>
      </div>
      
      {showTrackModal && (
        <ApplicationModal
          opportunity={opportunity}
          onClose={() => setShowTrackModal(false)}
          onSave={handleSaveApplication}
        />
      )}
    </div>
  )
}