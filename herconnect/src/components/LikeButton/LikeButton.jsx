import { useState } from 'react'
import { likeAPI } from '../../services/likeAPI'
import './LikeButton.css'

export default function LikeButton({ postId, initialLikes = [], currentUserId, type = 'post', onLikeSuccess }) {
  // Handle both array of user IDs and array of like objects
  const likeUserIds = initialLikes.map(like => 
    typeof like === 'object' ? like.userId : like
  )
  
  const [liked, setLiked] = useState(likeUserIds.includes(currentUserId))
  const [likesCount, setLikesCount] = useState(initialLikes.length)
  const [loading, setLoading] = useState(false)

  const handleLike = async () => {
    if (loading) {
      console.log('Like button is loading, ignoring click')
      return
    }
    
    if (!currentUserId) {
      console.log('No current user ID, cannot like')
      alert('Please log in to like posts')
      return
    }
    
    console.log('Attempting to like/unlike:', { postId, currentUserId, type, currentLiked: liked })
    setLoading(true)
    
    // Optimistic update
    const newLiked = !liked
    setLiked(newLiked)
    setLikesCount(prev => newLiked ? prev + 1 : prev - 1)
    
    try {
      const response = type === 'comment' 
        ? await likeAPI.toggleCommentLike(postId)
        : await likeAPI.togglePostLike(postId)

      console.log('Like API response:', response)
      
      if (response && response.success !== undefined) {
        // Use response data if available
        setLiked(response.liked)
        setLikesCount(response.likesCount || (response.liked ? likesCount : likesCount - 1))
      } else if (response) {
        // If no success field but response exists, assume it worked
        console.log('Like API succeeded (no success field)')
      }
      
      // Call success callback to refresh parent data
      if (onLikeSuccess) {
        onLikeSuccess()
      }
    } catch (error) {
      // Revert optimistic update on error
      setLiked(!newLiked)
      setLikesCount(prev => newLiked ? prev - 1 : prev + 1)
      console.error('Like failed:', error)
      
      if (error.message.includes('401')) {
        alert('Please log in again to like posts')
      } else {
        alert(`Like failed: ${error.message}`)
      }
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
      
      <span className="likes-count">
        {likesCount} {likesCount === 1 ? 'like' : 'likes'}
      </span>
    </div>
  )
}