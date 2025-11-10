import { useState, useEffect } from 'react'
import CommentItem from '../../components/Forum/CommentItem'
import './sharezone.css'

const API_URL = import.meta.env.VITE_API_URL || ''

export default function Content() {
  const [contents, setContents] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'project'
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')
  const [expandedComments, setExpandedComments] = useState({})
  const [commentText, setCommentText] = useState({})
  const [currentUser, setCurrentUser] = useState(null)

  const contentTypes = [
    { value: 'project', label: 'Project', icon: '' },
    { value: 'essay', label: 'Essay', icon: '' },
    { value: 'resume', label: 'Resume', icon: '' },
    { value: 'cover_letter', label: 'Cover Letter', icon: '' },
    { value: 'video', label: 'Video', icon: '' },
    { value: 'feedback', label: 'Feedback Request', icon: '' }
  ]

  const fetchContents = async () => {
    try {
      const response = await fetch(`${API_URL}/api/sharezone`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setContents(data.posts || [])
      }
    } catch (error) {
      console.error('Error fetching contents:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContents()
    const userData = localStorage.getItem('user')
    if (userData) {
      setCurrentUser(JSON.parse(userData))
    }
  }, [])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size should be less than 10MB')
      return
    }

    setError('')
    setSelectedFile(file)

    // Show preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      setError('Title is required')
      return
    }

    setUploading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const submitData = new FormData()
      
      submitData.append('title', formData.title)
      submitData.append('content', formData.content)
      submitData.append('category', formData.category)
      
      if (selectedFile) {
        submitData.append('file', selectedFile)
      }

      const response = await fetch(`${API_URL}/api/sharezone`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      })

      if (response.ok) {
        const newPost = await response.json()
        setContents(prev => [newPost, ...prev])
        
        // Reset form
        setFormData({ title: '', content: '', category: 'project' })
        setSelectedFile(null)
        setPreview(null)
        
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]')
        if (fileInput) fileInput.value = ''
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to create post')
      }
    } catch (error) {
      console.error('Error creating post:', error)
      setError('Failed to create post. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleAddComment = async (postId) => {
    const text = commentText[postId]
    if (!text?.trim()) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/sharezone/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: text })
      })

      if (response.ok) {
        setCommentText(prev => ({ ...prev, [postId]: '' }))
        fetchContents()
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const handleReplyToComment = async (parentCommentId, replyText) => {
    const post = contents.find(p => p.ShareZoneComments?.some(c => c.id === parentCommentId))
    if (!post) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/sharezone/${post._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: replyText,
          parentCommentId
        })
      })

      if (response.ok) {
        fetchContents()
      }
    } catch (error) {
      console.error('Error replying to comment:', error)
    }
  }

  const handleUpdateComment = async (commentId, newContent) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/sharezone/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newContent })
      })

      if (response.ok) {
        fetchContents()
        return true
      }
      return false
    } catch (error) {
      console.error('Error updating comment:', error)
      return false
    }
  }

  const handleLikeComment = async (commentId) => {
    try {
      await fetch(`${API_URL}/api/sharezone/comments/${commentId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
      fetchContents()
    } catch (error) {
      console.error('Error liking comment:', error)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment? This action cannot be undone.')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/sharezone/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        fetchContents()
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  return (
    <div className="content-page">
      {/* ShareZone Banner */}
      <div className="content-banner">
        <div className="banner-content">
          <div className="header-text">
            <h1>Welcome to ShareZone</h1>
            <p className="main-subtitle">Share Your Work & Get Feedback</p>
            <p className="description">Upload projects, essays, videos and connect with peers and mentors</p>
            
            <div className="contribution-highlight">
              <div className="highlight-item">
                <span className="highlight-icon"></span>
                <span>Share Projects</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon"></span>
                <span>Upload Essays</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon"></span>
                <span>Upload Videos</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon"></span>
                <span>Share Images</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon"></span>
                <span>Upload Resume</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon"></span>
                <span>Cover Letters</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-4">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="mb-0">Share Your Content</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select 
                      className="form-select"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                    >
                      <option value="project">📁 Project</option>
                      <option value="essay">📝 Essay</option>
                      <option value="resume">📄 Resume</option>
                      <option value="video">🎥 Video</option>
                      <option value="document">📋 Document</option>
                      <option value="other">🔗 Other</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter a title for your content"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Describe your content, what you learned, or any details you'd like to share..."
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Upload File</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={handleFileChange}
                      accept="*/*"
                    />
                    <small className="text-muted">Max file size: 10MB. Supports documents, images, videos, and more.</small>
                    
                    {preview && (
                      <div className="mt-2">
                        <img 
                          src={preview} 
                          alt="Preview" 
                          className="img-thumbnail"
                          style={{ maxWidth: '200px', maxHeight: '200px' }}
                        />
                      </div>
                    )}
                    
                    {selectedFile && !preview && (
                      <div className="mt-2">
                        <div className="alert alert-info py-2">
                          <small>📎 {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</small>
                        </div>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="alert alert-danger">
                      {error}
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Uploading...
                      </>
                    ) : (
                      'Share Content'
                    )}
                  </button>
                </form>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="posts-container">
                {contents.length === 0 ? (
                  <div className="text-center py-5">
                    <h5>No content shared yet</h5>
                    <p className="text-muted">Be the first to share your work!</p>
                  </div>
                ) : (
                  contents.map(content => (
                    <div key={content._id} className="card mb-3">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="card-title mb-0">{content.title}</h6>
                          <span className="badge bg-secondary">{content.category}</span>
                        </div>
                        {content.content && <p className="card-text">{content.content}</p>}
                        {content.fileUrl && (
                          <div className="mt-2">
                            <a href={content.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                              📎 View File
                            </a>
                          </div>
                        )}
                        <div className="d-flex justify-content-between align-items-center mt-3">
                          <small className="text-muted">
                            Shared by {content.author?.name || 'Anonymous'} • {new Date(content.createdAt).toLocaleDateString()}
                          </small>
                          <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => setExpandedComments(prev => ({ ...prev, [content._id]: !prev[content._id] }))}
                          >
                            💬 {content.ShareZoneComments?.length || 0} Comments
                          </button>
                        </div>
                        
                        {expandedComments[content._id] && (
                          <div className="mt-3 border-top pt-3">
                            <div className="mb-3">
                              <div className="d-flex gap-2">
                                <img 
                                  src={currentUser?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'User')}&background=8B5CF6&color=fff`}
                                  alt={currentUser?.name}
                                  className="rounded-circle"
                                  style={{ width: 32, height: 32 }}
                                />
                                <div className="flex-grow-1">
                                  <textarea
                                    className="form-control mb-2"
                                    rows="3"
                                    placeholder="Add a comment..."
                                    value={commentText[content._id] || ''}
                                    onChange={(e) => setCommentText(prev => ({ ...prev, [content._id]: e.target.value }))}
                                  />
                                  <button 
                                    className="btn btn-sm btn-primary"
                                    onClick={() => handleAddComment(content._id)}
                                    disabled={!commentText[content._id]?.trim()}
                                  >
                                    💬 Post Comment
                                  </button>
                                </div>
                              </div>
                            </div>
                            
                            {content.ShareZoneComments && content.ShareZoneComments.length > 0 ? (
                              <div>
                                <h6 className="mb-3">💬 Comments ({content.ShareZoneComments.length})</h6>
                                {content.ShareZoneComments
                                  .filter(c => !c.parentCommentId)
                                  .map(comment => (
                                    <CommentItem
                                      key={comment.id}
                                      comment={{
                                        ...comment,
                                        replies: content.ShareZoneComments.filter(c => c.parentCommentId === comment.id)
                                      }}
                                      onReply={handleReplyToComment}
                                      onUpdate={handleUpdateComment}
                                      onLike={handleLikeComment}
                                      onDelete={handleDeleteComment}
                                      currentUser={currentUser}
                                      postAuthorId={content.author?._id}
                                    />
                                  ))}
                              </div>
                            ) : (
                              <div className="text-center py-3 text-muted">
                                <p>No comments yet. Be the first to comment!</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}