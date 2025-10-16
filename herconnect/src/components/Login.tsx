import React, { useState } from 'react';
import { login } from '../services/authService';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		try {
			const data = await login({ email, password });
			// handle success (redirect etc.)
		} catch (err: any) {
			console.error('Login request failed', err);
			setError(err?.response?.data?.message || 'Login failed');
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<input
				name="email"
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				autoComplete="email"
			/>
			<input
				name="password"
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				autoComplete="current-password"
			/>
			<button type="submit">Login</button>
			{error && <div>{error}</div>}
		</form>
	);
}