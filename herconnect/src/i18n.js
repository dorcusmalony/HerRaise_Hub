import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './locales/en.json'
import ar from './locales/juba-ar.json'

const currentLang = localStorage.getItem('lang') || 'en'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar }
    },
    lng: currentLang,
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  })

// Set initial document direction
document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr')
document.documentElement.setAttribute('lang', currentLang)

export default i18n
