import { useState } from 'react'

export default function UniversalUpload({ 
  onUpload, 
  multiple = false, 
  acceptedTypes = '.jpg,.jpeg,.png,.gif,.webp,.mp4,.mov,.avi,.webm,.pdf,.doc,.docx,.ppt,.pptx,.txt,.mp3,.wav,.ogg',
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
      // General file upload - supports both single and multiple files
      const formData = new FormData()
      files.forEach(file => formData.append('files', file))
      
      const response = await fetch(`${API}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`)
      }
      
      const data = await response.json()
      if (data.success) {
        onUpload(multiple ? data.files : data.files[0])
      } else {
        throw new Error(data.message || 'Upload failed')
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