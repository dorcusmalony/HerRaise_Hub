import { useState, useEffect, useCallback } from 'react'
import { getSocket, requestNotificationPermission } from '../../services/socketService'
import OpportunityCard from '../../components/OpportunityCard/OpportunityCard'
import ApplicationTracker from '../../components/ApplicationTracker/ApplicationTracker'
import UrgentOpportunities from '../../components/UrgentOpportunities/UrgentOpportunities'
import { useAuth } from '../../hooks/useAuth'
import styles from './Opportunities.module.css'

export default function Opportunities() {
  const { user } = useAuth()
  const API = import.meta.env.VITE_API_URL || ''
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false)

  // Real-time updates
  useEffect(() => {
    requestNotificationPermission()
    const socket = getSocket()
    if (socket) {
      socket.on('opportunity:new', (data) => {
        setOpportunities(prev => [data, ...prev])
      })
      return () => {
        socket.off('opportunity:new')
      }
    }
  }, [])

  // Mock data for demonstration
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
      views: 1250,
      clickCount: 89
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
      views: 2100,
      clickCount: 156
    },
    {
      id: 3,
      title: "AAUW International Fellowships 2024",
      organization: "AAUW",
      type: "scholarship",
      description: "$18,000-$30,000 fellowships for women pursuing graduate studies.",
      amount: "$18,000-$30,000",
      location: "Global",
      applicationDeadline: "2024-12-20",
      applicationLink: "https://aauw.org/fellowships",
      isFeatured: false,
      views: 890,
      clickCount: 67
    },
    {
      id: 4,
      title: "TechWomen Program 2024",
      organization: "U.S. State Department",
      type: "conference",
      description: "Silicon Valley STEM mentorship program for emerging women leaders.",
      amount: "Fully funded",
      location: "Silicon Valley, USA",
      applicationDeadline: "2024-12-18",
      applicationLink: "https://techwomen.org/apply",
      isFeatured: true,
      views: 1450,
      clickCount: 123
    }
  ]

  // Fetch opportunities
  const fetchOpportunities = useCallback(async () => {
    const token = localStorage.getItem('token')
    const params = new URLSearchParams({
      type: filter !== 'all' ? filter : '',
      search,
      bookmarked: bookmarkedOnly
    })
    
    try {
      const response = await fetch(`${API}/api/opportunity-board?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setOpportunities(data.opportunities || [])
      } else {
        setOpportunities(getMockOpportunities())
      }
    } catch (error) {
      console.error('Error fetching opportunities:', error)
      setOpportunities(getMockOpportunities())
    } finally {
      setLoading(false)
    }
  }, [API, filter, search, bookmarkedOnly])

  useEffect(() => {
    fetchOpportunities()
  }, [fetchOpportunities])



  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>🎓 Scholarship & Opportunity Board</h1>
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
            <label className={styles.filterLabel}>Filter</label>
            <button 
              className={`${styles.bookmarkButton} ${bookmarkedOnly ? styles.active : ''}`}
              onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
            >
              {bookmarkedOnly ? '💖 Bookmarked Only' : '💖 Show Bookmarked'}
            </button>
          </div>
        </div>
      </div>

      {/* Urgent Opportunities */}
      <UrgentOpportunities />
      
      {/* Application Tracker */}
      <div className="mb-4">
        <ApplicationTracker />
      </div>

      {opportunities.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔍</div>
          <h4 className={styles.emptyTitle}>No opportunities found</h4>
          <p className={styles.emptyText}>Check back soon for new scholarships and internships!</p>
        </div>
      ) : (
        <div className={styles.opportunitiesGrid}>
          {opportunities.map(opportunity => (
            <OpportunityCard 
              key={opportunity.id}
              opportunity={opportunity} 
              currentUser={user}
            />
          ))}
        </div>
      )}
    </div>
  )
}

