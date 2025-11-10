import { useState } from 'react'
import { opportunityAPI } from '../../services/opportunityAPI'
import { applicationTrackerAPI } from '../../services/applicationTrackerAPI'
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
      // Track click for sidebar display
      const API_URL = import.meta.env.VITE_API_URL || ''
      await fetch(`${API_URL}/api/dashboard/track-opportunity/${opportunity.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
    } catch (error) {
      console.error('Error tracking click:', error)
    }
    
    window.open(opportunity.applicationLink, '_blank')
    
    setTimeout(() => {
      setShowTrackModal(true)
    }, 2000)
  }

  const handleSaveApplication = async (applicationData) => {
    try {
      await applicationTrackerAPI.trackApplication(
        opportunity.id,
        applicationData.status,
        applicationData.notes
      )
    } catch (error) {
      console.error('Error saving application:', error)
    }
  }

  const handleBookmark = async () => {
    try {
      const response = await opportunityAPI.toggleBookmark(opportunity.id)
      if (response.success) {
        setBookmarked(response.bookmarked)
      }
    } catch (error) {
      console.error('Bookmark failed:', error)
    }
  }



  return (
    <div className="opportunity-card">
      {opportunity.isFeatured && (
        <div className="featured-badge"> Featured</div>
      )}
      
      <div className="opportunity-header">
        <h3 className="opportunity-title">{opportunity.title}</h3>
        <button 
          className={`bookmark-btn ${bookmarked ? 'bookmarked' : ''}`}
          onClick={handleBookmark}
        >
          {bookmarked ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="opportunity-meta">
        {/* Fix: Render type as string, not object */}
        <span className={`type type-${Array.isArray(opportunity.type) ? opportunity.type[0] : opportunity.type}`}>
          {Array.isArray(opportunity.type)
            ? opportunity.type.join(', ')
            : typeof opportunity.type === 'object'
              ? Object.values(opportunity.type).join(', ')
              : opportunity.type}
        </span>
        <span className="organization">{opportunity.organization}</span>
        {opportunity.amount && (
          <span className="amount">{opportunity.amount}</span>
        )}
      </div>

      <p className="description">{opportunity.description}</p>

      <div className="opportunity-details">
        <div className="deadline">
           Deadline: {new Date(opportunity.applicationDeadline).toLocaleDateString()}
          <CountdownBadge deadline={opportunity.applicationDeadline} />
        </div>
        <div className="location"> {opportunity.location}</div>
      </div>

      <div className="opportunity-actions">
        <button 
          className="apply-btn"
          onClick={handleApplyClick}
        >
           Apply Now
        </button>
        <div className="stats">
           {opportunity.views || 0}  {opportunity.clickCount || 0} applications
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