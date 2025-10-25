import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/adminAPI';

const OpportunityStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    adminAPI.getOpportunityStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-3">
        <div className="spinner-border spinner-border-sm" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="row g-3 mb-4">
      <div className="col-md-3">
        <div className="card text-center border-primary">
          <div className="card-body">
            <h5 className="card-title text-primary">📊 Total</h5>
            <h2 className="text-primary">{stats?.total || 0}</h2>
          </div>
        </div>
      </div>
      
      <div className="col-md-3">
        <div className="card text-center border-success">
          <div className="card-body">
            <h5 className="card-title text-success">✅ Active</h5>
            <h2 className="text-success">{stats?.active || 0}</h2>
          </div>
        </div>
      </div>
      
      <div className="col-md-3">
        <div className="card text-center border-info">
          <div className="card-body">
            <h5 className="card-title text-info">🎓 Scholarships</h5>
            <h2 className="text-info">{stats?.scholarships || 0}</h2>
          </div>
        </div>
      </div>
      
      <div className="col-md-3">
        <div className="card text-center border-warning">
          <div className="card-body">
            <h5 className="card-title text-warning">💼 Internships</h5>
            <h2 className="text-warning">{stats?.internships || 0}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityStats;