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

        <h3 className={styles.formTitle} style={{color: 'white'}}>
          {editPost ? '✏️ Edit Post' : '✨ Share Your Work'}
        </h3>
        <p className={styles.formSubtitle} style={{color: 'white'}}>
          💪 Showcase your projects, essays, or ideas to get feedback from peers and mentors
        </p>

        {error && (
          <div className={styles.errorAlert}>{error}</div>
        )}

        {/* Post Type Display */}
        {formData.type === 'essay' ? (
          <div style={{textAlign: 'center', marginBottom: '1.5rem', padding: '1.5rem', background: 'white', borderRadius: '8px', border: '2px solid #8B5CF6'}}>
            <h2 style={{color: '#374151', marginBottom: '1rem', fontSize: '1.5rem'}}>Essays</h2>
            <p style={{color: '#374151', lineHeight: '1.6', margin: 0, fontSize: '1rem'}}>
              Welcome! Share your application essays for scholarships, internships, conferences, or projects.
              Peers and mentors can review and give feedback to help you strengthen your writing and improve your chances of success.
            </p>
          </div>
        ) : null}

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
            placeholder={getContentPlaceholder(formData.type)}
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

        {/* Upload Section - Only for specific types */}
        {(formData.type === 'project' || formData.type === 'essay' || formData.type === 'video') && (
          <div className={styles.uploadSection}>
            <label className={styles.formLabel} style={{color: 'white'}}>
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
