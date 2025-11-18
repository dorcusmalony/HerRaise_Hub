import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import CreatePostForm from '../../components/Forum/CreatePostForm'
import CreatePostModal from '../../components/Forum/CreatePostModal'
import PostCard from '../../components/Forum/PostCard'
import Pagination from '../../components/common/Pagination'
import CommentItem from '../../components/Forum/CommentItem'
import { FORUM_CATEGORIES } from '../../components/Forum/CategorySelector'
// import { forumAPI } from '../../utils/forumAPI' // Temporarily disabled
import LikeButton from '../../components/LikeButton/LikeButton'
import styles from './forum.module.css'

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

export default function CategoryPage() {
  const { categoryId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const API = import.meta.env.VITE_API_URL || ''
  
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [expandedPost, setExpandedPost] = useState(null)
  const [commentText, setCommentText] = useState({})
  const [currentUser, setCurrentUser] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [showPostDropdown, setShowPostDropdown] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sort, setSort] = useState('recent')

  // Get category info
  const category = FORUM_CATEGORIES[categoryId]

  // Load current user
  useEffect(() => {
    const userData = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    
    if (userData && token) {
      try {
        const user = JSON.parse(userData)
        setCurrentUser(user)
      } catch (e) {
        console.error('Failed to parse user data:', e)
        setCurrentUser(null)
      }
    } else {
      setCurrentUser(null)
    }
  }, [])

  const fetchPosts = useCallback(async () => {
    const token = localStorage.getItem('token')
    
    if (!token) {
      console.warn('No token found, user might need to login')
      setLoading(false)
      return
    }
    
    try {
      const response = await fetch(`${API}/api/forum/posts?category=${categoryId}&page=${page}&sort=${sort}&limit=20`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('📊 Full response data:', data)
        const posts = data.posts || data.data?.posts || data || []
        console.log('📊 First post with comments:', posts[0]?.ForumComments)
        setPosts(Array.isArray(posts) ? posts : [])
        setTotalPages(data.pagination?.totalPages || 1)
      } else {
        console.error('Failed to fetch posts:', response.status)
        setPosts([])
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }, [categoryId, page, sort, API])

  useEffect(() => {
    if (categoryId && category) {
      fetchPosts()
    } else {
      // Invalid category, redirect to forum
      navigate('/forum')
    }
  }, [fetchPosts, categoryId, category, navigate, page, sort])

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
        headers: { 'Authorization': `Bearer ${token}` }
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
    if (!text?.trim()) {
      console.log(' No comment text provided')
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      console.log(' No token found')
      alert('Please login to comment')
      return
    }
    
    console.log(' Adding comment:', { postId, text, API })
    
    try {
      const response = await fetch(`${API}/api/forum/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: text })
      })

      console.log(' Comment response:', response.status, response.statusText)

      if (response.ok) {
        const result = await response.json()
        console.log(' Comment posted:', result)
        
        // Clear comment text immediately
        setCommentText(prev => ({ ...prev, [postId]: '' }))
        
        // Add comment to local state immediately with proper structure
        if (result.comment) {
          const newComment = {
            ...result.comment,
            author: result.comment.author || currentUser,
            likes: result.comment.likes || [],
            createdAt: result.comment.createdAt || new Date().toISOString()
          }
          
          setPosts(prev => prev.map(post => 
            post.id === postId 
              ? { ...post, ForumComments: [...(post.ForumComments || []), newComment] }
              : post
          ))
        }
        
        // Show success message
        setSuccessMessage(result.message || 'Reply added successfully')
        setTimeout(() => setSuccessMessage(''), 3000)
        
        // Also refetch to ensure consistency
        fetchPosts()
      } else {
        const errorText = await response.text()
        console.error(' Comment failed:', response.status, errorText)
        alert(`Failed to post comment: ${response.status}`)
      }
    } catch (error) {
      console.error(' Comment error:', error)
      alert('Network error posting comment')
    }
  }

  const [pendingRequests, setPendingRequests] = useState(new Set())

  const handleReplyToComment = async (parentCommentId, replyText) => {
    const requestKey = `reply-${parentCommentId}-${Date.now()}`
    
    if (pendingRequests.has(parentCommentId)) {
      console.log('🔄 Request already pending for comment:', parentCommentId)
      return
    }

    const token = localStorage.getItem('token')
    const post = posts.find(p => p.ForumComments?.some(c => c.id === parentCommentId))
    
    if (!post) {
      console.error('❌ Post not found for parent comment:', parentCommentId)
      return
    }

    if (!token) {
      alert('Please login to reply')
      return
    }

    setPendingRequests(prev => new Set([...prev, parentCommentId]))

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
        const result = await response.json()
        
        if (result.comment) {
          const newReply = {
            ...result.comment,
            author: result.comment.author || currentUser,
            likes: result.comment.likes || [],
            createdAt: result.comment.createdAt || new Date().toISOString()
          }
          
          setPosts(prev => prev.map(p => 
            p.id === post.id 
              ? { ...p, ForumComments: [...(p.ForumComments || []), newReply] }
              : p
          ))
        }
        
        setSuccessMessage('Reply added successfully')
        setTimeout(() => setSuccessMessage(''), 3000)
      } else if (response.status === 409) {
        console.log('⚠️ Duplicate request detected, ignoring')
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
        console.error('❌ Reply failed:', response.status, errorData)
        alert(errorData.message || 'Failed to post reply')
      }
    } catch (error) {
      console.error('❌ Reply error:', error)
      alert('Network error posting reply')
    } finally {
      setPendingRequests(prev => {
        const newSet = new Set(prev)
        newSet.delete(parentCommentId)
        return newSet
      })
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
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        fetchPosts()
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  const getPostTypeIcon = (type) => {
    const icons = {
      question: '',
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

  if (!category) {
    return (
      <div className="text-center py-5">
        <h3>Category not found</h3>
        <button onClick={() => navigate('/forum')} className="btn btn-primary">
          Back to Forum
        </button>
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

      {/* Category Header */}
      <div className={styles.categoryHeader}>
        <button 
          onClick={() => navigate('/forum')}
          className={styles.backBtn}
        >
          ← All Categories
        </button>
        <h2 className={styles.categoryTitle}>
          {category.icon} {category.name}
        </h2>
        <div className={styles.categoryActions}>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className={styles.sortSelect}>
            <option value="recent">Most Recent</option>
            <option value="popular">Most Popular</option>
            <option value="most-liked">Most Liked</option>
          </select>
          <button 
            onClick={() => setShowCreateModal(true)}
            className={styles.createPostBtn}
          >
            + New Post
          </button>
        </div>
      </div>

      {/* Category Description */}
      <div className="text-center mb-4">
        <p className="text-muted">{category.description}</p>
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <CreatePostForm
              initialCategory={categoryId}
              onSuccess={(post, message) => {
                setShowCreateModal(false)
                setSuccessMessage(message || 'Post created successfully!')
                
                // Add new post to local state immediately with proper structure
                if (post) {
                  const newPost = {
                    ...post,
                    author: post.author || currentUser,
                    ForumComments: post.ForumComments || [],
                    likes: post.likes || [],
                    views: post.views || 0,
                    createdAt: post.createdAt || new Date().toISOString(),
                    updatedAt: post.updatedAt || new Date().toISOString()
                  }
                  setPosts(prev => [newPost, ...prev])
                }
                
                // Also refresh to ensure consistency
                setTimeout(() => fetchPosts(), 500)
                setTimeout(() => setSuccessMessage(''), 3000)
              }}
              onCancel={() => setShowCreateModal(false)}
            />
          </div>
        </div>
      )}

      {/* Edit Post Modal */}
      {editingPost && (
        <div className={styles.modalOverlay} onClick={() => setEditingPost(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <CreatePostForm
              editPost={editingPost}
              initialCategory={categoryId}
              onSuccess={(post) => {
                handleUpdatePost(post)
                setSuccessMessage('Post updated successfully!')
                setTimeout(() => setSuccessMessage(''), 3000)
              }}
              onCancel={() => setEditingPost(null)}
            />
          </div>
        </div>
      )}

      {/* Posts List */}
      {!editingPost && (
        posts.length === 0 ? (
          <div className="text-center py-5">
            <h4>No posts yet in this category</h4>
            <p className="text-muted">Be the first to start a discussion!</p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className={styles.createPostBtn}
            >
              Create First Post
            </button>
          </div>
        ) : (
          <>
            <div className={styles.postsList}>
              {posts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onUpdate={fetchPosts}
                  currentUser={currentUser}
                  onEdit={setEditingPost}
                  onDelete={handleDeletePost}
                />
              ))}
            </div>
            
            <Pagination 
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )
      )}

    </div>
  )
}