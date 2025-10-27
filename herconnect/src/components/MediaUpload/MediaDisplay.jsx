export default function MediaDisplay({ attachments }) {
  if (!attachments || attachments.length === 0) return null

  return (
    <div className="post-media">
      {attachments.map((media, index) => {
        const isVideo = media.resourceType === 'video' || media.url?.includes('.mp4') || media.url?.includes('.mov')
        
        return (
          <div key={index} className="post-media-item">
            {isVideo ? (
              <video 
                src={media.url} 
                controls 
                className="post-video"
                preload="metadata"
              />
            ) : (
              <img 
                src={media.url} 
                alt="Post media" 
                className="post-image"
                loading="lazy"
              />
            )}
          </div>
        )
      })}
    </div>
  )
}