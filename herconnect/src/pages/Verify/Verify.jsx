import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import styles from './Verify.module.css'

export default function Verify() {
	const [searchParams] = useSearchParams()
	const [status, setStatus] = useState('verifying') // 'verifying', 'success', 'error'
	const [message, setMessage] = useState('')
	
	const token = searchParams.get('token')
	const id = searchParams.get('id')

	useEffect(() => {
		const verifyEmail = async () => {
			if (!token || !id) {
				setStatus('error')
				setMessage('Invalid verification link. Please check your email for the correct link.')
				return
			}

			const API = import.meta.env.VITE_API_URL || ''
			
			try {
				const response = await fetch(`${API}/api/auth/verify/${token}/${id}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					}
				})

				const data = await response.json()

				if (response.ok && data.success) {
					setStatus('success')
					setMessage(data.message || 'Your email has been verified successfully! You can now login to your account.')
				} else {
					setStatus('error')
					setMessage(data.message || 'Verification failed. The link may be expired or invalid.')
				}
			} catch (error) {
				setStatus('error')
				setMessage('Network error. Please check your connection and try again.')
			}
		}

		verifyEmail()
	}, [token, id])

	return (
		<div className={styles.container}>
			<div className={styles.card}>
				{status === 'verifying' && (
					<div className={styles.verifying}>
						<div className={styles.spinner}></div>
						<h2>Verifying your email...</h2>
						<p>Please wait while we verify your account.</p>
					</div>
				)}

				{status === 'success' && (
					<div className={styles.success}>
						<div className={styles.successIcon}>✅</div>
						<h2>Email Verified!</h2>
						<p>{message}</p>
						<Link to="/login" className={styles.loginButton}>
							Go to Login
						</Link>
					</div>
				)}

				{status === 'error' && (
					<div className={styles.error}>
						<div className={styles.errorIcon}>❌</div>
						<h2>Verification Failed</h2>
						<p>{message}</p>
						<div className={styles.actions}>
							<Link to="/login" className={styles.loginButton}>
								Try Login
							</Link>
							<Link to="/register" className={styles.registerButton}>
								Register Again
							</Link>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}