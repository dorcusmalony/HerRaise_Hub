import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './ResourcePage.module.css'

export default function ResourcePage() {
  const { t: _t } = useTranslation()
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const resources = {
    'Career Development': [
      { 
        title: 'CV Templates & Examples', 
        desc: 'Professional CV templates designed for young women entering the workforce.', 
        type: 'PDF', 
        category: 'career',
        icon: '',
        link: '#',
        downloadCount: '2.3k',
        rating: 4.8
      },
      { 
        title: 'Cover Letter Samples', 
        desc: 'Compelling cover letter examples for internships and entry-level positions.', 
        type: 'Article', 
        category: 'career',
        icon: '',
        link: '#',
        downloadCount: '1.8k',
        rating: 4.6
      },
      { 
        title: 'Interview Preparation Guide', 
        desc: 'Complete guide to ace your interviews with confidence and preparation tips.', 
        type: 'PDF', 
        category: 'career',
        icon: '',
        link: '#',
        downloadCount: '3.1k',
        rating: 4.9
      }
    ],
    'Leadership & Skills': [
      { 
        title: 'Leadership Fundamentals', 
        desc: 'Essential leadership skills for young women in professional environments.', 
        type: 'Presentation', 
        category: 'leadership',
        icon: '',
        link: '#',
        downloadCount: '1.5k',
        rating: 4.7
      },
      { 
        title: 'Public Speaking Mastery', 
        desc: 'Overcome speaking anxiety and deliver impactful presentations.', 
        type: 'Video', 
        category: 'leadership',
        icon: '',
        link: '#',
        downloadCount: '2.7k',
        rating: 4.8
      },
      { 
        title: 'How to Break Through Fear and Become a Leader', 
        desc: 'Valerie Montgomery Rice shares insights on overcoming fear and stepping into leadership roles.', 
        type: 'Video', 
        category: 'leadership',
        icon: '',
        link: 'https://youtu.be/5uTDzBwwyho?si=rULBAxanzEoFBxwB',
        downloadCount: '3.2k',
        rating: 4.9
      },
      { 
        title: 'Networking Strategies', 
        desc: 'Build meaningful professional relationships and expand your network.', 
        type: 'Article', 
        category: 'leadership',
        icon: '',
        link: '#',
        downloadCount: '1.9k',
        rating: 4.5
      }
    ],
    'Education & Learning': [
      { 
        title: 'Study Techniques Guide', 
        desc: 'Effective study methods and time management for academic success.', 
        type: 'PDF', 
        category: 'education',
        icon: '',
        link: '#',
        downloadCount: '4.2k',
        rating: 4.9
      },
      { 
        title: 'Scholarship Application Tips', 
        desc: 'Step-by-step guide to writing winning scholarship applications.', 
        type: 'Article', 
        category: 'education',
        icon: '',
        link: '#',
        downloadCount: '3.8k',
        rating: 4.8
      }
    ],
    'Personal Development': [
      { 
        title: 'Goal Setting Workbook', 
        desc: 'Interactive workbook to set and achieve your personal and professional goals.', 
        type: 'Workbook', 
        category: 'personal',
        icon: '',
        link: '#',
        downloadCount: '2.1k',
        rating: 4.6
      },
      { 
        title: 'Confidence Building Guide', 
        desc: 'Practical exercises to build self-confidence and overcome imposter syndrome.', 
        type: 'PDF', 
        category: 'personal',
        icon: '',
        link: '#',
        downloadCount: '2.9k',
        rating: 4.7
      },
      { 
        title: 'Digital Privacy & Safety', 
        desc: 'Learn how to protect yourself online and maintain your digital privacy.', 
        type: 'Video', 
        category: 'personal',
        icon: '',
        link: 'https://youtu.be/5uTDzBwwyho?si=ts2HA8kJhBhcuZ3d',
        downloadCount: '1.2k',
        rating: 4.8
      }
    ]
  }

  // Generate consistent color for each resource matching home page theme
  const getResourceColor = (title) => {
    const colors = [
      '#8B5CF6', '#E84393', '#667eea', '#8B5CF6', 
      '#E84393', '#667eea', '#8B5CF6', '#E84393',
      '#667eea', '#8B5CF6', '#E84393', '#667eea'
    ]
    let hash = 0
    for (let i = 0; i < title.length; i++) {
      hash = title.charCodeAt(i) + ((hash << 5) - hash)
    }
    return colors[Math.abs(hash) % colors.length]
  }

  const getTypeColor = (type) => {
    const colors = {
      'PDF': '#dc3545',
      'Article': '#28a745',
      'Video': '#007bff',
      'Presentation': '#fd7e14',
      'Workbook': '#6f42c1'
    }
    return colors[type] || '#6c757d'
  }

  const getFilteredResources = () => {
    let documentResources = []
    let videoResources = []
    
    Object.entries(resources).forEach(([category, items]) => {
      const categoryItems = items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             item.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             category.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesSearch
      })
      
      if (categoryItems.length > 0) {
        const documents = categoryItems.filter(item => item.type !== 'Video')
        const videos = categoryItems.filter(item => item.type === 'Video')
        
        if (documents.length > 0) {
          documentResources.push([category, documents])
        }
        if (videos.length > 0) {
          videoResources.push([category, videos])
        }
      }
    })
    
    return { documentResources, videoResources }
  }

  return (
    <div className="container py-5">
      {/* Header Section */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-dark mb-3">Resource Library</h1>
        <p className="lead text-muted mb-4">
          Curated resources to empower your journey in education, career, and personal development
        </p>
        
        <div className="row justify-content-center mb-4">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

      </div>

      {/* Document Resources */}
      {getFilteredResources().documentResources.map(([category, items]) => (
        <div key={category} className="mb-5">
          <div className="d-flex align-items-center mb-4">
            <div className="flex-grow-1">
              <h2 className="h3 mb-1 text-dark">{category}</h2>
              <p className="text-muted mb-0">{items.length} resources available</p>
            </div>
          </div>

          <div className="row g-4">
            {items.map((resource, idx) => (
              <div key={idx} className="col-12 col-md-6 col-lg-4">
                <div 
                  className={`card h-100 shadow-sm border-0 ${styles.hoverShadow} ${styles.transitionAll} ${styles.zoomCard}`}
                  style={{
                    borderLeft: `4px solid ${getResourceColor(resource.title)}`,
                    background: `linear-gradient(135deg, ${getResourceColor(resource.title)}40, ${getResourceColor(resource.title)}20, white)`
                  }}
                >
                  <div className="card-body p-4">

                    
                    <h5 className="card-title mb-2 text-dark">{resource.title}</h5>
                    <p className={`card-text text-muted small mb-3 ${styles.lineHeightRelaxed}`}>
                      {resource.desc}
                    </p>
                    

                    
                    <div className="d-grid gap-2">
                      <a 
                        href={resource.link} 
                        className={`btn btn-sm ${styles.resourceButton}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Access Resource
                      </a>
                    </div>
                    

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Video Resources Section */}
      {getFilteredResources().videoResources.length > 0 && (
        <div className="mb-5">
          <div className="d-flex align-items-center mb-4">
            <div className="flex-grow-1">
              <h2 className="h3 mb-1 text-dark">Video Resources</h2>
              <p className="text-muted mb-0">
                {getFilteredResources().videoResources.reduce((total, [, items]) => total + items.length, 0)} videos available
              </p>
            </div>
          </div>

          {getFilteredResources().videoResources.map(([category, items]) => (
            <div key={category} className="mb-4">
              <h3 className="h5 mb-3 text-secondary">{category}</h3>
              <div className="row g-4">
                {items.map((resource, idx) => (
                  <div key={idx} className="col-12 col-md-6 col-lg-4">
                    <div 
                      className={`card h-100 shadow-sm border-0 ${styles.hoverShadow} ${styles.transitionAll} ${styles.zoomCard}`}
                      style={{
                        borderLeft: `4px solid ${getResourceColor(resource.title)}`,
                        background: `linear-gradient(135deg, ${getResourceColor(resource.title)}40, ${getResourceColor(resource.title)}20, white)`
                      }}
                    >
                      <div className="card-body p-4">

                        
                        <h5 className="card-title mb-2 text-dark">{resource.title}</h5>
                        <p className={`card-text text-muted small mb-3 ${styles.lineHeightRelaxed}`}>
                          {resource.desc}
                        </p>
                        

                        
                        <div className="d-grid gap-2">
                          <a 
                            href={resource.link} 
                            className={`btn btn-sm ${styles.resourceButton}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Watch Video
                          </a>
                        </div>
                        

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {getFilteredResources().documentResources.length === 0 && getFilteredResources().videoResources.length === 0 && searchTerm && (
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="fas fa-search fa-3x text-muted mb-3"></i>
            <h4 className="text-muted">No resources found</h4>
            <p className="text-muted">Try adjusting your search criteria</p>
          </div>
        </div>
      )}


    </div>
  )
}
