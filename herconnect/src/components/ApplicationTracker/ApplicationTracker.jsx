import { useState, useEffect } from 'react'

export default function ApplicationTracker() {
  const [applications, setApplications] = useState([])

  useEffect(() => {
    // Mock data for demonstration
    setApplications([
      {
        id: 1,
        opportunity: {
          title: "UN Women Leadership Scholarship",
          organization: "UN Women",
          deadline: "2024-12-31",
          applicationLink: "https://unwomen.org/scholarship/apply"
        },
        status: "applied",
        appliedAt: "2024-11-01"
      }
    ])
  }, [])

  const updateStatus = async (applicationId, newStatus) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      )
    )
  }

  const getStatusColor = (status) => {
    const colors = {
      'applied': '#3b82f6',
      'under_review': '#f59e0b', 
      'interview': '#8b5cf6',
      'accepted': '#10b981',
      'rejected': '#ef4444'
    }
    return colors[status] || '#6b7280'
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5>📋 My Applications ({applications.length})</h5>
      </div>
      <div className="card-body">
        {applications.length === 0 ? (
          <p className="text-muted">No applications tracked yet.</p>
        ) : (
          applications.map(app => (
            <div key={app.id} className="border rounded p-3 mb-3">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h6 className="mb-1">{app.opportunity.title}</h6>
                  <small className="text-muted">{app.opportunity.organization}</small>
                </div>
                <select 
                  className="form-select form-select-sm"
                  style={{ width: 'auto', borderColor: getStatusColor(app.status) }}
                  value={app.status} 
                  onChange={(e) => updateStatus(app.id, e.target.value)}
                >
                  <option value="applied">📝 Applied</option>
                  <option value="under_review">👀 Under Review</option>
                  <option value="interview">🎤 Interview</option>
                  <option value="accepted">✅ Accepted</option>
                  <option value="rejected">❌ Rejected</option>
                </select>
              </div>
              <div className="small text-muted">
                Applied: {new Date(app.appliedAt).toLocaleDateString()} • 
                Deadline: {new Date(app.opportunity.deadline).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}