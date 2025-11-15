import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import CreatePostForm from '../../components/Forum/CreatePostForm'
import CommentItem from '../../components/Forum/CommentItem'
import CategorySelector, { FORUM_CATEGORIES } from '../../components/Forum/CategorySelector'
import LikeButton from '../../components/LikeButton/LikeButton'
import styles from './forum.module.css'
import './youtube-video.css'

// Generate consistent color for each user
const getAuthorColor = (name) => {
  const colors = [
    '#e74c3c', '#3498db', '#9b59b6', '#e67e22', 
    '#1abc9c', '#f39c12', '#2ecc71', '#34495e',
    '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
    '#2196f3', '#00bcd4', '#009688', '#4caf50',
    '#8bc34a', '#cddc39', '#ffc107', '#ff9800'
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

export default function Forum() {
  const { t } = useTranslation()
  const API = import.meta.env.VITE_API_URL || ''
  
  // Debug: Check API URL on Vercel
  console.log('🔗 Forum API URL:', API)
  console.log('🌍 Environment:', import.meta.env.MODE)
  
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recent')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [expandedPost, setExpandedPost] = useState(null)
  const [commentText, setCommentText] = useState({})
  const [currentUser, setCurrentUser] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [showPostDropdown, setShowPostDropdown] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)


  // Load current user
  useEffect(() => {
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    
    console.log('🔍 Auth Debug - Token exists:', !!token)
    console.log('🔍 Auth Debug - User data exists:', !!userData)
    
    if (userData && token) {
      try {
        const user = JSON.parse(userData)
        setCurrentUser(user)
        console.log('👤 Current user loaded:', user)
        
        // Validate token is not expired
        try {
          const tokenPayload = JSON.parse(atob(token.split('.')[1]))
          const isExpired = tokenPayload.exp * 1000 < Date.now()
          console.log('🔍 Token expired:', isExpired)
          
          if (isExpired) {
            console.warn('⚠️ Token expired, clearing auth data')
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            setCurrentUser(null)
          }
        } catch (tokenError) {
          console.warn('⚠️ Invalid token format:', tokenError)
        }
      } catch (parseError) {
        console.error('❌ Failed to parse user data:', parseError)
        localStorage.removeItem('user')
        setCurrentUser(null)
      }
    } else {
      console.log('⚠️ Missing auth data - Token:', !!token, 'User:', !!userData)
      setCurrentUser(null)
    }
    
    // Debug: Log environment variables
    console.log('🔧 All env vars:', import.meta.env)
  }, [])

  const fetchPosts = useCallback(async () => {
    const token = localStorage.getItem('token')
    
    if (!token) {
      console.warn('⚠️ No token found, user might need to login')
      setLoading(false)
      return
    }
    
    try {
      console.log('📡 Fetching posts with token:', token.substring(0, 20) + '...')
      
      let url
      if (selectedCategory) {
        url = `${API}/api/forum/categories/${selectedCategory}/posts?filter=${filter}&sort=${sortBy}`
      } else {
        url = `${API}/api/forum/posts?filter=${filter}&sort=${sortBy}`
      }

      
      console.log('📡 Fetching from URL:', url)
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })

      console.log('📡 Posts response status:', response.status)
      
      if (response.status === 401) {
        console.warn('⚠️ Unauthorized - token might be invalid')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setCurrentUser(null)
        return
      }
      
      if (response.ok) {
        const data = await response.json()
        console.log('📊 Raw API response:', data)
        console.log('📊 Response keys:', Object.keys(data))
        console.log('📊 Response type:', typeof data)
        // Handle both old and new response formats
        const posts = data.posts || data.data?.posts || data || []
        console.log('📊 Posts array:', posts)
        console.log('📊 Posts length:', posts?.length)
        console.log('📊 First post sample:', posts?.[0])
        setPosts(Array.isArray(posts) ? posts : [])
        console.log('✅ Posts loaded successfully:', Array.isArray(posts) ? posts.length : 0)
      } else {
        console.error('❌ Failed to fetch posts:', response.status, response.statusText)
        const errorText = await response.text()
        console.error('❌ Error response:', errorText)
        setPosts([])
      }
    } catch (error) {
      console.error('❌ Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }, [API, filter, sortBy, selectedCategory])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside dropdown
      if (!event.target.closest('.dropdown')) {
        setShowPostDropdown(null)
      }
    }
    
    if (showPostDropdown) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showPostDropdown])



  const handleUpdatePost = (updatedPost) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p))
    setEditingPost(null)
  }

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) return

    const token = localStorage.getItem('token')
    
    try {
      const response = await fetch(`${API}/api/forum/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        setPosts(prev => prev.filter(p => p.id !== postId))
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post. Please try again.')
    }
  }

  const handleAddComment = async (postId) => {
    const text = commentText[postId]
    if (!text?.trim()) return

    const token = localStorage.getItem('token')
    
    try {
      const response = await fetch(`${API}/api/forum/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: text })
      })

      if (response.ok) {
        setCommentText(prev => ({ ...prev, [postId]: '' }))
        setSuccessMessage('Comment posted successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
        fetchPosts()
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const handleReplyToComment = async (parentCommentId, replyText) => {
    const token = localStorage.getItem('token')
    const post = posts.find(p => p.ForumComments?.some(c => c.id === parentCommentId))
    
    if (!post) return

    try {
      const response = await fetch(`${API}/api/forum/posts/${post.id}/comments`, {
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
        fetchPosts()
      }
    } catch (error) {
      console.error('Error replying to comment:', error)
    }
  }

  const handleUpdateComment = async (commentId, newContent) => {
    const token = localStorage.getItem('token')
    console.log('🔧 Updating comment:', { commentId, API, newContent })
    
    try {
      const response = await fetch(`${API}/api/forum/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newContent })
      })

      console.log('📝 Update response:', response.status, response.statusText)
      
      if (response.ok) {
        fetchPosts()
        return true
      }
      
      const errorData = await response.text()
      console.error('❌ Update failed:', errorData)
      return false
    } catch (error) {
      console.error('Error updating comment:', error)
      return false
    }
  }

  const handleLikeComment = async (commentId) => {
    try {
      await fetch(`${API}/api/forum/comments/${commentId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
      
      fetchPosts()
    } catch (error) {
      console.error('Error liking comment:', error)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment? This action cannot be undone.')) return

    const token = localStorage.getItem('token')
    console.log('🗑️ Deleting comment:', { commentId, API })
    
    try {
      const response = await fetch(`${API}/api/forum/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      console.log('🗑️ Delete response:', response.status, response.statusText)
      
      if (response.ok) {
        fetchPosts()
      } else {
        const errorData = await response.text()
        console.error('❌ Delete failed:', errorData)
        alert('Failed to delete comment. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
      alert('Failed to delete comment. Please try again.')
    }
  }

  const getPostTypeIcon = (type) => {
    const icons = {
      question: '❓',
      discussion: '🗣️'
    }
    return icons[type] || '💬'
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.forumContainer}>
      {/* Success Message */}
      {successMessage && (
        <div className={styles.successMessage}>
           {successMessage}
        </div>
      )}
      {/* Enhanced Header for Content Contribution */}
      <div className={styles.forumHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <h1 className={styles.forumTitle}>💬 Community Forum</h1>
            <p className={styles.forumSubtitle}>Connect with peers, ask questions, and join discussions</p>
            <div className={styles.contributionHighlight}>
              <div className={styles.highlightItem}>
                <span className={styles.highlightIcon}></span>
                <span>Ask Questions</span>
              </div>
              <div className={styles.highlightItem}>
                <span className={styles.highlightIcon}></span>
                <span>Join Discussions</span>
              </div>
              <div className={styles.highlightItem}>
                <span className={styles.highlightIcon}></span>
                <span>Get Support</span>
              </div>
              <div className={styles.highlightItem}>
                <span className={styles.highlightIcon}></span>
                <span>Share Ideas</span>
              </div>
            </div>
            <div className={styles.forumStats}>
              <span className={styles.statItem}>
                 {posts.length} Posts
              </span>
              <span className={styles.statItem}>
                 {new Set(posts.map(p => p.author?.id)).size} Contributors
              </span>
            </div>
          </div>
          <button 
            onClick={() => setShowCreateForm(true)}
            className={styles.createPostBtn}
          >
            💬 Start Discussion
          </button>
        </div>
      </div>

      {/* Main Forum - Categories Grid */}
      {!showCreateForm && !editingPost && (
        <CategorySelector
          showAsGrid={true}
          selectedCategory={selectedCategory}
          onCategoryChange={(categoryId) => {
            setSelectedCategory(categoryId)
          }}
        />
      )}

      {/* Category Header - Show when category selected */}
      {!showCreateForm && !editingPost && selectedCategory && (
        <div className={styles.categoryHeader}>
          <button 
            onClick={() => setSelectedCategory(null)}
            className={styles.backBtn}
          >
            ← All Categories
          </button>
          <h2 className={styles.categoryTitle}>
            {FORUM_CATEGORIES[selectedCategory]?.name || selectedCategory}
          </h2>
          <button 
            onClick={() => setShowCreateForm(true)}
            className={styles.createPostBtn}
          >
            + New Post
          </button>
        </div>
      )}

      {/* Filter Bar - Show when category selected */}
      {!showCreateForm && !editingPost && selectedCategory && (
        <div className={styles.filterBar}>
          <div className={styles.filterSection}>
            <label className={styles.filterLabel}>Browse by type:</label>
            <div className={styles.filterButtons}>
              {[
                { key: 'all', label: 'All', desc: 'All posts' },
                { key: 'question', label: 'Questions', desc: 'Need help' },
                { key: 'discussion', label: 'Discussions', desc: 'General topics' }
              ].map(f => (
                <button
                  key={f.key}
                  className={`${styles.filterBtn} ${filter === f.key ? styles.active : ''}`}
                  onClick={() => setFilter(f.key)}
                  title={f.desc}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.sortSection}>
            <label className={styles.sortLabel}>{t('sort_by')}:</label>
            <select 
              className={styles.sortSelect} 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">{t('recent')}</option>
              <option value="popular">{t('popular')}</option>
              <option value="trending">{t('trending')}</option>
            </select>
          </div>
        </div>
      )}

      {/* Create/Edit Post Form */}
      {(showCreateForm || editingPost) && (
        <div className={styles.postFormContainer}>

          <CreatePostForm
            editPost={editingPost}
            initialCategory={selectedCategory}
            onSuccess={(post) => {
              if (editingPost) {
                handleUpdatePost(post)
                setSuccessMessage('Post updated successfully!')
              } else {
                setShowCreateForm(false)
                setSuccessMessage('Post created successfully!')
                // Force immediate refresh of posts
                setTimeout(() => {
                  fetchPosts()
                }, 100)
              }
              setTimeout(() => setSuccessMessage(''), 3000)
            }}
            onCancel={() => {
              setShowCreateForm(false)
              setEditingPost(null)
            }}
          />
        </div>
      )}



      {/* Posts List - Show when category selected */}
      {!showCreateForm && !editingPost && selectedCategory && (
        posts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}></div>
            <h4 className={styles.emptyTitle}>Start the conversation!</h4>
            <p className={styles.emptySubtitle}>Ask questions, share ideas, or start discussions with the community</p>
            <div className={styles.emptyActions}>
              <button 
                onClick={() => setShowCreateForm(true)}
                className={styles.createPostBtn}
              >
                Start Your First Discussion
              </button>
            </div>
            <div className={styles.emptyTips}>
              <p><strong>Tip:</strong> Questions with clear context get better responses!</p>
            </div>
          </div>
        ) : (
          <div className={styles.postsList}>
            {posts.map(post => {
              const cardColor = post.cardColor || getAuthorColor(post.author?.name || 'User')
              return (
                <article 
                  key={post.id} 
                  className={styles.postCard} 
                  data-type={post.type}
                  style={{
                    borderLeft: `4px solid ${cardColor}`,
                    background: `linear-gradient(135deg, ${cardColor}15, transparent)`
                  }}
                >
                <div className={styles.postContent}>
                  <div className={styles.postHeader}>
                    <div className={styles.authorInfo}>
                      {post.author?.profilePicture ? (
                        <img 
                          src={post.author.profilePicture}
                          alt={post.author?.name}
                          className={styles.authorAvatar}
                        />
                      ) : (
                        <div 
                          className={styles.authorAvatarText}
                          style={{ backgroundColor: post.cardColor || getAuthorColor(post.author?.name || 'User') }}
                        >
                          {(post.author?.name || 'U').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className={styles.authorDetails}>
                        <h6 className={styles.authorName}>{post.author?.name}</h6>
                        <div className={styles.postMeta}>
                          <span className={styles.postDate}>{new Date(post.createdAt).toLocaleDateString()}</span>
                          {post.createdAt !== post.updatedAt && (
                            <span className={styles.editedBadge}>• {t('edited')}</span>
                          )}
                          <span className={`${styles.postTypeBadge} ${styles[post.type]}`}>
                            {getPostTypeIcon(post.type)} {post.type}
                          </span>
                          {post.category && (
                            <span className={styles.categoryBadge}>
                              Published from {FORUM_CATEGORIES[post.category]?.name || post.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Edit/Delete for post author or admin - Debug version */}
                    <div className="dropdown" style={{ position: 'relative' }}>
                      <button 
                        className="btn btn-sm btn-link text-muted p-0" 
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log('🔧 Dropdown clicked for post:', post.id)
                          console.log('🔧 Current user:', currentUser)
                          console.log('🔧 Post author:', post.author)
                          setShowPostDropdown(showPostDropdown === post.id ? null : post.id)
                        }}
                        style={{ 
                          fontSize: '1.5rem', 
                          background: '#f3f4f6', 
                          border: '1px solid #d1d5db',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          color: '#374151'
                        }}
                      >
                        ⋮
                      </button>
                      {showPostDropdown === post.id && (
                        <ul className="dropdown-menu dropdown-menu-end shadow-sm show" style={{ 
                          position: 'absolute', 
                          right: 0, 
                          top: '100%', 
                          zIndex: 1000, 
                          minWidth: '140px',
                          background: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          padding: '0.5rem 0'
                        }}>
                          {(currentUser?.id === post.author?.id || currentUser?.role === 'admin') ? (
                            <>
                              <li>
                                <button 
                                  className="dropdown-item small" 
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setEditingPost(post)
                                    setShowPostDropdown(null)
                                  }}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '0.5rem 1rem',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Edit Post
                                </button>
                              </li>
                              <li><hr className="dropdown-divider" style={{ margin: '0.25rem 0', border: 'none', borderTop: '1px solid #e5e7eb' }} /></li>
                              <li>
                                <button 
                                  className="dropdown-item small text-danger" 
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeletePost(post.id)
                                    setShowPostDropdown(null)
                                  }}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '0.5rem 1rem',
                                    cursor: 'pointer',
                                    color: '#dc2626'
                                  }}
                                >
                                  Delete Post
                                </button>
                              </li>
                            </>
                          ) : (
                            <li style={{ padding: '0.5rem 1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                              No permissions
                            </li>
                          )}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className={styles.postBody}>
                    <h3 className={styles.postTitle}>{post.title}</h3>
                    <p className={styles.postText}>{post.content}</p>

                    {/* Media Gallery - YouTube/Instagram Style */}
                    {post.attachments && post.attachments.length > 0 && (
                      <div 
                        className={styles.mediaGallery}
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log('🎬 Media gallery clicked, preventing bubbling')
                        }}
                      >
                        {post.attachments.map((file, index) => {
                          // Enhanced file type detection
                          let fileType = file.category || file.type || 'document'
                          const fileName = file.originalName || file.name || 'Unknown file'
                          const fileUrl = file.url || ''
                          
                          // Check file extension if type is not clear
                          if (fileType === 'document' || !fileType) {
                            const extension = fileUrl.split('.').pop()?.toLowerCase()
                            if (['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(extension)) {
                              fileType = 'video'
                            } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
                              fileType = 'image'
                            } else if (['mp3', 'wav', 'ogg', 'aac'].includes(extension)) {
                              fileType = 'audio'
                            }
                          }
                          
                          console.log('🎥 File debug:', { fileName, fileType, url: fileUrl, original: file })
                          
                          return (
                            <div 
                              key={index} 
                              className={styles.mediaItem}
                              onClick={(e) => {
                                e.stopPropagation()
                                console.log('🎬 Media item clicked, preventing redirect')
                              }}
                            >
                              {fileType === 'image' && (
                                <div className={styles.imageContainer}>
                                  <img 
                                    src={file.url} 
                                    alt={fileName}
                                    className={styles.fullImage}
                                    loading="lazy"
                                    onClick={(_e) => {
                                      // Open in fullscreen/modal
                                      const modal = document.createElement('div')
                                      modal.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;z-index:9999;cursor:pointer'
                                      const img = document.createElement('img')
                                      img.src = file.url
                                      img.style.cssText = 'max-width:90%;max-height:90%;object-fit:contain'
                                      modal.appendChild(img)
                                      modal.onclick = () => document.body.removeChild(modal)
                                      document.body.appendChild(modal)
                                    }}
                                  />
                                  <div className={styles.imageOverlay}>
                                    
                                  </div>
                                </div>
                              )}
                              {fileType === 'video' && (
                                <div 
                                  style={{
                                    width: '100%',
                                    maxWidth: '400px',
                                    background: '#000',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    margin: '0.5rem 0'
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    e.preventDefault()
                                    console.log('🎬 Video container clicked, preventing all navigation')
                                  }}
                                  onMouseDown={(e) => e.stopPropagation()}
                                  onMouseUp={(e) => e.stopPropagation()}
                                >
                                  <video 
                                    src={fileUrl} 
                                    controls 
                                    style={{
                                      width: '100%',
                                      aspectRatio: '16/9',
                                      maxHeight: '300px',
                                      background: '#000',
                                      display: 'block',
                                      objectFit: 'contain',
                                      borderRadius: '8px'
                                    }}
                                    preload="metadata"
                                    poster={file.thumbnail}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      e.preventDefault()
                                      console.log('🎥 Video clicked, preventing redirect for:', fileName)
                                      // Force focus on video element
                                      e.target.focus()
                                    }}
                                    onPlay={(e) => {
                                      e.stopPropagation()
                                      console.log('🎥 Video started playing')
                                    }}
                                    onPause={(e) => {
                                      e.stopPropagation()
                                      console.log('🎥 Video paused')
                                    }}
                                    onLoadStart={(e) => {
                                      e.stopPropagation()
                                      console.log('🎥 Video loading started')
                                    }}
                                    onError={(e) => {
                                      e.stopPropagation()
                                      console.error('🎥 Video error:', e.target.error)
                                      console.error('🎥 Video URL:', fileUrl)
                                    }}
                                    onLoadedData={(_e) => {
                                      console.log('🎥 Video loaded successfully:', fileName)
                                    }}
                                    onCanPlay={(_e) => {
                                      console.log('🎥 Video ready to play:', fileName)
                                    }}
                                  />
                                  <div 
                                    style={{
                                      padding: '0.5rem',
                                      background: 'white',
                                      borderTop: '1px solid #eee'
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <span style={{
                                      fontSize: '0.85rem',
                                      fontWeight: '500',
                                      color: '#333',
                                      display: 'block',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap'
                                    }}>{fileName}</span>
                                  </div>
                                </div>
                              )}
                              {fileType === 'audio' && (
                                <div className={styles.audioContainer} onClick={(e) => e.stopPropagation()}>
                                  <div className={styles.audioIcon}></div>
                                  <audio 
                                    src={file.url} 
                                    controls 
                                    className={styles.fullAudio}
                                    preload="metadata"
                                    onClick={(e) => e.stopPropagation()}
                                    onPlay={(e) => e.stopPropagation()}
                                    onPause={(e) => e.stopPropagation()}
                                  />
                                  <div className={styles.audioInfo}>
                                    <span className={styles.fileName}>{fileName}</span>
                                  </div>
                                </div>
                              )}
                              {(fileType === 'document' || !['image', 'video', 'audio'].includes(fileType)) && (
                                <div className={styles.documentContainer}>
                                  <div className={styles.documentIcon}></div>
                                  <div className={styles.documentInfo}>
                                    <span className={styles.fileName}>{fileName} (Type: {fileType})</span>
                                    <a 
                                      href={fileUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className={styles.downloadBtn}
                                    >
                                      Download
                                    </a>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}

                      {/* File Count Info */}
                    {post.attachments && post.attachments.length > 0 && (
                      <div className={styles.fileInfo}>
                        {post.attachments.length} file{post.attachments.length > 1 ? 's' : ''} attached
                      </div>
                    )}

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className={styles.postTags}>
                        {post.tags.map((tag, index) => (
                          <span key={index} className={styles.tag}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                  </div>

                  {/* Action Buttons */}
                  <div className={styles.postActions}>
                    <LikeButton
                      postId={post.id}
                      initialLikes={post.likes || []}
                      currentUserId={currentUser?.id}
                      type="post"
                      onLikeSuccess={fetchPosts}
                    />

                    <button 
                      onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                      className={`${styles.actionBtn} ${styles.commentBtn}`}
                      title={t('view comments')}
                    >
                       <span className={styles.count}>{post.ForumComments?.length || 0}</span>
                      <span className={styles.label}>Comments</span>
                    </button>

                    <div className={styles.viewsCount}>
                       <span>{post.views || 0} views</span>
                    </div>
                  </div>

                  {/* Comments Section */}
                  {expandedPost === post.id && (
                    <div className={styles.commentsSection}>
                      {/* Add Comment Form */}
                      <div className={styles.commentForm}>
                        <div className={styles.commentInputWrapper}>
                          <img 
                            src={currentUser?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'User')}&background=8B5CF6&color=fff`}
                            alt={currentUser?.name}
                            className={styles.commentAvatar}
                          />
                          <textarea
                            value={commentText[post.id] || ''}
                            onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                            placeholder={t('comment')}
                            rows="3"
                            className={styles.commentTextarea}
                          />
                        </div>
                        <div className={styles.commentFormActions}>
                          <button
                            onClick={() => handleAddComment(post.id)}
                            disabled={!commentText[post.id]?.trim()}
                            className={styles.postCommentBtn}
                          >
                             {t('post comment')}
                          </button>
                        </div>
                      </div>

                      {/* Comments List */}
                      {post.ForumComments && post.ForumComments.length > 0 ? (
                        <div className={styles.commentsList}>
                          <h6 className={styles.commentsHeader}>
                             {t('comments')} ({post.ForumComments.length})
                          </h6>
                          {post.ForumComments
                            .filter(c => !c.parentCommentId)
                            .map(comment => (
                              <CommentItem
                                key={comment.id}
                                comment={{
                                  ...comment,
                                  replies: post.ForumComments.filter(c => c.parentCommentId === comment.id)
                                }}
                                onReply={handleReplyToComment}
                                onUpdate={handleUpdateComment}
                                onLike={handleLikeComment}
                                onDelete={handleDeleteComment}
                                currentUser={currentUser}
                                postAuthorId={post.author?.id}
                              />
                            ))}
                        </div>
                      ) : (
                        <div className={styles.noComments}>
                           <p>{t('no comments ')}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                </article>
              )
            })}
          </div>
        )
      )}
    </div>
  )
}