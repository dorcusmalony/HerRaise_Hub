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
    <div style={{padding: '50px', maxWidth: '500px', margin: '0 auto'}}>
      <h2>👑 Create Admin Account</h2>
      <form onSubmit={handleSubmit} style={{marginTop: '30px'}}>
        <div style={{marginBottom: '15px'}}>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
            style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px'}}
          />
        </div>
        <div style={{marginBottom: '15px'}}>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
            style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px'}}
          />
        </div>
        <div style={{marginBottom: '15px'}}>
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
            style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px'}}
          />
        </div>
        <div style={{marginBottom: '15px'}}>
          <input
            type="text"
            placeholder="Admin Key (use: ADMIN123)"
            value={formData.adminKey}
            onChange={(e) => setFormData({...formData, adminKey: e.target.value})}
            required
            style={{width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px'}}
          />
        </div>
        <button 
          type="submit" 
          style={{
            width: '100%', 
            padding: '12px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Create Admin Account
        </button>
      </form>
      <p style={{marginTop: '20px', color: '#666'}}>
        Note: Your backend must support /api/auth/admin-register endpoint
      </p>
    </div>
  )
}