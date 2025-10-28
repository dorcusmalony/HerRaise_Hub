import React from 'react'
import styles from './FileUploadStatus.module.css'

export default function FileUploadStatus() {
  const uploadTypes = [
    {
      name: 'Profile Pictures',
      endpoint: '/api/profile/picture',
      formats: ['JPG', 'PNG', 'GIF', 'WebP'],
      limit: '10MB',
      features: ['Auto-delete old pictures', 'Circular crop optimization'],
      status: '✅ Active'
    },
    {
      name: 'Media Files',
      endpoint: '/api/media/upload',
      formats: ['Images', 'Videos (MP4, MOV, AVI, WebM)'],
      limit: '50MB',
      features: ['Auto format optimization', 'Video processing'],
      status: '✅ Active'
    },
    {
      name: 'General Files',
      endpoint: '/api/upload/single & /api/upload/multiple',
      formats: ['Images', 'Videos', 'Documents (PDF, DOC, PPT)', 'Audio (MP3, WAV)'],
      limit: '50MB per file, 5 files max',
      features: ['Multiple file support', 'All file types'],
      status: '✅ Active'
    },
    {
      name: 'Forum Attachments',
      endpoint: '/api/forum/upload',
      formats: ['All supported file types'],
      limit: '50MB',
      features: ['Multiple attachments', 'Forum integration'],
      status: '✅ Active'
    }
  ]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>📁 Cloudinary File Upload System</h2>
        <div className={styles.badge}>Production Ready</div>
      </div>

      <div className={styles.grid}>
        {uploadTypes.map((type, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>{type.name}</h3>
              <span className={styles.status}>{type.status}</span>
            </div>
            
            <div className={styles.cardBody}>
              <div className={styles.detail}>
                <strong>Endpoint:</strong> {type.endpoint}
              </div>
              <div className={styles.detail}>
                <strong>Formats:</strong> {type.formats.join(', ')}
              </div>
              <div className={styles.detail}>
                <strong>Limit:</strong> {type.limit}
              </div>
              
              <div className={styles.features}>
                <strong>Features:</strong>
                <ul>
                  {type.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}