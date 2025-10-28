import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './SafetyReport.css'

export default function SafetyReport() {
  const navigate = useNavigate()
  const API_URL = import.meta.env.VITE_API_URL || ''
  
  const [formData, setFormData] = useState({
    reportType: '',
    urgencyLevel: '',
    location: '',
    locationOther: '',
    description: '',
    evidenceUrl: '',
    contactPreference: 'anonymous',
    contactEmail: '',
    contactPhone: '',
    acknowledged: false
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${API_URL}/api/safety-resources/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          ...formData,
          location: formData.location === 'Other' ? formData.locationOther : formData.location,
          isAnonymous: formData.contactPreference === 'anonymous'
        })
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        alert(
          `Report submitted successfully!\n\n` +
          `Report ID: ${data.reportId}\n\n` +
          `${data.nextSteps?.join('\n') || 'Our team will review your report within 24 hours.'}`
        )
        
        // Reset form
        setFormData({
          reportType: '',
          urgencyLevel: '',
          location: '',
          locationOther: '',
          description: '',
          evidenceUrl: '',
          contactPreference: 'anonymous',
          contactEmail: '',
          contactPhone: '',
          acknowledged: false
        })

        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)
      } else {
        throw new Error(data.message || 'Failed to submit report')
      }
    } catch (error) {
      console.error('Report submission error:', error)
      setError(error.message || 'Failed to submit report. Please try again or call 777 if urgent.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-2xl font-bold mb-3">Report Submitted Successfully</h3>
          <p className="text-gray-600 mb-4">
            Thank you for reporting this concern. Our team will review it promptly.
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-red-600 mb-4">🚨 Report Safety Concern</h2>
      
      <div className="safety-divider mb-4"></div>
      
      <p className="text-gray-600 mb-6">
        This form is <strong>confidential and secure</strong>.<br />
        Your safety is our priority.
      </p>

      {/* Report Type */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Report Type: *</label>
        <div className="space-y-2">
          {{
            harassment: 'Harassment',
            bullying_cyberbullying: 'Bullying/Cyberbullying',
            inappropriate_content: 'Inappropriate Content',
            unsafe_situation: 'Unsafe Situation',
            legal_advice: 'Need Legal Advice',
            other: 'Other Safety Concern'
          }[formData.reportType]}
        </div>
      </div>

      {/* Urgency Level */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Urgency Level: *</label>
        <div className="space-y-2">
          {{
            critical: 'Critical (Immediate danger)',
            high: 'High (Needs quick attention)',
            medium: 'Medium (Important but not urgent)',
            low: 'Low (General inquiry)'
          }[formData.urgencyLevel]}
        </div>
      </div>

      {/* Location */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Where did this happen?</label>
        <div className="space-y-2">
          {['Forum/Discussion', 'Private Messages', 'Mentor Session', 'Outside Platform', 'Other'].map(loc => (
            <label key={loc} className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="location"
                value={loc}
                checked={formData.location === loc}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="mr-3"
              />
              <span>{loc}</span>
            </label>
          ))}
        </div>
        {formData.location === 'Other' && (
          <input
            type="text"
            placeholder="Please specify..."
            value={formData.locationOther}
            onChange={(e) => setFormData({...formData, locationOther: e.target.value})}
            className="w-full border rounded px-3 py-2 mt-2"
          />
        )}
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">
          Describe what happened: *
        </label>
        <p className="text-sm text-gray-500 mb-2">(Be as detailed as possible)</p>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          required
          rows="6"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Please provide details about what happened, when it occurred, and any other relevant information..."
        />
      </div>

      {/* Evidence URL */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">
          Link to content/user (if applicable):
        </label>
        <input
          type="text"
          value={formData.evidenceUrl}
          onChange={(e) => setFormData({...formData, evidenceUrl: e.target.value})}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="URL or username..."
        />
      </div>

      {/* Upload Evidence (Optional - simulated for now) */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">
          Upload Evidence (Optional):
        </label>
        <p className="text-sm text-gray-500 mb-2">Screenshots, documents, etc.</p>
        <input
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx"
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Contact Preference */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Contact Preference:</label>
        <div className="space-y-2">
          <label className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="contactPreference"
              value="anonymous"
              checked={formData.contactPreference === 'anonymous'}
              onChange={(e) => setFormData({...formData, contactPreference: e.target.value})}
              className="mr-3"
            />
            <span>Anonymous (we won't contact you)</span>
          </label>
          
          <label className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="contactPreference"
              value="email"
              checked={formData.contactPreference === 'email'}
              onChange={(e) => setFormData({...formData, contactPreference: e.target.value})}
              className="mr-3"
            />
            <span>Email me updates</span>
          </label>
          {formData.contactPreference === 'email' && (
            <input
              type="email"
              placeholder="your@email.com"
              value={formData.contactEmail}
              onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
              className="w-full border rounded px-3 py-2 ml-6 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
          
          <label className="flex items-center p-3 border rounded hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="contactPreference"
              value="phone"
              checked={formData.contactPreference === 'phone'}
              onChange={(e) => setFormData({...formData, contactPreference: e.target.value})}
              className="mr-3"
            />
            <span>Phone</span>
          </label>
          {formData.contactPreference === 'phone' && (
            <input
              type="tel"
              placeholder="+211 912 345 678"
              value={formData.contactPhone}
              onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
              className="w-full border rounded px-3 py-2 ml-6 mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>
      </div>

      {/* Acknowledgment */}
      <div className="mb-6 p-4 bg-gray-50 border rounded">
        <label className="flex items-start cursor-pointer">
          <input
            type="checkbox"
            checked={formData.acknowledged}
            onChange={(e) => setFormData({...formData, acknowledged: e.target.checked})}
            required
            className="mr-3 mt-1"
          />
          <span>
            I understand this report will be reviewed confidentially by authorized administrators 
            and appropriate action will be taken.
          </span>
        </label>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Submit Buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="bg-red-600 text-white px-6 py-3 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {submitting ? 'Submitting...' : 'Submit Report'}
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="bg-gray-300 text-gray-700 px-6 py-3 rounded hover:bg-gray-400 font-semibold"
        >
          Cancel
        </button>
      </div>

      {/* Emergency Help */}
      <div className="safety-divider my-6"></div>
      
      <div className="mt-6 p-6 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
        <p className="font-bold text-lg mb-3">Need immediate help?</p>
        <div className="space-y-2">
          <p className="text-lg">
            <a href="tel:777" className="text-red-600 hover:text-red-700 font-semibold">
              📞 Emergency Police: 777
            </a>
          </p>
          <p className="text-lg">
            <a href="tel:1212" className="text-blue-600 hover:text-blue-700 font-semibold">
               Do not keep quite, alway reach out for assistance
            </a>
          </p>
          <p className="text-lg">
            <a href="tel:999" className="text-red-600 hover:text-red-700 font-semibold">
               Emergency Services: 999
            </a>
          </p>
        </div>
      </div>
    </form>
  )
}
