const API_URL = import.meta.env.VITE_API_URL || ''

export const getClickedOpportunities = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/api/tracking/clicked-opportunities`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('Clicked opportunities data:', data)
      return data || []
    } else {
      console.error('Failed to fetch clicked opportunities:', response.status)
    }
    return []
  } catch (error) {
    console.error('Error fetching clicked opportunities:', error)
    return []
  }
}

export const getDashboardData = async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/api/dashboard`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      return await response.json()
    }
    return null
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return null
  }
}