import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import CreatePostForm from '../../components/Forum/CreatePostForm'
import CreatePostModal from '../../components/Forum/CreatePostModal'
import PostCard from '../../components/Forum/PostCard'
import Pagination from '../../components/pagination/Pagination'
import CommentItem from '../../components/Forum/CommentItem'
import { FORUM_CATEGORIES } from '../../components/Forum/CategorySelector'
import LikeButton from '../../components/LikeButton/LikeButton'
import styles from './forum.module.css'

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
  const [editingPost, setEditingPost] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sort, setSort] = useState('recent')

  const category = FORUM_CATEGORIES[categoryId]

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
        const posts = data.posts || data.data?.posts || data || []
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

  const handlePostLike = (postId, likeData) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, ...likeData }
        : post
    ))
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
      {successMessage && (
        <div className={styles.successMessage}>
          {successMessage}
        </div>
      )}

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

      <div className="text-center mb-4">
        <p className="text-muted">{category.description}</p>
      </div>

      {showCreateModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <CreatePostForm
              initialCategory={categoryId}
              onSuccess={(post, message) => {
                setShowCreateModal(false)
                setSuccessMessage(message || 'Post created successfully!')
                
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
                
                setTimeout(() => setSuccessMessage(''), 3000)
              }}
              onCancel={() => setShowCreateModal(false)}
            />
          </div>
        </div>
      )}

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
                  onUpdate={handlePostLike}
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
