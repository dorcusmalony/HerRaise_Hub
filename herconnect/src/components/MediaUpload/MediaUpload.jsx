import { useState } from 'react'
import './MediaUpload.css'

export default function MediaUpload({ onUpload, multiple = false }) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const uploadFile = async (file) => {
    if (!file) return

    // Validate file type
    const validTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/mov', 'video/avi', 'video/webm',
      'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain', 'audio/mpeg', 'audio/wav', 'audio/ogg'
    ]
    if (!validTypes.includes(file.type)) {
      alert('Please select a supported file type (images, videos, documents, or audio)')
      return
    }

    // Validate file size (500MB)
    if (file.size > 500 * 1024 * 1024) {
      alert('File size must be less than 500MB')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('media', file)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/media/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      })
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`)
      }
      
      const data = await response.json()

      if (data && data.success) {
        const fileData = data.files?.[0] || data
        onUpload({
          url: fileData.url,
          publicId: fileData.publicId || fileData.fileId,
          resourceType: fileData.resourceType,
          format: fileData.format,
          width: fileData.width,
          height: fileData.height,
          duration: fileData.duration,
          originalName: fileData.originalName,
          size: fileData.size,
          mimetype: fileData.mimetype
        })
      } else {
        alert('Upload failed. Please try again.')
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert(`Upload failed: ${error.message}. Please try again.`)
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
            Images & Videos • Max 500MB
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