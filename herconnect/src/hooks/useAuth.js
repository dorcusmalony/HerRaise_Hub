import { useState, useEffect } from 'react'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUser({
          id: payload.id || payload.userId,
          name: payload.name,
          email: payload.email
        })
      } catch (error) {
        console.error('Invalid token:', error)
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }, [])

  return { user, loading }
}