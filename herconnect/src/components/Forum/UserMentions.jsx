import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import styles from './UserMentions.module.css'

export default function UserMentions({ 
  value, 
  onChange, 
  onMentionsChange, 
  categoryId, 
  placeholder,
  className = '',
  rows = 3 
}) {
  const { t } = useLanguage()
  const API = import.meta.env.VITE_API_URL || ''
  const textareaRef = useRef(null)
  
  const [showDropdown, setShowDropdown] = useState(false)
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [cursorPosition, setCursorPosition] = useState(0)
  const [mentions, setMentions] = useState([])

  // Fetch taggable users
  const fetchUsers = async (search = '') => {
    if (!categoryId) return
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(
        `${API}/api/forum/categories/${categoryId}/taggable-users?search=${search}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  // Handle text change and detect @ mentions
  const handleTextChange = (e) => {
    const text = e.target.value
    const cursorPos = e.target.selectionStart
    
    onChange(text)
    setCursorPosition(cursorPos)
    
    // Check if @ was typed
    const beforeCursor = text.substring(0, cursorPos)
    const atMatch = beforeCursor.match(/@(\w*)$/)
    
    if (atMatch) {
      setSearchTerm(atMatch[1])
      setShowDropdown(true)
      fetchUsers(atMatch[1])
    } else {
      setShowDropdown(false)
    }
  }

  // Select user from dropdown
  const selectUser = (user) => {
    const beforeCursor = value.substring(0, cursorPosition)
    const afterCursor = value.substring(cursorPosition)
    
    // Replace @search with @username
    const atMatch = beforeCursor.match(/@(\w*)$/)
    if (atMatch) {
      const newBefore = beforeCursor.replace(/@(\w*)$/, `@${user.name} `)
      const newText = newBefore + afterCursor
      
      onChange(newText)
      
      // Add to mentions
      const newMentions = [...mentions, user.id]
      setMentions(newMentions)
      onMentionsChange(newMentions)
      
      setShowDropdown(false)
      
      // Focus back to textarea
      setTimeout(() => {
        textareaRef.current?.focus()
        const newCursorPos = newBefore.length
        textareaRef.current?.setSelectionRange(newCursorPos, newCursorPos)
      }, 0)
    }
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-mentions-container')) {
        setShowDropdown(false)
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <div className={`user-mentions-container ${styles.container}`}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleTextChange}
        placeholder={placeholder}
        rows={rows}
        className={`${styles.textarea} ${className}`}
      />
      
      {showDropdown && users.length > 0 && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            {t('Mention users')}
          </div>
          {users.slice(0, 5).map(user => (
            <div
              key={user.id}
              className={styles.userItem}
              onClick={() => selectUser(user)}
            >
              <img
                src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=8B5CF6&color=fff`}
                alt={user.name}
                className={styles.userAvatar}
              />
              <div className={styles.userInfo}>
                <div className={styles.userName}>{user.name}</div>
                <div className={styles.userRole}>{user.role || 'Member'}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}