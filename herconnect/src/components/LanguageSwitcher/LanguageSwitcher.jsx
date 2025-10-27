import { useLanguage } from '../../hooks/useLanguage'
import './LanguageSwitcher.css'

export default function LanguageSwitcher() {
  const { language, switchLanguage } = useLanguage()

  return (
    <div className="language-switcher">
      <select 
        value={language} 
        onChange={(e) => switchLanguage(e.target.value)}
        className="language-select"
      >
        <option value="en">🇺🇸 English</option>
        <option value="ar">🇸🇩 العربية</option>
      </select>
    </div>
  )
}