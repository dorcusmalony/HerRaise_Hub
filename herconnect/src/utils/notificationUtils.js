import { getSocket } from '../services/socketService'

// Trigger notification when user posts in forum
export const notifyForumPost = (postData) => {
  const socket = getSocket()
  if (socket) {
    socket.emit('forum:post_created', postData)
  }
  
  // Show immediate feedback to poster
  window.dispatchEvent(new CustomEvent('show-notification', {
    detail: {
      type: 'success',
      title: '✅ Post Published',
      message: 'Your post has been shared with the community!',
      priority: 'normal'
    }
  }))
}

// Trigger notification when opportunity is updated
export const notifyOpportunityUpdate = (opportunityData) => {
  const socket = getSocket()
  if (socket) {
    socket.emit('opportunity:updated', opportunityData)
  }
  
  // Show immediate feedback
  window.dispatchEvent(new CustomEvent('show-notification', {
    detail: {
      type: 'info',
      title: '📢 Opportunity Updated',
      message: `${opportunityData.title} has been updated`,
      priority: 'normal'
    }
  }))
}

// Trigger notification when new opportunity is created
export const notifyNewOpportunity = (opportunityData) => {
  const socket = getSocket()
  if (socket) {
    socket.emit('opportunity:created', opportunityData)
  }
  
  // Show immediate feedback to creator
  window.dispatchEvent(new CustomEvent('show-notification', {
    detail: {
      type: 'success',
      title: '🎓 Opportunity Created',
      message: `${opportunityData.title} is now live!`,
      priority: 'high'
    }
  }))
}

// Trigger notification when user applies to opportunity
export const notifyApplication = (applicationData) => {
  const socket = getSocket()
  if (socket) {
    socket.emit('application:submitted', applicationData)
  }
  
  // Show immediate feedback to applicant
  window.dispatchEvent(new CustomEvent('show-notification', {
    detail: {
      type: 'success',
      title: '📝 Application Submitted',
      message: `Your application for ${applicationData.opportunityTitle} has been submitted!`,
      priority: 'high'
    }
  }))
}

// Trigger notification when user answers a question
export const notifyForumAnswer = (answerData) => {
  const socket = getSocket()
  if (socket) {
    socket.emit('forum:answer_created', answerData)
  }
  
  // Show immediate feedback
  window.dispatchEvent(new CustomEvent('show-notification', {
    detail: {
      type: 'success',
      title: '💡 Answer Posted',
      message: 'Your answer has been shared!',
      priority: 'normal'
    }
  }))
}