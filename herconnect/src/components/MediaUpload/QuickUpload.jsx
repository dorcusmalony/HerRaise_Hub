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