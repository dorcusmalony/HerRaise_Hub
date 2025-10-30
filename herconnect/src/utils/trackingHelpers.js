// Local Storage helpers for tracking
const TRACKING_KEY = 'herraise_opportunity_tracking'

export const saveInteractionToStorage = (opportunityId, action, timestamp = Date.now()) => {
  try {
    const existing = JSON.parse(localStorage.getItem(TRACKING_KEY) || '{}')
    if (!existing[opportunityId]) {
      existing[opportunityId] = []
    }
    existing[opportunityId].push({ action, timestamp })
    localStorage.setItem(TRACKING_KEY, JSON.stringify(existing))
  } catch (error) {
    console.error('Failed to save interaction:', error)
  }
}

export const getInteractionsFromStorage = (opportunityId) => {
  try {
    const existing = JSON.parse(localStorage.getItem(TRACKING_KEY) || '{}')
    return existing[opportunityId] || []
  } catch (error) {
    console.error('Failed to get interactions:', error)
    return []
  }
}

export const hasUserInteracted = (opportunityId, action) => {
  const interactions = getInteractionsFromStorage(opportunityId)
  return interactions.some(interaction => interaction.action === action)
}

// URL Parameter helpers
export const addTrackingParams = (url, opportunityId) => {
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}ref=herraise&opportunity_id=${opportunityId}`
}

export const getOpportunityIdFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get('opportunity_id')
}

export const cleanTrackingParams = () => {
  const url = new URL(window.location)
  url.searchParams.delete('opportunity_id')
  url.searchParams.delete('ref')
  window.history.replaceState({}, document.title, url.pathname + url.search)
}