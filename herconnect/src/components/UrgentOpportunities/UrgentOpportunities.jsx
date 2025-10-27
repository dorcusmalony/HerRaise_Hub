import { useState, useEffect } from 'react'
import CountdownBadge from '../CountdownBadge/CountdownBadge'
import './UrgentOpportunities.css'

export default function UrgentOpportunities() {
  const [urgent, setUrgent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUrgentOpportunities()
  }, [])

  const fetchUrgentOpportunities = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/opportunity-board/urgent`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setUrgent(data.opportunities || [])
      } else {
        // Mock urgent opportunities
        setUrgent([
          {
            id: 1,
            title: "Mastercard Foundation Scholars Program 2024",
            organization: "Mastercard Foundation",
            amount: "$50,000/year",
            applicationDeadline: "2024-12-25",
            applicationLink: "https://mastercardfdn.org/scholars"
          },
          {
            id: 2,
            title: "UN Women Internship Programme",
            organization: "UN Women",
            amount: "Paid internship",
            applicationDeadline: "2024-12-20",
            applicationLink: "https://unwomen.org/internships"
          }
        ])
      }
    } catch (error) {
      console.error('Error fetching urgent opportunities:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="urgent-loading">Loading urgent opportunities...</div>

  if (urgent.length === 0) return null

  return (
    <div className="urgent-section">
      <div className="urgent-header">
        <h3 className="urgent-title">🔥 Urgent Deadlines</h3>
        <span className="urgent-count">{urgent.length} expiring soon</span>
      </div>
      
      <div className="urgent-grid">
        {urgent.map(opp => (
          <div key={opp.id} className="urgent-card">
            <div className="urgent-card-header">
              <h4 className="urgent-card-title">{opp.title}</h4>
              <CountdownBadge deadline={opp.applicationDeadline} />
            </div>
            <div className="urgent-card-body">
              <p className="urgent-organization">{opp.organization}</p>
              {opp.amount && <p className="urgent-amount">{opp.amount}</p>}
            </div>
            <div className="urgent-card-footer">
              <button 
                className="urgent-apply-btn"
                onClick={() => window.open(opp.applicationLink, '_blank')}
              >
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}