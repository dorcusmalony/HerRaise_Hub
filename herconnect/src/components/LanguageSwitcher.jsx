import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const changeLang = (lng) => {
    i18n.changeLanguage(lng)
    localStorage.setItem('lang', lng)
    window.location.reload()
  }
  return (
    <div className="d-flex gap-2 align-items-center">
      <span>{t('language')}:</span>
      <button className="btn btn-sm btn-outline-primary" onClick={() => changeLang('en')}>
        {t('english')}
      </button>
      <button className="btn btn-sm btn-outline-primary" onClick={() => changeLang('ar')}>
        {t('juba_arabic')}
      </button>
    </div>
  )
}
