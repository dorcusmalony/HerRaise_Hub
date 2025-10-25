import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { getSocket, requestNotificationPermission } from '../../services/socketService'
import ScholarshipTracker from '../../components/ScholarshipTracker'
import styles from '../../styles/Pages.module.css'

export default function Opportunities() {
  const { t, i18n } = useTranslation()
  const API = import.meta.env.VITE_API_URL || ''
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, internship, scholarship, event
  const [status, setStatus] = useState('active')
  const [priority, setPriority] = useState('')
  const [search, setSearch] = useState('')
  const [applications, setApplications] = useState({})
  const [reminders, setReminders] = useState([])
  const [showTracker, setShowTracker] = useState(false)

  // Real-time updates
  useEffect(() => {
    requestNotificationPermission()
    const socket = getSocket()
    if (socket) {
      socket.on('opportunity:new', (data) => {
        setOpportunities(prev => [data, ...prev])
      })
      socket.on('opportunity:deadline_reminder', (data) => {
        setReminders(prev => [...prev, data])
      })
      // Clean up listeners
      return () => {
        socket.off('opportunity:new')
        socket.off('opportunity:deadline_reminder')
      }
    }
  }, [])

  // Fetch opportunities
  const fetchOpportunities = useCallback(async () => {
    const token = localStorage.getItem('token')
    const lang = i18n.language || 'en'
    const params = new URLSearchParams({
      filter,
      type: filter !== 'all' ? filter : '',
      status,
      priority,
      search,
      lang
    })
    try {
      const response = await fetch(`${API}/api/opportunities?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setOpportunities(data.opportunities || [])
      } else if (response.status === 401 || response.status === 404) {
        // Backend doesn't support opportunities yet
        console.warn('Opportunities endpoint not available')
        setOpportunities([])
      }
    } catch (error) {
      console.error('Error fetching opportunities:', error)
      setOpportunities([])
    } finally {
      setLoading(false)
    }
  }, [API, filter, status, priority, search, i18n.language])

  useEffect(() => {
    fetchOpportunities()
  }, [fetchOpportunities])

  // Fetch application status for current user
  useEffect(() => {
    const token = localStorage.getItem('token')
    async function fetchApplications() {
      try {
        const res = await fetch(`${API}/api/opportunities/applications`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        if (res.ok) {
          const data = await res.json()
          setApplications(data.applications || {})
        }
      } catch (e) {
        // ignore
      }
    }
    fetchApplications()
  }, [API])

  // Apply for opportunity
  const handleApply = async (oppId) => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${API}/api/opportunities/${oppId}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (res.ok) {
        const data = await res.json()
        setApplications(prev => ({
          ...prev,
          [oppId]: data.application
        }))
        alert('Application submitted!')
      } else {
        alert('Failed to apply. Try again.')
      }
    } catch (e) {
      alert('Error applying.')
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
          <span className="visually-hidden">{t('loading')}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={`d-flex justify-content-between align-items-center mb-4 ${styles.mbSmall}`}>
        <div>
          <h2 className={styles.heroTitle}>{t('opportunities')}</h2>
          <p className="text-muted mb-0">{t('opportunities_subtitle')}</p>
        </div>
        <button 
          className="btn btn-outline-primary"
          onClick={() => setShowTracker(!showTracker)}
        >
          {showTracker ? 'Hide' : 'Show'} My Applications
        </button>
      </div>

      {showTracker && (
        <div className="mb-4">
          <ScholarshipTracker />
        </div>
      )}

      {/* Reminders */}
      {reminders.length > 0 && (
        <div className="alert alert-warning">
          <strong>Reminders:</strong>
          <ul>
            {reminders.map((r, idx) => (
              <li key={idx}>{r.message || 'Deadline approaching!'}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Enhanced Filter Bar */}
      <div className={`card mb-4 ${styles.mbSmall}`}>
        <div className="card-body">
          <div className="row g-3">
            {/* Type Filter */}
            <div className="col-md-3">
              <label className="form-label small text-muted">{t('type')}:</label>
              <select className="form-select" value={filter} onChange={e => setFilter(e.target.value)}>
                <option value="all">{t('all')}</option>
                <option value="internship">{t('internships')}</option>
                <option value="scholarship">{t('scholarships')}</option>
                <option value="event">{t('events')}</option>
              </select>
            </div>
            {/* Status Filter */}
            <div className="col-md-3">
              <label className="form-label small text-muted">{t('status')}:</label>
              <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
                <option value="active">{t('active')}</option>
                <option value="closed">{t('closed')}</option>
                <option value="upcoming">{t('upcoming')}</option>
              </select>
            </div>
            {/* Priority Filter */}
            <div className="col-md-3">
              <label className="form-label small text-muted">{t('priority')}:</label>
              <select className="form-select" value={priority} onChange={e => setPriority(e.target.value)}>
                <option value="">{t('all')}</option>
                <option value="high">{t('high')}</option>
                <option value="medium">{t('medium')}</option>
                <option value="low">{t('low')}</option>
              </select>
            </div>
            {/* Search */}
            <div className="col-md-3">
              <label className="form-label small text-muted">{t('search')}:</label>
              <input
                type="text"
                className="form-control"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t('search_placeholder')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="row">
        {opportunities.length === 0 ? (
          <div className="col-12">
            <div className={`card ${styles.mbSmall}`}>
              <div className="card-body text-center py-5">
                <h4 className="text-muted mb-3">{t('no_opportunities')}</h4>
                <p className="text-muted">{t('check_back_soon')}</p>
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
                      {opp.title}
                      {opp.isFeatured && (
                        <span className="badge bg-warning text-dark ms-2">Featured</span>
                      )}
                    </h5>
                    <span className={`badge ${getOpportunityBadge(opp.type)}`}>
                      {t(opp.type)}
                    </span>
                  </div>
                  <p className="text-muted small mb-2">{opp.organization}</p>
                  <p className="mb-3">{opp.description?.substring(0, 150)}...</p>
                  
                  {/* Amount and Priority */}
                  {opp.amount && (
                    <div className="mb-2">
                      <span className="badge bg-success me-2">Amount: {opp.amount}</span>
                    </div>
                  )}
                  {opp.priority && (
                    <div className="mb-2">
                      <span className={`badge ${opp.priority === 'high' ? 'bg-danger' : 'bg-secondary'}`}>Priority: {opp.priority}</span>
                    </div>
                  )}

                  <div className="mb-3">
                    <small className="text-muted">
                       {opp.location || t('remote')} • 
                       {t('deadline')}: {new Date(opp.deadline).toLocaleDateString()}
                    </small>
                  </div>

                  {/* Tags */}
                  {opp.tags && opp.tags.length > 0 && (
                    <div className="mb-2">
                      {opp.tags.map((tag, idx) => (
                        <span key={idx} className="badge bg-light text-dark border me-1">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Application section */}
                  <div className="mb-3">
                    {applications[opp.id] ? (
                      <div>
                        <span className="badge bg-success">Applied</span>
                        <span className="ms-2">Status: {applications[opp.id].status}</span>
                        {applications[opp.id].reminder && (
                          <span className="ms-2 text-warning">{applications[opp.id].reminder}</span>
                        )}
                      </div>
                    ) : (
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => handleApply(opp.id)}
                      >
                        Apply Now
                      </button>
                    )}
                  </div>

                  <div className="d-flex gap-2">
                    <a href={opp.link} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-secondary">
                      {t('details')}
                    </a>
                    <button className="btn btn-sm btn-outline-secondary">
                      {t('save')}
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

