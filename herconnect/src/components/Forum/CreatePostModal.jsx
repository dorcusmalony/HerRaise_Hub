import { useState } from 'react'
import styles from './CreatePostModal.module.css'

export default function CreatePostModal({ category, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'discussion',
    tags: []
  })
  const [tagInput, setTagInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Create New Post</h2>
          <button onClick={onClose} className={styles.closeBtn}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Post Title</label>
            <input
              id="title"
              type="text"
              placeholder="What's your post about?"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              placeholder="Share your thoughts, ask questions, or start a discussion..."
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              required
              rows="6"
              className={styles.textarea}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="type">Post Type</label>
            <select 
              id="type"
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className={styles.select}
            >
              <option value="discussion">Discussion</option>
              <option value="question">Question</option>
              <option value="announcement">Announcement</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tags">Tags (optional)</label>
            <div className={styles.tagInputWrapper}>
              <input
                id="tags"
                type="text"
                placeholder="Add a tag and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className={styles.input}
              />
              <button type="button" onClick={addTag} className={styles.addTagBtn}>
                Add
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className={styles.tagsList}>
                {formData.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    #{tag}
                    <button 
                      type="button" 
                      onClick={() => removeTag(tag)}
                      className={styles.removeTagBtn}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn}>
              Create Post
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}