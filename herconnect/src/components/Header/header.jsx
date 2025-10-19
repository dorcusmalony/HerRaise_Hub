import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { disconnectSocket } from '../../services/socketService'

export default function Header() {
	const logoUrl = new URL('../../images/her-logo.jpg', import.meta.url).href
	const navigate = useNavigate()
	const API = import.meta.env.VITE_API_URL || '/api'
	
	const [user, setUser] = useState(null)
	const [showDropdown, setShowDropdown] = useState(false)
	const [notifications] = useState([]) // Remove setNotifications since it's not used yet
	const dropdownRef = useRef(null)

	// Load user data on mount AND when storage changes
	useEffect(() => {
		const loadUser = () => {
			const userData = localStorage.getItem('user')
			if (userData) {
				try {
					setUser(JSON.parse(userData))
					console.log('✅ User loaded in Header:', JSON.parse(userData))
				} catch (e) {
					console.error('Failed to parse user data:', e)
					setUser(null)
				}
			} else {
				setUser(null)
			}
		}

		// Load initially
		loadUser()

		// Listen for storage changes (when user logs in/out)
		window.addEventListener('storage', loadUser)
		
		// Custom events for same-tab updates
		window.addEventListener('user-login', loadUser)
		window.addEventListener('user-logout', loadUser)

		return () => {
			window.removeEventListener('storage', loadUser)
			window.removeEventListener('user-login', loadUser)
			window.removeEventListener('user-logout', loadUser)
		}
	}, [])

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setShowDropdown(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	// Get user initials
	const getInitials = (name) => {
		if (!name) return '?'
		return name
			.split(' ')
			.map(word => word[0])
			.join('')
			.toUpperCase()
			.slice(0, 2)
	}

	const handleLogout = async (e) => {
		e?.preventDefault?.()
		setShowDropdown(false) // Close dropdown immediately
		
		const token = localStorage.getItem('token') || localStorage.getItem('authToken')
		
		try {
			const res = await fetch(`${API}/api/auth/logout`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...(token ? { Authorization: `Bearer ${token}` } : {})
				},
				credentials: 'include'
			})

			const data = await res.json().catch(() => null)
			if (res.ok && data?.success) {
				console.log('✅ Logout successful:', data.message)
			}
		} catch (err) {
			console.warn('⚠️ Logout request failed', err)
		} finally {
			// Disconnect WebSocket
			disconnectSocket()

			// Clear all auth data
			localStorage.removeItem('token')
			localStorage.removeItem('authToken')
			localStorage.removeItem('user')
			
			// ✅ Clear user state immediately
			setUser(null)
			
			// ✅ Dispatch logout event to update other components
			window.dispatchEvent(new Event('user-logout'))
			
			console.log('✅ User logged out, localStorage cleared')
			
			// Navigate to login
			navigate('/login', { replace: true })
		}
	}

	return (
		<header
			className="site-header border-bottom sticky-top"
			style={{
				borderColor: 'var(--border-blue)',
				background: 'var(--bg-white)',
				margin: 0,
				borderRadius: 0,
			}}
		>
			<div className="container d-flex align-items-center justify-content-between py-3">
				{/* Logo */}
				<Link to="/" className="d-flex align-items-center text-decoration-none" style={{color: 'var(--text-dark)'}}>
					<img src={logoUrl} alt="HerRaise Hub logo" width="56" className="me-2" />
					<div>
						<strong className="d-block" style={{color: 'var(--text-dark)'}}>HerRaise Hub</strong>
						<small className="text-muted">Empowering young women</small>
					</div>
				</Link>

				{/* Navigation */}
				<nav className="d-none d-md-flex align-items-center gap-4">
					<Link to="/" className="text-decoration-none" style={{color: 'var(--text-dark)'}}>Home</Link>
					<Link to="/about" className="text-decoration-none" style={{color: 'var(--text-dark)'}}>About</Link>
					<Link to="/forum" className="text-decoration-none" style={{color: 'var(--text-dark)'}}>Forum</Link>
					<Link to="/opportunities" className="text-decoration-none" style={{color: 'var(--text-dark)'}}>Opportunities</Link>
					<Link to="/resources" className="text-decoration-none" style={{color: 'var(--text-dark)'}}>Resources</Link>
				</nav>

				{/* Right Side: Notification + Avatar */}
				<div className="d-flex align-items-center gap-3">
					{user ? (
						<>
							{/* Notification Bell */}
							<div className="position-relative">
								<button 
									className="btn btn-link text-decoration-none p-2"
									style={{color: 'var(--text-dark)'}}
									title="Notifications"
								>
									<svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
										<path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
									</svg>
									{notifications.length > 0 && (
										<span 
											className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
											style={{fontSize: '0.6rem'}}
										>
											{notifications.length}
										</span>
									)}
								</button>
							</div>

							{/* Avatar Dropdown */}
							<div className="position-relative" ref={dropdownRef}>
								<button
									onClick={() => setShowDropdown(!showDropdown)}
									className="btn p-0 border-0 bg-transparent"
									style={{outline: 'none'}}
								>
									<div 
										className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
										style={{
											width: '40px',
											height: '40px',
											background: 'var(--brand-magenta)',
											overflow: 'hidden',
											cursor: 'pointer'
										}}
									>
										{user?.profilePicture ? (
											<img 
												src={user.profilePicture} 
												alt={user.name}
												style={{width: '100%', height: '100%', objectFit: 'cover'}}
											/>
										) : (
											<span>{getInitials(user?.name)}</span>
										)}
									</div>
								</button>

								{/* Dropdown Menu */}
								{showDropdown && (
									<div 
										className="position-absolute end-0 mt-2 bg-white rounded shadow-lg"
										style={{
											width: '280px',
											zIndex: 1050,
											border: '1px solid #e0e0e0'
										}}
									>
										{/* User Info Section */}
										<div className="p-3 border-bottom">
											<div className="d-flex align-items-center gap-3">
												<div 
													className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
													style={{
														width: '48px',
														height: '48px',
														background: 'var(--brand-magenta)',
														overflow: 'hidden'
													}}
												>
													{user?.profilePicture ? (
														<img 
															src={user.profilePicture} 
															alt={user.name}
															style={{width: '100%', height: '100%', objectFit: 'cover'}}
														/>
													) : (
														<span>{getInitials(user?.name)}</span>
													)}
												</div>
												<div className="flex-grow-1 overflow-hidden">
													<p className="mb-0 fw-semibold text-truncate">{user?.name || 'User'}</p>
													<p className="mb-0 small text-muted text-truncate">{user?.email || 'user@example.com'}</p>
													<span 
														className="badge mt-1"
														style={{background: 'var(--brand-magenta)', fontSize: '0.7rem'}}
													>
														{user?.role === 'mentee' ? '🎓 Mentee' : 
														 user?.role === 'mentor' ? '👩‍🏫 Mentor' : '👑 Admin'}
													</span>
												</div>
											</div>
										</div>

										{/* Menu Items */}
										<div className="py-1">
											<Link
												to="/profile"
												className="d-flex align-items-center px-3 py-2 text-decoration-none text-dark hover-bg-light"
												onClick={() => setShowDropdown(false)}
											>
												<svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16" className="me-2 text-muted">
													<path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
													<path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
												</svg>
												View Profile
											</Link>

											<Link
												to="/dashboard"
												className="d-flex align-items-center px-3 py-2 text-decoration-none text-dark hover-bg-light"
												onClick={() => setShowDropdown(false)}
											>
												<svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16" className="me-2 text-muted">
													<path d="M8 4a.5.5 0 0 1 .5.5V6a.5.5 0 0 1-1 0V4.5A.5.5 0 0 1 8 4zM3.732 5.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707zM2 10a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 10zm9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5zm.754-4.246a.389.389 0 0 0-.527-.02L7.547 9.31a.91.91 0 1 0 1.302 1.258l3.434-4.297a.389.389 0 0 0-.029-.518z"/>
													<path fillRule="evenodd" d="M0 10a8 8 0 1 1 15.547 2.661c-.442 1.253-1.845 1.602-2.932 1.25C11.309 13.488 9.475 13 8 13c-1.474 0-3.31.488-4.615.911-1.087.352-2.49.003-2.932-1.25A7.988 7.988 0 0 1 0 10zm8-7a7 7 0 0 0-6.603 9.329c.203.575.923.876 1.68.63C4.397 12.533 6.358 12 8 12s3.604.532 4.923.96c.757.245 1.477-.056 1.68-.631A7 7 0 0 0 8 3z"/>
												</svg>
												Dashboard
											</Link>

											<Link
												to="/settings"
												className="d-flex align-items-center px-3 py-2 text-decoration-none text-dark hover-bg-light"
												onClick={() => setShowDropdown(false)}
											>
												<svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16" className="me-2 text-muted">
													<path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
													<path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319z"/>
												</svg>
												Settings
											</Link>

											<Link
												to="/help"
												className="d-flex align-items-center px-3 py-2 text-decoration-none text-dark hover-bg-light"
												onClick={() => setShowDropdown(false)}
											>
												<svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16" className="me-2 text-muted">
													<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
													<path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
												</svg>
												Help
											</Link>
										</div>

										{/* Logout */}
										<div className="border-top pt-1">
											<button
												onClick={handleLogout}
												className="d-flex align-items-center w-100 px-3 py-2 text-decoration-none border-0 bg-transparent text-danger hover-bg-danger-light"
												style={{cursor: 'pointer'}}
											>
												<svg width="18" height="18" fill="currentColor" viewBox="0 0 16 16" className="me-2">
													<path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
													<path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
												</svg>
												Log Out
											</button>
										</div>
									</div>
								)}
							</div>
						</>
					) : (
						<>
							<Link to="/login" className="btn btn-sm btn-outline-primary">Login</Link>
							<Link to="/register" className="btn btn-sm text-white" style={{background: 'var(--brand-magenta)'}}>Register</Link>
						</>
					)}
				</div>
			</div>

			{/* Add hover effect CSS */}
			<style>{`
				.hover-bg-light:hover {
					background-color: #f8f9fa;
				}
				.hover-bg-danger-light:hover {
					background-color: #ffe5e5;
				}
			`}</style>
		</header>
	)
}