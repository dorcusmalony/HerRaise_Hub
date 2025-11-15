import { useState, useEffect, useCallback } from 'react'
import { LanguageContext } from './LanguageContextDefinition'

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en'
  })
  const [translations, setTranslations] = useState({})

  const loadTranslations = useCallback(async (lang) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/translations/${lang}`)
      if (response.ok) {
        const data = await response.json()
        setTranslations(data.translations || {})
      }
    } catch (error) {
      console.error('Failed to load translations:', error)
      // Fallback to default translations
      setTranslations(getDefaultTranslations(lang))
    }
  }, [])

  const getDefaultTranslations = (lang) => {
    // Return empty object since we're using useLanguage hook for translations
    return {}
  }

  const switchLanguage = async (lang) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/switch-language`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ language: lang })
      })
    } catch (error) {
      console.error('Failed to switch language on server:', error)
    }
    
    setLanguage(lang)
    localStorage.setItem('language', lang)
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', lang)
    await loadTranslations(lang)
  }

  const t = (key) => {
    return key.split('.').reduce((obj, k) => obj?.[k], translations) || key
  }

  useEffect(() => {
    loadTranslations(language)
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', language)
  }, [language, loadTranslations])

  return (
    <LanguageContext.Provider value={{ language, translations, switchLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

