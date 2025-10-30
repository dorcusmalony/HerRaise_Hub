import { useState, useEffect } from 'react'
import { trackOpportunityClick, trackUserReturn } from '../services/opportunityTracking'
import { saveInteractionToStorage, hasUserInteracted, addTrackingParams, getOpportunityIdFromUrl, cleanTrackingParams } from '../utils/trackingHelpers'
import { useToast } from '../hooks/useToast'

export const useOpportunityTracking = () => {
  const [showInterestModal, setShowInterestModal] = useState(false)
  const [selectedOpportunity, setSelectedOpportunity] = useState(null)
  const [loading, setLoading] = useState(false)
  const { showToast, ToastContainer } = useToast()

  // Check for return tracking when component mounts
  useEffect(() => {
    const checkForInterestPopup = async () => {
      const opportunityId = getOpportunityIdFromUrl()
      
      if (opportunityId) {
        // Check if we've already shown popup for this opportunity
        if (hasUserInteracted(opportunityId, 'popup_shown')) {
          cleanTrackingParams()
          return
        }
        
        setLoading(true)
        try {
          const result = await trackUserReturn(opportunityId)
          if (result.success && result.showInterestPopup) {
            setSelectedOpportunity(result.opportunity)
            setShowInterestModal(true)
            
            // Save to local storage
            saveInteractionToStorage(opportunityId, 'popup_shown')
            
            showToast('Welcome back! How was your experience?', 'info')
          }
          
          // Clean up URL parameters
          cleanTrackingParams()
        } catch (error) {
          console.error('Return tracking failed:', error)
          showToast('Failed to track your return', 'error')
        } finally {
          setLoading(false)
        }
      }
    }
    
    checkForInterestPopup()
  }, [showToast])

  // Handle apply button click with tracking
  const handleApplyClick = async (opportunity) => {
    setLoading(true)
    showToast('Opening application...', 'info', 2000)
    
    try {
      // Save interaction to local storage
      saveInteractionToStorage(opportunity.id, 'apply_clicked')
      
      const result = await trackOpportunityClick(opportunity.id)
      if (result.success && result.redirectUrl) {
        // Open external link with tracking
        const trackingUrl = addTrackingParams(result.redirectUrl, opportunity.id)
        window.open(trackingUrl, '_blank')
        showToast('Application opened successfully!', 'success')
        return true
      } else if (opportunity.applicationUrl) {
        // Fallback to direct URL with tracking
        const trackingUrl = addTrackingParams(opportunity.applicationUrl, opportunity.id)
        window.open(trackingUrl, '_blank')
        showToast('Application opened successfully!', 'success')
        return true
      }
    } catch (error) {
      console.error('Apply click tracking failed:', error)
      showToast('Failed to track click, but opening application...', 'warning')
      
      // Fallback to direct URL
      if (opportunity.applicationUrl) {
        const trackingUrl = addTrackingParams(opportunity.applicationUrl, opportunity.id)
        window.open(trackingUrl, '_blank')
        return true
      }
    } finally {
      setLoading(false)
    }
    
    showToast('No application URL available', 'error')
    return false
  }

  const closeInterestModal = () => {
    setShowInterestModal(false)
    setSelectedOpportunity(null)
  }

  const handleInterestSuccess = (message) => {
    showToast(message, 'success')
    // Save interaction to local storage
    if (selectedOpportunity) {
      saveInteractionToStorage(selectedOpportunity.id, 'marked_interested')
    }
  }

  return {
    showInterestModal,
    selectedOpportunity,
    loading,
    handleApplyClick,
    closeInterestModal,
    handleInterestSuccess,
    ToastContainer
  }
}