import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header/header.jsx'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import About from './pages/About/About'
import Contact from './pages/Contact/Contact'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register.jsx'
import ResourcePage from './pages/ResourcePage/ResourcePage'
import ResetPassword from './pages/Auth/ResetPassword'
import Verify from './pages/Verify/Verify.jsx'
import Profile from './pages/Profile/Profile.jsx'
import Forum from './pages/forum/forum.jsx'
import CategoryPage from './pages/forum/CategoryPage.jsx'
import Dashboard from './pages/dashboard/dashboard.jsx'
import Opportunities from './pages/Opportunities/Opportunities.jsx'
import Content from './pages/Sharezone/sharezone.jsx'
import SafetyReport from './pages/SafetyReport/SafetyReport'
import SafetyButton from './components/SafetyButton/SafetyButton'
import { LanguageProvider } from './contexts/LanguageContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { initializeSocket, disconnectSocket } from './services/socketService'
import { pushNotificationService } from './services/pushNotificationService'
import { notificationService } from './services/notificationService'
import './App.css'
import './styles/colors.css'
import './styles/rtl.css'
import './styles/responsive.css'
import './styles/professional.css'
import './styles/notifications.css'
import NotificationToast from './components/NotificationToast/NotificationToast'
import PushNotificationSetup from './components/PushNotificationSetup/PushNotificationSetup'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useState } from 'react'

export default function App() {
  const checkPendingOpportunities = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || ''
      const response = await fetch(`${API_URL}/api/tracking/pending-check`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.hasPending && data.count > 0) {
          const opportunityText = data.count === 1 ? 'opportunity' : 'opportunities'
          const titleText = data.count === 1 ? 'Pending Opportunity' : 'Pending Opportunities'
          
          // Show toast reminder
          toast.info(
            <div>
              <strong>📝 Reminder: {titleText}</strong>
              <div>You have {data.count} pending {opportunityText} to complete!</div>
            </div>, 
            {
              position: "top-right",
              autoClose: 10000,
              closeOnClick: true,
              pauseOnHover: true,
            }
          )
          
          // Add to notification bar
          window.dispatchEvent(new CustomEvent('add-notification', {
            detail: {
              id: 'pending-opportunities',
              type: 'pending_opportunities',
              title: `${titleText} Reminder`,
              message: `You have ${data.count} pending ${opportunityText} to complete`,
              timestamp: new Date().toISOString(),
              read: false
            }
          }))
        }
      }
    } catch (error) {
      console.error('Error checking pending opportunities:', error)
    }
  }

  useEffect(() => {
    // Read from environment variable - not hardcoded
    const api = import.meta.env.VITE_API_URL || ''
    console.log('VITE_API_URL=', api)
    if (!api) {
      console.warn('VITE_API_URL is not set. Set it in .env (local) and in Vercel env vars.')
    } else if (!/^https?:\/\/.+/.test(api)) {
      console.warn('VITE_API_URL looks malformed. It should start with "https://" (e.g. https://herraise-hub-backend-1.onrender.com). Check your .env / Vercel config.')
    }

    // Initialize socket if user is logged in
    const token = localStorage.getItem('token')
    let handleAppNotification
    
    if (token) {
      initializeSocket(token)
      notificationService.initialize()
      pushNotificationService.initialize()
      // checkPendingOpportunities() // Temporarily disabled to debug false notifications

      // Listen for real-time notifications
      handleAppNotification = (e) => {
        const { title, message, type, opportunityId } = e.detail || {}
        
        if (type === 'new_opportunity') {
          // Show custom toast for opportunities
          const toastElement = (
            <div className="opportunity-toast">
              <div className="toast-icon">🎯</div>
              <div className="toast-content">
                <h4>{title}</h4>
                <p>{message}</p>
                {opportunityId && (
                  <button onClick={() => window.location.href = `/opportunities/${opportunityId}`}>
                    View Opportunity
                  </button>
                )}
              </div>
            </div>
          )
          
          toast.success(toastElement, {
            position: "top-right",
            autoClose: 8000,
            closeOnClick: true,
            pauseOnHover: true,
          })
          
          // Play notification sound
          try {
            new Audio('/notification-sound.mp3').play().catch(() => {})
          } catch (e) {
            // Audio play failed - ignore
          }
          
          // Update opportunities list if user is on opportunities page
          if (window.location.pathname === '/opportunities') {
            window.dispatchEvent(new Event('refresh-opportunities'))
          }
        } else {
          // Regular notification
          toast.info(<div><strong>{title}</strong><div>{message}</div></div>, {
            position: "top-right",
            autoClose: 5000,
            closeOnClick: true,
            pauseOnHover: true,
          })
        }
      }
      window.addEventListener('app-notification', handleAppNotification)

      // Listen for forum post creation
      window.addEventListener('forum:post_created', (e) => {
        const { author, title } = e.detail || {}
        toast.success(<div><strong>New Post</strong><div>{author} posted: {title}</div></div>, {
          position: "top-right",
          autoClose: 5000,
        })
      })

      // Listen for forum comment creation
      window.addEventListener('forum:comment_created', (e) => {
        const { author, postTitle } = e.detail || {}
        toast.info(<div><strong>New Comment</strong><div>{author} commented on: {postTitle}</div></div>, {
          position: "top-right",
          autoClose: 5000,
        })
      })

      // Listen for opportunity updates (scholarship, internship, conference)
      window.addEventListener('opportunity:updated', (e) => {
        const { type, title } = e.detail || {}
        toast.info(<div><strong>Opportunity Updated</strong><div>{type}: {title}</div></div>, {
          position: "top-right",
          autoClose: 5000,
        })
      })
    }

    // Cleanup on unmount
    return () => {
      disconnectSocket()
      if (handleAppNotification) {
        window.removeEventListener('app-notification', handleAppNotification)
      }
    }
  }, [])

  return (
    <LanguageProvider>
      <NotificationProvider>
        <div className="app-root">
          <Header />
          <NotificationToast />
          <PushNotificationSetup />
          <ToastContainer />
          <SafetyButton />

          <main className="container-fluid px-3 py-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/resources" element={<ResourcePage />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/forum/category/:categoryId" element={<CategoryPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/opportunities" element={<Opportunities />} />
              <Route path="/sharezone" element={<Content />} />
              <Route path="/safety-report" element={<SafetyReport />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </NotificationProvider>
    </LanguageProvider>
  )
}