import { useState } from 'react'
import { opportunityAPI } from '../../services/opportunityAPI'
import { applicationTrackerAPI } from '../../services/applicationTrackerAPI'
import ApplicationModal from '../ApplicationTracker/ApplicationModal'
import ApplicationInterestModal from '../ApplicationTracker/ApplicationInterestModal'
import CountdownBadge from '../CountdownBadge/CountdownBadge'
import useApplicationTracking from '../../hooks/useApplicationTracking'
import './OpportunityCard.css'

export default function OpportunityCard({ opportunity, currentUser }) {
  const [bookmarked, setBookmarked] = useState(
    opportunity.interestedUsers?.includes(currentUser?.id) || false
  )
  const [showTrackModal, setShowTrackModal] = useState(false)
  const [showInterestModal, setShowInterestModal] = useState(false)
  const { trackApplication, markAsVisited, shouldShowInterestModal, markModalShown } = useApplicationTracking()

  const handleApplyClick = async () => {
    try {
      await opportunityAPI.trackClick(opportunity.id)
      markAsVisited(opportunity.id)
    } catch (error) {
      console.error('Error tracking click:', error)
    }
    
    window.open(opportunity.applicationLink, '_blank')
    
    // Check if user should see interest modal when they return
    setTimeout(() => {
      if (shouldShowInterestModal(opportunity.id)) {
        setShowInterestModal(true)
        markModalShown(opportunity.id)
      }
    }, 3000)
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

  const handleInterestConfirm = async (interestData) => {
    try {
      await trackApplication(interestData)
    } catch (error) {
      console.error('Error tracking interest:', error)
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
      
      {showInterestModal && (
        <ApplicationInterestModal
          opportunity={opportunity}
          onClose={() => setShowInterestModal(false)}
          onConfirm={handleInterestConfirm}
        />
      )}
    </div>
  )
}