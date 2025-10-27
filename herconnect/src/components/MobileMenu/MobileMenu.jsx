import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import './MobileMenu.css'

export default function MobileMenu({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useLanguage()

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  return (
    <>
      {/* Mobile menu button */}
      <button 
        className="mobile-menu-btn d-md-none"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span className={`hamburger ${isOpen ? 'active' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="mobile-menu-overlay" onClick={closeMenu}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <h5>Menu</h5>
              <button className="close-btn" onClick={closeMenu}>×</button>
            </div>
            
            <nav className="mobile-nav">
              <Link to="/" onClick={closeMenu}>{t('nav.home')}</Link>
              <Link to="/about" onClick={closeMenu}>{t('nav.about')}</Link>
              <Link to="/forum" onClick={closeMenu}>{t('nav.forum')}</Link>
              <Link to="/opportunities" onClick={closeMenu}>{t('nav.opportunities')}</Link>
              <Link to="/resources" onClick={closeMenu}>{t('nav.resources')}</Link>
              
              {user ? (
                <>
                  <hr />
                  <Link to="/profile" onClick={closeMenu}>Profile</Link>
                  <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
                  <button onClick={() => { onLogout(); closeMenu(); }} className="logout-btn">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <hr />
                  <Link to="/login" onClick={closeMenu}>Login</Link>
                  <Link to="/register" onClick={closeMenu}>Register</Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}