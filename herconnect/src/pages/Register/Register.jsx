// Try to POST to backend, fallback to simulated response on error
	import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ImageUpload from '../../components/ImageUpload/ImageUpload.jsx'
import RegistrationSuccess from '../../components/RegistrationSuccess/RegistrationSuccess.jsx'
import '../../styles/BootstrapVars.module.css'
import styles from './Register.module.css'

export default function Register(){
	const { t, i18n } = useTranslation()
	const [form, setForm] = useState({
		name: '',
		email: '',
		password: '',
		role: 'mentee',
		language: i18n.language || 'en',
		phoneNumber: '',
		location: { city: '', state: '' },
		dateOfBirth: '',
		interests: '',
		educationLevel: '',
		profilePicture: ''
	})
	const [loading, setLoading] = useState(false)
	const [errors, setErrors] = useState({})
	const [result, setResult] = useState(null)
	const [_submitting, _setSubmitting] = useState(false)
	const [debugInfo, setDebugInfo] = useState(null)
	const [success, setSuccess] = useState(null)
	const [error, setError] = useState(null)
	const [showSuccess, setShowSuccess] = useState(false)
	const [userEmail, setUserEmail] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [passwordStrength, setPasswordStrength] = useState({
		length: false,
		hasUpper: false,
		hasLower: false,
		hasNumber: false
	})

	const handleChange = (e) => {
		const { name, value } = e.target
		if (name === 'city' || name === 'state') {
			setForm(prev => ({ ...prev, location: { ...prev.location, [name]: value } }))
		} else {
			setForm(prev => ({ ...prev, [name]: value }))
		}
		
		// Password strength validation
		if (name === 'password') {
			setPasswordStrength({
				length: value.length >= 8,
				hasUpper: /[A-Z]/.test(value),
				hasLower: /[a-z]/.test(value),
				hasNumber: /\d/.test(value)
			})
		}
	}



	const validate = (role) => {
		const err = {}
		if (!form.name.trim()) err.name = t('name required')
		if (!form.email.trim()) err.email = 'Email required'
		if (!form.password) {
			err.password = 'Password required'
		} else if (form.password.length < 8) {
			err.password = 'Password must be at least 8 characters'
		} else if (!/[A-Z]/.test(form.password)) {
			err.password = 'Password must contain at least one uppercase letter'
		} else if (!/[a-z]/.test(form.password)) {
			err.password = 'Password must contain at least one lowercase letter'
		} else if (!/\d/.test(form.password)) {
			err.password = 'Password must contain at least one number'
		}
		if (role === 'mentor') {
			if (!form.educationLevel) err.educationLevel = t('education required')
		}
		setErrors(err)
		return Object.keys(err).length === 0
	}

	const handleImageUpload = (imageUrl) => {
		setForm(prev => ({ ...prev, profilePicture: imageUrl }))
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
			educationLevel: form.educationLevel || '',
			profilePicture: form.profilePicture || '' // Include profile picture
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
		
		setLoading(true)
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

			// Success - show welcome email notification
			setUserEmail(payload.email)
			setShowSuccess(true)
			
		} catch (err) {
			console.error("Registration error:", err)
			setError(err.message || 'Registration failed. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	const _handleSubmit = (role) => {
		submitToServer(role)
	}

	if (showSuccess) {
		return <RegistrationSuccess userEmail={userEmail} />
	}

	return (
		<div className={styles.container}>
			<h3 className={styles.title}>{t('Create Account')}</h3>
			<form className={styles.form} onSubmit={e => e.preventDefault()}>
				{/* Profile Picture Upload */}
				<ImageUpload 
					onImageUpload={handleImageUpload}
					currentImage={form.profilePicture}
					label={t('profile picture optional')}
				/>

				<div className="mb-2">
					<label className="form-label">{t('name')}</label>
					<input name="name" value={form.name} onChange={handleChange} className="form-control" autoComplete="name" />
					{errors.name && <div className="text-danger small">{errors.name}</div>}
				</div>

				<div className="mb-2">
					<label className="form-label">{t('email')}</label>
					<input name="email" value={form.email} onChange={handleChange} className="form-control" autoComplete="email" />
					{errors.email && <div className="text-danger small">{errors.email}</div>}
				</div>

				<div className="mb-2">
					<label className="form-label">{t('password')}</label>
					<div className="position-relative">
						<input 
							type={showPassword ? 'text' : 'password'} 
							name="password" 
							value={form.password} 
							onChange={handleChange} 
							className="form-control" 
							autoComplete="new-password"
							minLength="8"
						/>
						<button
							type="button"
							className="btn btn-sm position-absolute end-0 top-0 h-100"
							onClick={() => setShowPassword(!showPassword)}
							style={{border: 'none', background: 'transparent'}}
						>
							{showPassword ? '🙈' : '👁️'}
						</button>
					</div>
					{form.password && (
						<div className="mt-2">
							<div className="small mb-1">Password strength:</div>
							<div className="d-flex gap-1 mb-2">
								<div className={`flex-fill rounded ${passwordStrength.length >= 8 ? 'bg-success' : 'bg-light'}`} style={{height: '4px'}}></div>
								<div className={`flex-fill rounded ${passwordStrength.hasUpper ? 'bg-success' : 'bg-light'}`} style={{height: '4px'}}></div>
								<div className={`flex-fill rounded ${passwordStrength.hasLower ? 'bg-success' : 'bg-light'}`} style={{height: '4px'}}></div>
								<div className={`flex-fill rounded ${passwordStrength.hasNumber ? 'bg-success' : 'bg-light'}`} style={{height: '4px'}}></div>
							</div>
							<div className="small text-muted">
								<div className={passwordStrength.length >= 8 ? 'text-success' : 'text-muted'}>✓ At least 8 characters</div>
								<div className={passwordStrength.hasUpper ? 'text-success' : 'text-muted'}>✓ One uppercase letter</div>
								<div className={passwordStrength.hasLower ? 'text-success' : 'text-muted'}>✓ One lowercase letter</div>
								<div className={passwordStrength.hasNumber ? 'text-success' : 'text-muted'}>✓ One number</div>
							</div>
						</div>
					)}
					{errors.password && <div className="text-danger small">{errors.password}</div>}
				</div>







				<div className="mb-3">
					<label className="form-label">{t('Education level')}</label>
					<select name="educationLevel" value={form.educationLevel} onChange={handleChange} className="form-select">
						<option value="">{t('select')}</option>
						<option value="secondary">{t('Secondary')}</option>
						<option value="bachelor">{t('Bachelor')}</option>
						<option value="master">{t('Master')}</option>
						<option value="other">{t('Other')}</option>
					</select>
					{errors.educationLevel && <div className="text-danger small">{errors.educationLevel}</div>}
				</div>

				<div className="mb-3">
					<label className="form-label">{t('role')}</label>
					<select name="role" value={form.role} onChange={handleChange} className="form-select">
						<option value="mentee">{t('mentee')}</option>
						<option value="mentor">{t('mentor')}</option>
					</select>
				</div>

				<button type="submit" className={`btn ${styles.brandButton} w-100`} onClick={(e) => { e.preventDefault(); submitToServer(form.role); }} disabled={loading}>
					{loading ? 'creating account' : 'Create Account'}
				</button>
			</form>

			{error && (
				<div className="mt-3 alert alert-danger">
					<strong>{t('error')}:</strong> {error}
				</div>
			)}
			{debugInfo && (
				<div className="mt-3 alert alert-warning">
					<strong>Debug:</strong> {debugInfo}
				</div>
			)}

			{result && (
				<div className="mt-4 alert alert-light">
					<strong>{t('response')}:</strong>
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