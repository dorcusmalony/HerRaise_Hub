import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from '../../styles/Pages.module.css'

export default function Dashboard() {
  const navigate = useNavigate()
  const API = import.meta.env.VITE_API_URL || ''
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [recentPosts, setRecentPosts] = useState([])
  const [latestOpportunities, setLatestOpportunities] = useState([])
  const [recommendedResources, setRecommendedResources] = useState([])

  const fetchDashboardData = useCallback(async (token) => {
    // Fetch recent forum posts
    try {
      const postsRes = await fetch(`${API}/api/forum/posts?limit=3&sort=recent`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (postsRes.ok) {
        const data = await postsRes.json()
        setRecentPosts(data.posts || [])
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    }

    // Fetch latest opportunities
    try {
      const oppRes = await fetch(`${API}/api/opportunities?limit=3`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (oppRes.ok) {
        const data = await oppRes.json()
        setLatestOpportunities(data.opportunities || [])
      }
    } catch (error) {
      console.error('Error fetching opportunities:', error)
    }

    // Set static recommended resources (from ResourcePage)
    setRecommendedResources([
      { title: 'CV Templates & Examples', type: 'PDF', link: '#' },
      { title: 'Leadership Fundamentals', type: 'Presentation', link: '#' },
      { title: 'Resume Writing Best Practices', type: 'Article', link: '#' }
    ])
  }, [API])

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token) {
      // Not logged in, redirect to login
      navigate('/login', { replace: true })
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      fetchDashboardData(token)
    } catch (e) {
      console.error('Error parsing user data:', e)
      navigate('/login', { replace: true })
    }

    setLoading(false)
  }, [navigate, fetchDashboardData])

  if (loading) {
    return (
      <div className={`mx-auto ${styles.container}`}>
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`mx-auto ${styles.container}`}>
      {/* Welcome Section */}
      <div className="mb-4">
        <h2>Welcome back, {user?.name}! 👋</h2>
        <p className="text-muted">
          {user?.role === 'mentor' 
            ? 'Ready to inspire and guide young women today?' 
            : 'Discover opportunities and connect with mentors!'}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="row mb-4 g-3">
        <div className="col-md-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <h3 className="text-primary mb-1">{user?.totalPoints || 0}</h3>
              <small className="text-muted">Points</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <h3 className="text-success mb-1">Level {user?.level || 1}</h3>
              <small className="text-muted">Your Level</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <h3 className="text-info mb-1">{recentPosts.length}</h3>
              <small className="text-muted">My Posts</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center h-100">
            <div className="card-body">
              <h3 className="text-warning mb-1">0</h3>
              <small className="text-muted">Saved</small>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="row g-4">
        {/* Forum Section */}
        <div className="col-lg-8">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">🗨️ Recent Discussions</h5>
              <Link to="/forum" className="btn btn-sm btn-primary">View All</Link>
            </div>
            <div className="card-body">
              {recentPosts.length === 0 ? (
                <div className="text-center text-muted py-4">
                  <p className="mb-3">No recent discussions yet.</p>
                  <Link to="/forum/create" className="btn btn-outline-primary">
                    Start a Discussion
                  </Link>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {recentPosts.map(post => (
                    <Link 
                      key={post.id} 
                      to={`/forum/post/${post.id}`}
                      className="list-group-item list-group-item-action"
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{post.title}</h6>
                          <small className="text-muted">
                            by {post.author?.name} • {new Date(post.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                        <span className="badge bg-primary">{post.type}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Links Sidebar */}
        <div className="col-lg-4">
          <div className="card mb-3">
            <div className="card-header">
              <h6 className="mb-0">Quick Actions</h6>
            </div>
            <div className="list-group list-group-flush">
              <Link to="/profile" className="list-group-item list-group-item-action">
                👤 My Profile
              </Link>
              <Link to="/forum" className="list-group-item list-group-item-action">
                🗨️ Forum
              </Link>
              <Link to="/opportunities" className="list-group-item list-group-item-action">
                🎯 Opportunities
              </Link>
              <Link to="/resources" className="list-group-item list-group-item-action">
                📚 Resources
              </Link>
            </div>
          </div>

          {/* Mentor Badge (if user is mentor) */}
          {user?.role === 'mentor' && (
            <div className="card border-primary">
              <div className="card-body">
                <h6 className="card-title">🌟 Mentor Dashboard</h6>
                <p className="card-text small text-muted">
                  Access mentor-specific features and manage your mentees.
                </p>
                <Link to="/mentor/dashboard" className="btn btn-sm btn-primary w-100">
                  Go to Mentor Tools
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Opportunities Section */}
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">🎯 Latest Opportunities</h5>
              <Link to="/opportunities" className="btn btn-sm btn-success">Browse</Link>
            </div>
            <div className="card-body">
              {latestOpportunities.length === 0 ? (
                <div className="text-center text-muted py-4">
                  <p className="mb-3">No opportunities posted yet.</p>
                  <small>Check back soon for internships, scholarships, and events!</small>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {latestOpportunities.map((opp, idx) => (
                    <div key={idx} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">{opp.title}</h6>
                          <small className="text-muted">{opp.organization}</small>
                        </div>
                        <span className="badge bg-success">{opp.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Resources Section */}
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">📚 Recommended Resources</h5>
              <Link to="/resources" className="btn btn-sm btn-info">View All</Link>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                {recommendedResources.map((resource, idx) => (
                  <a 
                    key={idx} 
                    href={resource.link}
                    className="list-group-item list-group-item-action"
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <span>{resource.title}</span>
                      <span className="badge bg-light text-dark">{resource.type}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}