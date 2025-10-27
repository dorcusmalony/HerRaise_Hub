import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || ''

class OpportunityService {
  // Get all opportunities
  async getOpportunities(filters = {}) {
    try {
      const response = await axios.get(`${API_URL}/api/opportunity-board`, {
        params: filters,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching opportunities:', error)
      throw error
    }
  }

  // Track application click
  async trackApplication(opportunityId) {
    try {
      const response = await axios.post(`${API_URL}/api/opportunity-board/${opportunityId}/apply`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      return response.data
    } catch (error) {
      console.error('Error tracking application:', error)
      throw error
    }
  }

  // Bookmark opportunity
  async bookmarkOpportunity(opportunityId) {
    try {
      const response = await axios.post(`${API_URL}/api/opportunity-board/${opportunityId}/bookmark`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      return response.data
    } catch (error) {
      console.error('Error bookmarking opportunity:', error)
      throw error
    }
  }

  // Get bookmarked opportunities
  async getBookmarkedOpportunities() {
    try {
      const response = await axios.get(`${API_URL}/api/opportunity-board/bookmarked`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching bookmarked opportunities:', error)
      throw error
    }
  }

  // Get opportunity statistics
  async getStats() {
    try {
      const response = await axios.get(`${API_URL}/api/opportunity-board/stats`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching stats:', error)
      throw error
    }
  }
}

export const opportunityService = new OpportunityService()
export default opportunityService