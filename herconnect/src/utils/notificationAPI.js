const API_BASE = import.meta.env.VITE_API_URL || ''

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
})

export const notificationAPI = {
  // Create notification for post like
  createPostLikeNotification: async (postId, postAuthorId) => {
    try {
      const response = await fetch(`${API_BASE}/api/notifications`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          type: 'post_like',
          recipientId: postAuthorId,
          data: { postId },
          message: 'liked your post'
        })
      })
      return response.json()
    } catch (error) {
      console.error('Error creating post like notification:', error)
    }
  },

  // Create notification for comment
  createCommentNotification: async (postId, postAuthorId, commentId) => {
    try {
      const response = await fetch(`${API_BASE}/api/notifications`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          type: 'post_comment',
          recipientId: postAuthorId,
          data: { postId, commentId },
          message: 'commented on your post'
        })
      })
      return response.json()
    } catch (error) {
      console.error('Error creating comment notification:', error)
    }
  },

  // Create notification for comment like
  createCommentLikeNotification: async (commentId, commentAuthorId) => {
    try {
      const response = await fetch(`${API_BASE}/api/notifications`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          type: 'comment_like',
          recipientId: commentAuthorId,
          data: { commentId },
          message: 'liked your comment'
        })
      })
      return response.json()
    } catch (error) {
      console.error('Error creating comment like notification:', error)
    }
  },

  // Create notification for reply
  createReplyNotification: async (parentCommentId, commentAuthorId, replyId) => {
    try {
      const response = await fetch(`${API_BASE}/api/notifications`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          type: 'comment_reply',
          recipientId: commentAuthorId,
          data: { parentCommentId, replyId },
          message: 'replied to your comment'
        })
      })
      return response.json()
    } catch (error) {
      console.error('Error creating reply notification:', error)
    }
  }
}