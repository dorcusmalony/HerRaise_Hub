import React from 'react'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import styles from './Footer.module.css'

export default function Footer(){
  const { t } = useLanguage()
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
            <p className={`small ${styles.text}`}>{t('footer_description')}</p>
          </div>

          <div className="col-6 col-md-4 mb-4">
            <h5 className={styles.heading}>{t('quick_links')}</h5>
            <ul className="list-unstyled small">
              <li><a href="/resources" className={styles.link}>{t('resources')}</a></li>
              <li><a href="/reports" className={styles.link}>{t('reports')}</a></li>
              <li><a href="/about" className={styles.link}>{t('about')}</a></li>
              <li><a href="/privacy-policy" className={styles.link}>Privacy Policy</a></li>
              {isLoggedIn ? (
                <li><button type="button" onClick={handleLogout} className={styles.logoutButton}>{t('log_out')}</button></li>
              ) : (
                <li><a href="/login" className={styles.link}>{t('login')}</a></li>
              )}
            </ul>
          </div>

          <div className="col-6 col-md-4 mb-4">
            <h5 className={styles.heading}>{t('contact_newsletter')}</h5>
            <p className={`small mb-2 ${styles.text}`}>{t('join_mailing_list')}</p>
            <form className={styles.newsletter} onSubmit={e => e.preventDefault()}>
              <input className={`form-control form-control-sm me-2 ${styles.newsletterInput}`} placeholder={t('email_address')} aria-label={t('email_address')} />
              <button className="btn btn-sm btn-light">{t('subscribe')}</button>
            </form>
            <div className={styles.social}>
              <a href="#" className={styles.socialLink} aria-label="Facebook"><FaFacebook /></a>
              <a href="#" className={styles.socialLink} aria-label="Twitter"><FaTwitter /></a>
              <a href="#" className={styles.socialLink} aria-label="Instagram"><FaInstagram /></a>
              <a href="#" className={styles.socialLink} aria-label="LinkedIn"><FaLinkedin /></a>
            </div>
          </div>
        </div>

        <div className={styles.copyright}>{t('copyright')} {new Date().getFullYear()} HerRaise Hub {t('all_rights_reserved')}</div>
      </div>
    </footer>
  )
}