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
          onSuccess={(post) => {
            if (editingPost) {
              handleUpdatePost(post)
            } else {
              setShowCreateForm(false)
              fetchPosts()
            }
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
          <div key={post.id} className="card mb-4 shadow-sm hover-shadow-lg transition">
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
                    <div className="flex-grow-1">
                      <h5 className="mb-1">
                        {getPostTypeIcon(post.type)} {post.title}
                      </h5>
                      <div className="d-flex align-items-center gap-2 text-muted small">
                        <strong>{post.author?.name}</strong>
                        <span>•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        {post.createdAt !== post.updatedAt && (
                          <>
                            <span>•</span>
                            <span className="fst-italic">Edited</span>
                          </>
                        )}
                        <span className={`badge bg-${getPostTypeBadge(post.type)}`}>
                          {post.type}
                        </span>
                      </div>
                    </div>

                    {(currentUser?.id === post.author?.id || currentUser?.role === 'admin') && (
                      <div className="dropdown">
                        <button 
                          className="btn btn-sm btn-link text-muted p-1" 
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                          </svg>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end shadow">
                          <li>
                            <button className="dropdown-item" onClick={() => setEditingPost(post)}>
                              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="me-2">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                              </svg>
                              Edit Post
                            </button>
                          </li>
                          <li>
                            <button className="dropdown-item text-danger" onClick={() => handleDeletePost(post.id)}>
                              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="me-2">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                              </svg>
                              Delete Post
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  <p className="text-muted mb-3" style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {post.tags.map((tag, index) => (
                        <span key={index} className="badge bg-light text-dark border">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="d-flex gap-4 align-items-center pt-3 border-top">
                    <button 
                      onClick={() => handleLikePost(post.id)}
                      className={`btn btn-link btn-sm p-0 text-decoration-none ${post.likes?.some(l => l.userId === currentUser?.id) ? 'text-danger' : 'text-muted'}`}
                      title="Like post"
                    >
                      ❤️ <span className="ms-1">{post.likes?.length || 0}</span>
                    </button>

                    <button 
                      onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                      className="btn btn-link btn-sm p-0 text-decoration-none text-muted"
                      title="View comments"
                    >
                      💬 <span className="ms-1">{post.ForumComments?.length || 0} Comments</span>
                    </button>

                    <span className="text-muted small ms-auto" title="Views">
                      👁️ {post.views || 0}
                    </span>
                  </div>

                  {/* Comments Section */}
                  {expandedPost === post.id && (
                    <div className="mt-4 pt-4 border-top">
                      {/* Add Comment Form */}
                      <div className="mb-4">
                        <textarea
                          value={commentText[post.id] || ''}
                          onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                          placeholder="Write a thoughtful comment..."
                          rows="3"
                          className="form-control mb-2"
                        />
                        <div className="d-flex justify-content-end">
                          <button
                            onClick={() => handleAddComment(post.id)}
                            disabled={!commentText[post.id]?.trim()}
                            className="btn text-white"
                            style={{ background: 'var(--brand-magenta)' }}
                          >
                            Post Comment
                          </button>
                        </div>
                      </div>

                      {/* Comments List */}
                      {post.ForumComments && post.ForumComments.length > 0 ? (
                        <div className="comments-section">
                          <h6 className="mb-3 text-muted">
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="me-2">
                              <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
                            </svg>
                            Comments ({post.ForumComments.length})
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
                        <div className="text-center py-4">
                          <svg width="48" height="48" fill="currentColor" viewBox="0 0 16 16" className="text-muted mb-2">
                            <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
                          </svg>
                          <p className="text-muted">No comments yet. Be the first to comment!</p>
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