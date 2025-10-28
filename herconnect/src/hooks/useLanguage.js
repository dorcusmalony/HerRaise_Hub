import { useContext } from 'react'
import { LanguageContext } from '../contexts/LanguageContextDefinition'

const translations = {
  // English translations
  en: {
    postNotFound: 'Post not found.',
    commentNotFound: 'Comment not found.',
    liked: 'Liked',
    unliked: 'Unliked',
    postCreated: 'Post created successfully.',
    commentCreated: 'Comment posted successfully.',
    notFound: 'Not found.',
    clickTracked: 'Click tracked.',
    bookmarked: 'Bookmarked.',
    unbookmarked: 'Bookmark removed.',
    types: 'Types',
    
    // Add your Header translations
    home: 'Home',
    about: 'About',
    forum: 'Forum',
    opportunities: 'Opportunities',
    resources: 'Resources',
    view_profile: 'View Profile',
    dashboard: 'Dashboard',
    settings: 'Settings',
    help: 'Help',
    report_safety_concern: 'Report Safety Concern',
    log_out: 'Log Out',
    login: 'Login',
    register: 'Register',
  },
  
  // Swahili translations
  sw: {
    postNotFound: 'Chapisho halikupatikana.',
    commentNotFound: 'Maoni hayakupatikana.',
    liked: 'Imependwa',
    unliked: 'Imefutwa kupendwa',
    postCreated: 'Chapisho limeundwa.',
    commentCreated: 'Maoni yameongezwa.',
    notFound: 'Halikupatikana.',
    clickTracked: 'Kubonyeza imefuatiliwa.',
    bookmarked: 'Imewekwa alama.',
    unbookmarked: 'Alama imeondolewa.',
    types: 'Aina',
    
    // Add Swahili translations
    home: 'Nyumbani',
    about: 'Kuhusu',
    forum: 'Jukwaa',
    opportunities: 'Fursa',
    resources: 'Rasilimali',
    view_profile: 'Tazama Wasifu',
    dashboard: 'Dashibodi',
    settings: 'Mipangilio',
    help: 'Msaada',
    report_safety_concern: 'Ripoti Suala la Usalama',
    log_out: 'Toka',
    login: 'Ingia',
    register: 'Jisajili',
  }
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  
  // Get current language from context
  const { language } = context
  
  // Create t function that uses current language
  const t = (key) => {
    const currentLang = language || 'en'
    return translations[currentLang]?.[key] || key
  }
  
  // FIX: Return context WITH the t function
  return { ...context, t }
}