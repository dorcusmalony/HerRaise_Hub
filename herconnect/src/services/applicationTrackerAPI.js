const API_URL = import.meta.env.VITE_API_URL || ''

const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
})

export const applicationTrackerAPI = {
  // Track new application
  async trackApplication(opportunityId, status, notes) {
    const response = await fetch(`${API_URL}/api/application-tracker/track`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ opportunityId, status, notes })
    })
    return response.json()
  },

  // Get my tracked applications
  async getMyApplications(filters = {}) {
    const params = new URLSearchParams(filters)
    const response = await fetch(`${API_URL}/api/application-tracker/my-applications?${params}`, {
      headers: getAuthHeaders()
    })
    return response.json()
  },

  // Update application status
  async updateStatus(id, status, notes) {
    const response = await fetch(`${API_URL}/api/application-tracker/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, notes })
    })
    return response.json()
  },

  // Set reminder
  async setReminder(id, reminderDate, message) {
    const response = await fetch(`${API_URL}/api/application-tracker/${id}/reminder`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reminderDate, message })
    })
    return response.json()
  },

  // Get statistics
  async getStats() {
    const response = await fetch(`${API_URL}/api/application-tracker/stats`, {
      headers: getAuthHeaders()
    })
    return response.json()
  }
}