import React from 'react'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import styles from './Footer.module.css'

export default function Footer(){
  const navigate = useNavigate()
  const API = import.meta.env.VITE_API_URL || '/api'
  const isLoggedIn = !!localStorage.getItem('token') || !!localStorage.getItem('authToken')

  const handleLogout = async (e) => {
    e?.preventDefault?.()
    const token = localStorage.getItem('token') || localStorage.getItem('authToken')
    try {
      const res = await fetch(`${API}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include'
      })
      const data = await res.json().catch(() => null)
      if (res.ok && data?.success) {
        console.log('Logout:', data.message)
      } else {
        console.warn('Logout response:', data)
      }
    } catch (err) {
      console.warn('Logout error', err)
    } finally {
      try { 
        localStorage.removeItem('token')
        localStorage.removeItem('authToken')
      } catch {
        // Ignore localStorage errors
      }
      navigate('/', { replace: true })
    }
  }

  return (
    <footer
      className={styles.siteFooter}
      role="contentinfo"
      aria-labelledby="site-footer-heading"
    >
      <div className={styles.container}>
        <h2 id="site-footer-heading" className="visually-hidden">Site footer</h2>

        <div className="row">
          <div className="col-12 col-md-4 mb-4">
            <h5 className={styles.heading}>HerRaise Hub</h5>
            <p className={`small ${styles.text}`}>We support girls through resource opportunities, mentorship and track of goals setting to help them achive their careers.</p>
          </div>

          <div className="col-6 col-md-4 mb-4">
            <h5 className={styles.heading}>Quick Links</h5>
            <ul className="list-unstyled small">
              <li><a href="/resources" className={styles.link}>Resources</a></li>
              <li><a href="/reports" className={styles.link}>Reports</a></li>
              <li><a href="/about" className={styles.link}>About</a></li>
              {isLoggedIn ? (
                <li><button type="button" onClick={handleLogout} className={styles.logoutButton}>Logout</button></li>
              ) : (
                <li><a href="/login" className={styles.link}>Login</a></li>
              )}
            </ul>
          </div>

          <div className="col-6 col-md-4 mb-4">
            <h5 className={styles.heading}>Contact & Newsletter</h5>
            <p className={`small mb-2 ${styles.text}`}>Join our mailing list for updates.</p>
            <form className={styles.newsletter} onSubmit={e => e.preventDefault()}>
              <input className={`form-control form-control-sm me-2 ${styles.newsletterInput}`} placeholder="Email address" aria-label="Email address" />
              <button className="btn btn-sm btn-light">Subscribe</button>
            </form>
            <div className={styles.social}>
              <a href="#" className={styles.socialLink} aria-label="Facebook"><FaFacebook /></a>
              <a href="#" className={styles.socialLink} aria-label="Twitter"><FaTwitter /></a>
              <a href="#" className={styles.socialLink} aria-label="Instagram"><FaInstagram /></a>
              <a href="#" className={styles.socialLink} aria-label="LinkedIn"><FaLinkedin /></a>
            </div>
          </div>
        </div>

        <div className={styles.copyright}>© {new Date().getFullYear()} HerRaise Hub All rights reserved</div>
      </div>
    </footer>
  )
}