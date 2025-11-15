import { useState } from 'react'
import { Link } from 'react-router-dom'
import LikeButton from '../LikeButton/LikeButton'
import CommentSection from './CommentSection'
import styles from './PostCard.module.css'

const getAuthorColor = (name) => {
  const colors = [
    '#e74c3c', '#3498db', '#9b59b6', '#e67e22', 
    '#1abc9c', '#f39c12', '#2ecc71', '#34495e',
    '#e91e63', '#9c27b0', '#673ab7', '#3f51b5'
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

export default function PostCard({ post, onUpdate, currentUser }) {
  const [showComments, setShowComments] = useState(false)
  const cardColor = getAuthorColor(post.author?.name || 'User')

  const handleLike = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/forum/posts/${post.id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  return (
    <div className={styles.postCard} style={{ borderLeft: `4px solid ${cardColor}` }}>
      <div className={styles.postHeader}>
        <div className={styles.authorInfo}>
          {post.author?.profilePicture ? (
            <img src={post.author.profilePicture} alt={post.author.name} className={styles.authorAvatar} />
          ) : (
            <div className={styles.authorAvatarText} style={{ backgroundColor: cardColor }}>
              {(post.author?.name || 'U').charAt(0).toUpperCase()}
            </div>
          )}
          <div className={styles.authorDetails}>
            <span className={styles.authorName}>{post.author?.name}</span>
            <span className={styles.postDate}>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <span className={styles.postType}>{post.type}</span>
      </div>

      <Link to={`/forum/posts/${post.id}`} className={styles.postLink}>
        <div className={styles.postContent}>
          <h3 className={styles.postTitle}>{post.title}</h3>
          <p className={styles.postText}>
            {post.content.length > 200 ? `${post.content.substring(0, 200)}...` : post.content}
          </p>
          {post.publishedFrom && (
            <span className={styles.categoryTag}>{post.publishedFrom}</span>
          )}
        </div>
      </Link>

      <div className={styles.postActions}>
        <button onClick={handleLike} className={styles.actionBtn}>
          ❤️ {post.likesCount || 0}
        </button>
        <button 
          onClick={() => setShowComments(!showComments)}
          className={styles.actionBtn}
        >
          💬 {post.commentsCount || 0}
        </button>
        <span className={styles.viewsCount}>👁️ {post.viewsCount || 0}</span>
      </div>

      {showComments && (
        <CommentSection 
          postId={post.id} 
          comments={post.ForumComments || []}
          onUpdate={onUpdate}
          currentUser={currentUser}
        />
      )}
    </div>
  )
}