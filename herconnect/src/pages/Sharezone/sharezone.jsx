import { useState, useEffect } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import CommentItem from '../../components/Forum/CommentItem'
import ShareZoneTable from '../../components/ShareZone/ShareZoneTable'
import CommentsModal from '../../components/ShareZone/CommentsModal'
import './sharezone.css'

const API_URL = import.meta.env.VITE_API_URL || ''

export default function Content() {
  const { t } = useLanguage()
  const [contents, setContents] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'projects',
    externalLink: ''
  })
  const [shareType, setShareType] = useState('file') // 'file' or 'link'
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')
  const [expandedComments, setExpandedComments] = useState({})
  const [commentText, setCommentText] = useState({})
  const [currentUser, setCurrentUser] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingPostId, setEditingPostId] = useState(null)
  const [isEditing, setIsEditing] = useState(false)


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

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showForm) {
      document.body.classList.add('modal-open')
    } else {
      document.body.classList.remove('modal-open')
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [showForm])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validateFile = (file) => {
    const maxSize = 100 * 1024 * 1024 // 100MB
    if (file.size > maxSize) {
      setError(t('File too large. Maximum size is 100MB'))
      return false
    }
    return true
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!validateFile(file)) return

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
      setError(t('Title is required'))
      return
    }

    if (shareType === 'link' && !formData.externalLink.trim()) {
      setError(t('External link is required'))
      return
    }

    if (shareType === 'file' && !selectedFile && !isEditing) {
      setError(t('Please select a file to upload'))
      return
    }

    setUploading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      
      if (shareType === 'link') {
        // Send JSON for external links
        const response = await fetch(isEditing ? `${API_URL}/api/sharezone/${editingPostId}` : `${API_URL}/api/sharezone`, {
          method: isEditing ? 'PUT' : 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: formData.title,
            content: formData.content,
            category: formData.category,
            externalLink: formData.externalLink
          })
        })
        
        if (response.ok) {
          const updatedPost = await response.json()
          
          if (isEditing) {
            setContents(prev => prev.map(post => 
              post._id === editingPostId ? updatedPost : post
            ))
          } else {
            setContents(prev => [updatedPost, ...prev])
          }
          
          // Reset form
          setFormData({ title: '', content: '', category: 'projects', externalLink: '' })
          setShareType('file')
          setShowForm(false)
          setIsEditing(false)
          setEditingPostId(null)
        } else {
          const errorData = await response.json().catch(() => ({ error: isEditing ? t('Update failed') : t('Upload failed') }))
          setError(errorData.error || errorData.message || (isEditing ? t('Update failed') : t('Upload failed')))
        }
      } else {
        // Send FormData for file uploads
        const submitData = new FormData()
        
        submitData.append('title', formData.title)
        submitData.append('content', formData.content)
        submitData.append('category', formData.category)
        
        if (selectedFile) {
          submitData.append('file', selectedFile)
        }

        const url = isEditing ? `${API_URL}/api/sharezone/${editingPostId}` : `${API_URL}/api/sharezone`
        const method = isEditing ? 'PUT' : 'POST'

        const response = await fetch(url, {
          method,
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: submitData
        })

        if (response.ok) {
          const updatedPost = await response.json()
          
          if (isEditing) {
            setContents(prev => prev.map(post => 
              post._id === editingPostId ? updatedPost : post
            ))
          } else {
            setContents(prev => [updatedPost, ...prev])
          }
          
          // Reset form
          setFormData({ title: '', content: '', category: 'projects', externalLink: '' })
          setSelectedFile(null)
          setPreview(null)
          setShareType('file')
          setShowForm(false)
          setIsEditing(false)
          setEditingPostId(null)
          
          // Reset file input
          const fileInput = document.querySelector('input[type="file"]')
          if (fileInput) fileInput.value = ''
        } else {
          const errorData = await response.json().catch(() => ({ error: isEditing ? t('Update failed') : t('Upload failed') }))
          setError(errorData.error || errorData.message || (isEditing ? t('Update failed') : t('Upload failed')))
        }
      }
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} post:`, error)
      setError(t('Network error. Please try again.'))
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
    if (!window.confirm(t('Delete this comment? This action cannot be undone.'))) return

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

  const handleCommentToggle = (postId) => {
    setExpandedComments(prev => ({ ...prev, [postId]: !prev[postId] }))
  }

  const handleDeletePost = async (postId) => {
    if (!window.confirm(t('Delete this post? This action cannot be undone.'))) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/sharezone/${postId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        setContents(prev => prev.filter(content => content._id !== postId))
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const handleEditPost = (postId) => {
    const content = contents.find(c => c._id === postId)
    if (content) {
      setFormData({
        title: content.title,
        content: content.content || '',
        category: content.category,
        externalLink: content.externalLink || ''
      })
      setEditingPostId(postId)
      setIsEditing(true)
      setShowForm(true)
      
      // Set share type based on existing content
      if (content.externalLink) {
        setShareType('link')
      } else {
        setShareType('file')
        // Show existing file info if available
        if (content.fileUrl) {
          setPreview(content.fileUrl.includes('image') ? content.fileUrl : null)
        }
      }
    }
  }

  return (
    <div className="content-page">
      {/* ShareZone Banner */}
      <div className="content-banner">
        <div className="banner-content">
          <div className="header-text">
            <h1>{t('Welcome to ShareZone')}</h1>
            <p className="main-subtitle">{t('Share Your Work & Get Feedback')}</p>
            <p className="description">{t('Upload projects, essays, videos and connect with peers and mentors')}</p>
            
            <div className="contribution-highlight">
              <div className="highlight-item">
                <span className="highlight-icon"></span>
                <span>{t('Share Projects')}</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon"></span>
                <span>{t('Upload Essays')}</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon"></span>
                <span>{t('Upload Videos')}</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon"></span>
                <span>{t('Share Images')}</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon"></span>
                <span>{t('Upload Resume')}</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon"></span>
                <span>{t('Cover Letters')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-4">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="text-center mb-4">
              <button 
                className="btn btn-lg"
                style={{ backgroundColor: '#e84393', color: 'white', border: 'none' }}
                onClick={() => setShowForm(true)}
              >
                {t('Share Your Work')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid px-3">
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">{t('Loading...')}</span>
            </div>
          </div>
        ) : (
          <ShareZoneTable 
            contents={contents}
            currentUser={currentUser}
            onCommentToggle={handleCommentToggle}
            onDeletePost={handleDeletePost}
            onEditPost={handleEditPost}
          />
        )}

        {/* Comments Modal */}
        {Object.keys(expandedComments).some(key => expandedComments[key]) && (
          <CommentsModal
            content={contents.find(c => expandedComments[c._id])}
            currentUser={currentUser}
            commentText={commentText}
            setCommentText={setCommentText}
            onAddComment={handleAddComment}
            onReplyToComment={handleReplyToComment}
            onUpdateComment={handleUpdateComment}
            onLikeComment={handleLikeComment}
            onDeleteComment={handleDeleteComment}
            onClose={() => setExpandedComments({})}
          />
        )}
      </div>

      {/* Share Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => {
          setShowForm(false)
          setIsEditing(false)
          setEditingPostId(null)
          setFormData({ title: '', content: '', category: 'projects', externalLink: '' })
          setSelectedFile(null)
          setPreview(null)
          setShareType('file')
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5 className="modal-title">{isEditing ? t('Edit Your Content') : t('Share Your Content')}</h5>
              <button 
                type="button" 
                className="btn-close"
                onClick={() => {
                  setShowForm(false)
                  setIsEditing(false)
                  setEditingPostId(null)
                  setFormData({ title: '', content: '', category: 'projects', externalLink: '' })
                  setSelectedFile(null)
                  setPreview(null)
                  setShareType('file')
                }}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">{t('Category')}</label>
                  <select 
                    className="form-select"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="projects">{t('Projects')}</option>
                    <option value="essays">{t('Essays')}</option>
                    <option value="resumes">{t('Resumes')}</option>
                    <option value="videos">{t('Videos')}</option>
                    <option value="cover-letters">{t('Cover Letters')}</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">{t('Title *')}</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder={t('Enter a title for your content')}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">{t('Description')}</label>
                  <textarea
                    className="form-control"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder={t('Describe your content, what you learned, or any details you\'d like to share...')}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">{t('Share Type')}</label>
                  <div className="d-flex gap-3 mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="shareType"
                        id="shareFile"
                        checked={shareType === 'file'}
                        onChange={() => setShareType('file')}
                      />
                      <label className="form-check-label" htmlFor="shareFile">
                        {t('Upload File')}
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="shareType"
                        id="shareLink"
                        checked={shareType === 'link'}
                        onChange={() => setShareType('link')}
                      />
                      <label className="form-check-label" htmlFor="shareLink">
                        {t('External Link')}
                      </label>
                    </div>
                  </div>
                </div>

                {shareType === 'link' ? (
                  <div className="mb-3">
                    <label className="form-label">{t('External Link *')}</label>
                    <input
                      type="url"
                      className="form-control"
                      name="externalLink"
                      value={formData.externalLink}
                      onChange={handleInputChange}
                      placeholder="https://docs.google.com/document/d/..."
                      required={shareType === 'link'}
                    />
                    <small className="text-muted">{t('Share links from Google Docs, Drive, OneDrive, Dropbox, etc.')}</small>
                  </div>
                ) : (
                  <div className="mb-3">
                    <label className="form-label">{t('Upload File')}</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={handleFileChange}
                      accept="*/*"
                      required={shareType === 'file' && !isEditing}
                    />
                    <small className="text-muted">{t('Max file size: 100MB. Supports videos (~10 min HD), documents, images, and more.')}</small>
                    
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
                          <small>{selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</small>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {error && (
                  <div className="alert alert-danger">
                    {error}
                  </div>
                )}

                <div className="d-flex gap-2 justify-content-end">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowForm(false)
                      setIsEditing(false)
                      setEditingPostId(null)
                      setFormData({ title: '', content: '', category: 'projects', externalLink: '' })
                      setSelectedFile(null)
                      setPreview(null)
                      setShareType('file')
                    }}
                  >
                    {t('Cancel')}
                  </button>
                  <button 
                    type="submit" 
                    className="btn"
                    style={{ backgroundColor: '#e84393', color: 'white', border: 'none' }}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        {isEditing ? t('Updating...') : t('Uploading...')}
                      </>
                    ) : (
                      isEditing ? t('Update Content') : t('Share Content')
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}