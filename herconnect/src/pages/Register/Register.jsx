// Try to POST to backend, fallback to simulated response on error
	const submitToServer = async (role) => {
		if (!validate(role)) return
		const payload = buildPayload(role)
		const API = import.meta.env.VITE_API_URL || '';
		
		if (!API) {
			console.error("VITE_API_URL is not set!");
			setDebugInfo("VITE_API_URL environment variable is missing. Check your .env file.");
			return;
		}
		
		console.log("Environment VITE_API_URL:", API);
		
		// Correct endpoint based on backend structure
		const endpoint = `${API}/api/auth/register`;
		
		setSubmitting(true)
		setResult(null)
		setErrors({})
		setDebugInfo(null)
		
		console.log("Calling endpoint:", endpoint);
		
		try {
			const res = await fetch(endpoint, {
				method: 'POST',
				headers: { 
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});
			
			console.log("Response status:", res.status);
			
			// Try to parse response as JSON
			const data = await res.json().catch(() => {
				console.warn("Response is not valid JSON");
				return null;
			});
			
			if (!res.ok) {
				console.error("Error response:", data);
				setDebugInfo(`Server error (${res.status}): ${data?.message || 'Unknown error'}`);
				setErrors({ submit: data?.message || `Server error: ${res.status}` });
				setSubmitting(false);
				return;
			}
			
			// Server success
			console.log("Success! Response data:", data);
			setResult(data);
			
			if (data?.token) {
				try { localStorage.setItem('token', data.token); } catch (e) {}
			}
			
		} catch (err) {
			console.error("Network/Fetch error:", err);
			
			// Check if it's a CORS error
			if (err.message.includes('Failed to fetch') || err.name === 'TypeError') {
				setDebugInfo(`Network error - likely CORS issue. Backend needs to allow: ${window.location.origin}`);
			} else {
				setDebugInfo(`Error: ${err.message}`);
			}
			
			// Fallback to simulated response for development
			console.log("Using fallback simulated response");
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
					_note: 'simulated fallback response (backend not reachable)'
				}
				setResult(fakeResponse)
				try { localStorage.setItem('token', fakeResponse.token) } catch (e) {}
			} else {
				const fakeResponse = { 
					success: true, 
					message: 'Registered as mentee (simulated)', 
					user: { name: payload.name, email: payload.email, role: 'mentee' },
					_note: 'simulated fallback response (backend not reachable)'
				}
				setResult(fakeResponse)
			}
		}
		
		setSubmitting(false)
		// clear password in UI for safety
		setForm(prev => ({ ...prev, password: '' }))
	}