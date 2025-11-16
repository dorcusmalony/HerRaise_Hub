import { useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import './LanguageSwitcher.css'

export default function LanguageSwitcher() {
  const { language, switchLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇩' }
  ]

  const currentLang = languages.find(lang => lang.code === (language || 'en')) || languages[0]

  return (
    <div className="language-switcher">
      <button 
        className="language-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
      >
        <span className="globe-icon">🌐</span>
        <span className="current-lang">{currentLang.code === 'en' ? 'English' : 'العربية'}</span>
        <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>
      
      {isOpen && (
        <div className="language-dropdown">
          {languages.map(lang => (
            <button
              key={lang.code}
              className={`language-option ${(language || 'en') === lang.code ? 'active' : ''}`}
              onClick={() => {
                switchLanguage(lang.code)
                setIsOpen(false)
              }}
            >
              <span className="flag">{lang.flag}</span>
              <span className="name">{lang.name}</span>
              {(language || 'en') === lang.code && <span className="checkmark">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}