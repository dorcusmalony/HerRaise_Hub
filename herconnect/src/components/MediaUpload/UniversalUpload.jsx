import { useState } from 'react'

export default function UniversalUpload({ 
  onUpload, 
  multiple = false, 
  acceptedTypes = 'image/*,video/*,.pdf,.doc,.docx,.txt',
  buttonText = '📎 Upload Files',
  className = 'btn btn-outline-primary'
}) {
  const [uploading, setUploading] = useState(false)

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploading(true)
    const API = import.meta.env.VITE_API_URL || ''
    const token = localStorage.getItem('token')

    try {
      if (multiple && files.length > 1) {
        // Multiple files upload
        const formData = new FormData()
        files.forEach(file => formData.append('files', file))
        
        const response = await fetch(`${API}/api/upload/multiple`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        })
        
        const data = await response.json()
        if (data.success) {
          onUpload(data.files)
        }
      } else {
        // Single file upload
        const formData = new FormData()
        formData.append('file', files[0])
        
        const response = await fetch(`${API}/api/upload/single`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        })
        
        const data = await response.json()
        if (data.success) {
          const fileData = data.files?.[0] || data
          onUpload(multiple ? [fileData] : fileData)
        }
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <input
        type="file"
        accept={acceptedTypes}
        onChange={handleFileSelect}
        multiple={multiple}
        style={{ display: 'none' }}
        id="universal-upload-input"
        disabled={uploading}
      />
      <label 
        htmlFor="universal-upload-input" 
        className={className}
        style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}
      >
        {uploading ? '⏳ Uploading...' : buttonText}
      </label>
    </>
  )
}