import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from '../../styles/Pages.module.css'

export default function Login() {
  const navigate = useNavigate()

  // ✅ Use correct backend API URL
  const API = import.meta.env.VITE_API_URL || 'https://herraise-hub-backend-1.onrender.com/api/auth'

  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Forgot password flow
  const [forgotOpen, setForgotOpen] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotStatus, setForgotStatus] = useState(null)
  const [forgotLoading, setForgotLoading] = useState(false)

  // ✅ Handle login
  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        throw new Error(data?.message || 'Invalid email or password')
      }

      // Save token if available
      if (data?.token) {
        localStorage.setItem('token', data.token)
      }

      // Redirect to home
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
      setPassword('')
    }
  }

  // ✅ Forgot password submit
  const handleForgotSubmit = async (e) => {
    e.preventDefault()
    setForgotStatus(null)

    if (!forgotEmail || !forgotEmail.includes('@')) {
      setForgotStatus({ ok: false, message: 'Please enter a valid email.' })
      return
    }

    setForgotLoading(true)
    try {
      const res = await fetch(`${API}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      })
      const data = await res.json().catch(() => null)
      if (res.ok && (data?.success || data?.message)) {
        setForgotStatus({ ok: true, message: 'If that email exists, reset instructions were sent.' })
      } else {
        setForgotStatus({ ok: false, message: data?.message || 'Unable to process request.' })
      }
    } catch {
      setForgotStatus({ ok: false, message: 'Network error, please try again.' })
    } finally {
      setForgotLoading(false)
    }
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

        {error && <div className="text-danger small mb-2">{error}</div>}

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
        Don't have an account? <Link to="/register">Register</Link>
        <br />
        Have a reset token? <Link to="/reset-password">Reset password</Link>
      </div>

      {/* ✅ Forgot Password Overlay */}
      {forgotOpen && (
        <div className="contact-overlay" role="dialog" aria-modal="true" aria-labelledby="forgot-heading">
          <div className="contact-card mx-auto" style={{ maxWidth: 520 }}>
            <button
              type="button"
              className="btn-close float-end"
              aria-label="Close"
              onClick={() => { setForgotOpen(false); setForgotStatus(null) }}
            />
            <h2 id="forgot-heading" className="contact-title">Forgot Password</h2>
            <p className="small text-muted">
              Enter your account email. We'll send password reset instructions if it’s recognized.
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
                <div className={`mb-2 small ${forgotStatus.ok ? 'text-success' : 'text-danger'}`}>
                  {forgotStatus.message}
                </div>
              )}

              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => { setForgotOpen(false); setForgotStatus(null) }}
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
