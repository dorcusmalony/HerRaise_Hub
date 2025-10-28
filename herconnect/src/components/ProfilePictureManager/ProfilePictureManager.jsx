import { useState } from 'react'
import styles from './ProfilePictureManager.module.css'

export default function ProfilePictureManager({ currentPicture, onUpdate, editable = true }) {
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState(null)
  const API = import.meta.env.VITE_API_URL || ''

  const handleUpload = async (file) => {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB')
      return
    }

    setError(null)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('profilePicture', file)

      const response = await fetch(`${API}/api/profile/picture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      })

      const result = await response.json()
      
      if (result.success) {
        onUpdate(result.data.profilePicture)
      } else {
        throw new Error(result.message || 'Upload failed')
      }
    } catch (error) {
      setError(error.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!currentPicture) return

    setDeleting(true)
    setError(null)

    try {
      const response = await fetch(`${API}/api/profile/picture`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      const result = await response.json()
      
      if (result.success) {
        onUpdate(null)
      } else {
        throw new Error(result.message || 'Delete failed')
      }
    } catch (error) {
      setError(error.message || 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  const defaultImage = currentPicture || 
    'https://ui-avatars.com/api/?name=User&background=E84393&color=fff&size=200'

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <img
          src={defaultImage}
          alt="Profile"
          className={styles.profileImage}
        />
        
        {editable && (
          <div className={styles.controls}>
            <label className={styles.uploadBtn} disabled={uploading}>
              {uploading ? '⏳' : '📷'}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleUpload(e.target.files[0])}
                disabled={uploading}
                style={{ display: 'none' }}
              />
            </label>
            
            {currentPicture && (
              <button
                className={styles.deleteBtn}
                onClick={handleDelete}
                disabled={deleting}
                title="Remove picture"
              >
                {deleting ? '⏳' : '🗑️'}
              </button>
            )}
          </div>
        )}
      </div>

      {(uploading || deleting) && (
        <div className={styles.status}>
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Processing...</span>
          </div>
          <span>{uploading ? 'Uploading...' : 'Removing...'}</span>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}
    </div>
  )
}