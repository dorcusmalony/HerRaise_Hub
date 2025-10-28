import { useState } from 'react'
import { likeAPI } from '../../services/likeAPI'
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
      const response = type === 'comment' 
        ? await likeAPI.toggleCommentLike(postId)
        : await likeAPI.togglePostLike(postId)

      console.log('Like response:', response)
      
      if (response && response.success) {
        setLiked(response.liked)
        setLikesCount(response.likesCount)
      }
    } catch (error) {
      // Revert optimistic update on error
      setLiked(!newLiked)
      setLikesCount(prev => newLiked ? prev - 1 : prev + 1)
      console.error('Like failed:', error)
      alert(`Like failed: ${error.message}`)
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