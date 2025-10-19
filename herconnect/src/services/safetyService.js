const API_URL = import.meta.env.VITE_API_URL || ''

export const safetyService = {
  // Submit safety report
  async submitReport(reportData) {
    const token = localStorage.getItem('token')
    
    const response = await fetch(`${API_URL}/api/safety-resources/report`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(reportData)
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || 'Failed to submit report')
    }
    
    return response.json()
  },

  // Get report types and urgency levels
  async getReportTypes() {
    const response = await fetch(`${API_URL}/api/safety-resources/report-types`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch report types')
    }
    
    return response.json()
  },

  // Get legal advice information
  async getLegalAdvice() {
    const token = localStorage.getItem('token')
    
    const response = await fetch(`${API_URL}/api/safety-resources/legal-advice`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch legal advice')
    }
    
    return response.json()
  },

  // Submit emergency alert
  async sendEmergencyAlert(alertData) {
    const token = localStorage.getItem('token')
    
    const response = await fetch(`${API_URL}/api/safety-resources/emergency-alert`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(alertData)
    })
    
    if (!response.ok) {
      throw new Error('Failed to send emergency alert')
    }
    
    return response.json()
  },

  // Get my reports
  async getMyReports() {
    const token = localStorage.getItem('token')
    
    const response = await fetch(`${API_URL}/api/safety-resources/my-reports`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch reports')
    }
    
    return response.json()
  }
}
