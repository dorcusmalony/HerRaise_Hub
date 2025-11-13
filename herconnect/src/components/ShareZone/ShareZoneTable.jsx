import { useState, useEffect } from 'react'
import './ShareZoneTable.css'

const SHAREZONE_CATEGORIES = {
  'essays': 'Essays',
  'projects': 'Projects', 
  'videos': 'Videos',
  'resumes': 'Resumes',
  'cover-letters': 'Cover Letters',
  'project': 'Project',
  'essay': 'Essay',
  'resume': 'Resume',
  'video': 'Video',
  'document': 'Document',
  'other': 'Other'
}

const ShareZoneTable = ({ contents, currentUser, onCommentToggle, onDeletePost, onEditPost }) => {
  const [sortBy, setSortBy] = useState('date')
  const [filterCategory, setFilterCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [openDropdown, setOpenDropdown] = useState(null)

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null)
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const filteredAndSortedContents = contents
    .filter(content => {
      const matchesCategory = !filterCategory || content.category === filterCategory
      const matchesSearch = !searchTerm || 
        content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        content.author?.name.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'author':
          return (a.author?.name || '').localeCompare(b.author?.name || '')
        case 'category':
          return a.category.localeCompare(b.category)
        case 'comments':
          return (b.ShareZoneComments?.length || 0) - (a.ShareZoneComments?.length || 0)
        default:
          return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const truncateText = (text, maxLength = 50) => {
    if (!text) return ''
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  return (
    <div className="sharezone-table-container">
      <div className="table-controls">
        <div className="search-filter-row">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {Object.entries(SHAREZONE_CATEGORIES).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
            <option value="author">Sort by Author</option>
            <option value="category">Sort by Category</option>
            <option value="comments">Sort by Comments</option>
          </select>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="sharezone-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Author</th>
              <th>Date</th>
              <th>File</th>
              <th>Comments</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedContents.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  {contents.length === 0 ? 'No content shared yet' : 'No content matches your filters'}
                </td>
              </tr>
            ) : (
              filteredAndSortedContents.map(content => (
                <tr key={content._id} className="content-row">
                  <td className="title-cell">
                    <div className="title-content">
                      <h6 className="content-title">{content.title}</h6>
                      {content.content && (
                        <p className="content-description">
                          {truncateText(content.content, 80)}
                        </p>
                      )}
                    </div>
                  </td>
                  
                  <td className="category-cell">
                    <span className={`category-badge category-${content.category}`}>
                      {SHAREZONE_CATEGORIES[content.category] || content.category}
                    </span>
                  </td>
                  
                  <td className="author-cell">
                    <div className="author-info">
                      <img 
                        src={content.author?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(content.author?.name || 'User')}&background=8B5CF6&color=fff`}
                        alt={content.author?.name}
                        className="author-avatar"
                      />
                      <span className="author-name">
                        {content.author?.name || 'Anonymous'}
                      </span>
                    </div>
                  </td>
                  
                  <td className="date-cell">
                    {formatDate(content.createdAt)}
                  </td>
                  
                  <td className="file-cell">
                    {content.fileUrl ? (
                      <a 
                        href={content.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="file-link"
                      >
                        View File
                      </a>
                    ) : (
                      <span className="no-file">No file</span>
                    )}
                  </td>
                  
                  <td className="comments-cell">
                    <button 
                      className="comments-btn"
                      onClick={() => onCommentToggle(content._id)}
                    >
                      Comments ({content.ShareZoneComments?.length || 0})
                    </button>
                  </td>
                  
                  <td className="actions-cell">
                    {content.author?._id === currentUser?.id ? (
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button 
                          style={{
                            padding: '0.3rem 0.6rem',
                            backgroundColor: '#e84393',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                          }}
                          onClick={() => onEditPost(content._id)}
                        >
                          Edit
                        </button>
                        <button 
                          style={{
                            padding: '0.3rem 0.6rem',
                            backgroundColor: '#333333',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                          }}
                          onClick={() => onDeletePost(content._id)}
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <span style={{ color: '#6c757d' }}>-</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <span className="results-count">
          Showing {filteredAndSortedContents.length} of {contents.length} posts
        </span>
      </div>
    </div>
  )
}

export default ShareZoneTable