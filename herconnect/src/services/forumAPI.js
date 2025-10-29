const API_BASE = import.meta.env.VITE_API_URL || ''

export const forumAPI = {
  // Edit post with file management
  updatePost: async (postId, postData) => {
    const token = localStorage.getItem('token')
    
    try {
      const response = await fetch(`${API_BASE}/api/forum/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postData)
      })

      if (!response.ok) {
        throw new Error('Failed to update post')
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating post:', error)
      throw error
    }
  },

  // Delete post
  deletePost: async (postId) => {
    const token = localStorage.getItem('token')
    
    try {
      const response = await fetch(`${API_BASE}/api/forum/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete post')
      }

      return true
    } catch (error) {
      console.error('Error deleting post:', error)
      throw error
    }
  },

  // Update comment
  updateComment: async (commentId, content) => {
    const token = localStorage.getItem('token')
    
    try {
      const response = await fetch(`${API_BASE}/api/forum/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      })

      if (!response.ok) {
        throw new Error('Failed to update comment')
      }

      return await response.json()
    } catch (error) {
      console.error('Error updating comment:', error)
      throw error
    }
  },

  // Delete comment
  deleteComment: async (commentId) => {
    const token = localStorage.getItem('token')
    
    try {
      const response = await fetch(`${API_BASE}/api/forum/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete comment')
      }

      return true
    } catch (error) {
      console.error('Error deleting comment:', error)
      throw error
    }
  }
}