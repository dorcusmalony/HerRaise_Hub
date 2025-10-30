const API_URL = import.meta.env.VITE_API_URL || ''

export const trackOpportunityClick = async (opportunityId) => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/api/opportunity-tracking/${opportunityId}/track-click`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Tracking click failed:', error)
    return { success: false }
  }
}

export const trackUserReturn = async (opportunityId) => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/api/opportunity-tracking/${opportunityId}/track-return`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Return tracking failed:', error)
    return { success: false }
  }
}

export const markAsInterested = async (opportunityId, wantsReminder = false) => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/api/opportunity-tracking/${opportunityId}/interested`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ wantsReminder })
    })
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Interest tracking failed:', error)
    return { success: false }
  }
}

export const getInterestedOpportunities = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/api/opportunity-tracking/interested`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to get interested opportunities:', error)
    return { success: false, opportunities: [] }
  }
}