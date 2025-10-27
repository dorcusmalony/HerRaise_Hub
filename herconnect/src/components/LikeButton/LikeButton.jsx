import { useState } from 'react'
import axios from 'axios'
import './LikeButton.css'

export default function LikeButton({ postId, initialLikes = [], currentUserId, type = 'post' }) {
  const [liked, setLiked] = useState(initialLikes.includes(currentUserId))
  const [likesCount, setLikesCount] = useState(initialLikes.length)
  const [loading, setLoading] = useState(false)

  const handleLike = async () => {
    if (loading || !currentUserId) return
    
    setLoading(true)
    
    // Optimistic update
    const newLiked = !liked
    setLiked(newLiked)
    setLikesCount(prev => newLiked ? prev + 1 : prev - 1)
    
    try {
      const endpoint = type === 'comment' 
        ? `/api/forum/comments/${postId}/like`
        : `/api/forum/posts/${postId}/like`
        
      const response = await axios.post(`${import.meta.env.VITE_API_URL}${endpoint}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })

      // Update with server response
      setLiked(response.data.liked)
      setLikesCount(response.data.likesCount)
    } catch (error) {
      // Revert optimistic update on error
      setLiked(!newLiked)
      setLikesCount(prev => newLiked ? prev - 1 : prev + 1)
      console.error('Like failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="like-section">
      <button 
        className={`like-btn ${liked ? 'liked' : ''}`}
        onClick={handleLike}
        disabled={loading}
      >
        <span className="like-icon">
          {liked ? '❤️' : '🤍'}
        </span>
        <span className="like-text">
          {liked ? 'Liked' : 'Like'}
        </span>
      </button>
      
      {likesCount > 0 && (
        <span className="likes-count">
          {likesCount} {likesCount === 1 ? 'like' : 'likes'}
        </span>
      )}
    </div>
  )
}