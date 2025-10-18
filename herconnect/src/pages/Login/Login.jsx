import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { initializeSocket, requestNotificationPermission } from '../../services/socketService'
import styles from '../../styles/Pages.module.css'

export default function Login() {
  const navigate = useNavigate()
  const API = import.meta.env.VITE_API_URL || ''

  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [debugInfo, setDebugInfo] = useState(null)
  const [result, setResult] = useState(null)

  // Forgot password flow
  const [forgotOpen, setForgotOpen] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotStatus, setForgotStatus] = useState(null)
  const [forgotLoading, setForgotLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    setDebugInfo(null)
    setResult(null)
    setLoading(true)

    if (!API) {
      setDebugInfo('VITE_API_URL environment variable is missing. Check your .env file.')
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
        setDebugInfo(`Server error (${res.status}): ${errorMsg}`)
        setError(errorMsg)
        setLoading(false)
        return
      }

      // Success!
      console.log('✅ Login successful!', data)
      setResult(data)

      // Store token and user data
      if (data?.token) {
        try {
          localStorage.setItem('token', data.token)
          console.log('✅ Token saved successfully')
          
          // Initialize WebSocket connection
          initializeSocket(data.token)
          
          // Request notification permission
          await requestNotificationPermission()
        } catch (e) {
          console.error('Failed to save token:', e)
        }
      }
      
      if (data?.user) {
        try {
          localStorage.setItem('user', JSON.stringify(data.user))
          console.log('✅ User data saved successfully:', data.user)
        } catch (e) {
          console.error('Failed to save user data:', e)
        }
      } else {
        console.warn('⚠️ No user data in login response')
      }

      // Redirect based on role
      setTimeout(() => {
        if (data.user?.role === 'admin') {
          navigate('/admin/dashboard')
        } else if (data.user?.role === 'mentor') {
          navigate('/dashboard')
        } else {
          navigate('/dashboard')
        }
      }, 800)
      
    } catch (err) {
      console.error('Login error:', err)
      
      if (err.message.includes('Failed to fetch') || err.name === 'TypeError') {
        setDebugInfo(`Network error - likely CORS issue. Backend needs to allow: ${window.location.origin}`)
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

    if (!success) {
      setForgotStatus({ 
        ok: false, 
        message: lastError || 'Forgot password feature not available. Please contact support.' 
      })
    }

    setForgotLoading(false)
  }

  return (
    <div className={`mx-auto ${styles.container}`}>
      <h3>Login</h3>

      <form onSubmit={handleLogin}>
        <div className="mb-2">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-2">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className="alert alert-danger small mb-2">{error}</div>}
        
        {debugInfo && (
          <div className="alert alert-warning small mb-2">
            <strong>Debug:</strong> {debugInfo}
            <div className="small mt-1">Check browser console (F12) for more details.</div>
          </div>
        )}

        <div className="d-flex gap-2 mb-3">
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Login'}
          </button>
          <button
            type="button"
            className="btn btn-link"
            onClick={() => setForgotOpen(true)}
          >
            Forgot password?
          </button>
        </div>
      </form>

      <div className="small">
        Don&apos;t have an account? <Link to="/register">Register</Link>
        <br />
        Have a reset token? <Link to="/reset-password">Reset password</Link>
      </div>

      {/* Show response like Register page */}
      {result && result.success && (
        <div className="mt-4 alert alert-success">
          <strong>Success!</strong> Login successful. Redirecting to your profile...
        </div>
      )}

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