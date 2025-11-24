import { useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import './ExternalLinkInput.css'

const LINK_TYPES = {
  google_drive: { name: 'Google Drive', pattern: /drive\.google\.com/, icon: '🔵' },
  onedrive: { name: 'OneDrive', pattern: /1drv\.ms|onedrive\.live\.com/, icon: '🟦' },
  dropbox: { name: 'Dropbox', pattern: /dropbox\.com/, icon: '' },
  external: { name: 'External Link', pattern: /.*/, icon: '' }
}

const ExternalLinkInput = ({ onLinksChange, initialLinks = [] }) => {
  const { t } = useLanguage()
  const [links, setLinks] = useState(initialLinks)
  const [inputUrl, setInputUrl] = useState('')
  const [inputName, setInputName] = useState('')
  const [error, setError] = useState('')

  const detectLinkType = (url) => {
    for (const [type, config] of Object.entries(LINK_TYPES)) {
      if (config.pattern.test(url)) {
        return type
      }
    }
    return 'external'
  }

  const validateUrl = (url) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const addLink = () => {
    setError('')

    if (!inputUrl.trim()) {
      setError(t('Please enter a URL'))
      return
    }

    if (!validateUrl(inputUrl)) {
      setError(t('Invalid URL format'))
      return
    }

    if (!inputName.trim()) {
      setError(t('Please enter a link name'))
      return
    }

    const linkType = detectLinkType(inputUrl)
    const newLink = {
      url: inputUrl,
      type: linkType,
      name: inputName,
      id: Date.now()
    }

    const updatedLinks = [...links, newLink]
    setLinks(updatedLinks)
    onLinksChange(updatedLinks)

    setInputUrl('')
    setInputName('')
  }

  const removeLink = (id) => {
    const updatedLinks = links.filter(link => link.id !== id)
    setLinks(updatedLinks)
    onLinksChange(updatedLinks)
  }

  return (
    <div className="external-link-input">
      <div className="link-input-form">
        <div className="input-group">
          <input
            type="url"
            placeholder={t('Paste link (Google Drive, OneDrive, Dropbox, etc.)')}
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="link-url-input"
            onKeyPress={(e) => e.key === 'Enter' && addLink()}
          />
          <input
            type="text"
            placeholder={t('Link name (e.g., My Document.pdf)')}
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            className="link-name-input"
            onKeyPress={(e) => e.key === 'Enter' && addLink()}
          />
          <button
            type="button"
            onClick={addLink}
            className="add-link-btn"
          >
            {t('Add Link')}
          </button>
        </div>
        {error && <div className="link-error">{error}</div>}
      </div>

      {links.length > 0 && (
        <div className="links-list">
          <h6 className="links-title">{t('Added Links')} ({links.length})</h6>
          {links.map(link => (
            <div key={link.id} className="link-item">
              <div className="link-info">
                <span className="link-icon">{LINK_TYPES[link.type]?.icon}</span>
                <div className="link-details">
                  <span className="link-name">{link.name}</span>
                  <span className="link-type">{LINK_TYPES[link.type]?.name}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeLink(link.id)}
                className="remove-link-btn"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ExternalLinkInput
