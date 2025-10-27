import { useState } from 'react'

export default function ApplicationModal({ opportunity, onClose, onSave }) {
  const [status, setStatus] = useState('applied')
  const [notes, setNotes] = useState('')

  const handleSave = () => {
    onSave({
      opportunityId: opportunity.id,
      status,
      notes,
      appliedAt: new Date().toISOString()
    })
    onClose()
  }

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Track Application</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <h6>{opportunity.title}</h6>
            <p className="text-muted">{opportunity.organization}</p>
            
            <div className="mb-3">
              <label className="form-label">Application Status</label>
              <select 
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="applied"> Applied</option>
                <option value="under_review"> Under Review</option>
                <option value="interview"> Interview Scheduled</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Notes (Optional)</label>
              <textarea 
                className="form-control"
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about your application..."
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>Save Application</button>
          </div>
        </div>
      </div>
    </div>
  )
}