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

// New function to set deadline reminder
export const setDeadlineReminder = async (opportunityId, deadline) => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/api/reminders/deadline`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        opportunityId,
        deadline,
        reminderType: 'deadline',
        reminderDays: 3,
        reminderTime: '09:00' // 9 AM
      })
    })
    return await response.json()
  } catch (error) {
    console.error('Failed to set deadline reminder:', error)
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
      body: JSON.stringify({ 
        wantsReminder,
        reminderTime: wantsReminder ? '09:00' : null, // 9 AM reminder
        reminderDays: wantsReminder ? 3 : null // 3 days before deadline
      })
    })
    
    const data = await response.json()
    
    // If user wants reminder, also set up deadline reminder
    if (wantsReminder && data.success) {
      await setDeadlineReminder(opportunityId, data.deadline)
    }
    
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

// Enhanced return tracking
export const trackUserReturn = async (opportunityId) => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/api/opportunity-tracking/${opportunityId}/track-return`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        returnedAt: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
      })
    })
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Return tracking failed:', error)
    return { success: false }
  }
}