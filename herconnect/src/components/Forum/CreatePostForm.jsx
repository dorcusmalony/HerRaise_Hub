import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FileUpload from './FileUpload'
import styles from './CreatePostForm.module.css'

export default function CreatePostForm({ onSuccess, onCancel, editPost = null }) {
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_API_URL || ''
  
  const [formData, setFormData] = useState({
    title: editPost?.title || '',
    content: editPost?.content || '',
    type: editPost?.type || 'discussion',
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
        ? `${API_URL}/api/forum/posts/${editPost.id}`
        : `${API_URL}/api/forum/posts`
      
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

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.formBody}>
        <h3 className={styles.formTitle}>{editPost ? 'Edit Post' : 'Create New Post'}</h3>

        {error && (
          <div className={styles.errorAlert}>{error}</div>
        )}

        {/* Post Type */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Post Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            className={styles.formSelect}
          >
            <option value="discussion"> Discussion</option>
            <option value="question"> Question</option>
            <option value="project"> Project Showcase</option>
            <option value="essay"> Essay/Article</option>
            <option value="video"> Video</option>
          </select>
        </div>

        {/* Title */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
            maxLength={200}
            placeholder="Enter a descriptive title..."
            className={styles.formInput}
          />
        </div>

        {/* Content */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Content *</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            required
            rows="8"
            placeholder="Share your thoughts, questions, or ideas..."
            className={styles.formTextarea}
          />
          <div className={styles.characterCount}>
            {formData.content.length} characters
          </div>
        </div>

        {/* Tags */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Tags (comma separated)</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({...formData, tags: e.target.value})}
            placeholder="e.g., technology, education, leadership"
            className={styles.formInput}
          />
          <div className={styles.formHint}>
            Add relevant tags to help others find your post
          </div>
        </div>

        {/* File Upload for Projects/Essays */}
        {(formData.type === 'project' || formData.type === 'essay' || formData.type === 'video') && (
          <div className={styles.uploadSection}>
            <label className={styles.formLabel}>
              {formData.type === 'project' ? 'Upload Project Files' : 
               formData.type === 'essay' ? 'Upload Essay/Document' : 
               'Upload Video'}
            </label>
            <FileUpload 
              onFilesUploaded={(files) => setFormData({...formData, attachments: files})}
            />
            {formData.attachments.length > 0 && (
              <div className={styles.uploadSuccess}>
                ✅ {formData.attachments.length} file(s) uploaded
              </div>
            )}
          </div>
        )}

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
