import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FORUM_CATEGORIES } from './CategorySelector'
import styles from './CreatePostForm.module.css'

export default function CreatePostForm({ onSuccess, onCancel, editPost = null, initialType = 'project', initialCategory = '', initialSubcategory = '', isShareZone = false }) {
  const navigate = useNavigate()
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
      setError('Please login to continue')
      setSubmitting(false)
      return
    }

    try {
      const endpoint = editPost 
        ? `${API_URL}/${isShareZone ? 'api/sharezone' : 'api/forum'}/posts/${editPost.id}`
        : `${API_URL}/${isShareZone ? 'api/sharezone' : 'api/forum'}/posts`
      
      const response = await fetch(endpoint, {
        method: editPost ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          type: formData.type,
          category: formData.category,
          subcategory: formData.subcategory,
          publishedFrom: formData.category ? FORUM_CATEGORIES[formData.category]?.name : null,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
          attachments: formData.attachments
        })
      })

      const data = await response.json()

      if (data.success) {
        if (onSuccess) {
          onSuccess(data.post)
        } else {
          navigate('/forum')
        }
      } else {
        throw new Error(data.message || 'Failed to save post')
      }
    } catch (error) {
      console.error('Post submission error:', error)
      setError(error.message || 'Failed to save post')
    } finally {
      setSubmitting(false)
    }
  }



  const getContentPlaceholder = () => {
    return 'Share your thoughts, start a discussion, or ask for advice from the community...'
  }

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.formBody}>

        <h3 className={styles.formTitle} style={{color: 'white'}}>
          {editPost ? 'Edit Post' : 'Start a Discussion'}
        </h3>
        <p className={styles.formSubtitle} style={{color: 'white'}}>
          Share your thoughts, ask questions, or start conversations with the community
        </p>

        {error && (
          <div className={styles.errorAlert}>{error}</div>
        )}



        {/* Category Selection - Hidden when pre-selected */}
        {!initialCategory && (
          <div className={styles.formGroup}>
            <label className={styles.formLabel} style={{color: 'white'}}>Category *</label>
            <select
              value={formData.category}
              onChange={(e) => {
                setFormData({...formData, category: e.target.value, subcategory: ''})
              }}
              required
              className={styles.formSelect}
            >
              <option value="">Select a category...</option>
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
            <label className={styles.formLabel} style={{color: 'white'}}>Subcategory *</label>
            <select
              value={formData.subcategory}
              onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
              required
              className={styles.formSelect}
            >
              <option value="">Select a subcategory...</option>
              {Object.values(FORUM_CATEGORIES[formData.category]?.subcategories || {}).map(subcategory => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.icon} {subcategory.name}
                </option>
              ))}
            </select>
            {formData.subcategory && (
              <div className={styles.topicsHint} style={{color: 'white'}}>
                Suggested topics: {FORUM_CATEGORIES[formData.category]?.subcategories[formData.subcategory]?.topics.slice(0, 3).join(', ')}
              </div>
            )}
          </div>
        )}



        {/* Title */}
        <div className={styles.formGroup}>
          <label htmlFor="post-title" className={styles.formLabel} style={{color: 'white'}}>Title *</label>
          <input
            type="text"
            id="post-title"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
            maxLength={200}
            placeholder="Enter a descriptive title..."
            className={styles.formInput}
          />
        </div>

        {/* Enhanced Content */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel} style={{color: 'white'}}>Description *</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            required
            rows="8"
            placeholder={getContentPlaceholder()}
            className={styles.formTextarea}
          />
          <div className={styles.characterCount} style={{color: 'white'}}>
            {formData.content.length} characters
          </div>
        </div>

        {/* Tags */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel} style={{color: 'white'}}>Tags (comma separated)</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({...formData, tags: e.target.value})}
            placeholder="e.g., technology, education, leadership"
            className={styles.formInput}
          />
          <div className={styles.formHint} style={{color: 'white'}}>
            Add relevant tags to help others find your post
          </div>
        </div>



        {/* Buttons */}
        <div className={styles.formActions}>
          <button
            type="submit"
            disabled={submitting}
            className={styles.submitBtn}
          >
            {submitting ? 'Saving...' : editPost ? 'Update Post' : 'Submit Post'}
          </button>
          <button
            type="button"
            onClick={onCancel || (() => navigate('/forum'))}
            className={styles.cancelBtn}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}
