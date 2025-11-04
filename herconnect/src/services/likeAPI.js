const API_URL = import.meta.env.VITE_API_URL || ''

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  console.log('Getting auth headers, token exists:', !!token)
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}

export const likeAPI = {
  // Toggle like/unlike post
  async togglePostLike(postId) {
    const url = `${API_URL}/api/forum/posts/${postId}/like`
    console.log('Making like request to:', url)
    console.log('Auth token exists:', !!localStorage.getItem('token'))
    
    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({})
    })
    
    console.log('Like response status:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Like API error:', errorText)
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
    }
    
    const result = await response.json()
    console.log('Like API result:', result)
    return result
  },

  // Toggle like/unlike comment
  async toggleCommentLike(commentId) {
    const url = `${API_URL}/api/forum/comments/${commentId}/like`
    console.log('Making comment like request to:', url)
    
    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({})
    })
    
    console.log('Comment like response status:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Comment like API error:', errorText)
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
    }
    
    const result = await response.json()
    console.log('Comment like API result:', result)
    return result
  }
}