import React from 'react'

export default function ReportButton({onClick}){
  return (
    <button className="btn btn-danger" style={{background: 'var(--brand-magenta)', border: 'none'}} onClick={onClick}>
      Report Harassment
    </button>
  )
}