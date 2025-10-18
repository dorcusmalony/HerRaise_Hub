import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import styles from '../../styles/Pages.module.css'

export default function Forum() {
  const API = import.meta.env.VITE_API_URL || ''
  
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, discussions, projects, questions
  const [sortBy, setSortBy] = useState('recent') // recent, popular, trending

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

  const handleLike = async (postId) => {
    const token = localStorage.getItem('token')
    
    try {
      await fetch(`${API}/api/forum/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      // Refresh posts
      fetchPosts()
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  const getPostTypeIcon = (type) => {
    switch(type) {
      case 'project': return '📁'
      case 'question': return '❓'
      case 'essay': return '📝'
      case 'video': return '🎥'
      default: return '💬'
    }
  }

  const getPostTypeBadge = (type) => {
    const badges = {
      project: 'bg-primary',
      question: 'bg-warning',
      essay: 'bg-info',
      video: 'bg-danger',
      discussion: 'bg-success'
    }
    return badges[type] || 'bg-secondary'
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
    <div className={`mx-auto ${styles.container}`}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>🗨️ Discussion Forum</h2>
          <p className="text-muted mb-0">Share ideas, ask questions, and connect with peers</p>
        </div>
        <Link to="/forum/create" className="btn btn-primary">
          + Create Post
        </Link>
      </div>

      {/* Filter & Sort Bar */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            {/* Filter by Type */}
            <div className="col-md-6">
              <label className="form-label small text-muted">Filter by:</label>
              <div className="btn-group w-100" role="group">
                <input 
                  type="radio" 
                  className="btn-check" 
                  name="filter" 
                  id="filter-all" 
                  value="all"
                  checked={filter === 'all'}
                  onChange={(e) => setFilter(e.target.value)}
                />
                <label className="btn btn-outline-primary" htmlFor="filter-all">All</label>

                <input 
                  type="radio" 
                  className="btn-check" 
                  name="filter" 
                  id="filter-discussions" 
                  value="discussion"
                  checked={filter === 'discussion'}
                  onChange={(e) => setFilter(e.target.value)}
                />
                <label className="btn btn-outline-primary" htmlFor="filter-discussions">Discussions</label>

                <input 
                  type="radio" 
                  className="btn-check" 
                  name="filter" 
                  id="filter-projects" 
                  value="project"
                  checked={filter === 'project'}
                  onChange={(e) => setFilter(e.target.value)}
                />
                <label className="btn btn-outline-primary" htmlFor="filter-projects">Projects</label>

                <input 
                  type="radio" 
                  className="btn-check" 
                  name="filter" 
                  id="filter-questions" 
                  value="question"
                  checked={filter === 'question'}
                  onChange={(e) => setFilter(e.target.value)}
                />
                <label className="btn btn-outline-primary" htmlFor="filter-questions">Questions</label>
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
                <option value="unanswered">Unanswered</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="row">
        {posts.length === 0 ? (
          <div className="col-12">
            <div className="card">
              <div className="card-body text-center py-5">
                <h4 className="text-muted mb-3">No posts yet</h4>
                <p className="text-muted mb-4">
                  Be the first to start a discussion, share a project, or ask a question!
                </p>
                <Link to="/forum/create" className="btn btn-primary">
                  Create First Post
                </Link>
              </div>
            </div>
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="col-12 mb-3">
              <div className="card hover-shadow">
                <div className="card-body">
                  <div className="d-flex gap-3">
                    {/* Author Avatar */}
                    <div>
                      <img 
                        src={post.author?.profilePicture || 'https://via.placeholder.com/50'} 
                        alt={post.author?.name}
                        className="rounded-circle"
                        style={{ width: 50, height: 50, objectFit: 'cover' }}
                      />
                    </div>

                    {/* Post Content */}
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h5 className="mb-1">
                            <Link to={`/forum/post/${post.id}`} className="text-decoration-none text-dark">
                              {getPostTypeIcon(post.type)} {post.title}
                            </Link>
                          </h5>
                          <div className="d-flex align-items-center gap-2 text-muted small">
                            <span className="fw-bold">{post.author?.name}</span>
                            <span>•</span>
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className={`badge ${getPostTypeBadge(post.type)}`}>
                              {post.type}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Post Excerpt */}
                      <p className="text-muted mb-2">
                        {post.content?.substring(0, 200)}
                        {post.content?.length > 200 && '...'}
                      </p>

                      {/* Attachments Preview */}
                      {post.attachments?.length > 0 && (
                        <div className="d-flex gap-2 mb-2">
                          {post.attachments.map((attachment, idx) => (
                            <span key={idx} className="badge bg-light text-dark border">
                              {attachment.type === 'video' && '🎥'}
                              {attachment.type === 'image' && '🖼️'}
                              {attachment.type === 'document' && '📄'}
                              {' '}{attachment.name}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Engagement Stats */}
                      <div className="d-flex gap-4 align-items-center">
                        <button 
                          className="btn btn-sm btn-link text-decoration-none p-0"
                          onClick={() => handleLike(post.id)}
                        >
                          👍 {post.likes || 0} Likes
                        </button>
                        <Link 
                          to={`/forum/post/${post.id}`}
                          className="btn btn-sm btn-link text-decoration-none p-0"
                        >
                          💬 {post.commentsCount || 0} Comments
                        </Link>
                        <span className="text-muted small">
                          👁️ {post.views || 0} Views
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination (if needed) */}
      {posts.length > 0 && (
        <div className="d-flex justify-content-center mt-4">
          <nav>
            <ul className="pagination">
              <li className="page-item disabled">
                <span className="page-link">Previous</span>
              </li>
              <li className="page-item active">
                <span className="page-link">1</span>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">2</a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">3</a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">Next</a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  )
}