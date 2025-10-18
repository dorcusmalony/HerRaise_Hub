// Try to POST to backend, fallback to simulated response on error
	import React, { useState, useEffect } from 'react'
import '../../styles/BootstrapVars.module.css'
import styles from '../../styles/Pages.module.css'

export default function Register(){
	const [form, setForm] = useState({
		name: '',
		email: '',
		password: '',
		role: 'mentee',
		language: 'en',
		phoneNumber: '',
		location: { city: '', state: '' },
		dateOfBirth: '',
		interests: '',
		educationLevel: '',
	})
	const [errors, setErrors] = useState({})
	const [result, setResult] = useState(null)
	const [submitting, setSubmitting] = useState(false)
	const [debugInfo, setDebugInfo] = useState(null)
	const [success, setSuccess] = useState(null)
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)

	const handleChange = (e) => {
		const { name, value } = e.target
		if (name === 'city' || name === 'state') {
			setForm(prev => ({ ...prev, location: { ...prev.location, [name]: value } }))
		} else {
			setForm(prev => ({ ...prev, [name]: value }))
		}
	}

	const validate = (role) => {
		const err = {}
		if (!form.name.trim()) err.name = 'Name required'
		if (!form.email.trim()) err.email = 'Email required'
		if (!form.password) err.password = 'Password required'
		if (role === 'mentor') {
			if (!form.educationLevel) err.educationLevel = 'Education level required for mentors'
			if (!form.location.city.trim()) err.city = 'City required for mentors'
		}
		setErrors(err)
		return Object.keys(err).length === 0
	}

	const buildPayload = (role) => {
		return {
			name: form.name.trim(),
			email: form.email.trim(),
			password: form.password,
			role,
			language: form.language || 'en',
			phoneNumber: form.phoneNumber || '',
			location: {
				city: form.location.city || '',
				state: form.location.state || ''
			},
			dateOfBirth: form.dateOfBirth || '',
			interests: form.interests ? form.interests.split(',').map(s => s.trim()).filter(Boolean) : [],
			educationLevel: form.educationLevel || ''
		}
	}

	const submitToServer = async (role) => {
		if (!validate(role)) return
		const payload = buildPayload(role)
		const API = import.meta.env.VITE_API_URL || ''
		
		if (!API) {
			console.error("VITE_API_URL is not set!")
			setDebugInfo("VITE_API_URL environment variable is missing. Check your .env file.")
			return
		}
		
		console.log("Environment VITE_API_URL:", API)
		
		const endpoint = `${API}/api/auth/register`
		
		setSubmitting(true)
		setResult(null)
		setErrors({})
		setDebugInfo(null)
		setSuccess(null)
		setError(null)
		
		console.log("Calling endpoint:", endpoint)
		
		try {
			const res = await fetch(endpoint, {
				method: 'POST',
				headers: { 
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			})
			
			console.log("Response status:", res.status)
			
			const data = await res.json().catch(() => {
				console.warn("Response is not valid JSON")
				return { message: 'Invalid server response' }
			})
			
			console.log("Response data:", data)

			if (!res.ok) {
				// Handle specific error cases
				if (res.status === 400) {
					throw new Error(data.message || 'Invalid registration data. Please check all fields.')
				} else if (res.status === 409) {
					throw new Error('Email already registered. Please login instead.')
				} else if (res.status === 500) {
					throw new Error('Server error. Please try again later.')
				} else {
					throw new Error(data.message || `Registration failed (${res.status})`)
				}
			}

			// Success
			setSuccess(data.message || 'Registration successful! Redirecting to login...')
			
			// Clear form
			setForm({
				name: '',
				email: '',
				password: '',
				role: 'mentee',
				language: 'en',
				phoneNumber: '',
				location: { city: '', state: '' },
				dateOfBirth: '',
				interests: '',
				educationLevel: '',
			})

			if (data?.token) {
				try { localStorage.setItem('token', data.token) } catch (e) {}
			}
			
		} catch (err) {
			console.error("Registration error:", err)
			setError(err.message || 'Registration failed. Please try again.')
		} finally {
			setSubmitting(false)
		}
	}

	const handleSubmit = (role) => {
		submitToServer(role)
	}

	return (
		<div className={`mx-auto ${styles.container}`}>
			<h3>Create account</h3>
			<form onSubmit={e => e.preventDefault()}>
				<div className="mb-2">
					<label className="form-label">Name</label>
					<input name="name" value={form.name} onChange={handleChange} className="form-control" autoComplete="name" />
					{errors.name && <div className="text-danger small">{errors.name}</div>}
				</div>

				<div className="mb-2">
					<label className="form-label">Email</label>
					<input name="email" value={form.email} onChange={handleChange} className="form-control" autoComplete="email" />
					{errors.email && <div className="text-danger small">{errors.email}</div>}
				</div>

				<div className="mb-2">
					<label className="form-label">Password</label>
					<input type="password" name="password" value={form.password} onChange={handleChange} className="form-control" autoComplete="new-password" />
					{errors.password && <div className="text-danger small">{errors.password}</div>}
				</div>

				<div className="mb-3">
					<label className="form-label">Phone number</label>
					<input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} className="form-control" placeholder="+211..." autoComplete="tel" />
				</div>

				<div className="mb-3">
					<label className="form-label">Preferred language</label>
					<select name="language" value={form.language} onChange={handleChange} className="form-select" >
						<option value="en">English</option>
						<option value="ar">Arabic</option>
						<option value="sw">Swahili</option>
					</select>
				</div>

				<div className="mb-2">
					<label className="form-label">City</label>
					<input name="city" value={form.location.city} onChange={handleChange} className="form-control" autoComplete="address-level2" />
					{errors.city && <div className="text-danger small">{errors.city}</div>}
				</div>
				<div className="mb-2">
					<label className="form-label">State / Country</label>
					<input name="state" value={form.location.state} onChange={handleChange} className="form-control" autoComplete="address-level1" />
				</div>

				<div className="mb-2">
					<label className="form-label">Date of birth</label>
					<input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className="form-control" />
				</div>

				<div className="mb-2">
					<label className="form-label">Interests (comma separated)</label>
					<input name="interests" value={form.interests} onChange={handleChange} className="form-control" placeholder="e.g. leadership, career development" />
				</div>

				<div className="mb-3">
					<label className="form-label">Education level</label>
					<select name="educationLevel" value={form.educationLevel} onChange={handleChange} className="form-select">
						<option value="">Select...</option>
						<option value="secondary">Secondary</option>
						<option value="bachelor">Bachelor</option>
						<option value="master">Master</option>
						<option value="other">Other</option>
					</select>
					{errors.educationLevel && <div className="text-danger small">{errors.educationLevel}</div>}
				</div>

				<div className="d-flex gap-2">
					<button type="button" className="btn btn-outline-primary" onClick={() => handleSubmit('mentee')} disabled={submitting}>
						{submitting ? 'Submitting…' : 'Join as Mentee'}
					</button>
					<button type="button" className={`btn ${styles.brandButton}`} onClick={() => handleSubmit('mentor')} disabled={submitting}>
						{submitting ? 'Submitting…' : 'Join as Mentor'}
					</button>
				</div>
			</form>

			{(debugInfo || error) && (
				<div className="mt-3 alert alert-warning">
					{error && <div className="text-danger"><strong>Error:</strong> {error}</div>}
					{debugInfo && <div className="text-warning"><strong>Debug:</strong> {debugInfo}</div>}
					<div className="small mt-1">Check browser console (F12) for more details.</div>
				</div>
			)}

			{result && (
				<div className="mt-4 alert alert-light">
					<strong>Response:</strong>
					<pre className={styles.responsePre}>{JSON.stringify(result, null, 2)}</pre>
				</div>
			)}

			{success && (
				<div className="mt-4 alert alert-success">
					{success}
				</div>
			)}
		</div>
	)
}