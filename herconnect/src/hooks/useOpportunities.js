import { useState, useEffect, useCallback } from 'react'
import { opportunityAPI } from '../services/opportunityAPI'

export function useOpportunities(initialFilters = {}) {
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState(initialFilters)
  const [pagination, setPagination] = useState({})

  const fetchOpportunities = useCallback(async (newFilters = filters) => {
    setLoading(true)
    try {
      const data = await opportunityAPI.getOpportunities(newFilters)
      if (data.success) {
        setOpportunities(data.opportunities)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch opportunities:', error)
    } finally {
      setLoading(false)
    }
  }, [filters])

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    fetchOpportunities({ ...filters, ...newFilters })
  }

  const toggleBookmark = async (id) => {
    try {
      const result = await opportunityAPI.toggleBookmark(id)
      if (result.success) {
        setOpportunities(prev => 
          prev.map(opp => 
            opp.id === id ? { ...opp, bookmarked: result.bookmarked } : opp
          )
        )
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error)
    }
  }

  useEffect(() => {
    fetchOpportunities()
  }, [fetchOpportunities])

  return {
    opportunities,
    loading,
    filters,
    pagination,
    fetchOpportunities,
    updateFilters,
    toggleBookmark
  }
}