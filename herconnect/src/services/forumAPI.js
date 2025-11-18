const API_URL = import.meta.env.VITE_API_URL

const forumAPI = {
  // Create post
  createPost: async (postData) => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/api/forum/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(postData)
    })
    return response.json()
  },

  // Add comment/reply
  addComment: async (postId, commentData) => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/api/forum/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(commentData)
    })
    return response.json()
  },

  // Like post
  likePost: async (postId) => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/api/forum/posts/${postId}/like`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.json()
  },

  // Like comment
  likeComment: async (commentId) => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/api/forum/comments/${commentId}/like`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.json()
  },

  // Get posts
  getPosts: async (params = {}) => {
    const token = localStorage.getItem('token')
    const queryString = new URLSearchParams(params).toString()
    const response = await fetch(`${API_URL}/api/forum/posts?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.json()
  },

  // Get single post
  getPost: async (postId) => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/api/forum/posts/${postId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.json()
  }
}

export { forumAPI }
export default forumAPI