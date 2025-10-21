import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import CreatePostForm from '../../components/Forum/CreatePostForm'
import CommentItem from '../../components/Forum/CommentItem'
import styles from './forum.module.css'

export default function Forum() {
  const { t } = useTranslation()
  const API = import.meta.env.VITE_API_URL || ''
  
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

  // Load current user
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setCurrentUser(JSON.parse(userData))
    }
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

  const handleLikePost = async (postId) => {
    const token = localStorage.getItem('token')
    
    try {
      const response = await fetch(`${API}/api/forum/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
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
    
    try {
      const response = await fetch(`${API}/api/forum/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newContent })
      })

      if (response.ok) {
        fetchPosts()
        return true
      }
      return false
    } catch (error) {
      console.error('Error updating comment:', error)
      return false
    }
  }

  const handleLikeComment = async (commentId) => {
    const token = localStorage.getItem('token')
    
    try {
      await fetch(`${API}/api/forum/comments/${commentId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
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
    
    try {
      const response = await fetch(`${API}/api/forum/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        fetchPosts()
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
          ✅ {successMessage}
        </div>
      )}
      {/* Professional Header */}
      <div className={styles.forumHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <h1 className={styles.forumTitle}>{t('discussion_forum')}</h1>
            <p className={styles.forumSubtitle}>{t('be_first')}</p>
            <div className={styles.forumStats}>
              <span className={styles.statItem}>
                💬 {posts.length} Posts
              </span>
              <span className={styles.statItem}>
                👥 {new Set(posts.map(p => p.author?.id)).size} Contributors
              </span>
            </div>
          </div>
          <button 
            onClick={() => setShowCreateForm(true)}
            className={styles.createPostBtn}
          >
            ➕ {t('create_post')}
          </button>
        </div>
      </div>

      {/* Professional Filter & Sort Bar */}
      <div className={styles.filterBar}>
        <div className={styles.filterSection}>
          <label className={styles.filterLabel}>{t('filter_by')}:</label>
          <div className={styles.filterButtons}>
            {['all', 'discussion', 'project', 'question'].map(f => (
              <button
                key={f}
                className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
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
            <option value="recent">{t('most_recent')}</option>
            <option value="popular">{t('most_popular')}</option>
            <option value="trending">{t('trending')}</option>
          </select>
        </div>
      </div>

      {/* Create/Edit Post Form */}
      {(showCreateForm || editingPost) && (
        <div className={styles.postFormContainer}>
          <CreatePostForm
            editPost={editingPost}
            onSuccess={(post) => {
              if (editingPost) {
                handleUpdatePost(post)
                setSuccessMessage('Post updated successfully!')
              } else {
                setShowCreateForm(false)
                setSuccessMessage('Post created successfully!')
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

      {/* Posts List */}
      {!showCreateForm && !editingPost && (
        posts.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>💬</div>
            <h4 className={styles.emptyTitle}>{t('no_posts_yet')}</h4>
            <p className={styles.emptySubtitle}>{t('be_first_to_start')}</p>
            <button 
              onClick={() => setShowCreateForm(true)}
              className={styles.createPostBtn}
            >
              ➕ {t('create_first_post')}
            </button>
          </div>
        ) : (
          <div className={styles.postsList}>
            {posts.map(post => (
              <article key={post.id} className={styles.postCard}>
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
                      <div className={styles.postActionsMenu}>
                        <button 
                          className={styles.menuTrigger} 
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          ⋯
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                          <li>
                            <button className="dropdown-item" onClick={() => setEditingPost(post)}>
                              ✏️ {t('edit_post')}
                            </button>
                          </li>
                          <li>
                            <button className="dropdown-item text-danger" onClick={() => handleDeletePost(post.id)}>
                              🗑️ {t('delete_post')}
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className={styles.postBody}>
                    <h3 className={styles.postTitle}>{post.title}</h3>
                    <p className={styles.postText}>{post.content}</p>

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
                      title={t('view_comments')}
                    >
                      💬 <span className={styles.count}>{post.ForumComments?.length || 0}</span>
                      <span className={styles.label}>Comments</span>
                    </button>

                    <div className={styles.viewsCount}>
                      👁️ <span>{post.views || 0} views</span>
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
                            placeholder={t('write_comment')}
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
                            📤 {t('post_comment')}
                          </button>
                        </div>
                      </div>

                      {/* Comments List */}
                      {post.ForumComments && post.ForumComments.length > 0 ? (
                        <div className={styles.commentsList}>
                          <h6 className={styles.commentsHeader}>
                            💬 {t('comments')} ({post.ForumComments.length})
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
                          💬 <p>{t('no_comments_yet')}</p>
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