import React from 'react'
import styles from './forumpage.module.css'

export default function PostCard({ post, onLike, onComment }) {
  return (
    <div className={`card mb-3 ${styles.postCard}`}>
      <div className="card-body">
        <div className={styles.postHeader}>
          <div>
            <strong>{post.author}</strong>
            <div className="small text-muted">{new Date(post.createdAt).toLocaleString()}</div>
          </div>
          <span className={`badge bg-secondary ${styles.postCategory}`}>{post.category}</span>
        </div>

        <h5 className="mt-2">{post.title}</h5>
        <p className={styles.postContent}>{post.content}</p>

        <div className={`d-flex justify-content-between align-items-center ${styles.actions}`}>
          <div>
            <button className={`btn btn-sm btn-outline-primary me-2`} onClick={onLike}>Like ({post.likes})</button>
            <button className={`btn btn-sm btn-outline-secondary`} onClick={onComment}>Comment ({post.comments})</button>
          </div>
          <div className="small text-muted">ID: {post.id}</div>
        </div>
      </div>
    </div>
  )
}
