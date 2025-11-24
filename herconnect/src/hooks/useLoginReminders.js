import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || ''

export function useLoginReminders() {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`${API_URL}/api/notifications`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          const reminders = data.notifications?.filter(
            notif => notif.type === 'application_update'
          ) || []
          setNotifications(reminders)
        }
      } catch (error) {
        console.error('Error fetching notifications:', error)
      }
    }

    fetchNotifications()
  }, [])

  const dismissNotification = (index) => {
    setNotifications(prev => prev.filter((_, i) => i !== index))
  }

  return { notifications, dismissNotification }
}
