const API_BASE = import.meta.env.VITE_API_URL || ''

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
})

export const forumAPI = {
  // Category Posts
  getCategoryPosts: async (category, params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const response = await fetch(`${API_BASE}/api/forum/categories/${category}/posts?${queryString}`, {
      headers: getAuthHeaders()
    })
    return response.json()
  },

  // Create Post in Category
  createPostInCategory: async (category, postData) => {
    const response = await fetch(`${API_BASE}/api/forum/categories/${category}/posts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(postData)
    })
    return response.json()
  },

  // Get Single Post
  getPost: async (postId) => {
    const response = await fetch(`${API_BASE}/api/forum/posts/${postId}`, {
      headers: getAuthHeaders()
    })
    return response.json()
  },

  // Update Post
  updatePost: async (postId, postData) => {
    const response = await fetch(`${API_BASE}/api/forum/posts/${postId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(postData)
    })
    return response.json()
  },

  // Delete Post
  deletePost: async (postId) => {
    const response = await fetch(`${API_BASE}/api/forum/posts/${postId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    return response.ok
  },

  // Like Post
  likePost: async (postId) => {
    const response = await fetch(`${API_BASE}/api/forum/posts/${postId}/like`, {
      method: 'POST',
      headers: getAuthHeaders()
    })
    return response.json()
  },

  // Comments
  addComment: async (postId, commentData) => {
    const response = await fetch(`${API_BASE}/api/forum/posts/${postId}/comments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(commentData)
    })
    return response.json()
  },

  updateComment: async (commentId, commentData) => {
    const response = await fetch(`${API_BASE}/api/forum/comments/${commentId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(commentData)
    })
    return response.json()
  },

  deleteComment: async (commentId) => {
    const response = await fetch(`${API_BASE}/api/forum/comments/${commentId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    return response.ok
  },

  likeComment: async (commentId) => {
    const response = await fetch(`${API_BASE}/api/forum/comments/${commentId}/like`, {
      method: 'POST',
      headers: getAuthHeaders()
    })
    return response.json()
  }
}