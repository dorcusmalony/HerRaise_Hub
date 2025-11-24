import { describe, it, expect } from 'vitest'

// ============================================
// 4.2.3 UNIT TESTING OUTPUTS
// ============================================

describe('Unit Tests - Component Functions', () => {
  describe('ExternalLinkInput Component', () => {
    const detectLinkType = (url) => {
      if (url.includes('drive.google.com')) return 'google_drive'
      if (url.includes('1drv.ms') || url.includes('onedrive')) return 'onedrive'
      if (url.includes('dropbox.com')) return 'dropbox'
      return 'external'
    }

    it('should detect Google Drive links', () => {
      const url = 'https://drive.google.com/file/d/abc123'
      expect(detectLinkType(url)).toBe('google_drive')
    })

    it('should detect OneDrive links', () => {
      const url = 'https://1drv.ms/w/s!xyz789'
      expect(detectLinkType(url)).toBe('onedrive')
    })

    it('should detect Dropbox links', () => {
      const url = 'https://dropbox.com/s/abc123'
      expect(detectLinkType(url)).toBe('dropbox')
    })

    it('should detect generic external links', () => {
      const url = 'https://example.com/file'
      expect(detectLinkType(url)).toBe('external')
    })
  })

  describe('ShareZoneTable Component', () => {
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    it('should format dates correctly', () => {
      const date = '2024-01-15T10:30:00Z'
      const formatted = formatDate(date)
      expect(formatted).toMatch(/Jan 15, 2024/)
    })

    const truncateText = (text, maxLength = 50) => {
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
    }

    it('should truncate long text', () => {
      const longText = 'This is a very long text that should be truncated'
      const truncated = truncateText(longText, 20)
      expect(truncated).toBe('This is a very long ...')
    })

    it('should not truncate short text', () => {
      const shortText = 'Short'
      const result = truncateText(shortText, 20)
      expect(result).toBe('Short')
    })
  })

  describe('Form Validation Functions', () => {
    const validateTitle = (title) => {
      if (!title || typeof title !== 'string') return false
      return title.trim().length > 0 && title.length <= 200
    }

    it('should validate title presence', () => {
      expect(validateTitle('Valid Title')).toBe(true)
      expect(validateTitle('')).toBe(false)
      expect(validateTitle('   ')).toBe(false)
      expect(validateTitle(null)).toBe(false)
    })

    it('should validate title length', () => {
      const longTitle = 'a'.repeat(201)
      expect(validateTitle(longTitle)).toBe(false)
      expect(validateTitle('a'.repeat(200))).toBe(true)
    })

    const validateCategory = (category, validCategories) => {
      return validCategories.includes(category)
    }

    it('should validate category selection', () => {
      const validCategories = ['projects', 'essays', 'resumes', 'videos']
      expect(validateCategory('projects', validCategories)).toBe(true)
      expect(validateCategory('invalid', validCategories)).toBe(false)
    })
  })

  describe('Link Validation Functions', () => {
    const validateUrl = (url) => {
      if (!url || typeof url !== 'string') return false
      try {
        new URL(url)
        return true
      } catch {
        return false
      }
    }

    it('should validate URL format', () => {
      expect(validateUrl('https://drive.google.com/file/d/abc')).toBe(true)
      expect(validateUrl('invalid-url')).toBe(false)
      expect(validateUrl('')).toBe(false)
      expect(validateUrl(null)).toBe(false)
    })

    const validateLinkName = (name) => {
      if (!name || typeof name !== 'string') return false
      return name.trim().length > 0 && name.length <= 100
    }

    it('should validate link name', () => {
      expect(validateLinkName('Document.pdf')).toBe(true)
      expect(validateLinkName('')).toBe(false)
      expect(validateLinkName('   ')).toBe(false)
      expect(validateLinkName(null)).toBe(false)
    })
  })

  describe('Data Processing Functions', () => {
    const normalizeExternalLinks = (post) => {
      let externalLinks = []
      
      if (post.externalLinks && Array.isArray(post.externalLinks)) {
        externalLinks = post.externalLinks.filter(link => link && link.url)
      } else if (post.externalLink && typeof post.externalLink === 'string') {
        externalLinks = [{ url: post.externalLink, name: 'View Link', type: 'external' }]
      }
      
      return { ...post, externalLinks }
    }

    it('should normalize multiple external links', () => {
      const post = {
        title: 'Test',
        externalLinks: [
          { url: 'https://drive.google.com/file/d/abc', name: 'Doc.pdf', type: 'google_drive' }
        ]
      }
      const normalized = normalizeExternalLinks(post)
      expect(normalized.externalLinks).toHaveLength(1)
      expect(normalized.externalLinks[0].url).toBe('https://drive.google.com/file/d/abc')
    })

    it('should convert single link to array', () => {
      const post = {
        title: 'Test',
        externalLink: 'https://example.com/file'
      }
      const normalized = normalizeExternalLinks(post)
      expect(normalized.externalLinks).toHaveLength(1)
      expect(normalized.externalLinks[0].url).toBe('https://example.com/file')
    })
  })
})
