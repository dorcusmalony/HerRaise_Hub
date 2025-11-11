import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import CreatePostForm from '../../components/Forum/CreatePostForm'
import CommentItem from '../../components/Forum/CommentItem'
import LikeButton from '../../components/LikeButton/LikeButton'
import styles from './forum.module.css'

export default function EducationForum() {
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
  const [showPostDropdown, setShowPostDropdown] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    
    if (userData && token) {
      try {
        const user = JSON.parse(userData)
        setCurrentUser(user)
      } catch (parseError) {
        localStorage.removeItem('user')
        setCurrentUser(null)
      }
    }
  }, [])

  const fetchPosts = useCallback(async () => {
    const token = localStorage.getItem('token')
    
    if (!token) {
      setLoading(false)
      return
    }
    
    try {
      const response = await fetch(`${API}/api/forum/posts?filter=${filter}&sort=${sortBy}&category=personal-growth&subcategory=education-study`, {
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

  const handleUpdatePost = (updatedPost) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p))
    setEditingPost(null)
  }

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return

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
    if (!window.confirm('Delete this comment?')) return

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
    }
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
      {successMessage && (
        <div className={styles.successMessage}>
          {successMessage}
        </div>
      )}

      <div className={styles.forumHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <h1 className={styles.forumTitle}>📚 Education & Study Tips</h1>
            <p className={styles.forumSubtitle}>Academic challenges, scholarship opportunities, and study strategies</p>
            <div className={styles.contributionHighlight}>
              <div className={styles.highlightItem}>
                <span className={styles.highlightIcon}>🎓</span>
                <span>Academic Help</span>
              </div>
              <div className={styles.highlightItem}>
                <span className={styles.highlightIcon}>💰</span>
                <span>Scholarships</span>
              </div>
              <div className={styles.highlightItem}>
                <span className={styles.highlightIcon}>📖</span>
                <span>Study Methods</span>
              </div>
              <div className={styles.highlightItem}>
                <span className={styles.highlightIcon}>🤝</span>
                <span>Tutoring</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setShowCreateForm(true)}
            className={styles.createPostBtn}
          >
            📚 Ask Question
          </button>
        </div>
      </div>

      {(showCreateForm || editingPost) && (
        <div className={styles.postFormContainer}>
          <CreatePostForm
            editPost={editingPost}
            initialType="question"
            onSuccess={(post) => {
              if (editingPost) {
                handleUpdatePost(post)
              } else {
                setShowCreateForm(false)
                fetchPosts()
              }
              setSuccessMessage('Post saved!')
              setTimeout(() => setSuccessMessage(''), 3000)
            }}
            onCancel={() => {
              setShowCreateForm(false)
              setEditingPost(null)
            }}
          />
        </div>
      )}

      {!showCreateForm && !editingPost && (
        posts.length === 0 ? (
          <div className={styles.emptyState}>
            <h4 className={styles.emptyTitle}>Start the conversation!</h4>
            <p className={styles.emptySubtitle}>Ask questions about academics, share study tips, or discuss scholarship opportunities</p>
            <button 
              onClick={() => setShowCreateForm(true)}
              className={styles.createPostBtn}
            >
              📚 Ask Your First Question
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
                        </div>
                      </div>
                    </div>

                    {(currentUser?.id === post.author?.id || currentUser?.role === 'admin') && (
                      <div className="dropdown">
                        <button 
                          className="btn btn-sm btn-link text-muted p-0" 
                          onClick={() => setShowPostDropdown(showPostDropdown === post.id ? null : post.id)}
                        >
                          ⋮
                        </button>
                        {showPostDropdown === post.id && (
                          <ul className="dropdown-menu dropdown-menu-end shadow-sm show">
                            <li>
                              <button className="dropdown-item small" onClick={() => setEditingPost(post)}>
                                ✏️ Edit
                              </button>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                              <button className="dropdown-item small text-danger" onClick={() => handleDeletePost(post.id)}>
                                🗑️ Delete
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
                  </div>

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
                    >
                      💬 <span className={styles.count}>{post.ForumComments?.length || 0}</span>
                      <span className={styles.label}>Comments</span>
                    </button>
                  </div>

                  {expandedPost === post.id && (
                    <div className={styles.commentsSection}>
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
                            placeholder="Share your thoughts or advice..."
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
                            💬 Post Comment
                          </button>
                        </div>
                      </div>

                      {post.ForumComments && post.ForumComments.length > 0 ? (
                        <div className={styles.commentsList}>
                          <h6 className={styles.commentsHeader}>
                            💬 Comments ({post.ForumComments.length})
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
                          <p>No comments yet. Be the first to share your thoughts!</p>
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