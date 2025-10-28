const API_URL = import.meta.env.VITE_API_URL || ''

const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
})

export const likeAPI = {
  // Toggle like/unlike post
  async togglePostLike(postId) {
    const response = await fetch(`${API_URL}/api/forum/posts/${postId}/like`, {
      method: 'POST',
      headers: getAuthHeaders()
    })
    return response.json()
  },

  // Toggle like/unlike comment
  async toggleCommentLike(commentId) {
    const response = await fetch(`${API_URL}/api/forum/comments/${commentId}/like`, {
      method: 'POST',
      headers: getAuthHeaders()
    })
    return response.json()
  }
}