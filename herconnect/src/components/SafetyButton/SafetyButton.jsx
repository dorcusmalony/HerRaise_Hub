import { useState } from 'react'
import './SafetyButton.css'

export default function SafetyButton() {
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    reportType: '',
    urgencyLevel: '',
    location: '',
    locationOther: '',
    description: '',
    evidenceUrl: '',
    contactPreference: 'anonymous',
    contactEmail: '',
    contactPhone: '',
    acknowledged: false
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL || ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${API_URL}/api/safety-resources/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          ...formData,
          location: formData.location === 'Other' ? formData.locationOther : formData.location,
          isAnonymous: formData.contactPreference === 'anonymous'
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setTimeout(() => {
          setShowModal(false)
          setSuccess(false)
          // Reset form
          setFormData({
            reportType: '',
            urgencyLevel: '',
            location: '',
            locationOther: '',
            description: '',
            evidenceUrl: '',
            contactPreference: 'anonymous',
            contactEmail: '',
            contactPhone: '',
            acknowledged: false
          })
        }, 2000)
      } else {
        throw new Error(data.message || 'Failed to submit report')
      }
    } catch (error) {
      setError(error.message || 'Failed to submit report. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        className="safety-float-button"
        onClick={() => setShowModal(true)}
        title="Report Safety Concern"
      >
        <span className="safety-icon"></span>
        <span className="safety-text">Report</span>
      </button>

      {/* Modal */}
      {showModal && (
        <div className="safety-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="safety-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="safety-modal-close" onClick={() => setShowModal(false)}>×</button>
            
            {success ? (
              <div className="text-center p-5">
                <div style={{ fontSize: '4rem' }}>✅</div>
                <h3 className="mb-3">Report Submitted</h3>
                <p>Thank you. Our team will review it promptly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="text-danger mb-3"> Report Safety Concern</h3>
                <p className="text-muted mb-4">This form is confidential and secure.</p>

                {/* Report Type */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Report Type *</label>
                  <select 
                    className="form-select" 
                    value={formData.reportType}
                    onChange={(e) => setFormData({...formData, reportType: e.target.value})}
                    required
                  >
                    <option value="">Select type...</option>
                    <option value="harassment">Harassment</option>
                    <option value="bullying_cyberbullying">Bullying/Cyberbullying</option>
                    <option value="inappropriate_content">Inappropriate Content</option>
                    <option value="unsafe_situation">Unsafe Situation</option>
                    <option value="legal_advice">Need Legal Advice</option>
                    <option value="other">Other Safety Concern</option>
                  </select>
                </div>

                {/* Urgency Level */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Urgency Level *</label>
                  <select 
                    className="form-select" 
                    value={formData.urgencyLevel}
                    onChange={(e) => setFormData({...formData, urgencyLevel: e.target.value})}
                    required
                  >
                    <option value="">Select urgency...</option>
                    <option value="critical">🔴 Critical (Immediate danger)</option>
                    <option value="high">🟠 High (Needs quick attention)</option>
                    <option value="medium">🟡 Medium (Important but not urgent)</option>
                    <option value="low">🟢 Low (General inquiry)</option>
                  </select>
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Describe what happened *</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Please provide details..."
                    required
                  />
                </div>

                {/* Location */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Where did this happen?</label>
                  <select 
                    className="form-select" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  >
                    <option value="">Select location...</option>
                    <option value="Forum/Discussion">Forum/Discussion</option>
                    <option value="Private Messages">Private Messages</option>
                    <option value="Mentor Session">Mentor Session</option>
                    <option value="Outside Platform">Outside Platform</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Contact Preference */}
                <div className="mb-3">
                  <label className="form-label fw-bold">Contact Preference</label>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="contactPreference"
                      value="anonymous"
                      checked={formData.contactPreference === 'anonymous'}
                      onChange={(e) => setFormData({...formData, contactPreference: e.target.value})}
                    />
                    <label className="form-check-label">Anonymous</label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="contactPreference"
                      value="email"
                      checked={formData.contactPreference === 'email'}
                      onChange={(e) => setFormData({...formData, contactPreference: e.target.value})}
                    />
                    <label className="form-check-label">Email me updates</label>
                  </div>
                </div>

                {/* Acknowledgment */}
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={formData.acknowledged}
                      onChange={(e) => setFormData({...formData, acknowledged: e.target.checked})}
                      required
                    />
                    <label className="form-check-label small">
                      I understand this will be reviewed confidentially
                    </label>
                  </div>
                </div>

                {error && (
                  <div className="alert alert-danger">{error}</div>
                )}

                {/* Emergency Numbers */}
                <div className="alert alert-warning mb-3">
                  <strong>Need immediate help?</strong><br />
                  📞 Emergency: 777 • GBV Hotline: 1212
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-danger flex-grow-1" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
