const API_URL = import.meta.env.VITE_API_URL || ''

const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
})

export const opportunityAPI = {
  // Get opportunities with filters
  async getOpportunities(filters = {}) {
    const params = new URLSearchParams(filters)
    const response = await fetch(`${API_URL}/api/opportunity-board?${params}`, {
      headers: getAuthHeaders()
    })
    return response.json()
  },

  // Get single opportunity
  async getOpportunity(id) {
    const response = await fetch(`${API_URL}/api/opportunities/${id}`, {
      headers: getAuthHeaders()
    })
    return response.json()
  },

  // Apply to opportunity
  async applyToOpportunity(id, applicationData) {
    const response = await fetch(`${API_URL}/api/opportunities/${id}/apply`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ applicationData })
    })
    return response.json()
  },

  // Track application click
  async trackClick(id) {
    const response = await fetch(`${API_URL}/api/opportunity-board/${id}/apply`, {
      method: 'POST',
      headers: getAuthHeaders()
    })
    return response.json()
  },

  // Toggle bookmark
  async toggleBookmark(id) {
    const response = await fetch(`${API_URL}/api/opportunity-board/${id}/bookmark`, {
      method: 'POST',
      headers: getAuthHeaders()
    })
    return response.json()
  },

  // Get bookmarked opportunities
  async getBookmarked() {
    const response = await fetch(`${API_URL}/api/opportunity-board/bookmarked`, {
      headers: getAuthHeaders()
    })
    return response.json()
  },

  // Get urgent opportunities
  async getUrgent() {
    const response = await fetch(`${API_URL}/api/opportunity-board/urgent`, {
      headers: getAuthHeaders()
    })
    return response.json()
  },

  // Get statistics
  async getStats() {
    const response = await fetch(`${API_URL}/api/opportunity-board/stats`, {
      headers: getAuthHeaders()
    })
    return response.json()
  }
}