import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './dashboard.module.css'

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
      // Not logged in, redirect to home page
      navigate('/', { replace: true })
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      fetchDashboardData(token)
    } catch (e) {
      console.error('Error parsing user data:', e)
      navigate('/', { replace: true })
    }

    setLoading(false)
  }, [navigate, fetchDashboardData])

  if (loading) {
    return (
      <div className={styles.container}>
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Welcome Section */}
      <div className={styles.welcomeSection}>
        <h1 className={styles.welcomeTitle}>Welcome back, {user?.name}! </h1>
        <p className={styles.welcomeSubtitle}>
          {user?.role === 'mentor' 
            ? 'Ready to inspire and guide young women today?' 
            : 'Discover opportunities and connect with mentors!'}
        </p>
      </div>

      {/* Quick Stats */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.purple}`}>
          <span className={styles.statIcon}></span>
          <h3 className={styles.statValue}>{user?.totalPoints || 0}</h3>
          <p className={styles.statLabel}>Points Earned</p>
        </div>
        <div className={`${styles.statCard} ${styles.blue}`}>
          <span className={styles.statIcon}>⭐</span>
          <h3 className={styles.statValue}>Level {user?.level || 1}</h3>
          <p className={styles.statLabel}>Your Level</p>
        </div>
        <div className={`${styles.statCard} ${styles.pink}`}>
          <span className={styles.statIcon}></span>
          <h3 className={styles.statValue}>{recentPosts.length}</h3>
          <p className={styles.statLabel}>Forum Posts</p>
        </div>
        <div className={`${styles.statCard} ${styles.green}`}>
          <span className={styles.statIcon}>💾</span>
          <h3 className={styles.statValue}>0</h3>
          <p className={styles.statLabel}>Saved Items</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className={styles.contentGrid}>
        {/* Forum Section */}
        <div className={`${styles.featureCard} ${styles.purple}`}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>💬 Recent Discussions</h3>
            <Link to="/forum" className={styles.viewAllBtn}>View All</Link>
          </div>
          <div className={styles.cardBody}>
            {recentPosts.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}></div>
                <h4 className={styles.emptyTitle}>No recent discussions yet</h4>
                <p className={styles.emptyDescription}>Start engaging with the community!</p>
                <Link to="/forum" className={styles.emptyAction}>
                  Join Forum
                </Link>
              </div>
            ) : (
              <div>
                {recentPosts.map(post => (
                  <div key={post.id} className={styles.listItem}>
                    <div className={styles.listItemHeader}>
                      <div>
                        <h6 className={styles.listItemTitle}>{post.title}</h6>
                        <p className={styles.listItemMeta}>
                          by {post.author?.name} • {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`${styles.listItemBadge} ${styles.purple}`}>{post.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Sidebar */}
        <div className={styles.quickActions}>
          <Link to="/profile" className={`${styles.actionCard} ${styles.purple}`}>
            <span className={styles.actionIcon}></span>
            <h4 className={styles.actionTitle}>My Profile</h4>
            <p className={styles.actionDescription}>View and edit your profile</p>
          </Link>
          
          <Link to="/forum" className={`${styles.actionCard} ${styles.blue}`}>
            <span className={styles.actionIcon}></span>
            <h4 className={styles.actionTitle}>Forum</h4>
            <p className={styles.actionDescription}>Join discussions</p>
          </Link>
          
          <Link to="/opportunities" className={`${styles.actionCard} ${styles.pink}`}>
            <span className={styles.actionIcon}></span>
            <h4 className={styles.actionTitle}>Opportunities</h4>
            <p className={styles.actionDescription}>Find internships & scholarships</p>
          </Link>
          
          <Link to="/resources" className={`${styles.actionCard} ${styles.green}`}>
            <span className={styles.actionIcon}>📚</span>
            <h4 className={styles.actionTitle}>Resources</h4>
            <p className={styles.actionDescription}>Access learning materials</p>
          </Link>
          
          {user?.role === 'mentor' && (
            <Link to="/mentor/dashboard" className={`${styles.actionCard} ${styles.purple}`}>
              <span className={styles.actionIcon}>🌟</span>
              <h4 className={styles.actionTitle}>Mentor Tools</h4>
              <p className={styles.actionDescription}>Manage your mentees</p>
            </Link>
          )}
        </div>
      </div>
      
      {/* Bottom Section */}
      <div className={styles.bottomGrid}>
        {/* Opportunities Section */}
        <div className={`${styles.featureCard} ${styles.blue}`}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}> Latest Opportunities</h3>
            <Link to="/opportunities" className={styles.viewAllBtn}>Browse All</Link>
          </div>
          <div className={styles.cardBody}>
            {latestOpportunities.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}></div>
                <h4 className={styles.emptyTitle}>No opportunities yet</h4>
                <p className={styles.emptyDescription}>Check back soon for internships and scholarships!</p>
                <Link to="/opportunities" className={styles.emptyAction}>
                  Browse Opportunities
                </Link>
              </div>
            ) : (
              <div>
                {latestOpportunities.map((opp, idx) => (
                  <div key={idx} className={styles.listItem}>
                    <div className={styles.listItemHeader}>
                      <div>
                        <h6 className={styles.listItemTitle}>{opp.title}</h6>
                        <p className={styles.listItemMeta}>{opp.organization}</p>
                      </div>
                      <span className={`${styles.listItemBadge} ${styles.blue}`}>{opp.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Resources Section */}
        <div className={`${styles.featureCard} ${styles.pink}`}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>📚 Recommended Resources</h3>
            <Link to="/resources" className={styles.viewAllBtn}>View All</Link>
          </div>
          <div className={styles.cardBody}>
            <div>
              {recommendedResources.map((resource, idx) => (
                <div key={idx} className={styles.listItem}>
                  <div className={styles.listItemHeader}>
                    <div>
                      <h6 className={styles.listItemTitle}>{resource.title}</h6>
                    </div>
                    <span className={`${styles.listItemBadge} ${styles.pink}`}>{resource.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}