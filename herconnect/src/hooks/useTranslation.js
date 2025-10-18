export function useTranslation() {
  // Simple translation function - returns English text by default
  // You can expand this to support multiple languages later
  const translations = {
    'profile.mentee': 'Mentee',
    'profile.mentor': 'Mentor',
    'profile.admin': 'Admin',
    'profile.level': 'Level',
    'profile.points': 'Points',
    'profile.status': 'Status',
    'profile.verified': 'Verified',
    'common.error': 'Error',
    'common.success': 'Success',
    'profile.editProfile': 'Edit Profile',
    'profile.changePassword': 'Change Password',
    'profile.name': 'Name',
    'profile.email': 'Email',
    'profile.bio': 'Bio',
    'profile.bioPlaceholder': 'Tell us about yourself...',
    'profile.phoneNumber': 'Phone Number',
    'profile.phoneNumberHint': 'Enter phone number with country code',
    'profile.phoneNumberHelp': 'Include country code, e.g., +254 712 345 678',
    'profile.language': 'Language',
    'languages.english': 'English',
    'languages.swahili': 'Swahili',
    'languages.arabic': 'Arabic',
    'languages.french': 'French',
    'profile.dateOfBirth': 'Date of Birth',
    'profile.city': 'City',
    'profile.cityPlaceholder': 'e.g., Nairobi',
    'profile.state': 'State/Country',
    'profile.statePlaceholder': 'e.g., Kenya',
    'profile.interests': 'Interests',
    'profile.interestsHelp': 'Select topics you\'re interested in',
    'profile.customInterestsPlaceholder': 'Add custom interests (comma-separated)',
    'profile.education': 'Education Level',
    'profile.selectEducation': 'Select your education level',
    'educationLevels.secondary': 'Secondary School',
    'educationLevels.bachelor': 'Bachelor\'s Degree',
    'educationLevels.master': 'Master\'s Degree',
    'educationLevels.phd': 'PhD',
    'educationLevels.other': 'Other',
    'mentor.title': 'Mentor Information',
    'profile.professionalTitle': 'Professional Title',
    'profile.professionalTitlePlaceholder': 'e.g., Software Engineer',
    'profile.organization': 'Organization',
    'profile.yearsOfExperience': 'Years of Experience',
    'profile.maxMentees': 'Max Mentees',
    'profile.linkedinProfile': 'LinkedIn Profile',
    'profile.expertise': 'Expertise',
    'profile.expertisePlaceholder': 'e.g., Web Development, Career Coaching',
    'mentor.mentorBio': 'Mentor Bio',
    'mentor.mentorBioPlaceholder': 'Describe your experience and what you can help mentees with...'
  }

  const t = (key) => {
    return translations[key] || key
  }

  return { t }
}
