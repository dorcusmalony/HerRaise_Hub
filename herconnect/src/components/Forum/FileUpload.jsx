import { useState } from 'react'
import styles from './FileUpload.module.css'

const FileUpload = ({ onFilesUploaded }) => {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return
    
    setUploading(true)
    const formData = new FormData()
    Array.from(files).forEach(file => formData.append('files', file))

    try {
      const API = import.meta.env.VITE_API_URL || ''
      const response = await fetch(`${API}/api/forum/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData
      })
      
      if (response.ok) {
        const data = await response.json()
        onFilesUploaded(data.files)
      } else {
        console.error('Upload failed')
      }
    } catch (error) {
      console.error('Upload failed:', error)
    }
    setUploading(false)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files)
    }
  }

  return (
    <div className={styles.uploadContainer}>
      <div 
        className={`${styles.dropZone} ${dragActive ? styles.dragActive : ''} ${uploading ? styles.uploading : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          multiple 
          accept="image/*,video/*,.pdf,.doc,.docx,.txt,.ppt,.pptx"
          onChange={(e) => handleUpload(e.target.files)}
          disabled={uploading}
          className={styles.fileInput}
          id="file-upload"
        />
        <label htmlFor="file-upload" className={styles.uploadLabel}>
          {uploading ? (
            <div className={styles.uploadingState}>
              <div className={styles.spinner}></div>
              <p>Uploading files...</p>
            </div>
          ) : (
            <div className={styles.uploadPrompt}>
              <div className={styles.uploadIcon}>📁</div>
              <p className={styles.uploadText}>
                <strong>Click to upload</strong> or drag and drop
              </p>
              <p className={styles.uploadHint}>
                Images, videos, PDFs, documents (Max 10MB each)
              </p>
            </div>
          )}
        </label>
      </div>
    </div>
  )
}

export default FileUpload