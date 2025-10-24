import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './AdminDashboard.module.css'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const API = import.meta.env.VITE_API_URL || ''
  
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  
  // Data states
  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState([])
  const [resources, setResources] = useState([])
  
  // Form states
  const [showResourceForm, setShowResourceForm] = useState(false)
  const [editingResource, setEditingResource] = useState(null)
  const [resourceForm, setResourceForm] = useState({
    title: '',
    description: '',
    type: 'PDF',
    url: '',
    category: 'career'
  })

  const fetchAdminData = useCallback(async (token) => {
    try {
      const [postsRes, usersRes, resourcesRes] = await Promise.all([
        fetch(`${API}/api/forum/posts?limit=50`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API}/api/admin/users`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API}/api/resources`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      if (postsRes.ok) {
        const data = await postsRes.json()
        setPosts(data.posts || [])
      }
      if (usersRes.ok) {
        const data = await usersRes.json()
        setUsers(data.users || [])
      }
      if (resourcesRes.ok) {
        const data = await resourcesRes.json()
        setResources(data.resources || [])
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
    }
  }, [API])

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token) {
      navigate('/')
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.role !== 'admin') {
        navigate('/dashboard')
        return
      }
      setUser(parsedUser)
      fetchAdminData(token)
    } catch (e) {
      navigate('/')
    }

    setLoading(false)
  }, [navigate, fetchAdminData])

  const handleDeletePost = async (postId) => {
    if (!confirm('Delete this post? This action cannot be undone.')) return
    
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`${API}/api/forum/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        setPosts(prev => prev.filter(p => p.id !== postId))
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const handleResourceSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    
    try {
      const method = editingResource ? 'PUT' : 'POST'
      const url = editingResource 
        ? `${API}/api/resources/${editingResource.id}`
        : `${API}/api/resources`
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(resourceForm)
      })

      if (response.ok) {
        const data = await response.json()
        if (editingResource) {
          setResources(prev => prev.map(r => r.id === editingResource.id ? data : r))
        } else {
          setResources(prev => [...prev, data])
        }
        
        setShowResourceForm(false)
        setEditingResource(null)
        setResourceForm({ title: '', description: '', type: 'PDF', url: '', category: 'career' })
      }
    } catch (error) {
      console.error('Error saving resource:', error)
    }
  }

  const handleDeleteResource = async (resourceId) => {
    if (!confirm('Delete this resource?')) return
    
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`${API}/api/resources/${resourceId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        setResources(prev => prev.filter(r => r.id !== resourceId))
      }
    } catch (error) {
      console.error('Error deleting resource:', error)
    }
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminHeader}>
        <h1 className={styles.adminTitle}>👑 Admin Dashboard</h1>
        <p className={styles.adminSubtitle}>Welcome back, {user?.name}</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.purple}`}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statValue}>{users.length}</div>
          <div className={styles.statLabel}>Total Users</div>
        </div>
        <div className={`${styles.statCard} ${styles.pink}`}>
          <div className={styles.statIcon}>💬</div>
          <div className={styles.statValue}>{posts.length}</div>
          <div className={styles.statLabel}>Forum Posts</div>
        </div>
        <div className={`${styles.statCard} ${styles.blue}`}>
          <div className={styles.statIcon}>📚</div>
          <div className={styles.statValue}>{resources.length}</div>
          <div className={styles.statLabel}>Resources</div>
        </div>
      </div>

      <div className={styles.tabNav}>
        {['overview', 'posts', 'users', 'resources'].map(tab => (
          <button
            key={tab}
            className={`${styles.tabBtn} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'overview' && (
          <div className={styles.overviewGrid}>
            <div className={styles.overviewCard}>
              <h3>📊 Recent Activity</h3>
              <p>Latest posts and user registrations</p>
            </div>
            <div className={styles.overviewCard}>
              <h3>✅ System Health</h3>
              <p>All systems operational</p>
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div className={styles.postsSection}>
            <h3>💬 Forum Posts Management</h3>
            <div className={styles.postsList}>
              {posts.map(post => (
                <div key={post.id} className={styles.postItem}>
                  <div className={styles.postInfo}>
                    <h4>{post.title}</h4>
                    <p>By {post.author?.name} • {new Date(post.createdAt).toLocaleDateString()}</p>
                    <span className={`${styles.badge} ${styles[post.type]}`}>{post.type}</span>
                  </div>
                  <button 
                    onClick={() => handleDeletePost(post.id)}
                    className={styles.deleteBtn}
                  >
                    🗑️ Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className={styles.usersSection}>
            <h3>👥 Users Management</h3>
            <div className={styles.usersList}>
              {users.map(user => (
                <div key={user.id} className={styles.userItem}>
                  <div className={styles.userInfo}>
                    <h4>{user.name}</h4>
                    <p>{user.email}</p>
                    <span className={`${styles.badge} ${styles[user.role]}`}>{user.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className={styles.resourcesSection}>
            <div className={styles.sectionHeader}>
              <h3>📚 Resources Management</h3>
              <button 
                onClick={() => setShowResourceForm(true)}
                className={styles.addBtn}
              >
                ➕ Add Resource
              </button>
            </div>

            {showResourceForm && (
              <form onSubmit={handleResourceSubmit} className={styles.resourceForm}>
                <input
                  type="text"
                  placeholder="Resource Title"
                  value={resourceForm.title}
                  onChange={(e) => setResourceForm(prev => ({...prev, title: e.target.value}))}
                  required
                />
                <textarea
                  placeholder="Description"
                  value={resourceForm.description}
                  onChange={(e) => setResourceForm(prev => ({...prev, description: e.target.value}))}
                  required
                />
                <select
                  value={resourceForm.type}
                  onChange={(e) => setResourceForm(prev => ({...prev, type: e.target.value}))}
                >
                  <option value="PDF">PDF</option>
                  <option value="Article">Article</option>
                  <option value="Video">Video</option>
                </select>
                <input
                  type="url"
                  placeholder="Resource URL"
                  value={resourceForm.url}
                  onChange={(e) => setResourceForm(prev => ({...prev, url: e.target.value}))}
                  required
                />
                <div className={styles.formActions}>
                  <button type="submit" className={styles.saveBtn}>
                    {editingResource ? 'Update' : 'Create'} Resource
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setShowResourceForm(false)
                      setEditingResource(null)
                      setResourceForm({ title: '', description: '', type: 'PDF', url: '', category: 'career' })
                    }}
                    className={styles.cancelBtn}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className={styles.resourcesList}>
              {resources.map(resource => (
                <div key={resource.id} className={styles.resourceItem}>
                  <div className={styles.resourceInfo}>
                    <h4>{resource.title}</h4>
                    <p>{resource.description}</p>
                    <span className={`${styles.badge} ${styles[resource.type?.toLowerCase()]}`}>
                      {resource.type}
                    </span>
                  </div>
                  <div className={styles.resourceActions}>
                    <button 
                      onClick={() => {
                        setEditingResource(resource)
                        setResourceForm(resource)
                        setShowResourceForm(true)
                      }}
                      className={styles.editBtn}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteResource(resource.id)}
                      className={styles.deleteBtn}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}