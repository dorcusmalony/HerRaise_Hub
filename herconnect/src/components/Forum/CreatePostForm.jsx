import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CreatePostForm({ onSuccess, onCancel, editPost = null }) {
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_API_URL || ''
  
  const [formData, setFormData] = useState({
    title: editPost?.title || '',
    content: editPost?.content || '',
    type: editPost?.type || 'discussion',
    tags: editPost?.tags?.join(', ') || ''
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
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
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
    <form onSubmit={handleSubmit} className="card shadow-sm">
      <div className="card-body p-4">
        <h3 className="mb-4">{editPost ? 'Edit Post' : 'Create New Post'}</h3>

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        {/* Post Type */}
        <div className="mb-3">
          <label className="form-label fw-bold">Post Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            className="form-select"
          >
            <option value="discussion"> Discussion</option>
            <option value="question"> Question</option>
            <option value="project"> Project Showcase</option>
            <option value="essay"> Essay/Article</option>
            <option value="video"> Video</option>
          </select>
        </div>

        {/* Title */}
        <div className="mb-3">
          <label className="form-label fw-bold">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
            maxLength={200}
            placeholder="Enter a descriptive title..."
            className="form-control"
          />
        </div>

        {/* Content */}
        <div className="mb-3">
          <label className="form-label fw-bold">Content *</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            required
            rows="8"
            placeholder="Share your thoughts, questions, or ideas..."
            className="form-control"
          />
          <small className="text-muted">
            {formData.content.length} characters
          </small>
        </div>

        {/* Tags */}
        <div className="mb-4">
          <label className="form-label fw-bold">Tags (comma separated)</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({...formData, tags: e.target.value})}
            placeholder="e.g., technology, education, leadership"
            className="form-control"
          />
          <small className="text-muted">
            Add relevant tags to help others find your post
          </small>
        </div>

        {/* Buttons */}
        <div className="d-flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="btn text-white"
            style={{ background: 'var(--brand-magenta)' }}
          >
            {submitting ? 'Saving...' : editPost ? 'Update Post' : 'Submit Post'}
          </button>
          <button
            type="button"
            onClick={onCancel || (() => navigate('/forum'))}
            className="btn btn-primary"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}
