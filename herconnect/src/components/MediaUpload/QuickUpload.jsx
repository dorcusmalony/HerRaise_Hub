import { useState } from 'react'
import axios from 'axios'

export default function QuickUpload({ onUpload, buttonText = "📎 Add Media", className = "btn btn-outline-primary" }) {
  const [uploading, setUploading] = useState(false)

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/mov', 'video/avi', 'video/webm']
    if (!validTypes.includes(file.type)) {
      alert('Please select an image or video file')
      return
    }

    if (file.size > 50 * 1024 * 1024) {
      alert('File size must be less than 50MB')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/upload/single`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      if (response.data && response.data.success) {
        const fileData = response.data.files?.[0] || response.data
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
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        id="quick-upload-input"
        disabled={uploading}
      />
      <label htmlFor="quick-upload-input" className={className} style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}>
        {uploading ? '⏳ Uploading...' : buttonText}
      </label>
    </>
  )
}