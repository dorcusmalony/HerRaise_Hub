import io from 'socket.io-client'

let socket = null

export const initializeSocket = (token) => {
  if (socket?.connected) {
    console.log('Socket already connected')
    return socket
  }

  const API_URL = import.meta.env.VITE_API_URL || ''
  console.log('🔗 Connecting to socket at:', API_URL)
  const socketUrl = API_URL

  socket = io(socketUrl, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5
  })

  socket.on('connect', () => {
    console.log('✅ Connected to WebSocket:', socket.id)
    socket.emit('authenticate', token)
  })

  socket.on('authenticated', (data) => {
    console.log('🔐 Socket authenticated:', data)
  })

  socket.on('disconnect', (reason) => {
    console.log('❌ Disconnected from WebSocket:', reason)
  })

  socket.on('connect_error', (error) => {
    console.error('🚨 WebSocket connection error:', error)
    console.error('Error details:', error.message, error.type)
  })

  socket.on('reconnect', (attemptNumber) => {
    console.log('🔄 Reconnected after', attemptNumber, 'attempts')
  })

  socket.on('reconnect_error', (error) => {
    console.error('🔄❌ Reconnection failed:', error)
  })

  // Listen for new opportunities
  socket.on('opportunity:new', (data) => {
    console.log(' New opportunity:', data)
    showNotification('New Opportunity', data.title || 'A new opportunity has been posted!')
  })

  // Listen for application status updates
  socket.on('application:status_update', (data) => {
    console.log(' Application status updated:', data)
    showNotification('Application Update', `Your application status: ${data.status}`)
  })

  // Listen for deadline reminders
  socket.on('opportunity:deadline_reminder', (data) => {
    console.log(' Deadline reminder:', data)
    showNotification('Deadline Reminder', data.message || 'Deadline approaching!')
  })

  // Listen for new forum questions
  socket.on('forum:new_question', (data) => {
    console.log(' New forum question:', data)
    showNotification('New Question Posted', `${data.author.name}: ${data.title}`)
  })

  // Listen for answers to your questions
  socket.on('forum:new_answer', (data) => {
    console.log(' New answer:', data)
    showNotification('Someone Answered Your Question', `${data.author.name} answered: ${data.questionTitle}`)
  })

  // Listen for comments on your posts
  socket.on('forum:new_comment', (data) => {
    console.log(' New comment:', data)
    showNotification('New Comment', `${data.author.name} commented on your post`)
  })

  // Listen for opportunity updates
  socket.on('opportunity:updated', (data) => {
    console.log(' Opportunity updated:', data)
    showNotification('Opportunity Updated', `${data.title} has new updates`)
  })

  // Listen for new applications
  socket.on('application:new', (data) => {
    console.log(' New application:', data)
    showNotification('New Application', `Someone applied to ${data.opportunityTitle}`)
  })

  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const getSocket = () => socket



function showNotification(title, message) {
  // Browser notification
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { 
      body: message,
      icon: '/vite.svg' // Update with your app icon
    })
  }

  // In-app notification (you can customize this)
  const event = new CustomEvent('app-notification', {
    detail: { title, message }
  })
  window.dispatchEvent(event)
}

export const requestNotificationPermission = async () => {
  if ('Notification' in window && Notification.permission === 'default') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }
  return Notification.permission === 'granted'
}
