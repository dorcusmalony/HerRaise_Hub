// services/adminAPI.js
const API_BASE = import.meta.env.VITE_API_URL;

export const adminAPI = {
  getOpportunityStats: async () => {
    const response = await fetch(`${API_BASE}/admin/opportunities/stats`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.json();
  },
  
  getOpportunities: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE}/admin/opportunities?${params}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.json();
  },
  
  createOpportunity: async (data) => {
    const response = await fetch(`${API_BASE}/admin/opportunities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  updateOpportunity: async (id, data) => {
    const response = await fetch(`${API_BASE}/admin/opportunities/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  },
  
  deleteOpportunity: async (id) => {
    const response = await fetch(`${API_BASE}/admin/opportunities/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.json();
  },

  getApplications: async (opportunityId = null) => {
    const url = opportunityId 
      ? `${API_BASE}/admin/opportunities/${opportunityId}/applications`
      : `${API_BASE}/admin/applications`;
    
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    });
    return response.json();
  },

  updateApplicationStatus: async (applicationId, status) => {
    const response = await fetch(`${API_BASE}/admin/applications/${applicationId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ status })
    });
    return response.json();
  }
};