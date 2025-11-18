import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { FORUM_CATEGORIES } from './CategorySelector'
import forumAPI from '../../services/forumAPI'
import styles from './CreatePostForm.module.css'

export default function CreatePostForm({ onSuccess, onCancel, editPost = null, initialType = 'project', initialCategory = '', initialSubcategory = '', isShareZone = false }) {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const API_URL = import.meta.env.VITE_API_URL || ''
  
  const [formData, setFormData] = useState({
    title: editPost?.title || '',
    content: editPost?.content || '',
    type: editPost?.type || initialType,
    category: editPost?.category || initialCategory,
    subcategory: editPost?.subcategory || initialSubcategory,
    tags: editPost?.tags?.join(', ') || '',
    attachments: editPost?.attachments || []
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const token = localStorage.getItem('token')
    if (!token) {
      setError(t('Please login to continue'))
      setSubmitting(false)
      return
    }

    try {
      const endpoint = editPost 
        ? `${API_URL}/${isShareZone ? 'api/sharezone' : 'api/forum'}/posts/${editPost.id}`
        : `${API_URL}/${isShareZone ? 'api/sharezone' : 'api/forum'}/posts`
      
      console.log('📤 Submitting post to:', endpoint)
      console.log('📤 Form data:', formData)
      console.log('📤 Initial category:', initialCategory)
      
      const postData = {
        title: formData.title,
        content: formData.content,
        type: formData.type || 'discussion',
        category: formData.category || initialCategory,
        subcategory: formData.subcategory || initialSubcategory,
        publishedFrom: (formData.category || initialCategory) ? FORUM_CATEGORIES[formData.category || initialCategory]?.name : null,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        attachments: formData.attachments

      }
      
      console.log('📤 Final post data:', postData)
      
      const response = await fetch(endpoint, {
        method: editPost ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(postData)
      })

      console.log('📤 Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('📤 Response data:', data)
        
        // Handle different response formats
        const post = data.post || data.data || data
        
        if (onSuccess) {
          onSuccess(post)
        } else {
          navigate('/forum')
        }
      } else {
        const errorData = await response.text()
        console.error('❌ Post submission failed:', errorData)
        throw new Error(`Failed to save post (${response.status})`)
      }
    } catch (error) {
      console.error('Post submission error:', error)
      setError(error.message || 'Failed to save post')
    } finally {
      setSubmitting(false)
    }
  }



  const getContentPlaceholder = () => {
    return t('Share your thoughts, start a discussion, or ask for advice from the community...')
  }

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.formBody}>

        <h3 className={styles.formTitle} style={{color: 'white'}}>
          {editPost ? t('Edit Post') : t('Start a Discussion')}
        </h3>
        <p className={styles.formSubtitle} style={{color: 'white'}}>
          {t('Share your thoughts, ask questions, or start conversations with the community')}
        </p>

        {error && (
          <div className={styles.errorAlert}>{error}</div>
        )}



        {/* Category Selection - Hidden when pre-selected */}
        {!initialCategory && (
          <div className={styles.formGroup}>
            <label className={styles.formLabel} style={{color: 'white'}}>{t('Category *')}</label>
            <select
              value={formData.category}
              onChange={(e) => {
                setFormData({...formData, category: e.target.value, subcategory: ''})
              }}
              required
              className={styles.formSelect}
            >
              <option value="">{t('Select a category...')}</option>
              {Object.values(FORUM_CATEGORIES).map(category => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Subcategory Selection - Hidden when pre-selected */}
        {formData.category && !initialCategory && !initialSubcategory && (
          <div className={styles.formGroup}>
            <label className={styles.formLabel} style={{color: 'white'}}>{t('Subcategory *')}</label>
            <select
              value={formData.subcategory}
              onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
              required
              className={styles.formSelect}
            >
              <option value="">{t('Select a subcategory...')}</option>
              {Object.values(FORUM_CATEGORIES[formData.category]?.subcategories || {}).map(subcategory => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.icon} {subcategory.name}
                </option>
              ))}
            </select>
            {formData.subcategory && (
              <div className={styles.topicsHint} style={{color: 'white'}}>
                {t('Suggested topics:')}: {FORUM_CATEGORIES[formData.category]?.subcategories[formData.subcategory]?.topics.slice(0, 3).join(', ')}
              </div>
            )}
          </div>
        )}



        {/* Title */}
        <div className={styles.formGroup}>
          <label htmlFor="post-title" className={styles.formLabel} style={{color: 'white'}}>{t('Title *')}</label>
          <input
            type="text"
            id="post-title"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
            maxLength={200}
            placeholder={t('Enter a descriptive title...')}
            className={styles.formInput}
          />
        </div>

        {/* Enhanced Content with User Mentions */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel} style={{color: 'white'}}>{t('Description *')}</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            placeholder={getContentPlaceholder()}
            className={styles.formTextarea}
            rows={8}
            required
          />
          <div className={styles.characterCount} style={{color: 'white'}}>
            {formData.content.length} {t('characters')}
          </div>
        </div>

        {/* Tags */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel} style={{color: 'white'}}>{t('Tags (comma separated)')}</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({...formData, tags: e.target.value})}
            placeholder={t('e.g., technology, education, leadership')}
            className={styles.formInput}
          />
          <div className={styles.formHint} style={{color: 'white'}}>
            {t('Add relevant tags to help others find your post')}
          </div>
        </div>



        {/* Buttons */}
        <div className={styles.formActions}>
          <button
            type="submit"
            disabled={submitting}
            className={styles.submitBtn}
          >
            {submitting ? t('Saving...') : editPost ? t('Update Post') : t('Submit Post')}
          </button>
          <button
            type="button"
            onClick={onCancel || (() => navigate('/forum'))}
            className={styles.cancelBtn}
          >
            {t('Cancel')}
          </button>
        </div>
      </div>
    </form>
  )
}
