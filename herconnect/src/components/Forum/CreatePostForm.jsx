import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FileUpload from './FileUpload'
import styles from './CreatePostForm.module.css'

export default function CreatePostForm({ onSuccess, onCancel, editPost = null, initialType = 'project' }) {
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_API_URL || ''
  
  const [formData, setFormData] = useState({
    title: editPost?.title || '',
    content: editPost?.content || '',
    type: editPost?.type || initialType,
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

  const getAcceptedFileTypes = (type) => {
    switch(type) {
      case 'project':
        return 'image/*,video/*,.pdf,.doc,.docx,.txt,.zip,.rar,.py,.js,.html,.css,.json'
      case 'essay':
        return '.pdf,.doc,.docx,.txt,.rtf'
      case 'video':
        return 'video/*,.mp4,.avi,.mov,.wmv,.ppt,.pptx'
      default:
        return 'image/*,video/*,.pdf,.doc,.docx,.txt'
    }
  }

  const getContentPlaceholder = (type) => {
    switch(type) {
      case 'project':
        return 'Describe your project: What did you build? What technologies did you use? What challenges did you face? What feedback are you looking for?'
      case 'essay':
        return 'Tell us about your essay: What topic did you explore? What are your main arguments? What feedback would help you improve?'
      case 'video':
        return 'Describe your video content: What is it about? Who is your target audience? What kind of feedback are you seeking?'
      case 'question':
        return 'Ask your question clearly: Provide context, what you\'ve tried, and what specific help you need...'
      default:
        return 'Share your thoughts, start a discussion, or ask for advice from the community...'
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.formBody}>
        <h3 className={styles.formTitle}>
          {editPost ? '✏️ Edit Post' : '✨ Share Your Work'}
        </h3>
        <p className={styles.formSubtitle}>
          💪 Showcase your projects, essays, or ideas to get feedback from peers and mentors
        </p>

        {error && (
          <div className={styles.errorAlert}>{error}</div>
        )}

        {/* Post Type Display */}
        <div className={styles.typeDisplay}>
          <span className={styles.typeIcon}>
            {formData.type === 'project' ? '🚀' :
             formData.type === 'essay' ? '📝' :
             formData.type === 'video' ? '🎥' :
             formData.type === 'question' ? '❓' : '💬'}
          </span>
          <span className={styles.typeName}>
            {formData.type === 'project' ? 'Project Showcase' :
             formData.type === 'essay' ? 'Essay Upload' :
             formData.type === 'video' ? 'Video Upload' :
             formData.type === 'question' ? 'Ask Question' : 'Discussion'}
          </span>
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

        {/* Enhanced Content */}
        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Description *</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            required
            rows="8"
            placeholder={getContentPlaceholder(formData.type)}
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

        {/* Upload Section - Only for specific types */}
        {(formData.type === 'project' || formData.type === 'essay' || formData.type === 'video') && (
          <div className={styles.uploadSection}>
            <label className={styles.formLabel}>
              {formData.type === 'video' ? '🎥 Upload Video *' :
               formData.type === 'essay' ? '📝 Upload Essay/Document *' :
               '🚀 Upload Project Files *'}
            </label>
            <FileUpload 
              onFilesUploaded={(files) => setFormData({...formData, attachments: files})}
              acceptedTypes={getAcceptedFileTypes(formData.type)}
            />
            {formData.attachments.length > 0 && (
              <div className={styles.uploadSuccess}>
                ✅ {formData.attachments.length} file(s) ready to share!
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
