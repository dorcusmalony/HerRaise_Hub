import React, { useState } from 'react'

export default function Contact({ modal = false, onClose = () => {} }) {
  const [form, setForm] = useState({
    subject: "",
    name: "",
    email: "",
    company: "",
    message: "",
    referral: "",
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    const err = {}
    if (!form.subject.trim()) err.subject = "Required"
    if (!form.name.trim()) err.name = "Required"
    if (!form.email.trim()) err.email = "Required"
    if (!form.message.trim()) err.message = "Required"
    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    console.log("Contact form submitted", form)
    alert("Message sent — thank you.")
    setForm({ subject: "", name: "", email: "", company: "", message: "", referral: "" })
    if (modal) onClose()
  }

  const formMarkup = (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Subject</label>
        <input name="subject" value={form.subject} onChange={handleChange} className="form-control" placeholder="Subject (e.g. Partnership inquiry)" />
        {errors.subject && <div className="text-danger small">{errors.subject}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Name</label>
        <input name="name" value={form.name} onChange={handleChange} className="form-control" placeholder="Your full name" />
        {errors.name && <div className="text-danger small">{errors.name}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Email</label>
        <input name="email" value={form.email} onChange={handleChange} className="form-control" placeholder="you@example.com" />
        {errors.email && <div className="text-danger small">{errors.email}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Company or School</label>
        <input name="company" value={form.company} onChange={handleChange} className="form-control" placeholder="Company or school (optional)" />
      </div>

      <div className="mb-3">
        <label className="form-label">Comment / Question</label>
        <textarea name="message" value={form.message} onChange={handleChange} className="form-control" rows="4" placeholder="Write your message here..." />
        {errors.message && <div className="text-danger small">{errors.message}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">How did you hear about HerRaise Hub?</label>
        <select name="referral" value={form.referral} onChange={handleChange} className="form-select">
          <option value="">Select an option</option>
          <option value="social">Social media (Facebook, Instagram, Twitter)</option>
          <option value="friend">Friend or colleague</option>
          <option value="school">School</option>
          <option value="search">Search engine (Google)</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="d-flex justify-content-end">
        <button type="submit" className="btn btn-primary">Submit</button>
      </div>
    </form>
  )

  if (modal) {
    return (
      <div className="contact-overlay" role="dialog" aria-modal="true" aria-labelledby="contact-heading">
        <div className="contact-card mx-auto" style={{ maxWidth: 620 }}>
          <button type="button" className="btn-close float-end" aria-label="Close" onClick={onClose} />
          <h2 id="contact-heading" className="contact-title">Contact form</h2>
          <p className="small">Please complete this form below with any questions.</p>
          {formMarkup}
        </div>
      </div>
    )
  }

  return (
    <div className="container py-4">
      <div className="contact-card mx-auto">
        <h2 className="contact-title">Contact form</h2>
        <p className="small">Please complete this form below with any questions.</p>
        {formMarkup}
      </div>
    </div>
  )
}
