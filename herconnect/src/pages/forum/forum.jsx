import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import CreatePostForm from '../../components/Forum/CreatePostForm'
import CommentItem from '../../components/Forum/CommentItem'
import styles from './forum.module.css'

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
  const [selectedType, setSelectedType] = useState('project')
  const [showPostDropdown, setShowPostDropdown] = useState(null)
  const [expandedVideo, setExpandedVideo] = useState(null)


  // Load current user
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setCurrentUser(JSON.parse(userData))
    }
    
    // Debug: Log environment variables
    console.log('🔧 All env vars:', import.meta.env)
  }, [])

  const fetchPosts = useCallback(async () => {
    const token = localStorage.getItem('token')
    
    try {
      const response = await fetch(`${API}/api/forum/posts?filter=${filter}&sort=${sortBy}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPosts(data.posts || [])
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }, [API, filter, sortBy])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowPostDropdown(null)
    }
    
    if (showPostDropdown) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showPostDropdown])

  const handleLikePost = async (postId) => {
    try {
      const response = await fetch(`${API}/api/forum/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        fetchPosts()
      }
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

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
      project: '',
      question: '',
      essay: '',
      video: '',
      discussion: ''
    }
    return icons[type] || ''
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
            <h1 className={styles.forumTitle}> Share Your Work & Get Feedback</h1>
            <p className={styles.forumSubtitle}>Upload projects, essays, videos and connect with peers and mentors</p>
            <div className={styles.contributionHighlight}>
              <div className={styles.highlightItem}>
                <span className={styles.highlightIcon}></span>
                <span>Share Projects</span>
              </div>
              <div className={styles.highlightItem}>
                <span className={styles.highlightIcon}></span>
                <span>Upload Essays</span>
              </div>
              <div className={styles.highlightItem}>
                <span className={styles.highlightIcon}></span>
                <span>upload Videos</span>
              </div>
              <div className={styles.highlightItem}>
                <span className={styles.highlightIcon}></span>
                
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
            ✨ Share Your Work
          </button>
        </div>
      </div>

      {/* Enhanced Filter Bar */}
      <div className={styles.filterBar}>
        <div className={styles.filterSection}>
          <label className={styles.filterLabel}>Browse by type:</label>
          <div className={styles.filterButtons}>
            {[
              { key: 'all', label: ' All', desc: 'All posts' },
              { key: 'project', label: ' Projects', desc: 'Code & creative work' },
              { key: 'essay', label: ' Essays', desc: 'Written content' },
              { key: 'video', label: ' Videos', desc: 'Video content' },
              { key: 'question', label: ' Questions', desc: 'Need help' }
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

      {/* Create/Edit Post Form */}
      {(showCreateForm || editingPost) && (
        <div className={styles.postFormContainer}>
          <CreatePostForm
            editPost={editingPost}
            initialType={selectedType}
            onSuccess={(post) => {
              if (editingPost) {
                handleUpdatePost(post)
                setSuccessMessage('Post update')
              } else {
                setShowCreateForm(false)
                setSuccessMessage('Post created!')
                fetchPosts()
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

      {/* Quick Create Button - Always Visible */}
      {!showCreateForm && !editingPost && (
        <div className={styles.quickCreateSection}>
          <div className={styles.createButtons}>
            <button 
              onClick={() => {
                setSelectedType('project')
                setShowCreateForm(true)
              }}
              className={styles.createBtn}
            >
              <div className={styles.btnIcon}></div>
              <div className={styles.btnText}>Share Project</div>
              <div className={styles.btnCount}>{posts.filter(p => p.type === 'project').length} shared</div>
            </button>
            <button 
              onClick={() => {
                setSelectedType('essay')
                setShowCreateForm(true)
              }}
              className={styles.createBtn}
            >
              <div className={styles.btnIcon}></div>
              <div className={styles.btnText}>Upload Essay</div>
              <div className={styles.btnCount}>{posts.filter(p => p.type === 'essay').length} uploaded</div>
            </button>
            <button 
              onClick={() => {
                setSelectedType('video')
                setShowCreateForm(true)
              }}
              className={styles.createBtn}
            >
              <div className={styles.btnIcon}></div>
              <div className={styles.btnText}>Upload Video</div>
              <div className={styles.btnCount}>{posts.filter(p => p.type === 'video').length} uploaded</div>
            </button>
            <button 
              onClick={() => {
                setSelectedType('question')
                setShowCreateForm(true)
              }}
              className={styles.createBtn}
            >
              <div className={styles.btnIcon}></div>
              <div className={styles.btnText}>Ask Question</div>
              <div className={styles.btnCount}>{posts.filter(p => p.type === 'question').length} asked</div>
            </button>
          </div>
        </div>
      )}

      {/* Posts List */}
      {!showCreateForm && !editingPost && (
        posts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}></div>
            <h4 className={styles.emptyTitle}>Ready to share your amazing work?</h4>
            <p className={styles.emptySubtitle}>Upload your projects, essays, or videos to get valuable feedback from peers and mentors</p>
            <div className={styles.emptyActions}>
              <button 
                onClick={() => setShowCreateForm(true)}
                className={styles.createPostBtn}
              >
                 Share Your First Project
              </button>
            </div>
            <div className={styles.emptyTips}>
              <p> <strong>Tips:</strong> Projects with files get 3x more engagement!</p>
            </div>
          </div>
        ) : (
          <div className={styles.postsList}>
            {posts.map(post => (
              <article key={post.id} className={styles.postCard} data-type={post.type}>
                <div className={styles.postContent}>
                  <div className={styles.postHeader}>
                    <div className={styles.authorInfo}>
                      <img 
                        src={post.author?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.name || 'User')}&background=8B5CF6&color=fff`}
                        alt={post.author?.name}
                        className={styles.authorAvatar}
                      />
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
                        </div>
                      </div>
                    </div>

                    {/* Edit/Delete for post author or admin */}
                    {(currentUser?.id === post.author?.id || currentUser?.role === 'admin') && (
                      <div className="dropdown" style={{ position: 'relative' }}>
                        <button 
                          className="btn btn-sm btn-link text-muted p-0" 
                          onClick={() => setShowPostDropdown(showPostDropdown === post.id ? null : post.id)}
                          style={{ fontSize: '1.2rem' }}
                        >
                          ⋮
                        </button>
                        {showPostDropdown === post.id && (
                          <ul className="dropdown-menu dropdown-menu-end shadow-sm show" style={{ position: 'absolute', right: 0, top: '100%', zIndex: 1000 }}>
                            <li>
                              <button className="dropdown-item small" onClick={() => {
                                setEditingPost(post)
                                setShowPostDropdown(null)
                              }}>
                                ✏️ Edit Post
                              </button>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                              <button className="dropdown-item small text-danger" onClick={() => {
                                handleDeletePost(post.id)
                                setShowPostDropdown(null)
                              }}>
                                🗑️ Delete Post
                              </button>
                            </li>
                          </ul>
                        )}
                      </div>
                    )}
                  </div>

                  <div className={styles.postBody}>
                    <h3 className={styles.postTitle}>{post.title}</h3>
                    <p className={styles.postText}>{post.content}</p>

                    {/* Media Gallery - YouTube/Instagram Style */}
                    {post.attachments && post.attachments.length > 0 && (
                      <div className={styles.mediaGallery}>
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
                          

                          
                          return (
                            <div key={index} className={styles.mediaItem}>
                              {fileType === 'image' && (
                                <div className={styles.imageContainer}>
                                  <img 
                                    src={file.url} 
                                    alt={fileName}
                                    className={styles.fullImage}
                                    loading="lazy"
                                    onClick={() => {
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
                                </div>
                              )}
                              {fileType === 'video' && (
                                <div 
                                  style={{
                                    width: '100%',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    margin: '1rem 0',
                                    position: 'relative',
                                    cursor: expandedVideo === `${post.id}-${index}` ? 'default' : 'pointer'
                                  }}
                                  onClick={() => {
                                    if (expandedVideo !== `${post.id}-${index}`) {
                                      setExpandedVideo(`${post.id}-${index}`)
                                    }
                                  }}
                                >
                                  <video 
                                    src={fileUrl} 
                                    controls={expandedVideo === `${post.id}-${index}`}
                                    style={{
                                      width: '100%',
                                      height: expandedVideo === `${post.id}-${index}` ? '400px' : '200px',
                                      background: '#000',
                                      display: 'block',
                                      objectFit: 'cover',
                                      transition: 'height 0.3s ease'
                                    }}
                                    preload="metadata"
                                    poster={file.thumbnail}
                                  />
                                  {expandedVideo !== `${post.id}-${index}` && (
                                    <div style={{
                                      position: 'absolute',
                                      top: '50%',
                                      left: '50%',
                                      transform: 'translate(-50%, -50%)',
                                      background: 'rgba(0,0,0,0.7)',
                                      borderRadius: '50%',
                                      width: '60px',
                                      height: '60px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: 'white',
                                      fontSize: '20px',
                                      pointerEvents: 'none'
                                    }}>
                                      ▶
                                    </div>
                                  )}
                                  {expandedVideo === `${post.id}-${index}` && (
                                    <div style={{
                                      position: 'absolute',
                                      top: '10px',
                                      right: '10px',
                                      background: 'rgba(0,0,0,0.7)',
                                      color: 'white',
                                      padding: '5px 10px',
                                      borderRadius: '15px',
                                      fontSize: '12px',
                                      cursor: 'pointer'
                                    }}
                                    onClick={(_e) => {
                                      _e.stopPropagation()
                                      setExpandedVideo(null)
                                    }}>
                                      ✕ Minimize
                                    </div>
                                  )}
                                </div>
                              )}
                              {fileType === 'audio' && (
                                <div className={styles.audioContainer}>
                                  <div className={styles.audioIcon}>🎵</div>
                                  <audio 
                                    src={file.url} 
                                    controls 
                                    className={styles.fullAudio}
                                    preload="metadata"
                                  />
                                  <div className={styles.audioInfo}>
                                    <span className={styles.fileName}>{fileName}</span>
                                  </div>
                                </div>
                              )}
                              {(fileType === 'document' || !['image', 'video', 'audio'].includes(fileType)) && (
                                <div className={styles.documentContainer}>
                                  <div className={styles.documentIcon}>📄</div>
                                  <div className={styles.documentInfo}>
                                    <span className={styles.fileName}>{fileName} (Type: {fileType})</span>
                                    <a 
                                      href={fileUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className={styles.downloadBtn}
                                    >
                                      📎 Download
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
                        📎 {post.attachments.length} file{post.attachments.length > 1 ? 's' : ''} attached
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
                    <button 
                      onClick={() => handleLikePost(post.id)}
                      className={`${styles.actionBtn} ${styles.likeBtn} ${post.likes?.some(l => l.userId === currentUser?.id) ? styles.liked : ''}`}
                      title={t('like_post')}
                    >
                      ❤️ <span className={styles.count}>{post.likes?.length || 0}</span>
                      <span className={styles.label}>Likes</span>
                    </button>

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
            ))}
          </div>
        )
      )}
    </div>
  )
}