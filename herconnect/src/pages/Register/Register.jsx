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

	const handleChange = (e) => {
		const { name, value } = e.target
		if (name === 'city' || name === 'state') {
			setForm(prev => ({ ...prev, location: { ...prev.location, [name]: value } }))
		} else {
			setForm(prev => ({ ...prev, [name]: value }))
		}
		

	}



	const validateEmail = (email) => {
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
		return emailRegex.test(email)
	}

	const validate = (role) => {
		const err = {}
		if (!form.name.trim()) err.name = t('name required')
		if (!form.email.trim()) {
			err.email = 'Email required'
		} else if (!validateEmail(form.email.trim())) {
			err.email = 'Please enter a valid email address (e.g., user@gmail.com)'
		}
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
				// Handle specific error cases with user-friendly messages
				if (res.status === 400) {
					// Check if it's email already in use
					if (data.message && data.message.toLowerCase().includes('email')) {
						throw new Error('This email is already registered. Please use a different email or try logging in.')
					}
					throw new Error(data.message || 'Please check your information and try again.')
				} else if (res.status === 409) {
					throw new Error('This email is already registered. Please use a different email or try logging in.')
				} else if (res.status === 500) {
					// Check if backend message mentions email
					if (data.message && data.message.toLowerCase().includes('email')) {
						throw new Error('This email is already registered. Please use a different email or try logging in.')
					}
					throw new Error('Unable to create account right now. Please try again in a few minutes.')
				} else {
					throw new Error(data.message || 'Registration failed. Please try again.')
				}
			}

			// Success - show check email message
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
					<input 
						type="email" 
						name="email" 
						value={form.email} 
						onChange={handleChange} 
						className="form-control" 
						autoComplete="email"
						placeholder="Enter your email (e.g., user@gmail.com)"
					/>
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
							style={{ paddingRight: '40px' }}
						/>
						<button
							type="button"
							className="position-absolute"
							onClick={() => setShowPassword(!showPassword)}
							style={{
								right: '12px',
								top: '50%',
								transform: 'translateY(-50%)',
								border: 'none',
								background: 'transparent',
								cursor: 'pointer',
								color: '#6c757d',
								fontSize: '16px'
							}}
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