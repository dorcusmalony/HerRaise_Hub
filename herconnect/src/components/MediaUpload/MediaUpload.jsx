import { useState } from 'react'
import axios from 'axios'
import './MediaUpload.css'

export default function MediaUpload({ onUpload, multiple = false }) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const uploadFile = async (file) => {
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/mov', 'video/avi', 'video/webm']
    if (!validTypes.includes(file.type)) {
      alert('Please select an image or video file')
      return
    }

    // Validate file size (50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('File size must be less than 50MB')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('media', file)

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/media/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      onUpload(response.data)
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    const files = Array.from(e.dataTransfer.files)
    
    if (multiple) {
      files.forEach(uploadFile)
    } else {
      uploadFile(files[0])
    }
  }

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files)
    
    if (multiple) {
      files.forEach(uploadFile)
    } else {
      uploadFile(files[0])
    }
  }

  return (
    <div 
      className={`media-upload-zone ${dragActive ? 'drag-active' : ''} ${uploading ? 'uploading' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
    >
      {uploading ? (
        <div className="upload-progress">
          <div className="spinner"></div>
          <p>📤 Uploading...</p>
        </div>
      ) : (
        <>
          <div className="upload-icon">📎</div>
          <p className="upload-text">
            Drag & drop {multiple ? 'files' : 'a file'} here or click to browse
          </p>
          <p className="upload-hint">
            Images & Videos • Max 50MB
          </p>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileSelect}
            multiple={multiple}
            style={{ display: 'none' }}
            id="media-file-input"
            disabled={uploading}
          />
          <label htmlFor="media-file-input" className="upload-button">
            Choose {multiple ? 'Files' : 'File'}
          </label>
        </>
      )}
    </div>
  )
}