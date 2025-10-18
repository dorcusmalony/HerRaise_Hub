import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from '../../styles/Pages.module.css'
import { profileService } from '../../services/profileService'
import ProfilePictureUpload from '../../components/ProfilePictureUpload'
import { useTranslation } from '../../hooks/useTranslation'

export default function Profile() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: '',
    bio: '',
    phoneNumber: '',
    language: 'en',
    location: { city: '', state: '' },
    dateOfBirth: '',
    interests: [],
    educationLevel: '',
    profilePicture: null,
    totalPoints: 0,
    level: 1,
    isVerified: false,
    verificationDate: null,
    mentorProfile: null
  })
  
  const [editForm, setEditForm] = useState({})

  // ✅ Fetch profile data on mount
  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    try {
      const response = await profileService.getProfile()
      const userData = response.user || response.data || response
      setProfile(userData)
      setEditForm(userData)
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (err) {
      console.error('Profile fetch error:', err)
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    
    // Clear previous errors when user starts editing
    setError(null)
    
    if (name === 'city' || name === 'state') {
      setEditForm(prev => ({ 
        ...prev, 
        location: { ...prev.location, [name]: value } 
      }))
    } else if (name === 'interests' || name === 'expertise') {
      if (name === 'expertise') {
        setEditForm(prev => ({
          ...prev,
          mentorProfile: {
            ...prev.mentorProfile,
            expertise: value.split(',').map(s => s.trim()).filter(Boolean)
          }
        }))
      } else {
        setEditForm(prev => ({ 
          ...prev, 
          interests: value.split(',').map(s => s.trim()).filter(Boolean) 
        }))
      }
    } else if (name.startsWith('mentor-')) {
      const field = name.replace('mentor-', '')
      setEditForm(prev => ({
        ...prev,
        mentorProfile: {
          ...prev.mentorProfile,
          [field]: value
        }
      }))
    } else {
      setEditForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleInterestToggle = (interest) => {
    setEditForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleProfilePictureUpload = (newPictureUrl) => {
    setProfile(prev => ({ ...prev, profilePicture: newPictureUrl }))
    setEditForm(prev => ({ ...prev, profilePicture: newPictureUrl }))
    
    const updatedUser = { ...profile, profilePicture: newPictureUrl }
    localStorage.setItem('user', JSON.stringify(updatedUser))
    setSuccess('Profile picture updated successfully!')
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    // Client-side validation
    if (!editForm.name || !editForm.email) {
      setError('Name and email are required')
      return
    }

    if (editForm.phoneNumber && !/^\+?[\d\s-()]+$/.test(editForm.phoneNumber)) {
      setError('Please enter a valid phone number')
      return
    }

    if (editForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      setError('Please enter a valid email address')
      return
    }

    setSaving(true)

    try {
      const profileData = {
        name: editForm.name,
        email: editForm.email,
        bio: editForm.bio,
        phoneNumber: editForm.phoneNumber,
        language: editForm.language,
        location: editForm.location,
        dateOfBirth: editForm.dateOfBirth,
        interests: editForm.interests,
        educationLevel: editForm.educationLevel
      }

      if (profile.role === 'mentor' && editForm.mentorProfile) {
        profileData.mentorProfile = editForm.mentorProfile
      }

      const data = await profileService.updateProfile(profileData)

      setProfile(data.user || data)
      setEditForm(data.user || data)
      localStorage.setItem('user', JSON.stringify(data.user || data))
      setSuccess('Profile updated successfully!')
      setEditing(false)
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000)
    } catch (err) {
      console.error('Profile update error:', err)
      setError(err.message || 'Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditForm(profile)
    setEditing(false)
    setError(null)
  }

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (error && !profile.name) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">Error: {error}</div>
      </div>
    )
  }

  const displayImage = profile.profilePicture || 'https://via.placeholder.com/150'

  const availableInterests = [
    'leadership', 'education', 'technology', 'business',
    'health', 'personal growth', 'career development'
  ]

  return (
    <div className={`mx-auto ${styles.container}`} style={{ maxWidth: 720 }}>
      {/* Profile Header */}
      <div className="profile-header text-center mb-4">
        <ProfilePictureUpload 
          currentPicture={profile.profilePicture}
          onUploadSuccess={handleProfilePictureUpload}
          editable={editing}
        />
        <h3 className="mb-2">{profile.name}</h3>
        <span className="badge" style={{ background: 'var(--brand-magenta)', fontSize: '1rem' }}>
          {profile.role === 'mentee' ? `🎓 ${t('profile.mentee')}` : 
           profile.role === 'mentor' ? `👩‍🏫 ${t('profile.mentor')}` : 
           `👑 ${t('profile.admin')}`}
        </span>
      </div>

      {/* Gamification Info */}
      {(profile.totalPoints > 0 || profile.level > 1 || profile.isVerified) && (
        <div className="d-flex justify-content-center gap-3 mb-4">
          <div className="text-center">
            <strong className="d-block text-muted small">{t('profile.level')}</strong>
            <div className="badge bg-primary fs-6">{profile.level}</div>
          </div>
          <div className="text-center">
            <strong className="d-block text-muted small">{t('profile.points')}</strong>
            <div className="fs-6">{profile.totalPoints}</div>
          </div>
          {profile.isVerified && (
            <div className="text-center">
              <strong className="d-block text-muted small">{t('profile.status')}</strong>
              <div className="text-success fs-6">✓ {t('profile.verified')}</div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>{t('common.error')}:</strong> {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <strong>{t('common.success')}!</strong> {success}
          <button type="button" className="btn-close" onClick={() => setSuccess(null)}></button>
        </div>
      )}

      {/* Profile Actions */}
      {!editing && (
        <div className="d-flex gap-2 justify-content-center mb-4">
          <button className={`btn ${styles.brandButton}`} onClick={() => setEditing(true)}>
            {t('profile.editProfile')}
          </button>
          <button className="btn btn-outline-secondary" onClick={() => navigate('/change-password')}>
            {t('profile.changePassword')}
          </button>
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body p-4">
          {editing ? (
            <form onSubmit={handleSave}>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label">{t('profile.name')}</label>
                  <input 
                    name="name"
                    value={editForm.name || ''}
                    onChange={handleEditChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">{t('profile.email')}</label>
                  <input 
                    name="email"
                    type="email"
                    value={editForm.email || ''}
                    onChange={handleEditChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">{t('profile.bio')}</label>
                  <textarea 
                    name="bio"
                    value={editForm.bio || ''}
                    onChange={handleEditChange}
                    className="form-control"
                    rows="3"
                    placeholder={t('profile.bioPlaceholder')}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">{t('profile.phoneNumber')}</label>
                  <input 
                    name="phoneNumber"
                    value={editForm.phoneNumber || ''}
                    onChange={handleEditChange}
                    className="form-control"
                    placeholder="+254 712 345 678"
                    pattern="^\+?[\d\s-()]+$"
                    title={t('profile.phoneNumberHint')}
                  />
                  <small className="text-muted">{t('profile.phoneNumberHelp')}</small>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">{t('profile.language')}</label>
                  <select 
                    name="language"
                    value={editForm.language || 'en'}
                    onChange={handleEditChange}
                    className="form-select"
                  >
                    <option value="en">🇬🇧 {t('languages.english')}</option>
                    <option value="sw">🇰🇪 {t('languages.swahili')}</option>
                    <option value="ar">🇸🇦 {t('languages.arabic')}</option>
                    <option value="fr">🇫🇷 {t('languages.french')}</option>
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">{t('profile.dateOfBirth')}</label>
                  <input 
                    name="dateOfBirth"
                    type="date"
                    value={editForm.dateOfBirth || ''}
                    onChange={handleEditChange}
                    className="form-control"
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">{t('profile.city')}</label>
                  <input 
                    name="city"
                    value={editForm.location?.city || ''}
                    onChange={handleEditChange}
                    className="form-control"
                    placeholder={t('profile.cityPlaceholder')}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label">{t('profile.state')}</label>
                  <input 
                    name="state"
                    value={editForm.location?.state || ''}
                    onChange={handleEditChange}
                    className="form-control"
                    placeholder={t('profile.statePlaceholder')}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">{t('profile.interests')}</label>
                  <div className="interests-grid d-flex flex-wrap gap-2">
                    {availableInterests.map(interest => (
                      <label key={interest} className="form-check form-check-inline">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={editForm.interests?.includes(interest)}
                          onChange={() => handleInterestToggle(interest)}
                        />
                        <span className="form-check-label text-capitalize">{interest}</span>
                      </label>
                    ))}
                  </div>
                  <div className="form-text">{t('profile.interestsHelp')}</div>
                  <input 
                    name="interests"
                    value={Array.isArray(editForm.interests) ? editForm.interests.filter(i => !availableInterests.includes(i)).join(', ') : ''}
                    onChange={(e) => {
                      const customInterests = e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      const selectedPredefined = editForm.interests?.filter(i => availableInterests.includes(i)) || []
                      setEditForm(prev => ({ ...prev, interests: [...selectedPredefined, ...customInterests] }))
                    }}
                    className="form-control mt-2"
                    placeholder={t('profile.customInterestsPlaceholder')}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">{t('profile.education')} *</label>
                  <select 
                    name="educationLevel"
                    value={editForm.educationLevel || ''}
                    onChange={handleEditChange}
                    className="form-select"
                    required
                  >
                    <option value="">{t('profile.selectEducation')}</option>
                    <option value="secondary">🎓 {t('educationLevels.secondary')}</option>
                    <option value="bachelor">🎓 {t('educationLevels.bachelor')}</option>
                    <option value="master">🎓 {t('educationLevels.master')}</option>
                    <option value="phd">🎓 {t('educationLevels.phd')}</option>
                    <option value="other">📚 {t('educationLevels.other')}</option>
                  </select>
                </div>

                {/* Mentor-specific fields */}
                {profile.role === 'mentor' && (
                  <>
                    <div className="col-12 mt-4">
                      <h5 className="border-bottom pb-2">{t('mentor.title')}</h5>
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">{t('profile.professionalTitle')}</label>
                      <input 
                        name="mentor-professionalTitle"
                        value={editForm.mentorProfile?.professionalTitle || ''}
                        onChange={handleEditChange}
                        className="form-control"
                        placeholder={t('profile.professionalTitlePlaceholder')}
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">{t('profile.organization')}</label>
                      <input 
                        name="mentor-organization"
                        value={editForm.mentorProfile?.organization || ''}
                        onChange={handleEditChange}
                        className="form-control"
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">{t('profile.yearsOfExperience')}</label>
                      <input 
                        name="mentor-yearsOfExperience"
   
                        value={editForm.mentorProfile?.yearsOfExperience || 0}
                        onChange={handleEditChange}
                        className="form-control"
                        min="0"
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label">{t('profile.maxMentees')}</label>
                      <input 
                        name="mentor-maxMentees"
                        type="number"
                        value={editForm.mentorProfile?.maxMentees || 5}
                        onChange={handleEditChange}
                        className="form-control"
                        min="1"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">{t('profile.linkedinProfile')}</label>
                      <input 
                        name="mentor-linkedinProfile"
                        type="url"
                        value={editForm.mentorProfile?.linkedinProfile || ''}
                        onChange={handleEditChange}
                        className="form-control"
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">{t('profile.expertise')}</label>
                      <input 
                        name="expertise"
                        value={Array.isArray(editForm.mentorProfile?.expertise) ? editForm.mentorProfile.expertise.join(', ') : ''}
                        onChange={handleEditChange}
                        className="form-control"
                        placeholder={t('profile.expertisePlaceholder')}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">{t('mentor.mentorBio')}</label>
                      <textarea 
                        name="mentor-bio"
                        value={editForm.mentorProfile?.bio || ''}
                        onChange={handleEditChange}
                        className="form-control"
                        rows="4"
                        placeholder={t('mentor.mentorBioPlaceholder')}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="d-flex gap-2 mt-4">
                <button 
                  type="submit" 
                  className={`btn ${styles.brandButton}`} 
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Saving...
                    </>
                  ) : (
                    ' Save Changes'
                  )}
                </button>
                <button 
                  type="button" 
                  className="btn btn-light" 
                  onClick={handleCancel}
                  disabled={saving}
                >
                  ✖️ Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              {/* Basic Info */}
              <div className="row g-3 mb-4">
                <div className="col-12 col-md-6">
                  <div className="info-item">
                    <label className="d-block text-muted small fw-bold">Email:</label>
                    <span>{profile.email || '—'}</span>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="info-item">
                    <label className="d-block text-muted small fw-bold">Phone:</label>
                    <span>{profile.phoneNumber || '—'}</span>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="info-item">
                    <label className="d-block text-muted small fw-bold">Location:</label>
                    <span>
                      {profile.location?.city || profile.location?.state 
                        ? `${profile.location.city}, ${profile.location.state}` 
                        : '—'}
                    </span>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="info-item">
                    <label className="d-block text-muted small fw-bold">Language:</label>
                    <span className="text-capitalize">{profile.language || 'English'}</span>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="info-item">
                    <label className="d-block text-muted small fw-bold">Date of Birth:</label>
                    <span>{profile.dateOfBirth || '—'}</span>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="info-item">
                    <label className="d-block text-muted small fw-bold">Education:</label>
                    <span className="text-capitalize">{profile.educationLevel || '—'}</span>
                  </div>
                </div>
              </div>

              {profile.bio && (
                <div className="info-item mb-4">
                  <label className="d-block text-muted small fw-bold mb-2">Bio:</label>
                  <p className="mb-0">{profile.bio}</p>
                </div>
              )}

              {profile.interests?.length > 0 && (
                <div className="info-item mb-4">
                  <label className="d-block text-muted small fw-bold mb-2">Interests:</label>
                  <div className="interests-tags d-flex flex-wrap gap-2">
                    {profile.interests.map((interest, idx) => (
                      <span key={idx} className="badge bg-light text-dark border tag">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Mentor Profile Section */}
              {profile.role === 'mentor' && profile.mentorProfile && (
                <>
                  <hr className="my-4" />
                  <h5 className="mb-3">Mentor Information</h5>

                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <div className="info-item">
                        <label className="d-block text-muted small fw-bold">Professional Title:</label>
                        <span>{profile.mentorProfile.professionalTitle || '—'}</span>
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <div className="info-item">
                        <label className="d-block text-muted small fw-bold">Organization:</label>
                        <span>{profile.mentorProfile.organization || '—'}</span>
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <div className="info-item">
                        <label className="d-block text-muted small fw-bold">Years of Experience:</label>
                        <span>{profile.mentorProfile.yearsOfExperience || 0} years</span>
                      </div>
                    </div>

                    <div className="col-12 col-md-6">
                      <div className="info-item">
                        <label className="d-block text-muted small fw-bold">Max Mentees:</label>
                        <span>{profile.mentorProfile.maxMentees || 5}</span>
                      </div>
                    </div>

                    {profile.mentorProfile.linkedinProfile && (
                      <div className="col-12">
                        <div className="info-item">
                          <label className="d-block text-muted small fw-bold">LinkedIn:</label>
                          <a href={profile.mentorProfile.linkedinProfile} target="_blank" rel="noopener noreferrer" className="text-primary">
                            View Profile
                          </a>
                        </div>
                      </div>
                    )}

                    {profile.mentorProfile.expertise?.length > 0 && (
                      <div className="col-12">
                        <div className="info-item">
                          <label className="d-block text-muted small fw-bold mb-2">Expertise:</label>
                          <div className="d-flex flex-wrap gap-2">
                            {profile.mentorProfile.expertise.map((exp, i) => (
                              <span key={i} className="badge tag" style={{ background: 'var(--brand-magenta)' }}>
                                {exp}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

