import React, { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PendingOpportunitiesPopup from '../components/Notifications/PendingOpportunitiesPopup'

const NotificationContext = createContext()

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [showPendingPopup, setShowPendingPopup] = useState(false)
  const [pendingOpportunities, setPendingOpportunities] = useState([])
  const navigate = useNavigate()

  const showPendingOpportunitiesPopup = (opportunities) => {
    setPendingOpportunities(opportunities)
    setShowPendingPopup(true)
    
    // Also add these as notifications to the bell
    opportunities.forEach(opp => {
      const notification = {
        id: `deadline_${opp.id}`,
        type: 'deadline_reminder',
        title: `Deadline Reminder: ${opp.title}`,
        message: opp.message,
        createdAt: new Date().toISOString(),
        readStatus: false,
        data: {
          opportunityId: opp.id,
          priority: opp.priority
        }
      }
      
      // Dispatch event for notification bell
      window.dispatchEvent(new CustomEvent('new-notification', {
        detail: notification
      }))
    })
  }

  const handleViewOpportunity = (opportunityId) => {
    setShowPendingPopup(false)
    navigate(`/opportunities/${opportunityId}`)
  }

  const handleClosePopup = () => {
    setShowPendingPopup(false)
    // Navigate to dashboard after closing popup
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    if (userData.role === 'admin') {
      navigate('/admin/dashboard')
    } else {
      navigate('/dashboard')
    }
  }

  const value = {
    showPendingOpportunitiesPopup,
    handleViewOpportunity,
    handleClosePopup
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {showPendingPopup && (
        <PendingOpportunitiesPopup
          opportunities={pendingOpportunities}
          onClose={handleClosePopup}
          onViewOpportunity={handleViewOpportunity}
        />
      )}
    </NotificationContext.Provider>
  )
}