import { useState } from 'react'
import { notificationAPI } from '../../utils/notificationAPI'
import styles from './CommentSection.module.css'

export default function CommentSection({ postId, comments, onUpdate, currentUser, postAuthorId }) {
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState(null)
  const [showCommentForm, setShowCommentForm] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/forum/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          content: newComment,
          parentCommentId: replyTo
        })
      })
      if (response.ok) {
        const data = await response.json()
        setNewComment('')
        setReplyTo(null)
        setShowCommentForm(false)
        
        // Create notification for comment or reply
        if (replyTo) {
          // Find the parent comment author
          const parentComment = comments.find(c => c.id === replyTo)
          if (parentComment && currentUser?.id !== parentComment.author?.id) {
            notificationAPI.createReplyNotification(replyTo, parentComment.author?.id, data.comment?.id)
          }
        } else {
          // Regular comment - notify post author
          if (currentUser?.id !== postAuthorId) {
            notificationAPI.createCommentNotification(postId, postAuthorId, data.comment?.id)
          }
        }
        
        onUpdate()
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const handleLikeComment = async (commentId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/forum/comments/${commentId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        const data = await response.json()
        
        // Create notification for comment like (not own comment)
        const comment = comments.find(c => c.id === commentId)
        if (comment && currentUser?.id !== comment.author?.id && data.liked) {
          notificationAPI.createCommentLikeNotification(commentId, comment.author?.id)
        }
        
        onUpdate()
      }
    } catch (error) {
      console.error('Error liking comment:', error)
    }
  }

  return (
    <div className={styles.commentSection}>
      {!showCommentForm ? (
        <button 
          onClick={() => setShowCommentForm(true)}
          className={styles.showCommentBtn}
        >
          💬 Add a comment...
        </button>
      ) : (
        <form onSubmit={handleSubmit} className={styles.commentForm}>
        <div className={styles.commentInputWrapper}>
          <img 
            src={currentUser?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'User')}&background=8B5CF6&color=fff`}
            alt={currentUser?.name}
            className={styles.commentAvatar}
          />
          <textarea
            placeholder={replyTo ? "Write a reply..." : "Add a comment..."}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
            rows="3"
            className={styles.commentTextarea}
          />
        </div>
        <div className={styles.commentActions}>
          <button 
            type="button" 
            onClick={() => {
              setShowCommentForm(false)
              setNewComment('')
              setReplyTo(null)
            }} 
            className={styles.cancelBtn}
          >
            Cancel
          </button>
          <button type="submit" className={styles.submitBtn}>
            {replyTo ? 'Reply' : 'Comment'}
          </button>
        </div>
      </form>
      )}

      <div className={styles.commentsList}>
        {comments.filter(c => !c.parentCommentId).map(comment => (
          <div key={comment.id} className={styles.comment}>
            <div className={styles.commentHeader}>
              <img 
                src={comment.author?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author?.name || 'User')}&background=8B5CF6&color=fff`}
                alt={comment.author?.name}
                className={styles.commentAvatar}
              />
              <div className={styles.commentAuthorInfo}>
                <span className={styles.commentAuthor}>{comment.author?.name}</span>
                <span className={styles.commentDate}>{new Date(comment.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <p className={styles.commentContent}>{comment.content}</p>
            <div className={styles.commentFooter}>
              <button 
                onClick={() => handleLikeComment(comment.id)}
                className={styles.likeBtn}
              >
                ❤️ {comment.likes?.length || 0}
              </button>
              <button 
                onClick={() => {
                  setReplyTo(comment.id)
                  setShowCommentForm(true)
                }}
                className={styles.replyBtn}
              >
                Reply
              </button>
            </div>
            
            {/* Replies */}
            {comments.filter(c => c.parentCommentId === comment.id).map(reply => (
              <div key={reply.id} className={styles.reply}>
                <div className={styles.commentHeader}>
                  <img 
                    src={reply.author?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.author?.name || 'User')}&background=8B5CF6&color=fff`}
                    alt={reply.author?.name}
                    className={styles.commentAvatar}
                  />
                  <div className={styles.commentAuthorInfo}>
                    <span className={styles.commentAuthor}>{reply.author?.name}</span>
                    <span className={styles.commentDate}>{new Date(reply.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <p className={styles.commentContent}>{reply.content}</p>
                <div className={styles.commentFooter}>
                  <button 
                    onClick={() => handleLikeComment(reply.id)}
                    className={styles.likeBtn}
                  >
                    ❤️ {reply.likes?.length || 0}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}