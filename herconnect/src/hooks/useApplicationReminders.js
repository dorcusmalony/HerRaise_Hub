import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || ''

export function useApplicationReminders() {
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchReminders = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${API_URL}/api/reminders/incomplete-applications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setReminders(data.reminders || [])
      }
    } catch (error) {
      console.error('Error fetching reminders:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReminders()
  }, [])

  return { reminders, loading, refetch: fetchReminders }
}
