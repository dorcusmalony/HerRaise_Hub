import { useLanguage } from '../../hooks/useLanguage'

export default function LanguageSwitcher() {
  const { language, switchLanguage, t } = useLanguage()
  
  const changeLang = (lng) => {
    switchLanguage(lng)
  }
  return (
    <div className="d-flex gap-2 align-items-center">
      <span>Language:</span>
      <button 
        className={`btn btn-sm ${language === 'en' ? 'btn-primary' : 'btn-outline-primary'}`} 
        onClick={() => changeLang('en')}
      >
        English
      </button>
      <button 
        className={`btn btn-sm ${language === 'ar' ? 'btn-primary' : 'btn-outline-primary'}`} 
        onClick={() => changeLang('ar')}
      >
        العربية
      </button>
    </div>
  )
}
