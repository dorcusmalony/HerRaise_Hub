import CommentItem from '../Forum/CommentItem'
import './CommentsModal.css'

const CommentsModal = ({ 
  content, 
  currentUser, 
  commentText, 
  setCommentText, 
  onAddComment, 
  onReplyToComment, 
  onUpdateComment, 
  onLikeComment, 
  onDeleteComment, 
  onClose 
}) => {
  if (!content) return null

  return (
    <div className="comments-modal-overlay" onClick={onClose}>
      <div className="comments-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="comments-modal-header">
          <h5>{content.title}</h5>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="comments-modal-body">
          <div className="add-comment-section">
            <div className="comment-input-row">
              <img 
                src={currentUser?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'User')}&background=8B5CF6&color=fff`}
                alt={currentUser?.name}
                className="user-avatar"
              />
              <div className="comment-input-container">
                <textarea
                  className="comment-input"
                  rows="3"
                  placeholder="Add a comment..."
                  value={commentText[content._id] || ''}
                  onChange={(e) => setCommentText(prev => ({ ...prev, [content._id]: e.target.value }))}
                />
                <button 
                  className="post-comment-btn"
                  onClick={() => onAddComment(content._id)}
                  disabled={!commentText[content._id]?.trim()}
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>
          
          <div className="comments-list">
            {content.ShareZoneComments && content.ShareZoneComments.length > 0 ? (
              <>
                <h6 className="comments-count">Comments ({content.ShareZoneComments.length})</h6>
                {content.ShareZoneComments
                  .filter(c => !c.parentCommentId)
                  .map(comment => (
                    <CommentItem
                      key={comment.id}
                      comment={{
                        ...comment,
                        replies: content.ShareZoneComments.filter(c => c.parentCommentId === comment.id)
                      }}
                      onReply={onReplyToComment}
                      onUpdate={onUpdateComment}
                      onLike={onLikeComment}
                      onDelete={onDeleteComment}
                      currentUser={currentUser}
                      postAuthorId={content.author?._id}
                    />
                  ))}
              </>
            ) : (
              <div className="no-comments">
                <p>No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommentsModal