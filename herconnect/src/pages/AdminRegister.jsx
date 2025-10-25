import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    adminKey: ''
  })
  const navigate = useNavigate()
  const API = import.meta.env.VITE_API_URL || ''

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch(`${API}/api/auth/admin-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          role: 'admin'
        })
      })

      if (response.ok) {
        alert('Admin account created successfully!')
        navigate('/login')
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to create admin account')
      }
    } catch (error) {
      alert('Error creating admin account')
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h3>👑 Create Admin Account</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Admin Key (use: ADMIN123)"
                    value={formData.adminKey}
                    onChange={(e) => setFormData({...formData, adminKey: e.target.value})}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Create Admin Account
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}