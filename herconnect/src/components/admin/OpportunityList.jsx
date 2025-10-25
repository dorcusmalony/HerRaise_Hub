import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/adminAPI';

const OpportunityList = ({ onEdit, onDelete }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    search: ''
  });
  
  const fetchOpportunities = async () => {
    try {
      const data = await adminAPI.getOpportunities(filters);
      setOpportunities(data.opportunities || []);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
    }
  };
  
  useEffect(() => {
    fetchOpportunities();
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (id) => {
    if (confirm('Delete this opportunity?')) {
      try {
        await adminAPI.deleteOpportunity(id);
        setOpportunities(prev => prev.filter(opp => opp.id !== id));
        onDelete?.(id);
      } catch (error) {
        alert('Error deleting opportunity');
      }
    }
  };
  
  return (
    <div className="opportunity-list">
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <select 
                className="form-select"
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
              >
                <option value="">All Types</option>
                <option value="scholarship">Scholarships</option>
                <option value="internship">Internships</option>
                <option value="event">Events</option>
              </select>
            </div>
            
            <div className="col-md-4">
              <select 
                className="form-select"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <div className="col-md-4">
              <input 
                type="text" 
                className="form-control"
                placeholder="Search..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>Title</th>
              <th>Type</th>
              <th>Organization</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map(opp => (
              <tr key={opp.id}>
                <td>
                  <strong>{opp.title}</strong>
                  {opp.isFeatured && <span className="badge bg-warning ms-2">Featured</span>}
                </td>
                <td>
                  <span className={`badge ${
                    opp.type === 'scholarship' ? 'bg-success' : 
                    opp.type === 'internship' ? 'bg-primary' : 'bg-info'
                  }`}>
                    {opp.type}
                  </span>
                </td>
                <td>{opp.organization}</td>
                <td>{new Date(opp.deadline).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${opp.isActive ? 'bg-success' : 'bg-secondary'}`}>
                    {opp.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="btn-group btn-group-sm">
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => onEdit?.(opp)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-outline-danger"
                      onClick={() => handleDelete(opp.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {opportunities.length === 0 && (
        <div className="text-center py-4">
          <p className="text-muted">No opportunities found</p>
        </div>
      )}
    </div>
  );
};

export default OpportunityList;