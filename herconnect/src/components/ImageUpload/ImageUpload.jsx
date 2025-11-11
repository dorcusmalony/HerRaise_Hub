import { useState } from 'react'

export default function ImageUpload({ onImageUpload, currentImage, label = "Profile Picture" }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentImage || null)
  const [error, setError] = useState(null)
  const API = import.meta.env.VITE_API_URL || ''

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB')
      return
    }

    setError(null)

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)

    // Upload to backend (which will upload to Cloudinary)
    setUploading(true)
    const formData = new FormData()
    formData.append('profilePicture', file) // Match backend field name

    try {
      const token = localStorage.getItem('token')
      
      //  Using correct backend endpoint: POST /api/profile/picture
      const response = await fetch(`${API}/api/profile/picture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Upload failed')
      }

      const data = await response.json()
      
      // Backend returns: { success: true, user: { profilePicture: 'cloudinary_url' } }
      const imageUrl = data.user?.profilePicture || data.profilePicture || data.secure_url || data.url
      
      if (imageUrl) {
        onImageUpload(imageUrl)
      } else {
        throw new Error('No image URL received from server')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setError(error.message || 'Failed to upload image. Please try again.')
      setPreview(currentImage) // Revert preview on error
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <div className="d-flex align-items-center gap-3">
        {preview && (
          <img 
            src={preview} 
            alt="Preview" 
            className="rounded-circle"
            style={{ width: 80, height: 80, objectFit: 'cover', border: '2px solid var(--brand-magenta)' }}
          />
        )}
        <div className="flex-grow-1">
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
          {uploading && (
            <div className="d-flex align-items-center gap-2 mt-2">
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Uploading...</span>
              </div>
              <small className="text-muted">Uploading to Cloudinary...</small>
            </div>
          )}
          {error && (
            <div className="alert alert-danger alert-sm mt-2 mb-0 py-1 px-2">
              <small>{error}</small>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
