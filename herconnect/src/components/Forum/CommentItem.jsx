import { useState } from 'react'

export default function CommentItem({ comment, onReply, onEdit, onDelete, onLike, currentUser }) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [editText, setEditText] = useState(comment.content)
  const [submitting, setSubmitting] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL || ''
  const isAuthor = currentUser?.id === comment.author?.id
  const isAdmin = currentUser?.role === 'admin'
  const canModify = isAuthor || isAdmin
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
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/api/forum/comments/${comment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: editText })
      })

      if (response.ok) {
        onEdit && onEdit(comment.id, editText)
        setEditMode(false)
      }
    } catch (error) {
      console.error('Edit failed:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="border-start border-3 ps-3 mb-3" style={{ borderColor: comment.parentCommentId ? '#e0e0e0' : 'var(--brand-magenta)' }}>
      <div className="d-flex gap-2">
        <img
          src={comment.author?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author?.name || 'User')}&background=E84393&color=fff`}
          alt={comment.author?.name}
          className="rounded-circle"
          style={{ width: 40, height: 40, objectFit: 'cover' }}
        />
        
        <div className="flex-grow-1">
          <div className="d-flex justify-content-between align-items-start mb-1">
            <div>
              <strong className="small">{comment.author?.name}</strong>
              <span className="text-muted small ms-2">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
              {comment.isEdited && (
                <span className="text-muted small ms-2">(edited)</span>
              )}
            </div>

            {canModify && !editMode && (
              <div className="dropdown">
                <button className="btn btn-sm btn-link text-muted" data-bs-toggle="dropdown">
                  ⋮
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button className="dropdown-item" onClick={() => setEditMode(true)}>
                      ✏️ Edit
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={() => onDelete(comment.id)}>
                      🗑️ Delete
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {editMode ? (
            <div>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="form-control form-control-sm mb-2"
                rows="3"
              />
              <button 
                onClick={handleEdit}
                disabled={submitting}
                className="btn btn-sm text-white me-2"
                style={{ background: 'var(--brand-magenta)' }}
              >
                Save
              </button>
              <button 
                onClick={() => {
                  setEditMode(false)
                  setEditText(comment.content)
                }}
                className="btn btn-sm btn-secondary"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <p className="mb-2">{comment.content}</p>
              
              <div className="d-flex gap-3 small">
                <button
                  onClick={() => onLike(comment.id)}
                  className={`btn btn-link btn-sm p-0 text-decoration-none ${isLiked ? 'text-danger' : 'text-muted'}`}
                >
                  ❤️ {comment.likes?.length || 0}
                </button>
                
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="btn btn-link btn-sm p-0 text-decoration-none text-muted"
                >
                  💬 Reply
                </button>
              </div>

              {showReplyForm && (
                <div className="mt-2">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    className="form-control form-control-sm mb-2"
                    rows="2"
                  />
                  <button
                    onClick={handleReply}
                    disabled={submitting || !replyText.trim()}
                    className="btn btn-sm text-white me-2"
                    style={{ background: 'var(--brand-magenta)' }}
                  >
                    Reply
                  </button>
                  <button
                    onClick={() => {
                      setShowReplyForm(false)
                      setReplyText('')
                    }}
                    className="btn btn-sm btn-primary"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </>
          )}

          {/* Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3">
              {comment.replies.map(reply => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onLike={onLike}
                  currentUser={currentUser}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
