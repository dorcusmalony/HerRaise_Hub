const API_URL = import.meta.env.VITE_API_URL || ''

export const profileService = {
  // Get current user profile
  async getProfile() {
    const token = localStorage.getItem('token')
    
    if (!token) {
      throw new Error('No authentication token found')
    }
    
    console.log('📡 Calling GET /api/profile with token:', token.substring(0, 20) + '...')
    
    const response = await fetch(`${API_URL}/api/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log('📥 Profile response status:', response.status)
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('401 Unauthorized')
      }
      const errorText = await response.text()
      console.error('❌ Profile fetch failed:', errorText)
      throw new Error(`Failed to fetch profile: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('✅ Profile data received:', data)
    
    return data
  },

  // Update user profile
  async updateProfile(profileData) {
    const token = localStorage.getItem('token')
    
    if (!token) {
      throw new Error('No authentication token found')
    }
    
    const response = await fetch(`${API_URL}/api/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || 'Failed to update profile')
    }
    
    return response.json()
  },

  // Upload profile picture
  async uploadProfilePicture(file) {
    const token = localStorage.getItem('token')
    
    if (!token) {
      throw new Error('No authentication token found')
    }

    const formData = new FormData()
    formData.append('profilePicture', file)
    
    const response = await fetch(`${API_URL}/api/profile/picture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || 'Failed to upload profile picture')
    }
    
    return response.json()
  },

  // Delete profile picture
  async deleteProfilePicture() {
    const token = localStorage.getItem('token')
    
    if (!token) {
      throw new Error('No authentication token found')
    }
    
    const response = await fetch(`${API_URL}/api/profile/picture`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || 'Failed to delete profile picture')
    }
    
    return response.json()
  },

  // Change language preference
  async changeLanguage(language) {
    const token = localStorage.getItem('token')
    
    if (!token) {
      throw new Error('No authentication token found')
    }
    
    const response = await fetch(`${API_URL}/api/profile/language`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ language })
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || 'Failed to change language')
    }
    
    return response.json()
  }
}