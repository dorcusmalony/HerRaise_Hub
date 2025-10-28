import { useState, useEffect } from 'react'
import { applicationTrackerAPI } from '../services/applicationTrackerAPI'

export function useApplicationTracker() {
  const [applications, setApplications] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(false)

  const fetchApplications = async (filters = {}) => {
    setLoading(true)
    try {
      const data = await applicationTrackerAPI.getMyApplications(filters)
      if (data.success) {
        setApplications(data.applications)
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const data = await applicationTrackerAPI.getStats()
      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const trackApplication = async (opportunityId, status, notes) => {
    try {
      const result = await applicationTrackerAPI.trackApplication(opportunityId, status, notes)
      if (result.success) {
        fetchApplications()
        fetchStats()
      }
      return result
    } catch (error) {
      console.error('Failed to track application:', error)
      return { success: false, error: error.message }
    }
  }

  const updateStatus = async (id, status, notes) => {
    try {
      const result = await applicationTrackerAPI.updateStatus(id, status, notes)
      if (result.success) {
        setApplications(prev => 
          prev.map(app => 
            app.id === id ? { ...app, status, notes } : app
          )
        )
        fetchStats()
      }
      return result
    } catch (error) {
      console.error('Failed to update status:', error)
      return { success: false, error: error.message }
    }
  }

  const setReminder = async (id, reminderDate, message) => {
    try {
      const result = await applicationTrackerAPI.setReminder(id, reminderDate, message)
      if (result.success) {
        setApplications(prev => 
          prev.map(app => 
            app.id === id ? { ...app, nextReminderDate: reminderDate } : app
          )
        )
      }
      return result
    } catch (error) {
      console.error('Failed to set reminder:', error)
      return { success: false, error: error.message }
    }
  }

  useEffect(() => {
    fetchApplications()
    fetchStats()
  }, [])

  return {
    applications,
    stats,
    loading,
    fetchApplications,
    trackApplication,
    updateStatus,
    setReminder
  }
}