import { useState, useEffect, useCallback } from 'react'
import { getSocket } from '../../services/socketService'
import styles from './Opportunities.module.css'

const API_URL = import.meta.env.VITE_API_URL || ''

const getMockOpportunities = () => [
  {
    id: 1,
    title: "UN Women Leadership Scholarship 2025",
    organization: "UN Women",
    type: "scholarship",
    description: "Empowering young women leaders through education and mentorship programs.",
    amount: "$5,000",
    location: "Global",
    applicationDeadline: "2024-12-31",
    applicationLink: "https://unwomen.org/scholarship/apply",
    isFeatured: true,
    
  },
  {
    id: 2,
    title: "Google Women Techmakers Internship",
    organization: "Google",
    type: "internship",
    description: "3-month paid internship program for women in technology.",
    amount: "$4,000/month",
    location: "Remote/Global",
    applicationDeadline: "2024-11-15",
    applicationLink: "https://careers.google.com/women-techmakers",
    
  }
]

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

  const handleApplyClick = async (opportunityId, applicationLink) => {
    try {
      // Track click
      await fetch(`${API_URL}/api/opportunity-board/${opportunityId}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
    } catch (error) {
      console.error('Error tracking click:', error)
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
      
      <div className={styles.header}>
        <h1 className={styles.title}> Scholarship & Opportunity Board</h1>
        <p className={styles.subtitle}>
          Discover scholarships, internships, and competitions. Apply directly through external links.
        </p>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterRow}>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Type</label>
            <select className={styles.select} value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="all">All Opportunities</option>
              <option value="scholarship">Scholarships</option>
              <option value="internship">Internships</option>
              <option value="competition">Competitions</option>
              <option value="conference">Conferences</option>
            </select>
          </div>
          <div className={styles.filterGroup}>
            <label className={styles.filterLabel}>Search</label>
            <input
              type="text"
              className={styles.input}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search opportunities..."
            />
          </div>
          <div className={styles.filterGroup}>
            <button 
              className={`${styles.bookmarkButton} ${bookmarked ? styles.active : ''}`}
              onClick={() => setBookmarked(!bookmarked)}
            >
              {bookmarked ? '💖 Bookmarked Only' : '💖 Show Bookmarked'}
            </button>
          </div>
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
            <div key={opportunity.id} className={styles.opportunityCard}>
              {opportunity.isFeatured && (
                <div className={styles.featuredBadge}> Featured</div>
              )}
              
              <div className={styles.opportunityHeader}>
                <h3 className={styles.opportunityTitle}>{opportunity.title}</h3>
                <button 
                  className={`${styles.bookmarkBtn} ${opportunity.bookmarked ? styles.bookmarked : ''}`}
                  onClick={() => handleBookmark(opportunity.id)}
                >
                  {opportunity.bookmarked ? '💖' : '🤍'}
                </button>
              </div>

              <div className={styles.opportunityMeta}>
                <span className={styles.type}>{opportunity.type}</span>
                <span className={styles.organization}>{opportunity.organization}</span>
                {opportunity.amount && (
                  <span className={styles.amount}>{opportunity.amount}</span>
                )}
              </div>

              <p className={styles.description}>{opportunity.description}</p>

              <div className={styles.opportunityDetails}>
                <div className={styles.deadline}>
                   Deadline: {new Date(opportunity.applicationDeadline).toLocaleDateString()}
                  {opportunity.isUrgent && (
                    <span className={styles.urgentBadge}> Urgent</span>
                  )}
                </div>
                <div className={styles.location}> {opportunity.location}</div>
              </div>

              <div className={styles.opportunityActions}>
                <button 
                  onClick={() => handleApplyClick(opportunity.id, opportunity.applicationLink)}
                  className={styles.applyBtn}
                >
                   Apply Now
                </button>
                <div className={styles.stats}>
                   {opportunity.views || 0} views  {opportunity.clickCount || 0} applications
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}