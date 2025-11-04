import LikeButton from '../LikeButton/LikeButton'
import { MediaDisplay } from '../MediaUpload'
import { forumAPI } from '../../services/forumAPI'
import './ForumPost.css'

export default function ForumPost({ post, currentUser, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this post? This will remove all comments and cannot be undone.')) return
    
    try {
      await forumAPI.deletePost(post.id)
      onDelete?.(post.id)
    } catch (error) {
      alert('Failed to delete post. Please try again.')
    }
  }

  return (
    <div className="forum-post">
      <div className="post-header">
        <div className="author-info">
          <img 
            src={post.author?.avatar || '/default-avatar.png'} 
            alt={post.author?.name}
            className="author-avatar"
          />
          <div>
            <h4 className="author-name">{post.author?.name}</h4>
            <span className="post-date">{formatDate(post.createdAt)}</span>
          </div>
        </div>
        
        {/* Edit/Delete Menu */}
        {(currentUser?.id === post.author?.id || currentUser?.role === 'admin') && (
          <div className="post-menu">
            <button 
              className="menu-btn"
              onClick={() => onEdit?.(post)}
              title="Edit post"
            >
              edit
            </button>
            <button 
              className="menu-btn delete-btn"
              onClick={() => handleDelete()}
              title="Delete post"
            >
              delete
            </button>
          </div>
        )}
      </div>

      <div className="post-content">
        <h3 className="post-title">{post.title}</h3>
        <p className="post-text">{post.content}</p>
        
        {post.attachments && post.attachments.length > 0 && (
          <MediaDisplay attachments={post.attachments} />
        )}
      </div>

      <div className="post-actions">
        <LikeButton
          postId={post.id}
          initialLikes={post.likes || []}
          currentUserId={currentUser?.id}
          type="post"
        />
        
        <button className="comment-btn">
           Comment ({post.commentsCount || 0})
        </button>
        
        <button className="share-btn">
           Share
        </button>
      </div>
    </div>
  )
}