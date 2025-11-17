import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { initializeSocket, requestNotificationPermission } from '../../services/socketService'
import { useNotification } from '../../contexts/NotificationContext'
import styles from './Login.module.css'

export default function Login() {
  const navigate = useNavigate()
  const API = import.meta.env.VITE_API_URL || ''

  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [_result, setResult] = useState(null)

  // Forgot password flow
  const [forgotOpen, setForgotOpen] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotStatus, setForgotStatus] = useState(null)
  const [forgotLoading, setForgotLoading] = useState(false)
  const { showPendingOpportunitiesPopup } = useNotification()
  const [unverifiedEmail, setUnverifiedEmail] = useState('')
  const [showResendVerification, setShowResendVerification] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMessage, setResendMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)

    setResult(null)
    setLoading(true)

    if (!API) {
      console.error('VITE_API_URL environment variable is missing. Check your .env file.')
      setLoading(false)
      return
    }

    const endpoint = `${API}/api/auth/login`
    console.log('Login endpoint:', endpoint)

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      console.log('Login response status:', res.status)
      
      const data = await res.json().catch(() => {
        console.warn('Response is not valid JSON')
        return null
      })
      
      console.log('Login response data:', data)

      if (!res.ok) {
        const errorMsg = data?.message || data?.error || `Login failed (${res.status})`
        
        // Check if user needs email verification
        if (data?.requiresVerification) {
          setUnverifiedEmail(data.email || email)
          setShowResendVerification(true)
          setError('Please verify your email before logging in. Check your inbox for the verification link.')
        } else {
          setError(errorMsg)
        }
        setLoading(false)
        return
      }

      // Success!
      console.log(' Login successful!', data)
      setResult(data)

      // Store token and user data
      if (data?.token) {
        try {
          localStorage.setItem('token', data.token)
          console.log(' Token saved successfully')
          
          // Initialize WebSocket connection
          initializeSocket(data.token)
          
          // Request notification permission
          await requestNotificationPermission()
        } catch (e) {
          console.error('Failed to save token:', e)
        }
      }
      
      // Save user data
      if (data?.user) {
        try {
          localStorage.setItem('user', JSON.stringify(data.user))
          console.log(' User data saved successfully:', data.user)
          
          //  Dispatch event to update Header
          window.dispatchEvent(new Event('user-login'))
        } catch (e) {
          console.error(' Failed to save user data:', e)
        }
      } else {
        console.warn(' No user data in login response')
      }

      // Check for pending reminders (liked opportunities)
      if (data?.pendingReminders && data.pendingReminders.count > 0) {
        showPendingOpportunitiesPopup(data.pendingReminders.opportunities)
      } else {
        // Direct navigation if no reminders
        if (data.user?.role === 'admin') {
          navigate('/admin/dashboard')
        } else {
          navigate('/dashboard')
        }
      }
      
    } catch (err) {
      console.error('Login error:', err)
      
      if (err.message.includes('Failed to fetch') || err.name === 'TypeError') {
        console.error(`Network error - likely CORS issue. Backend needs to allow: ${window.location.origin}`)
        setError('Unable to connect to server. Please try again later.')
      } else {
        setError(err.message || 'Login failed')
      }
    } finally {
      setLoading(false)
      setPassword('')
    }
  }

  const handleForgotSubmit = async (e) => {
    e.preventDefault()
    setForgotStatus(null)

    if (!forgotEmail || !forgotEmail.includes('@')) {
      setForgotStatus({ ok: false, message: 'Please enter a valid email.' })
      return
    }

    if (!API) {
      setForgotStatus({ ok: false, message: 'API URL not configured.' })
      return
    }

    setForgotLoading(true)
    
    const endpoints = [
      `${API}/api/auth/forgot-password`,
      `${API}/api/auth/forgotPassword`,
      `${API}/api/forgot-password`
    ]

    let success = false
    let lastError = null

    for (const endpoint of endpoints) {
      try {
        console.log('Trying forgot password endpoint:', endpoint)
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: forgotEmail })
        })
        
        console.log('Forgot password response status:', res.status)
        
        if (res.status === 404) {
          console.log('404 - trying next endpoint')
          continue
        }
        
        const data = await res.json().catch(() => null)
        console.log('Forgot password response:', data)
        
        if (res.ok) {
          setForgotStatus({ 
            ok: true, 
            message: data?.message || 'If that email exists, reset instructions were sent.' 
          })
          success = true
          setForgotEmail('')
          break
        } else {
          lastError = data?.message || 'Unable to process request.'
        }
      } catch (err) {
        console.error(`Error with ${endpoint}:`, err)
        lastError = err.message
      }
    }

    if (success) {
      setForgotStatus({ 
        ok: false, 
        message: lastError || 'Forgot password feature not available. Please contact support.' 
      })
    }

    setForgotLoading(false)
  }

  const handleResendVerification = async () => {
    setResendLoading(true)
    setResendMessage('')
    
    try {
      const res = await fetch(`${API}/api/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: unverifiedEmail })
      })
      
      const data = await res.json()
      
      if (res.ok && data.success) {
        setResendMessage('Verification email sent successfully! Check your inbox.')
      } else {
        setResendMessage(data.message || 'Failed to send verification email.')
      }
    } catch (error) {
      setResendMessage('Network error. Please try again.')
    } finally {
      setResendLoading(false)
    }
  }



  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome Back</h1>
        <p className={styles.subtitle}>Sign in to your account</p>
        
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              className={styles.input}
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className={styles.input}
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ paddingRight: '40px' }}
                required
              />
              <button
                type="button"
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  color: '#6c757d',
                  fontSize: '16px'
                }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}
        
          {showResendVerification && (
            <div style={{ background: '#e3f2fd', color: '#1976d2', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
              <p style={{ marginBottom: '0.5rem' }}>Need a new verification email?</p>
              <button 
                type="button" 
                style={{ background: 'transparent', color: '#1976d2', border: '1px solid #1976d2', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                onClick={handleResendVerification}
                disabled={resendLoading}
              >
                {resendLoading ? 'Sending...' : 'Resend Verification Email'}
              </button>
              {resendMessage && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>{resendMessage}</div>
              )}
            </div>
          )}
        


          <button 
            className={styles.submitButton}
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          
          <button
            type="button"
            style={{ background: 'none', border: 'none', color: '#667eea', textDecoration: 'underline', cursor: 'pointer', marginTop: '0.5rem' }}
            onClick={() => setForgotOpen(true)}
          >
            Forgot password?
          </button>
        </form>

        <div className={styles.links}>
          Don&apos;t have an account? <Link to="/register">Register</Link>
          <br />
          Have a reset token? <Link to="/reset-password">Reset password</Link>
        </div>
      </div>

      {/* Show response like Register page */}


      {forgotOpen && (
        <div className="contact-overlay" role="dialog" aria-modal="true" aria-labelledby="forgot-heading">
          <div className="contact-card mx-auto" style={{ maxWidth: 520 }}>
            <button
              type="button"
              className="btn-close float-end"
              aria-label="Close"
              onClick={() => { setForgotOpen(false); setForgotStatus(null); setForgotEmail('') }}
            />
            <h2 id="forgot-heading" className="contact-title">Forgot Password</h2>
            <p className="small text-muted">
              Enter your account email. We&apos;ll send password reset instructions if it&apos;s recognized.
            </p>

            <form onSubmit={handleForgotSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={forgotEmail}
                  onChange={e => setForgotEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>

              {forgotStatus && (
                <div className={`alert ${forgotStatus.ok ? 'alert-success' : 'alert-danger'} small mb-2`}>
                  {forgotStatus.message}
                </div>
              )}

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => { setForgotOpen(false); setForgotStatus(null); setForgotEmail('') }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={forgotLoading}>
                  {forgotLoading ? 'Sending…' : 'Send reset email'}
                </button>
              </div>
            </form>

            <div className="mt-3 small text-muted">
              Already have a reset token?{' '}
              <Link to="/reset-password" onClick={() => setForgotOpen(false)}>
                Reset your password now
              </Link>.
            </div>
          </div>
        </div>
      )}
      

    </div>
  )
}