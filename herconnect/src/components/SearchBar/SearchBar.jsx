import React from 'react'

export default function SearchBar(){
  return (
    <form className="d-flex search-bar w-100 my-3" role="search" onSubmit={e => e.preventDefault()}>
      <input className="form-control form-control-sm me-2" type="search" placeholder="Search resources, posts..." />
      <button className="btn btn-sm btn-outline-primary" type="submit" style={{borderColor:'var(--border-blue)', color:'var(--text-dark)'}}>Search</button>
    </form>
  )
}