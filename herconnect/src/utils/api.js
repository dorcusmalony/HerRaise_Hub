const API_URL = import.meta.env.VITE_API_URL || ''

export const apiCall = async (endpoint, options = {}) => {
  const language = localStorage.getItem('language') || 'en'
  const token = localStorage.getItem('token')
  
  const url = `${API_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}lang=${language}`
  
  const defaultHeaders = {
    'Accept-Language': language,
    'Content-Type': 'application/json'
  }
  
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`
  }
  
  return fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  })
}

export default apiCall