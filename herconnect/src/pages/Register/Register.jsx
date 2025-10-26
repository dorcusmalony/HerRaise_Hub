// Try to POST to backend, fallback to simulated response on error
	import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import ImageUpload from '../../components/ImageUpload/ImageUpload.jsx'
import '../../styles/BootstrapVars.module.css'
import styles from '../../styles/Pages.module.css'

export default function Register(){
	const navigate = useNavigate()
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
	const [submitting, setSubmitting] = useState(false)
	const [debugInfo, setDebugInfo] = useState(null)
	const [success, setSuccess] = useState(null)
	const [error, setError] = useState(null)

	const handleChange = (e) => {
		const { name, value } = e.target
		if (name === 'city' || name === 'state') {
			setForm(prev => ({ ...prev, location: { ...prev.location, [name]: value } }))
		} else {
			setForm(prev => ({ ...prev, [name]: value }))
		}
	}

	const handleLangSwitch = (lang) => {
		i18n.changeLanguage(lang)
		setForm(prev => ({ ...prev, language: lang }))
	}

	const validate = (role) => {
		const err = {}
		if (!form.name.trim()) err.name = t('name_required')
		if (!form.email.trim()) err.email = 'Email required'
		if (!form.password) err.password = 'Password required'
		if (role === 'mentor') {
			if (!form.educationLevel) err.educationLevel = t('education_required')
			if (!form.location.city.trim()) err.city = 'City required for mentors'
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

			// Success
			setSuccess(data.message || 'Registration successful! Redirecting to login...')
			
			// Clear form
			setForm({
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

			//  Redirect to login page after 2 seconds
			setTimeout(() => {
				navigate('/login', { replace: true })
			}, 2000)
			
		} catch (err) {
			console.error("Registration error:", err)
			setError(err.message || 'Registration failed. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	const handleSubmit = (role) => {
		submitToServer(role)
	}

	return (
		<div className={`mx-auto ${styles.container}`}>
			{/* Language Switcher */}
			<div className="mb-3 d-flex gap-2 align-items-center">
				<span>{t('language')}:</span>
				<button type="button" className={`btn btn-sm btn-outline-primary ${form.language === 'en' ? 'active' : ''}`} onClick={() => handleLangSwitch('en')}>
					{t('english')}
				</button>
				<button type="button" className={`btn btn-sm btn-outline-primary ${form.language === 'ar' ? 'active' : ''}`} onClick={() => handleLangSwitch('ar')}>
					{t('juba_arabic')}
				</button>
			</div>
			<h3>{t('create_account')}</h3>
			<form onSubmit={e => e.preventDefault()}>
				{/* Profile Picture Upload */}
				<ImageUpload 
					onImageUpload={handleImageUpload}
					currentImage={form.profilePicture}
					label={t('profile_picture_optional')}
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
					<input type="password" name="password" value={form.password} onChange={handleChange} className="form-control" autoComplete="new-password" />
					{errors.password && <div className="text-danger small">{errors.password}</div>}
				</div>

				<div className="mb-3">
					<label className="form-label">{t('phone_number')}</label>
					<input 
						type="tel"
						name="phoneNumber" 
						value={form.phoneNumber} 
						onChange={handleChange} 
						className="form-control" 
						placeholder={t('phone_placeholder')}
						pattern="^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$"
						title={t('phone_title')}
						autoComplete="tel"
					/>
					<small className="text-muted">{t('phone_hint')}</small>
				</div>

				<div className="mb-3">
					<label className="form-label">{t('preferred_language')}</label>
					<select name="language" value={form.language} onChange={handleChange} className="form-select" >
						<option value="en">{t('english')}</option>
						<option value="ar">{t('juba_arabic')}</option>
					</select>
				</div>

				<div className="mb-2">
					<label className="form-label">{t('city')}</label>
					<input name="city" value={form.location.city} onChange={handleChange} className="form-control" autoComplete="address-level2" />
					{errors.city && <div className="text-danger small">{errors.city}</div>}
				</div>
				<div className="mb-2">
					<label className="form-label">{t('state_country')}</label>
					<input name="state" value={form.location.state} onChange={handleChange} className="form-control" autoComplete="address-level1" />
				</div>

				<div className="mb-2">
					<label className="form-label">{t('date_of_birth')}</label>
					<input 
						type="date" 
						name="dateOfBirth" 
						value={form.dateOfBirth} 
						onChange={handleChange} 
						className="form-control"
						max={new Date().toISOString().split('T')[0]}
					/>
					<small className="text-muted">{t('dob_hint')}</small>
				</div>

				<div className="mb-2">
					<label className="form-label">{t('interests')}</label>
					<input name="interests" value={form.interests} onChange={handleChange} className="form-control" placeholder={t('interests_placeholder')} />
				</div>

				<div className="mb-3">
					<label className="form-label">{t('education_level')}</label>
					<select name="educationLevel" value={form.educationLevel} onChange={handleChange} className="form-select">
						<option value="">{t('select')}</option>
						<option value="secondary">{t('secondary')}</option>
						<option value="bachelor">{t('bachelor')}</option>
						<option value="master">{t('master')}</option>
						<option value="other">{t('other')}</option>
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
					{loading ? 'Submitting...' : 'Create Account'}
				</button>
			</form>

			{(debugInfo || error) && (
				<div className="mt-3 alert alert-warning">
					{error && <div className="text-danger"><strong>{t('error')}:</strong> {error}</div>}
					{debugInfo && <div className="text-warning"><strong>Debug:</strong> {debugInfo}</div>}
					<div className="small mt-1">{t('check_console')}</div>
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