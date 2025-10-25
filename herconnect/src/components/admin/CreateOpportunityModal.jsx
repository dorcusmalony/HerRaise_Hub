import { useState } from 'react';
import { adminAPI } from '../../services/adminAPI';

const CreateOpportunityModal = ({ opportunity = null, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: opportunity?.title || '',
    description: opportunity?.description || '',
    type: opportunity?.type || 'scholarship',
    deadline: opportunity?.deadline || '',
    amount: opportunity?.amount || '',
    organization: opportunity?.organization || '',
    location: opportunity?.location || '',
    priority: opportunity?.priority || 'medium',
    isFeatured: opportunity?.isFeatured || false,
    link: opportunity?.link || ''
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (opportunity) {
        await adminAPI.updateOpportunity(opportunity.id, formData);
      } else {
        await adminAPI.createOpportunity(formData);
      }
      onSuccess?.();
      onClose();
    } catch (error) {
      alert('Error saving opportunity');
    }
  };
  
  return (
    <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {opportunity ? 'Update' : 'Create'} Opportunity
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              
              <div className="mb-3">
                <textarea 
                  className="form-control"
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  required
                />
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <select 
                    className="form-select"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="scholarship">Scholarship</option>
                    <option value="internship">Internship</option>
                    <option value="event">Event</option>
                  </select>
                </div>
                
                <div className="col-md-6 mb-3">
                  <input 
                    type="date" 
                    className="form-control"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6 mb-3">
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="Amount/Prize"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="Organization"
                    value={formData.organization}
                    onChange={(e) => setFormData({...formData, organization: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <input 
                  type="url" 
                  className="form-control"
                  placeholder="Application Link"
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {opportunity ? 'Update' : 'Create'} Opportunity
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOpportunityModal;