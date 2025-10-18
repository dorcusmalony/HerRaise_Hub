const API_URL = import.meta.env.VITE_API_URL || 'https://herraise-hub-backend-1.onrender.com'

export const apiClient = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token')
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
      }
    }

    const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`
    
    try {
      const response = await fetch(url, config)
      
      // Handle non-JSON responses
      const contentType = response.headers.get('content-type')
      const isJSON = contentType && contentType.includes('application/json')
      
      const data = isJSON ? await response.json() : await response.text()
      
      if (!response.ok) {
        // Handle specific status codes
        if (response.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          window.location.href = '/login'
          throw new Error('Session expired. Please login again.')
        } else if (response.status === 404) {
          throw new Error('API endpoint not found. Please check the backend.')
        } else if (response.status === 500) {
          throw new Error('Server error. Please try again later.')
        }
        
        throw new Error(data.message || data.error || `Request failed (${response.status})`)
      }
      
      return data
    } catch (err) {
      if (err.message.includes('Failed to fetch')) {
        throw new Error('Cannot connect to server. Please check your internet connection.')
      }
      throw err
    }
  },

  get(endpoint, options) {
    return this.request(endpoint, { ...options, method: 'GET' })
  },

  post(endpoint, body, options) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body)
    })
  },

  put(endpoint, body, options) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body)
    })
  },

  delete(endpoint, options) {
    return this.request(endpoint, { ...options, method: 'DELETE' })
  }
}

export default apiClient
