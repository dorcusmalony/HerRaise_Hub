import { useState, useEffect, useCallback } from 'react'
import { getSocket } from '../../services/socketService'
import { toast } from 'react-toastify'
import { useApplicationReminders } from '../../hooks/useApplicationReminders'
import { useLanguage } from '../../hooks/useLanguage'
import styles from './Opportunities.module.css'
import './purple-buttons.css'

const API_URL = import.meta.env.VITE_API_URL || ''


  

export default function Opportunities() {
  const { t } = useLanguage()
  const [opportunities, setOpportunities] = useState([])
  const [likedOpportunities, setLikedOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarLoading, setSidebarLoading] = useState(true)
  const [opportunityStatuses, setOpportunityStatuses] = useState({})
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [bookmarked, setBookmarked] = useState(false)
  const [showNewOpportunityBanner, setShowNewOpportunityBanner] = useState(false)
  const { reminders } = useApplicationReminders()



  const fetchOpportunities = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        type: filter !== 'all' ? filter : '',
        search,
        bookmarked: bookmarked.toString()
      })
      
      const response = await fetch(`${API_URL}/api/opportunity-board?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setOpportunities(data.opportunities || [])
      } else {
        setOpportunities([])
      }
    } catch (error) {
      console.error('Error fetching opportunities:', error)
      setOpportunities([])
    } finally {
      setLoading(false)
    }
  }, [filter, search, bookmarked])

  const fetchSidebarOpportunities = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/tracking/clicked-opportunities`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      console.log('📊 Sidebar fetch response:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('📊 BACKEND RESPONSE:', JSON.stringify(data, null, 2))
        
        // Set opportunities from backend response
        if (data.success && Array.isArray(data.opportunities)) {
          setLikedOpportunities(data.opportunities)
          console.log('📊 Setting', data.opportunities.length, 'liked opportunities')
        } else {
          setLikedOpportunities([])
          console.log('📊 No opportunities found, sidebar empty')
        }
      } else {
        console.error('❌ Sidebar fetch failed:', response.status)
        setLikedOpportunities([])
      }
    } catch (error) {
      console.error('Error fetching sidebar opportunities:', error)
      setLikedOpportunities([])
    } finally {
      setSidebarLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOpportunities()
    fetchSidebarOpportunities()
  }, [fetchOpportunities, fetchSidebarOpportunities])

  // Socket notification handling
  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    const handleNotification = (notification) => {
      if (notification.type === 'new_opportunity') {
        // Auto-refresh opportunities list
        fetchOpportunities()
        
        // Show "New opportunity added" banner
        setShowNewOpportunityBanner(true)
        setTimeout(() => setShowNewOpportunityBanner(false), 5000)
      }
    }

    socket.on('notification', handleNotification)
    
    // Listen for refresh event from App.jsx
    const handleRefresh = () => {
      fetchOpportunities()
      setShowNewOpportunityBanner(true)
      setTimeout(() => setShowNewOpportunityBanner(false), 5000)
    }
    
    window.addEventListener('refresh-opportunities', handleRefresh)
    
    // Listen for sidebar refresh events
    const handleSidebarRefresh = () => {
      fetchSidebarOpportunities()
    }
    window.addEventListener('refresh-sidebar', handleSidebarRefresh)

    return () => {
      socket.off('notification', handleNotification)
      window.removeEventListener('refresh-opportunities', handleRefresh)
      window.removeEventListener('refresh-sidebar', handleSidebarRefresh)
    }
  }, [fetchOpportunities])

  const handleCardClick = async (opportunityId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/tracking/track/${opportunityId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        console.log('✅ Opportunity added to sidebar:', opportunityId)
        fetchSidebarOpportunities() // Refresh sidebar
      } else {
        console.error('❌ Failed to add opportunity to sidebar:', response.status)
      }
    } catch (error) {
      console.error('Error adding opportunity to sidebar:', error)
    }
  }

  const handleApplyClick = async (opportunityId, applicationLink) => {
    try {
      // Call apply endpoint (automatically tracks with status: in_progress)
      const response = await fetch(`${API_URL}/api/opportunities/${opportunityId}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
      
      console.log('📡 Apply response status:', response.status)
      
      if (response.ok) {
        console.log('🎯 Apply tracked for opportunity:', opportunityId)
      } else {
        console.error('❌ Apply tracking failed:', response.status)
      }
    } catch (error) {
      console.error('Error tracking apply:', error)
    }
    
    // Open external link
    window.open(applicationLink, '_blank')
  }

  const handleBookmark = async (opportunityId) => {
    try {
      const response = await fetch(`${API_URL}/api/opportunity-board/${opportunityId}/bookmark`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.ok) {
        fetchOpportunities() // Refresh to update bookmark status
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error)
    }
  }

  const setOpportunityStatus = (opportunityId, status) => {
    setOpportunityStatuses(prev => ({ ...prev, [opportunityId]: status }))
  }

  const handleCompletionAnswer = async (opportunityId, completed) => {
    if (!completed) {
      // Handle "No" answer - just refresh
      try {
        const response = await fetch(`${API_URL}/api/tracking/completion-question/${opportunityId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ completed: false })
        })
        
        if (response.ok) {
          fetchSidebarOpportunities()
        }
      } catch (error) {
        console.error('Error updating completion status:', error)
      }
      return
    }

    // Handle "Yes" answer with improved UX
    try {
      // Show loading state
      setOpportunityStatus(opportunityId, 'completing')
      
      const response = await fetch(`${API_URL}/api/tracking/completion-question/${opportunityId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed: true })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        // Show completed status briefly
        setOpportunityStatus(opportunityId, 'completed')
        
        // Show success message
        toast.success('✅ Opportunity completed!')
        
        // Remove after showing completion
        setTimeout(() => {
          setLikedOpportunities(prev => 
            prev.filter(item => {
              const oppId = item.opportunity?.id || item.opportunityId
              return oppId !== opportunityId
            })
          )
          // Clean up status
          setOpportunityStatus(opportunityId, null)
        }, 2000)
      } else {
        throw new Error(data.message || 'Failed to complete')
      }
    } catch (error) {
      setOpportunityStatus(opportunityId, 'error')
      toast.error('Failed to complete opportunity')
      console.error('Error updating completion status:', error)
      
      // Reset status after error
      setTimeout(() => {
        setOpportunityStatus(opportunityId, null)
      }, 3000)
    }
  }




  return (
    <div className={styles.dashboardContainer}>
      {/* Dashboard Header */}
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>OPPORTUNITIES DASHBOARD</h1>
        <p className={styles.dashboardSubtitle}>Discover and <span style={{color: '#8B6F47', fontWeight: '600'}}>TRACK</span> opportunities that match your goals</p>
      </div>

      <div className={styles.dashboardLayout}>
        {/* Main Content */}
        <div className={styles.mainContent}>
          {showNewOpportunityBanner && (
            <div className={styles.newOpportunityBanner}>
              {t('New Opportunities')}
            </div>
          )}

          <div className={styles.filtersSection}>
            <div className={styles.filterButtons}>
              <button 
                className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
                onClick={() => setFilter('all')}
              >
                {t('all')}
              </button>
              <button 
                className={`${styles.filterBtn} ${filter === 'scholarship' ? styles.active : ''}`}
                onClick={() => setFilter('scholarship')}
              >
                {t('scholarships')}
              </button>
              <button 
                className={`${styles.filterBtn} ${filter === 'internship' ? styles.active : ''}`}
                onClick={() => setFilter('internship')}
              >
                {t('internships')}
              </button>
              <button 
                className={`${styles.filterBtn} ${filter === 'conference' ? styles.active : ''}`}
                onClick={() => setFilter('conference')}
              >
                {t('conferences')}
              </button>
              <button 
                className={`${styles.filterBtn} ${filter === 'competition' ? styles.active : ''}`}
                onClick={() => setFilter('competition')}
              >
                {t('competitions')}
              </button>
            </div>
            
            <div className={styles.searchAndBookmark}>
              <input
                type="text"
                className={styles.searchInput}
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t('search opportunities')}
              />
              <button 
                className={`${styles.bookmarkButton} ${bookmarked ? styles.active : ''}`}
                onClick={() => setBookmarked(!bookmarked)}
              >
                {bookmarked ? '♥' : '♡'}
              </button>
            </div>
          </div>

          {loading && (
            <div className={styles.loadingState}>
              <div className="spinner-border" role="status">
                <span className="visually-hidden">{t('loading')}</span>
              </div>
            </div>
          )}

          {!loading && (
            <div className={styles.cardsGrid}>
              {opportunities.map(opportunity => (
                <div 
                  key={opportunity.id} 
                  className={styles.opportunityCard}
                  onClick={() => handleCardClick(opportunity.id)}
                >
                  {opportunity.isFeatured && (
                    <div className={styles.featuredBadge}>{t('featured')}</div>
                  )}
                  
                  <button 
                    className={`${styles.bookmarkBtn} ${opportunity.bookmarked ? styles.bookmarked : ''}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleBookmark(opportunity.id)
                    }}
                  >
                    {opportunity.bookmarked ? '♥' : '♡'}
                  </button>

                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{opportunity.title}</h3>
                    <p className={styles.cardOrg}>{opportunity.organization}</p>
                    
                    <div className={styles.cardMeta}>
                      <span className={styles.cardType}>{opportunity.type}</span>
                      {opportunity.amount && <span className={styles.cardAmount}>{opportunity.amount}</span>}
                    </div>

                    <div className={styles.cardFooter}>
                      <span className={styles.cardDeadline}>
                        {t('deadline')}: {new Date(opportunity.applicationDeadline).toLocaleDateString()}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          handleApplyClick(opportunity.id, opportunity.applicationLink)
                        }}
                        className={styles.applyBtn}
                      >
                        {t('apply now')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar - Reminders & Liked Opportunities */}
        <div className={styles.sidebar}>
          {reminders.length > 0 && (
            <div style={{
              background: '#fff3e0',
              border: '2px solid #ff9800',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px'
            }}>
              <h4 style={{
                color: '#e65100',
                fontSize: '14px',
                fontWeight: '600',
                margin: '0 0 8px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                 {t('incomplete_applications_header')}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {reminders.map(reminder => (
                  <div key={reminder.applicationId} style={{
                    background: 'white',
                    padding: '8px',
                    borderRadius: '4px',
                    borderLeft: '3px solid #ff9800'
                  }}>
                    <p style={{
                      margin: '0 0 4px 0',
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#333'
                    }}>
                      {reminder.opportunityTitle}
                    </p>
                    <p style={{
                      margin: '0 0 4px 0',
                      fontSize: '12px',
                      color: '#666'
                    }}>
                      {reminder.organization}
                    </p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{
                        fontSize: '12px',
                        color: reminder.daysRemaining <= 3 ? '#d32f2f' : '#ff9800',
                        fontWeight: '600'
                      }}>
                         {reminder.daysRemaining} {t('days_left')}
                      </span>
                      <button
                        onClick={() => {
                          const element = document.querySelector(`[data-app-id="${reminder.applicationId}"]`)
                          element?.scrollIntoView({ behavior: 'smooth' })
                        }}
                        style={{
                          background: '#ff9800',
                          color: 'white',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          cursor: 'pointer'
                        }}
                      >
                        {t('continue')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className={styles.sidebarHeader}>
            <h3>OPPORTUNITIES TO TRACK</h3>
            <p style={{fontSize: '0.85rem', color: '#666', marginTop: '0.5rem', fontWeight: '400'}}>Reserve the opportunities you love to keep track of them by clicking on the cards of the opportunities you are qualified and have interest in to be a professional one</p>
          </div>
          
          {sidebarLoading ? (
            <div className={styles.loading}>{t('loading')}</div>
          ) : likedOpportunities.length === 0 ? (
            <div className={styles.emptyState}>
              <p>{t('ON Opportunities Yet')}</p>
            </div>
          ) : (
            <div className={styles.opportunityList}>
              {likedOpportunities.map(item => {
                const opportunity = item.opportunity || item
                const status = item.status || 'pending'
                const trackingId = item.id || item.opportunityId
                
                return (
                  <div key={trackingId} className={styles.opportunityEntry}>
                    <h4 className={styles.opportunityName}>{opportunity.title}</h4>
                    <p className={styles.organizationName}>{opportunity.organization}</p>
                    <div className={styles.applicationStatus}>
                      <span>{t('application')}: </span>
                      <span className={`${styles.statusText} ${status === 'completed' ? styles.completed : styles.pending}`}>
                        {status === 'completed' ? t('completed') : t('pending')}
                      </span>
                    </div>
                    <div className={styles.completionQuestion}>
                      <p>Have you completed this application?</p>
                      <div className={styles.yesNoButtons}>
                        <button 
                          className={styles.noBtn}
                          onClick={() => handleCompletionAnswer(opportunity.id, false)}
                          disabled={opportunityStatuses[opportunity.id]}
                        >
                          {t('no')}
                        </button>
                        <button 
                          className={styles.yesBtn}
                          onClick={() => handleCompletionAnswer(opportunity.id, true)}
                          disabled={opportunityStatuses[opportunity.id]}
                        >
                          {opportunityStatuses[opportunity.id] === 'completing' ? t('completing') :
                           opportunityStatuses[opportunity.id] === 'completed' ? ' ' + t('completed') :
                           opportunityStatuses[opportunity.id] === 'error' ? 'Error' : t('yes')}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
