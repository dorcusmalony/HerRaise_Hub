import React, { useState } from 'react'
import styles from './forumpage.module.css'

export default function CreatePost({ onCreate }) {
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
