import { useState } from 'react'

export default function MediaOnlyUpload({ 
  onUpload, 
  buttonText = '🎥 Upload Media',
  className = 'btn btn-outline-primary'
}) {
  const [uploading, setUploading] = useState(false)

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate media types only
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/mov', 'video/avi', 'video/webm']
    if (!validTypes.includes(file.type)) {
      alert('Please select an image or video file only')
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

      const data = await response.json()
      if (data.success) {
        onUpload({
          url: data.url,
          publicId: data.publicId,
          resourceType: data.resourceType,
          format: data.format,
          width: data.width,
          height: data.height,
          duration: data.duration
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
        id="media-only-upload-input"
        disabled={uploading}
      />
      <label 
        htmlFor="media-only-upload-input" 
        className={className}
        style={{ cursor: uploading ? 'not-allowed' : 'pointer' }}
      >
        {uploading ? '⏳ Uploading...' : buttonText}
      </label>
    </>
  )
}