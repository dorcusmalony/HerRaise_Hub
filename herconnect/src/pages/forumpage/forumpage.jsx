import React, { useState } from 'react'
import '../../styles/BootstrapVars.module.css' // side-effect: load Bootstrap + CSS vars
import styles from './forumpage.module.css'

/**
 * Self-contained Forum page (CreatePost + PostCard included)
 * Use this single-file approach to avoid missing import errors that cause a blank screen.
 */

function CreatePost({ onCreate }) {
  const [form, setForm] = useState({ author: 'You', title: '', category: 'General', content: '' })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    const err = {}
    if (!form.title.trim()) err.title = 'Title required'
    if (!form.content.trim()) err.content = 'Content required'
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onCreate({ author: form.author, title: form.title.trim(), category: form.category, content: form.content.trim() })
    setForm({ author: 'You', title: '', category: 'General', content: '' })
  }

  return (
    <div className={`card ${styles.formCard}`}>
      <div className="card-body">
        <h5 className="card-title">Create a post</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="form-label small">Title</label>
            <input name="title" value={form.title} onChange={handleChange} className={`form-control ${styles.input}`} />
            {errors.title && <div className="text-danger small mt-1">{errors.title}</div>}
          </div>

          <div className="mb-2">
            <label className="form-label small">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="form-select">
              <option>General</option>
              <option>Project</option>
              <option>Help</option>
              <option>Discussion</option>
            </select>
          </div>

          <div className="mb-2">
            <label className="form-label small">Content</label>
            <textarea name="content" value={form.content} onChange={handleChange} className={`form-control ${styles.textarea}`} rows="4" placeholder="Share your idea, question or link..."></textarea>
            {errors.content && <div className="text-danger small mt-1">{errors.content}</div>}
          </div>

          <div className="d-flex justify-content-end">
            <button type="submit" className={`btn ${styles.brandButton}`}>Publish</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function PostCard({ post, onLike, onComment }) {
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
            <button className="btn btn-sm btn-outline-primary me-2" onClick={onLike}>Like ({post.likes})</button>
            <button className="btn btn-sm btn-outline-secondary" onClick={onComment}>Comment ({post.comments})</button>
          </div>
          <div className="small text-muted">ID: {post.id}</div>
        </div>
      </div>
    </div>
  )
}

export default function ForumPage() {
  // defensive: catch rendering errors and log to console
  try {
    const [posts, setPosts] = useState([
      {
        id: Date.now() - 2000,
        author: 'Dorcus Alier',
        title: 'My project on women in tech',
        category: 'Project',
        content: 'Excited to share my research on women in tech and how to get started.',
        likes: 3,
        comments: 1,
        createdAt: new Date().toISOString()
      },
      {
        id: Date.now() - 1000,
        author: 'Kur Peter',
        title: 'Need mentor in leadership',
        category: 'Help',
        content: 'Looking for a mentor experienced in leadership and public speaking.',
        likes: 2,
        comments: 0,
        createdAt: new Date().toISOString()
      }
    ])

    const handleCreate = (post) => {
      const newPost = {
        id: Date.now(),
        likes: 0,
        comments: 0,
        createdAt: new Date().toISOString(),
        ...post
      }
      setPosts(prev => [newPost, ...prev])
    }

    const handleLike = (id) => {
      setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p))
    }

    const handleAddComment = (id) => {
      setPosts(prev => prev.map(p => p.id === id ? { ...p, comments: p.comments + 1 } : p))
    }

    return (
      <div className={`container py-4 ${styles.forumContainer}`}>
        <h3 className="mb-3">HerRaise Forum</h3>
        <div className={styles.grid}>
          <div className={styles.left}>
            <CreatePost onCreate={handleCreate} />
            <div className="mt-3">
              {posts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={() => handleLike(post.id)}
                  onComment={() => handleAddComment(post.id)}
                />
              ))}
            </div>
          </div>

          <aside className={styles.right}>
            <div className={`card ${styles.sidebarCard}`}>
              <div className="card-body">
                <h6>Forum Guidelines</h6>
                <ul className={styles.guidelines}>
                  <li>Be respectful and supportive.</li>
                  <li>Share constructive feedback.</li>
                  <li>No hate speech or personal attacks.</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    )
  } catch (err) {
    // show a simple fallback in DOM and log error for debugging
    console.error('ForumPage render error:', err)
    return (
      <div className="container py-4">
        <h3>HerRaise Forum</h3>
        <div className="alert alert-danger">An error occurred rendering the forum. Check the browser console for details.</div>
      </div>
    )
  }
}
