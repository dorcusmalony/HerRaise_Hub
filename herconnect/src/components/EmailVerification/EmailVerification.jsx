import React, { useState, useEffect } from 'react'
import styles from './EmailVerification.module.css'

export default function EmailVerification({ userEmail, onVerificationSuccess, onBack }) {
	const [verificationCode, setVerificationCode] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const [resendLoading, setResendLoading] = useState(false)
	const [resendMessage, setResendMessage] = useState('')
	const [timeLeft, setTimeLeft] = useState(300) // 5 minutes

	useEffect(() => {
		if (timeLeft > 0) {
			const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
			return () => clearTimeout(timer)
		}
	}, [timeLeft])

	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60)
		const secs = seconds % 60
		return `${mins}:${secs.toString().padStart(2, '0')}`
	}

	const handleVerify = async (e) => {
		e.preventDefault()
		if (!verificationCode.trim()) {
			setError('Please enter the verification code')
			return
		}

		setLoading(true)
		setError('')
		
		const API = import.meta.env.VITE_API_URL || ''
		
		try {
			const res = await fetch(`${API}/api/auth/verify-email`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: userEmail,
					verificationCode: verificationCode.trim()
				})
			})

			const data = await res.json()

			if (!res.ok) {
				throw new Error(data.message || 'Verification failed')
			}

			onVerificationSuccess()
		} catch (err) {
			setError(err.message || 'Verification failed. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	const handleResend = async () => {
		setResendLoading(true)
		setResendMessage('')
		setError('')
		
		const API = import.meta.env.VITE_API_URL || ''
		
		try {
			const res = await fetch(`${API}/api/auth/resend-verification`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: userEmail })
			})

			const data = await res.json()

			if (!res.ok) {
				throw new Error(data.message || 'Failed to resend code')
			}

			setResendMessage('Verification code sent! Check your email.')
			setTimeLeft(300) // Reset timer
		} catch (err) {
			setError(err.message || 'Failed to resend code. Please try again.')
		} finally {
			setResendLoading(false)
		}
	}

	return (
		<div className={styles.container}>
			<div className={styles.card}>
				<div className={styles.header}>
					<h2>Verify Your Email</h2>
					<p>We've sent a verification code to:</p>
					<strong>{userEmail}</strong>
				</div>

				<form onSubmit={handleVerify} className={styles.form}>
					<div className={styles.inputGroup}>
						<label>Enter 6-digit verification code:</label>
						<input
							type="text"
							value={verificationCode}
							onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
							placeholder="000000"
							className={styles.codeInput}
							maxLength="6"
						/>
					</div>

					{error && <div className={styles.error}>{error}</div>}
					{resendMessage && <div className={styles.success}>{resendMessage}</div>}

					<button 
						type="submit" 
						disabled={loading || verificationCode.length !== 6}
						className={styles.verifyButton}
					>
						{loading ? 'Verifying...' : 'Verify Email'}
					</button>
				</form>

				<div className={styles.resendSection}>
					<p>Didn't receive the code?</p>
					<button
						type="button"
						onClick={handleResend}
						disabled={resendLoading || timeLeft > 0}
						className={styles.resendButton}
					>
						{resendLoading ? 'Sending...' : timeLeft > 0 ? `Resend in ${formatTime(timeLeft)}` : 'Resend Code'}
					</button>
				</div>

				<button onClick={onBack} className={styles.backButton}>
					← Back to Registration
				</button>
			</div>
		</div>
	)
}