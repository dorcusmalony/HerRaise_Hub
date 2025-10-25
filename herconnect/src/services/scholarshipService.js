import { apiClient } from '../utils/api.js'

export const scholarshipService = {
  // Get all scholarships/opportunities
  async getAll(filter = 'all') {
    try {
      const response = await apiClient.get(`/api/opportunities?filter=${filter}`)
      return response.opportunities || []
    } catch (error) {
      console.error('Error fetching scholarships:', error)
      throw error
    }
  },

  // Create new scholarship/opportunity
  async create(scholarshipData) {
    try {
      const response = await apiClient.post('/api/opportunities', scholarshipData)
      return response
    } catch (error) {
      console.error('Error creating scholarship:', error)
      throw error
    }
  },

  // Update existing scholarship/opportunity
  async update(id, scholarshipData) {
    try {
      const response = await apiClient.put(`/api/opportunities/${id}`, scholarshipData)
      return response
    } catch (error) {
      console.error('Error updating scholarship:', error)
      throw error
    }
  },

  // Delete scholarship/opportunity
  async delete(id) {
    try {
      await apiClient.delete(`/api/opportunities/${id}`)
      return true
    } catch (error) {
      console.error('Error deleting scholarship:', error)
      throw error
    }
  },

  // Get scholarship by ID
  async getById(id) {
    try {
      const response = await apiClient.get(`/api/opportunities/${id}`)
      return response
    } catch (error) {
      console.error('Error fetching scholarship:', error)
      throw error
    }
  },

  // Apply to scholarship (for users)
  async apply(scholarshipId, applicationData) {
    try {
      const response = await apiClient.post(`/api/opportunities/${scholarshipId}/apply`, applicationData)
      return response
    } catch (error) {
      console.error('Error applying to scholarship:', error)
      throw error
    }
  },

  // Get user's applications
  async getUserApplications() {
    try {
      const response = await apiClient.get('/api/opportunities/applications')
      return response.applications || []
    } catch (error) {
      console.error('Error fetching user applications:', error)
      throw error
    }
  },

  // Get applications for a specific scholarship (admin only)
  async getScholarshipApplications(scholarshipId) {
    try {
      const response = await apiClient.get(`/api/opportunities/${scholarshipId}/applications`)
      return response.applications || []
    } catch (error) {
      console.error('Error fetching scholarship applications:', error)
      throw error
    }
  }
}

export default scholarshipService