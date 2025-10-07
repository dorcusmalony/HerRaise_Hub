import React from 'react'

export default function Login(){
  return (
    <div className="mx-auto" style={{maxWidth:400}}>
      <h3>Login</h3>
      <form>
        <div className="mb-2">
          <label>Email</label>
          <input className="form-control" />
        </div>
        <div className="mb-2">
          <label>Password</label>
          <input type="password" className="form-control" />
        </div>
        <button className="btn btn-primary">Login</button>
      </form>
    </div>
  )
}