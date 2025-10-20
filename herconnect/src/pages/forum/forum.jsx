import { useState, useEffect, useCallback } from 'react'
import CreatePostForm from '../../components/Forum/CreatePostForm'
import CommentItem from '../../components/Forum/CommentItem'
import styles from '../../styles/Pages.module.css'

export default function Forum() {
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

  const handleDeletePost = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    const token = localStorage.getItem('token')
    
    try {
      const response = await fetch(`${API}/api/forum/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        fetchPosts()
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
    if (!confirm('Delete this comment?')) return

    const token = localStorage.getItem('token')
    
    try {
      await fetch(`${API}/api/forum/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      fetchPosts()
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  const getPostTypeIcon = (type) => {
    const icons = {
      project: '📁',
      question: '❓',
      essay: '📝',
      video: '🎥',
      discussion: '💬'
    }
    return icons[type] || '💬'
  }

  const getPostTypeBadge = (type) => {
    const badges = {
      project: 'primary',
      question: 'warning',
      essay: 'info',
      video: 'danger',
      discussion: 'success'
    }
    return badges[type] || 'secondary'
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

  if (showCreateForm || editingPost) {
    return (
      <div className={`mx-auto ${styles.container}`}>
        <CreatePostForm
          editPost={editingPost}
          onSuccess={() => {
            setShowCreateForm(false)
            setEditingPost(null)
            fetchPosts()
          }}
          onCancel={() => {
            setShowCreateForm(false)
            setEditingPost(null)
          }}
        />
      </div>
    )
  }

  return (
    <div className={`mx-auto ${styles.container}`}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>🗨️ Discussion Forum</h2>
          <p className="text-muted mb-0">Share ideas, ask questions, and connect with peers</p>
        </div>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="btn text-white"
          style={{ background: 'var(--brand-magenta)' }}
        >
          + Create Post
        </button>
      </div>

      {/* Filter & Sort Bar */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            {/* Filter by Type */}
            <div className="col-md-6">
              <label className="form-label small text-muted">Filter by:</label>
              <div className="btn-group w-100" role="group">
                {['all', 'discussion', 'project', 'question'].map(f => (
                  <div key={f}>
                    <input 
                      type="radio" 
                      className="btn-check" 
                      name="filter" 
                      id={`filter-${f}`}
                      value={f}
                      checked={filter === f}
                      onChange={(e) => setFilter(e.target.value)}
                    />
                    <label className="btn btn-outline-primary" htmlFor={`filter-${f}`}>
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div className="col-md-6">
              <label className="form-label small text-muted">Sort by:</label>
              <select 
                className="form-select" 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="trending">Trending</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <h4 className="text-muted mb-3">No posts yet</h4>
            <p className="text-muted mb-4">
              Be the first to start a discussion!
            </p>
            <button 
              onClick={() => setShowCreateForm(true)}
              className="btn text-white"
              style={{ background: 'var(--brand-magenta)' }}
            >
              Create First Post
            </button>
          </div>
        </div>
      ) : (
        posts.map(post => (
          <div key={post.id} className="card mb-4 shadow-sm">
            <div className="card-body">
              <div className="d-flex gap-3">
                {/* Author Avatar */}
                <img 
                  src={post.author?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.name || 'User')}&background=E84393&color=fff`}
                  alt={post.author?.name}
                  className="rounded-circle"
                  style={{ width: 50, height: 50, objectFit: 'cover' }}
                />

                {/* Post Content */}
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h5 className="mb-1">
                        {getPostTypeIcon(post.type)} {post.title}
                      </h5>
                      <div className="d-flex align-items-center gap-2 text-muted small">
                        <strong>{post.author?.name}</strong>
                        <span>•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        <span className={`badge bg-${getPostTypeBadge(post.type)}`}>
                          {post.type}
                        </span>
                      </div>
                    </div>

                    {(currentUser?.id === post.author?.id || currentUser?.role === 'admin') && (
                      <div className="dropdown">
                        <button className="btn btn-sm btn-link text-muted" data-bs-toggle="dropdown">
                          ⋮
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                          <li>
                            <button className="dropdown-item" onClick={() => setEditingPost(post)}>
                              ✏️ Edit
                            </button>
                          </li>
                          <li>
                            <button className="dropdown-item text-danger" onClick={() => handleDeletePost(post.id)}>
                              🗑️ Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  <p className="text-muted mb-3 white-space-pre-wrap">{post.content}</p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {post.tags.map((tag, index) => (
                        <span key={index} className="badge bg-light text-dark">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="d-flex gap-4 align-items-center pt-3 border-top">
                    <button 
                      onClick={() => handleLikePost(post.id)}
                      className="btn btn-link btn-sm p-0 text-decoration-none"
                    >
                      ❤️ {post.likes?.length || 0}
                    </button>

                    <button 
                      onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                      className="btn btn-link btn-sm p-0 text-decoration-none"
                    >
                      💬 {post.ForumComments?.length || 0} Comments
                    </button>

                    <span className="text-muted small ms-auto">
                      👁️ {post.views || 0} Views
                    </span>
                  </div>

                  {/* Comments Section */}
                  {expandedPost === post.id && (
                    <div className="mt-4 pt-4 border-top">
                      {/* Add Comment */}
                      <div className="mb-4">
                        <textarea
                          value={commentText[post.id] || ''}
                          onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                          placeholder="Write a comment..."
                          rows="3"
                          className="form-control mb-2"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          disabled={!commentText[post.id]?.trim()}
                          className="btn text-white"
                          style={{ background: 'var(--brand-magenta)' }}
                        >
                          Comment
                        </button>
                      </div>

                      {/* Comments List */}
                      {post.ForumComments && post.ForumComments.length > 0 && (
                        <div>
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
                                onLike={handleLikeComment}
                                onDelete={handleDeleteComment}
                                currentUser={currentUser}
                              />
                            ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}