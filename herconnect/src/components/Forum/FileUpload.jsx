import { useState } from 'react'
import styles from './FileUpload.module.css'

const FileUpload = ({ onFilesUploaded, acceptedTypes = '.jpg,.jpeg,.png,.gif,.webp,.mp4,.mov,.avi,.webm,.pdf,.doc,.docx,.ppt,.pptx,.txt,.mp3,.wav,.ogg' }) => {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [error, setError] = useState(null)

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return
    
    setUploading(true)
    setError(null)
    const formData = new FormData()
    Array.from(files).forEach(file => formData.append('files', file))

    try {
      const API = import.meta.env.VITE_API_URL || ''
      const response = await fetch(`${API}/api/forum/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData
      })
      
      const data = await response.json()
      
      if (response.ok && data.success && data.files) {
        setUploadedFiles(prev => [...prev, ...data.files])
        onFilesUploaded([...uploadedFiles, ...data.files])
      } else {
        setError(data.message || 'Upload failed')
        console.error('Upload failed:', data)
      }
    } catch (error) {
      setError('Upload failed. Please try again.')
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

  const removeFile = (index) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index)
    setUploadedFiles(newFiles)
    onFilesUploaded(newFiles)
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
          accept={acceptedTypes}
          onChange={(e) => handleUpload(e.target.files)}
          disabled={uploading}
          className={styles.fileInput}
          id="file-upload"
          name="file-upload"
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
                Images, videos, documents, audio (Max 50MB each)
              </p>
            </div>
          )}
        </label>
      </div>
      
      {error && (
        <div className={styles.errorMessage}>
          ❌ {error}
        </div>
      )}
      
      {/* File Preview */}
      {uploadedFiles.length > 0 && (
        <div className={styles.filePreview}>
          <h4>📎 Uploaded Files ({uploadedFiles.length})</h4>
          <div className={styles.fileList}>
            {uploadedFiles.map((file, index) => (
              <div key={index} className={styles.fileItem}>
                <div className={styles.fileInfo}>
                  {file.category === 'image' && (
                    <img src={file.url} alt={file.originalName} className={styles.thumbnail} />
                  )}
                  {file.category === 'video' && (
                    <video src={file.url} className={styles.thumbnail} />
                  )}
                  {file.category !== 'image' && file.category !== 'video' && (
                    <div className={styles.fileIcon}>
                      {file.category === 'audio' ? '🎵' : '📄'}
                    </div>
                  )}
                  <div className={styles.fileName}>
                    <strong>{file.originalName}</strong>
                    <small>{file.category}</small>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => removeFile(index)}
                  className={styles.removeBtn}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUpload