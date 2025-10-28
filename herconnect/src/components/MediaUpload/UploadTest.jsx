import { useState } from 'react'

export default function UploadTest() {
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [uploading, setUploading] = useState(false)

  const testUpload = async (file) => {
    if (!file) return

    setUploading(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append('media', file)

    try {
      console.log('Testing upload to:', `${import.meta.env.VITE_API_URL}/api/media/upload`)
      console.log('Token:', localStorage.getItem('token') ? 'Present' : 'Missing')
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/media/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      const data = await response.json()
      console.log('Response data:', data)

      if (data.success) {
        setResult(data)
      } else {
        setError(data.message || 'Upload failed')
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>🧪 Media Upload Test</h3>
      
      <input
        type="file"
        accept="image/*,video/*"
        onChange={(e) => testUpload(e.target.files[0])}
        disabled={uploading}
      />
      
      {uploading && <p>⏳ Testing upload...</p>}
      
      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          <strong>❌ Error:</strong> {error}
        </div>
      )}
      
      {result && (
        <div style={{ color: 'green', marginTop: '10px' }}>
          <strong>✅ Success!</strong>
          <pre style={{ background: '#f5f5f5', padding: '10px', marginTop: '10px' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
      
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <strong>Debug Info:</strong><br/>
        API URL: {import.meta.env.VITE_API_URL}<br/>
        Token: {localStorage.getItem('token') ? '✅ Present' : '❌ Missing'}
      </div>
    </div>
  )
}