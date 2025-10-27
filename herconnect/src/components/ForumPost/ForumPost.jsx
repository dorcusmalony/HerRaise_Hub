import LikeButton from '../LikeButton/LikeButton'
import { MediaDisplay } from '../MediaUpload'
import './ForumPost.css'

export default function ForumPost({ post, currentUser }) {
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
          💬 Comment ({post.commentsCount || 0})
        </button>
        
        <button className="share-btn">
          📤 Share
        </button>
      </div>
    </div>
  )
}