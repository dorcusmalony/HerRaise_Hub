import { useState } from 'react'
import { notifyForumPost } from '../../utils/notificationUtils'
import { useNotifications } from '../../hooks/useNotifications'
import MediaUpload from '../MediaUpload/MediaUpload'
import MediaPreview from '../MediaUpload/MediaPreview'

export default function ForumPostForm({ onPostCreated }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [attachments, setAttachments] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showNotification } = useNotifications()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/forum/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ title, content, attachments })
      })

      if (response.ok) {
        const newPost = await response.json()
        
        // Trigger real-world notification
        notifyForumPost({
          id: newPost.id,
          title: newPost.title,
          content: newPost.content,
          author: newPost.author
        })

        // Reset form
        setTitle('')
        setContent('')
        setAttachments([])
        
        // Callback to parent component
        if (onPostCreated) onPostCreated(newPost)
      } else {
        showNotification('Error', 'Failed to create post', 'warning')
      }
    } catch (error) {
      showNotification('Error', 'Network error occurred', 'warning')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMediaUpload = (uploadedMedia) => {
    setAttachments(prev => [...prev, uploadedMedia])
    showNotification('Media Uploaded', 'File uploaded successfully!', 'success')
  }

  const removeMedia = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit} className="forum-post-form">
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Post title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <textarea
          className="form-control"
          rows="4"
          placeholder="Share your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      
      <div className="mb-3">
        <label className="form-label">Add Photos or Videos</label>
        <MediaUpload onUpload={handleMediaUpload} multiple={true} />
      </div>

      {attachments.length > 0 && (
        <div className="mb-3">
          <label className="form-label">Uploaded Media ({attachments.length})</label>
          <div className="media-preview-container">
            {attachments.map((media, index) => (
              <MediaPreview 
                key={index}
                media={media}
                onRemove={() => removeMedia(index)}
              />
            ))}
          </div>
        </div>
      )}
      
      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={isSubmitting || !title.trim() || !content.trim()}
      >
        {isSubmitting ? 'Posting...' : 'Create Post'}
      </button>
    </form>
  )
}