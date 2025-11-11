import { useState } from 'react'

export default function CommentItem({ comment, onReply, onUpdate, onDelete, onLike, currentUser, postAuthorId }) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [editText, setEditText] = useState(comment.content)
  const [submitting, setSubmitting] = useState(false)

  const isAuthor = currentUser?.id === comment.author?.id
  const isAdmin = currentUser?.role === 'admin'
  const isPostAuthor = currentUser?.id === postAuthorId
  const canModify = isAuthor || isAdmin
  const canReply = !!currentUser // Anyone can reply if logged in
  const isLiked = comment.likes?.some(like => like.userId === currentUser?.id)

  const handleReply = async () => {
    if (!replyText.trim()) return
    
    setSubmitting(true)
    await onReply(comment.id, replyText)
    setReplyText('')
    setShowReplyForm(false)
    setSubmitting(false)
  }

  const handleEdit = async () => {
    if (!editText.trim()) return
    
    setSubmitting(true)
    const success = await onUpdate(comment.id, editText)
    if (success) {
      setEditMode(false)
    }
    setSubmitting(false)
  }

  const handleCancelEdit = () => {
    setEditMode(false)
    setEditText(comment.content)
  }

  return (
    <div 
      className="border-start ps-3 mb-3" 
      style={{ 
        borderWidth: '3px',
        borderColor: comment.parentCommentId ? '#e0e0e0' : '#6c757d' 
      }}
    >
      <div className="d-flex gap-2">
        <img
          src={comment.author?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author?.name || 'User')}&background=E84393&color=fff`}
          alt={comment.author?.name}
          className="rounded-circle flex-shrink-0"
          style={{ width: 36, height: 36, objectFit: 'cover' }}
        />
        
        <div className="flex-grow-1">
          <div className="d-flex justify-content-between align-items-start mb-1">
            <div>
              <strong className="small">{comment.author?.name}</strong>
              {comment.author?.id === postAuthorId && (
                <span className="badge bg-primary ms-2" style={{ fontSize: '0.65rem' }}>Author</span>
              )}
              <span className="text-muted small ms-2">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
              {comment.updatedAt && comment.createdAt !== comment.updatedAt && (
                <span className="text-muted small ms-2 fst-italic">(edited)</span>
              )}
            </div>

            {canModify && (
              <div className="dropdown">
                <button 
                  className="btn btn-sm btn-link text-muted p-0" 
                  data-bs-toggle="dropdown"
                  style={{ fontSize: '1.2rem' }}
                >
                  ⋮
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                  <li>
                    <button className="dropdown-item small" onClick={() => setEditMode(true)}>
                       Edit
                    </button>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item small text-danger" onClick={() => onDelete(comment.id)}>
                       Delete
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {editMode ? (
            <div className="edit-form">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="form-control form-control-sm mb-2"
                rows="3"
                disabled={submitting}
              />
              <div className="d-flex gap-2">
                <button 
                  onClick={handleEdit}
                  disabled={submitting || !editText.trim()}
                  className="btn btn-sm btn-success"
                >
                  {submitting ? 'Saving...' : 'Save'}
                </button>
                <button 
                  onClick={handleCancelEdit}
                  disabled={submitting}
                  className="btn btn-sm btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="mb-2 small" style={{ whiteSpace: 'pre-wrap' }}>{comment.content}</p>
              
              <div className="d-flex gap-3 small">
                <button
                  onClick={() => onLike(comment.id)}
                  className={`btn btn-link btn-sm p-0 text-decoration-none ${isLiked ? 'text-danger' : 'text-muted'}`}
                  title="Like comment"
                >
                  ❤️ {comment.likes?.length || 0}
                </button>
                
                {canReply && (
                  <button
                    onClick={() => setShowReplyForm(!showReplyForm)}
                    className="btn btn-link btn-sm p-0 text-decoration-none text-muted"
                    title={isPostAuthor ? 'Reply as post author' : 'Reply to comment'}
                  >
                    Reply {isPostAuthor && '(as Author)'}
                  </button>
                )}
              </div>

              {showReplyForm && (
                <div className="mt-3 p-3 bg-light border rounded">
                  <div className="mb-2 small text-muted">
                    {isPostAuthor && (
                      <span className="badge bg-primary me-2">Replying as Post Author</span>
                    )}
                    Replying to <strong>{comment.author?.name}</strong>
                  </div>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Write your reply${isPostAuthor ? ' as the post author' : ''}...`}
                    className="form-control form-control-sm mb-2"
                    rows="3"
                    disabled={submitting}
                  />
                  <div className="d-flex gap-2">
                    <button
                      onClick={handleReply}
                      disabled={submitting || !replyText.trim()}
                      className="btn btn-sm btn-success"
                    >
                      {submitting ? 'Posting...' : 'Post Reply'}
                    </button>
                    <button
                      onClick={() => {
                        setShowReplyForm(false)
                        setReplyText('')
                      }}
                      disabled={submitting}
                      className="btn btn-sm btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 ms-3">
              <div className="mb-2 small text-muted">
                {comment.replies.length} {comment.replies.length === 1 ? 'Reply' : 'Replies'}
              </div>
              {comment.replies.map(reply => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onLike={onLike}
                  currentUser={currentUser}
                  postAuthorId={postAuthorId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
