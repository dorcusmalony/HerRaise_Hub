import React from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
	// compute URL for image placed in src/images; update filename if different
	const logoUrl = new URL('../../images/her logo.jpg', import.meta.url).href

	return (
		<header
			className="site-header border-bottom"
			style={{
				borderColor: 'var(--border-blue)',
				background: 'var(--bg-white)', // plain white navbar
				margin: 0,
				borderRadius: 0,
			}}
		>
			<div className="container d-flex align-items-center py-3">
				<Link to="/" className="me-3 d-flex align-items-center text-decoration-none" style={{color: 'var(--text-dark)'}}>
					<img src={logoUrl} alt="HerRaise Hub logo" width="56" className="me-2" />
					<div>
						<strong className="d-block" style={{color: 'var(--text-dark)'}}>HerRaise Hub</strong>
						<small className="text-muted">We live through uplifting each other.</small>
					</div>
				</Link>

				<div className="flex-grow-1" />

				<nav className="d-flex align-items-center gap-2">
					<Link to="/" className="btn btn-sm" style={{background: 'transparent', border: `1px solid var(--border-blue)`, color: 'var(--text-dark)'}}>Home</Link>
					<Link to="/about" className="btn btn-sm" style={{background: 'transparent', border: `1px solid var(--border-blue)`, color: 'var(--text-dark)'}}>About</Link>
					<Link to="/contact" className="btn btn-sm" style={{background: 'transparent', border: `1px solid var(--border-blue)`, color: 'var(--text-dark)'}}>Contact</Link>

					<Link to="/resources" className="btn btn-sm" style={{background: 'transparent', border: `1px solid var(--border-blue)`, color: 'var(--text-dark)'}}>Resources</Link>
					<Link to="/login" className="btn btn-sm" style={{background: 'transparent', border: `1px solid var(--border-blue)`, color: 'var(--text-dark)'}}>Login</Link>
					<Link to="/logout" className="btn btn-sm" style={{background: 'transparent', border: `1px solid var(--border-blue)`, color: 'var(--text-dark)'}}>Logout</Link>
					<Link to="/register" className="btn btn-sm text-white" style={{background: 'var(--brand-magenta)', border: `1px solid var(--border-blue)`}}>Register</Link>
				</nav>
			</div>
		</header>
	)
}