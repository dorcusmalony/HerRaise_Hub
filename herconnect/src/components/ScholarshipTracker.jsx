import { useState, useEffect } from 'react'

export default function ScholarshipTracker() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const API = import.meta.env.VITE_API_URL || ''

  useEffect(() => {
    fetchApplications()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchApplications = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`${API}/api/opportunities/applications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setApplications(data.applications || [])
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      accepted: '#10b981',
      rejected: '#ef4444',
      submitted: '#3b82f6'
    }
    return colors[status] || '#6b7280'
  }

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">🎯 My Applications</h5>
      </div>
      <div className="card-body">
        {applications.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted">No applications yet. Start applying to opportunities!</p>
          </div>
        ) : (
          <div className="row">
            {applications.map(app => (
              <div key={app.id} className="col-md-6 mb-3">
                <div className="card border-start border-4" style={{borderLeftColor: getStatusColor(app.status)}}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="card-title mb-0">{app.opportunity.title}</h6>
                      <span 
                        className="badge rounded-pill"
                        style={{backgroundColor: getStatusColor(app.status), color: 'white'}}
                      >
                        {app.status}
                      </span>
                    </div>
                    <p className="text-muted small mb-2">{app.opportunity.organization}</p>
                    <div className="small text-muted">
                      <div>Applied: {new Date(app.appliedAt).toLocaleDateString()}</div>
                      <div>Deadline: {new Date(app.opportunity.deadline).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}