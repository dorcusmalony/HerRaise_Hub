import { useState } from 'react'

export default function ProfilePictureUpload({ currentPicture, onUploadSuccess, editable }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const API = import.meta.env.VITE_API_URL || ''

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB')
      return
    }

    setError(null)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('profilePicture', file)

      const token = localStorage.getItem('token')

      // ✅ Using correct backend endpoint: POST /api/profile/picture
      const response = await fetch(`${API}/api/profile/picture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to upload profile picture')
      }

      const data = await response.json()
      
      // Backend returns: { success: true, user: { profilePicture: 'cloudinary_url' } }
      const imageUrl = data.user?.profilePicture || data.profilePicture || data.secure_url || data.url
      
      if (imageUrl) {
        onUploadSuccess(imageUrl)
      } else {
        throw new Error('No image URL received from server')
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError(err.message || 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  // Use ui-avatars as fallback instead of placeholder service
  const defaultImage = currentPicture || 
    'https://ui-avatars.com/api/?name=User&background=E84393&color=fff&size=150'

  return (
    <div className="profile-picture-upload text-center mb-3">
      <div className="position-relative d-inline-block">
        <img
          src={defaultImage}
          alt="Profile"
          className="rounded-circle"
          style={{
            width: 150,
            height: 150,
            objectFit: 'cover',
            border: '3px solid var(--brand-magenta)'
          }}
        />
        {editable && (
          <label
            htmlFor="profile-picture-input"
            className="position-absolute bottom-0 end-0 btn btn-sm rounded-circle"
            style={{
              width: 40,
              height: 40,
              padding: 0,
              cursor: uploading ? 'not-allowed' : 'pointer',
              background: 'var(--brand-magenta)',
              color: 'white',
              border: '2px solid white'
            }}
            title="Change profile picture"
          >
            {uploading ? '⏳' : '📷'}
          </label>
        )}
        <input
          id="profile-picture-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={!editable || uploading}
          className="d-none"
        />
      </div>
      {uploading && (
        <div className="mt-2">
          <div className="spinner-border spinner-border-sm text-primary" role="status">
            <span className="visually-hidden">Uploading...</span>
          </div>
          <small className="text-muted d-block">Uploading to Cloudinary...</small>
        </div>
      )}
      {error && (
        <div className="alert alert-danger alert-sm mt-2" style={{ maxWidth: 300, margin: '0.5rem auto', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}
    </div>
  )
}