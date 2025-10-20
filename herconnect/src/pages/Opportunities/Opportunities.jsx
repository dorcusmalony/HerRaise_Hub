import { useState, useEffect, useCallback } from 'react'
import styles from '../../styles/Pages.module.css'

export default function Opportunities() {
  const API = import.meta.env.VITE_API_URL || ''
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, internship, scholarship, event

  const fetchOpportunities = useCallback(async () => {
    const token = localStorage.getItem('token')
    
    try {
      const response = await fetch(`${API}/api/opportunities?filter=${filter}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setOpportunities(data.opportunities || [])
      }
    } catch (error) {
      console.error('Error fetching opportunities:', error)
    } finally {
      setLoading(false)
    }
  }, [API, filter])

  useEffect(() => {
    fetchOpportunities()
  }, [fetchOpportunities])

  const getOpportunityIcon = (type) => {
    switch(type) {
      case 'internship': return ''
      case 'scholarship': return ''
      case 'event': return ''
      default: return ''
    }
  }

  const getOpportunityBadge = (type) => {
    const badges = {
      internship: 'bg-primary',
      scholarship: 'bg-success',
      event: 'bg-info'
    }
    return badges[type] || 'bg-secondary'
  }

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
      <div className={`d-flex justify-content-between align-items-center mb-4 ${styles.mbSmall}`}>
        <div>
          <h2 className={styles.heroTitle}>Opportunities</h2>
          <p className="text-muted mb-0">Internships, scholarships, and events for young women</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className={`card mb-4 ${styles.mbSmall}`}>
        <div className="card-body">
          <label className="form-label small text-muted">Filter by type:</label>
          <div className="btn-group w-100" role="group">
            <input 
              type="radio" 
              className="btn-check" 
              name="opp-filter" 
              id="opp-all" 
              value="all"
              checked={filter === 'all'}
              onChange={(e) => setFilter(e.target.value)}
            />
            <label className="btn btn-outline-primary" htmlFor="opp-all">All</label>

            <input 
              type="radio" 
              className="btn-check" 
              name="opp-filter" 
              id="opp-internship" 
              value="internship"
              checked={filter === 'internship'}
              onChange={(e) => setFilter(e.target.value)}
            />
            <label className="btn btn-outline-primary" htmlFor="opp-internship">Internships</label>

            <input 
              type="radio" 
              className="btn-check" 
              name="opp-filter" 
              id="opp-scholarship" 
              value="scholarship"
              checked={filter === 'scholarship'}
              onChange={(e) => setFilter(e.target.value)}
            />
            <label className="btn btn-outline-primary" htmlFor="opp-scholarship">Scholarships</label>

            <input 
              type="radio" 
              className="btn-check" 
              name="opp-filter" 
              id="opp-event" 
              value="event"
              checked={filter === 'event'}
              onChange={(e) => setFilter(e.target.value)}
            />
            <label className="btn btn-outline-primary" htmlFor="opp-event">Events</label>
          </div>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="row">
        {opportunities.length === 0 ? (
          <div className="col-12">
            <div className={`card ${styles.mbSmall}`}>
              <div className="card-body text-center py-5">
                <h4 className="text-muted mb-3">No opportunities yet</h4>
                <p className="text-muted">Check back soon for internships, scholarships, and events!</p>
              </div>
            </div>
          </div>
        ) : (
          opportunities.map(opp => (
            <div key={opp.id} className="col-12 col-md-6 col-lg-4 mb-3">
              <div className={`card h-100 hover-shadow ${styles.mbSmall}`}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="mb-0">
                      {getOpportunityIcon(opp.type)} {opp.title}
                    </h5>
                    <span className={`badge ${getOpportunityBadge(opp.type)}`}>
                      {opp.type}
                    </span>
                  </div>
                  <p className="text-muted small mb-2">{opp.organization}</p>
                  <p className="mb-3">{opp.description?.substring(0, 150)}...</p>
                  
                  <div className="mb-3">
                    <small className="text-muted">
                       {opp.location || 'Remote'} • 
                       Deadline: {new Date(opp.deadline).toLocaleDateString()}
                    </small>
                  </div>

                  <div className="d-flex gap-2">
                    <a href={opp.link} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary">
                      Apply Now
                    </a>
                    <button className="btn btn-sm btn-outline-secondary">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

