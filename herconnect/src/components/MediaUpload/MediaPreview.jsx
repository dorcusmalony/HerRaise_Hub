import axios from 'axios'

export default function MediaPreview({ media, onRemove, showRemove = true }) {
  const handleRemove = async () => {
    if (media.publicId) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/media/${media.publicId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
      } catch (error) {
        console.error('Failed to delete media:', error)
      }
    }
    onRemove()
  }

  const isVideo = media.resourceType === 'video' || media.url?.includes('.mp4') || media.url?.includes('.mov')

  return (
    <div className="media-preview-item">
      {isVideo ? (
        <video 
          src={media.url} 
          className="media-preview" 
          controls 
          preload="metadata"
        />
      ) : (
        <img 
          src={media.url} 
          alt="Preview" 
          className="media-preview"
          loading="lazy"
        />
      )}
      
      {showRemove && (
        <button 
          className="media-remove-btn" 
          onClick={handleRemove}
          title="Remove media"
        >
          ×
        </button>
      )}
    </div>
  )
}