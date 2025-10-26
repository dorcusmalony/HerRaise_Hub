import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function ResourcePage() {
  const { t } = useTranslation()
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const resources = {
    'Career Development': [
      { 
        title: 'CV Templates & Examples', 
        desc: 'Professional CV templates designed for young women entering the workforce.', 
        type: 'PDF', 
        category: 'career',
        icon: '📄',
        link: '#',
        downloadCount: '2.3k',
        rating: 4.8
      },
      { 
        title: 'Cover Letter Samples', 
        desc: 'Compelling cover letter examples for internships and entry-level positions.', 
        type: 'Article', 
        category: 'career',
        icon: '📝',
        link: '#',
        downloadCount: '1.8k',
        rating: 4.6
      },
      { 
        title: 'Interview Preparation Guide', 
        desc: 'Complete guide to ace your interviews with confidence and preparation tips.', 
        type: 'PDF', 
        category: 'career',
        icon: '🎯',
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
        icon: '👑',
        link: '#',
        downloadCount: '1.5k',
        rating: 4.7
      },
      { 
        title: 'Public Speaking Mastery', 
        desc: 'Overcome speaking anxiety and deliver impactful presentations.', 
        type: 'Video', 
        category: 'leadership',
        icon: '🎤',
        link: '#',
        downloadCount: '2.7k',
        rating: 4.8
      },
      { 
        title: 'Networking Strategies', 
        desc: 'Build meaningful professional relationships and expand your network.', 
        type: 'Article', 
        category: 'leadership',
        icon: '🤝',
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
        icon: '📚',
        link: '#',
        downloadCount: '4.2k',
        rating: 4.9
      },
      { 
        title: 'Scholarship Application Tips', 
        desc: 'Step-by-step guide to writing winning scholarship applications.', 
        type: 'Article', 
        category: 'education',
        icon: '🎓',
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
        icon: '🎯',
        link: '#',
        downloadCount: '2.1k',
        rating: 4.6
      },
      { 
        title: 'Confidence Building Guide', 
        desc: 'Practical exercises to build self-confidence and overcome imposter syndrome.', 
        type: 'PDF', 
        category: 'personal',
        icon: '💪',
        link: '#',
        downloadCount: '2.9k',
        rating: 4.7
      }
    ]
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
    let filtered = []
    Object.entries(resources).forEach(([category, items]) => {
      const categoryItems = items.filter(item => {
        const matchesFilter = activeFilter === 'all' || item.category === activeFilter
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             item.desc.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesFilter && matchesSearch
      })
      if (categoryItems.length > 0) {
        filtered.push([category, categoryItems])
      }
    })
    return filtered
  }

  return (
    <div className="container py-5">
      {/* Header Section */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary mb-3">📚 Resource Library</h1>
        <p className="lead text-muted mb-4">
          Curated resources to empower your journey in education, career, and personal development
        </p>
        
        {/* Search Bar */}
        <div className="row justify-content-center mb-4">
          <div className="col-md-6">
            <div className="input-group input-group-lg">
              <span className="input-group-text bg-white border-end-0">
                <i className="fas fa-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
          {['all', 'career', 'leadership', 'education', 'personal'].map(filter => (
            <button
              key={filter}
              className={`btn ${
                activeFilter === filter ? 'btn-primary' : 'btn-outline-primary'
              } btn-sm px-3`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter === 'all' ? 'All Resources' : 
               filter === 'career' ? '💼 Career' :
               filter === 'leadership' ? '👑 Leadership' :
               filter === 'education' ? '🎓 Education' : '🌟 Personal'}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      {getFilteredResources().map(([category, items]) => (
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
                <div className="card h-100 shadow-sm border-0 hover-shadow transition-all">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="resource-icon">
                        <span style={{ fontSize: '2rem' }}>{resource.icon}</span>
                      </div>
                      <span 
                        className="badge px-2 py-1 text-white fw-normal"
                        style={{ backgroundColor: getTypeColor(resource.type) }}
                      >
                        {resource.type}
                      </span>
                    </div>
                    
                    <h5 className="card-title mb-2 text-dark">{resource.title}</h5>
                    <p className="card-text text-muted small mb-3 line-height-relaxed">
                      {resource.desc}
                    </p>
                    
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <span className="text-warning">{'★'.repeat(Math.floor(resource.rating))}</span>
                        <small className="text-muted">{resource.rating}</small>
                      </div>
                      <small className="text-muted">
                        <i className="fas fa-download me-1"></i>
                        {resource.downloadCount}
                      </small>
                    </div>
                    
                    <div className="d-grid gap-2">
                      <a 
                        href={resource.link} 
                        className="btn btn-primary btn-sm"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fas fa-external-link-alt me-2"></i>
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

      {/* Empty State */}
      {getFilteredResources().length === 0 && (
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="fas fa-search fa-3x text-muted mb-3"></i>
            <h4 className="text-muted">No resources found</h4>
            <p className="text-muted">Try adjusting your search or filter criteria</p>
          </div>
          <button 
            className="btn btn-outline-primary"
            onClick={() => {
              setSearchTerm('')
              setActiveFilter('all')
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      <style jsx>{`
        .hover-shadow {
          transition: all 0.3s ease;
        }
        .hover-shadow:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15) !important;
        }
        .transition-all {
          transition: all 0.3s ease;
        }
        .line-height-relaxed {
          line-height: 1.6;
        }
        .resource-icon {
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(13, 110, 253, 0.1);
          border-radius: 12px;
        }
      `}</style>
    </div>
  )
}