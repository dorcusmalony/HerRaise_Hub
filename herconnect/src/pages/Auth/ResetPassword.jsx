import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function ResetPassword(){
  const navigate = useNavigate()
  const location = useLocation()
  const API = import.meta.env.VITE_API_URL || '/api'

  // read optional token from query string
  const params = new URLSearchParams(location.search)
  const token = params.get('token') || ''

  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)

  const validate = () => {
    if (!newPassword || newPassword.length < 8) {
      setStatus({ ok: false, message: 'Password must be at least 8 characters.' })
      return false
    }
    if (newPassword !== confirm) {
      setStatus({ ok: false, message: 'Passwords do not match.' })
      return false
    }
    return true
  }

  const handleReset = async (e) => {
    e?.preventDefault?.()
    setStatus(null)
    if (!validate()) return
    setLoading(true)
    try {
      const headers = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`
      const res = await fetch(`${API}/reset-password`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ newPassword })
      })
      const data = await res.json().catch(() => null)
      if (res.ok) {
        setStatus({ ok: true, message: data?.message || 'Password updated. You can now login.' })
        // small delay and redirect to login
        setTimeout(() => navigate('/login'), 1200)
      } else {
        setStatus({ ok: false, message: data?.message || 'Unable to reset password.' })
      }
    } catch {
      setStatus({ ok: false, message: 'Network error, try again.' })
    } finally {
      setLoading(false)
      setNewPassword('')
      setConfirm('')
    }
  }

  return (
    <div className="mx-auto" style={{maxWidth:520}}>
      <h3>Reset password</h3>
      <p className="small text-muted">Provide a new password. If you received a reset link, the token is read from the URL automatically.</p>

      <form onSubmit={handleReset}>
        <div className="mb-2">
          <label className="form-label">New password</label>
          <input type="password" className="form-control" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
        </div>

        <div className="mb-2">
          <label className="form-label">Confirm new password</label>
          <input type="password" className="form-control" value={confirm} onChange={e => setConfirm(e.target.value)} />
        </div>

        {status && <div className={`mb-2 ${status.ok ? 'text-success' : 'text-danger'} small`}>{status.message}</div>}

        <div className="d-flex gap-2">
          <button type="button" className="btn btn-light" onClick={() => navigate('/login')}>Back to login</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Updating…' : 'Reset password'}</button>
        </div>
      </form>
    </div>
  )
}
