import { useState, useEffect, useCallback } from 'react'
import { getSocket } from '../../services/socketService'
import styles from './Opportunities.module.css'
import './purple-buttons.css'

const API_URL = import.meta.env.VITE_API_URL || ''


  

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [bookmarked, setBookmarked] = useState(false)
  const [showNewOpportunityBanner, setShowNewOpportunityBanner] = useState(false)



  const fetchOpportunities = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        type: filter !== 'all' ? filter : '',
        search,
        bookmarked: bookmarked.toString()
      })
      
      const response = await fetch(`${API_URL}/api/opportunity-board?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setOpportunities(data.opportunities || [])
      } else {
        // Fallback to mock data if API fails
        setOpportunities(getMockOpportunities())
      }
    } catch (error) {
      console.error('Error fetching opportunities:', error)
      setOpportunities(getMockOpportunities())
    } finally {
      setLoading(false)
    }
  }, [filter, search, bookmarked])

  useEffect(() => {
    fetchOpportunities()
  }, [fetchOpportunities])

  // Socket notification handling
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const handleNotification = (notification) => {
      if (notification.type === 'new_opportunity') {
        // Auto-refresh opportunities list
        fetchOpportunities()
        
        // Show "New opportunity added" banner
        setShowNewOpportunityBanner(true)
        setTimeout(() => setShowNewOpportunityBanner(false), 5000)
      }
    }

    socket.on('notification', handleNotification)
    
    // Listen for refresh event from App.jsx
    const handleRefresh = () => {
      fetchOpportunities()
      setShowNewOpportunityBanner(true)
      setTimeout(() => setShowNewOpportunityBanner(false), 5000)
    }
    
    window.addEventListener('refresh-opportunities', handleRefresh)

    return () => {
      socket.off('notification', handleNotification)
      window.removeEventListener('refresh-opportunities', handleRefresh)
    }
  }, [fetchOpportunities])

  const handleCardClick = async (opportunityId) => {
    try {
      // Track the click to add to liked opportunities
      const response = await fetch(`${API_URL}/api/tracking/track/${opportunityId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        console.log('✅ Opportunity added to dashboard:', opportunityId)
        // Optionally show a toast notification or update UI
      } else {
        console.error('❌ Failed to add opportunity to dashboard:', response.status)
      }
    } catch (error) {
      console.error('Error adding opportunity to dashboard:', error)
    }
  }

  const handleApplyClick = async (opportunityId, applicationLink) => {
    try {
      // Call apply endpoint (automatically tracks with status: in_progress)
      const response = await fetch(`${API_URL}/api/opportunities/${opportunityId}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
      
      console.log('📡 Apply response status:', response.status)
      
      if (response.ok) {
        console.log('🎯 Apply tracked for opportunity:', opportunityId)
      } else {
        console.error('❌ Apply tracking failed:', response.status)
      }
    } catch (error) {
      console.error('Error tracking apply:', error)
    }
    
    // Open external link
    window.open(applicationLink, '_blank')
  }

  const handleBookmark = async (opportunityId) => {
    try {
      const response = await fetch(`${API_URL}/api/opportunity-board/${opportunityId}/bookmark`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.ok) {
        fetchOpportunities() // Refresh to update bookmark status
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error)
    }
  }



  return (
    <div className={styles.container}>
      {showNewOpportunityBanner && (
        <div className={styles.newOpportunityBanner}>
          🎉 New opportunities have been added! Check them out below.
        </div>
      )}

      <div className={styles.filtersRow}>
        <div className={styles.filterButtons}>
          <button 
            className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`${styles.filterBtn} ${filter === 'scholarship' ? styles.active : ''}`}
            onClick={() => setFilter('scholarship')}
          >
            Scholarships
          </button>
          <button 
            className={`${styles.filterBtn} ${filter === 'internship' ? styles.active : ''}`}
            onClick={() => setFilter('internship')}
          >
            Internships
          </button>
          <button 
            className={`${styles.filterBtn} ${filter === 'conference' ? styles.active : ''}`}
            onClick={() => setFilter('conference')}
          >
            Conferences
          </button>
          <button 
            className={`${styles.filterBtn} ${filter === 'competition' ? styles.active : ''}`}
            onClick={() => setFilter('competition')}
          >
            Competitions
          </button>
        </div>
        
        <div className={styles.searchAndBookmark}>
          <input
            type="text"
            className={styles.searchInput}
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
          />
          <button 
            className={`${styles.bookmarkButton} ${bookmarked ? styles.active : ''}`}
            onClick={() => setBookmarked(!bookmarked)}
          >
            {bookmarked ? '💖' : '🤍'}
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {!loading && (
        <div className={styles.opportunitiesGrid}>
          {opportunities.map(opportunity => (
            <div 
              key={opportunity.id} 
              className={styles.compactCard}
              onClick={() => handleCardClick(opportunity.id)}
            >
              {opportunity.isFeatured && (
                <div className={styles.featuredBadge}>⭐</div>
              )}
              
              <button 
                className={`${styles.bookmarkBtn} ${opportunity.bookmarked ? styles.bookmarked : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  handleBookmark(opportunity.id)
                }}
              >
                {opportunity.bookmarked ? '💖' : '🤍'}
              </button>

              <h3 className={styles.cardTitle}>{opportunity.title}</h3>
              <p className={styles.cardOrg}>{opportunity.organization}</p>
              
              <div className={styles.cardMeta}>
                <span className={styles.cardType}>{opportunity.type}</span>
                {opportunity.amount && <span className={styles.cardAmount}>{opportunity.amount}</span>}
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.cardDeadline}>
                  📅 {new Date(opportunity.applicationDeadline).toLocaleDateString()}
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    handleApplyClick(opportunity.id, opportunity.applicationLink)
                  }}
                  className={styles.learnMoreBtn}
                >
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}