import React, { useState } from 'react'

export default function Register(){
	const [form, setForm] = useState({
		name: '',
		email: '',
		password: '',
		role: 'mentee', // default
		language: 'en',
		phoneNumber: '',
		location: { city: '', state: '' },
		dateOfBirth: '',
		interests: '', // comma separated input, will become array
		educationLevel: '',
	})
	const [errors, setErrors] = useState({})
	const [result, setResult] = useState(null) // store simulated API response

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

	const handleSubmit = (role) => {
		if (!validate(role)) return
		const payload = {
			name: form.name.trim(),
			email: form.email.trim(),
			password: form.password,
			role,
			language: form.language || 'en',
			phoneNumber: form.phoneNumber || '',
			location: {
				city: form.location.city || '',
				state: form.location.state || '',
			},
			dateOfBirth: form.dateOfBirth || '',
			interests: form.interests ? form.interests.split(',').map(s => s.trim()).filter(Boolean) : [],
			educationLevel: form.educationLevel || '',
		}

		// Simulate API response for mentor role using the structure you provided
		if (role === 'mentor') {
			const fakeResponse = {
				success: true,
				token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
				user: {
					id: 'c3a2b1a4-2a23-4dc8-baf1-2b44e4e8aa3f',
					name: payload.name || 'Mary Ajok',
					email: payload.email || 'maryajok@example.com',
					role: 'mentor',
					language: payload.language || 'en',
					phoneNumber: payload.phoneNumber || '+211900000001',
					location: payload.location,
					dateOfBirth: payload.dateOfBirth || '1995-06-20',
					interests: payload.interests.length ? payload.interests : ['leadership','career development'],
					educationLevel: payload.educationLevel || 'bachelor',
				},
			}
			// store/display simulated response
			setResult(fakeResponse)
			// optionally persist token
			try { localStorage.setItem('token', fakeResponse.token) } catch (e) {}
			alert('Registered as mentor (simulated). Token saved to localStorage.')
		} else {
			// simple mentee simulation
			const fakeResponse = { success: true, message: 'Registered as mentee', user: { name: payload.name, email: payload.email, role: 'mentee' } }
			setResult(fakeResponse)
			alert('Registered as mentee (simulated).')
		}

		// reset password field for safety in UI
		setForm(prev => ({ ...prev, password: '' }))
	}

	return (
		<div className="mx-auto" style={{maxWidth:640}}>
			<h3>Create account</h3>
			<form onSubmit={e => e.preventDefault()}>
				<div className="mb-2">
					<label className="form-label">Name</label>
					<input name="name" value={form.name} onChange={handleChange} className="form-control" />
					{errors.name && <div className="text-danger small">{errors.name}</div>}
				</div>

				<div className="mb-2">
					<label className="form-label">Email</label>
					<input name="email" value={form.email} onChange={handleChange} className="form-control" />
					{errors.email && <div className="text-danger small">{errors.email}</div>}
				</div>

				<div className="mb-2">
					<label className="form-label">Password</label>
					<input type="password" name="password" value={form.password} onChange={handleChange} className="form-control" />
					{errors.password && <div className="text-danger small">{errors.password}</div>}
				</div>

				<div className="mb-3">
					<label className="form-label">Phone number</label>
					<input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} className="form-control" placeholder="+211..." />
				</div>

				<div className="mb-3">
					<label className="form-label">Preferred language</label>
					<select name="language" value={form.language} onChange={handleChange} className="form-select" >
						<option value="en">English</option>
						<option value="ar">Arabic</option>
						<option value="sw">Swahili</option>
					</select>
				</div>

				{/* Mentor-only fields (still editable but validated only when role=mentor) */}
				<div className="mb-2">
					<label className="form-label">City</label>
					<input name="city" value={form.location.city} onChange={handleChange} className="form-control" />
					{errors.city && <div className="text-danger small">{errors.city}</div>}
				</div>
				<div className="mb-2">
					<label className="form-label">State / Country</label>
					<input name="state" value={form.location.state} onChange={handleChange} className="form-control" />
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
					<button type="button" className="btn btn-outline-primary" onClick={() => handleSubmit('mentee')}>
						Join as Mentee
					</button>
					<button type="button" className="btn" style={{background: 'var(--brand-magenta)', color:'#fff'}} onClick={() => handleSubmit('mentor')}>
						Join as Mentor
					</button>
				</div>
			</form>

			{/* show simulated response */}
			{result && (
				<div className="mt-4 alert alert-light">
					<strong>Response (simulated):</strong>
					<pre style={{whiteSpace:'pre-wrap', wordBreak:'break-word', marginTop:8}}>{JSON.stringify(result, null, 2)}</pre>
				</div>
			)}
		</div>
	)
}