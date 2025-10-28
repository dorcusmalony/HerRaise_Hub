import { useState } from 'react'
import { likeAPI } from '../services/likeAPI'

export function useLike(initialLikes = [], currentUserId, type = 'post') {
  const [liked, setLiked] = useState(initialLikes.includes(currentUserId))
  const [likesCount, setLikesCount] = useState(initialLikes.length)
  const [loading, setLoading] = useState(false)

  const toggleLike = async (id) => {
    if (loading || !currentUserId) return

    setLoading(true)
    
    // Optimistic update
    const newLiked = !liked
    setLiked(newLiked)
    setLikesCount(prev => newLiked ? prev + 1 : prev - 1)
    
    try {
      const response = type === 'comment' 
        ? await likeAPI.toggleCommentLike(id)
        : await likeAPI.togglePostLike(id)

      if (response.success) {
        setLiked(response.liked)
        setLikesCount(response.likesCount)
      } else {
        // Revert on failure
        setLiked(!newLiked)
        setLikesCount(prev => newLiked ? prev - 1 : prev + 1)
      }
    } catch (error) {
      // Revert optimistic update on error
      setLiked(!newLiked)
      setLikesCount(prev => newLiked ? prev - 1 : prev + 1)
      console.error('Like failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    liked,
    likesCount,
    loading,
    toggleLike
  }
}