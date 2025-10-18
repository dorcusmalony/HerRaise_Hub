import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header/header.jsx'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import About from './pages/About/About'
import Contact from './pages/Contact/Contact'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register.jsx'
import ResourcePage from './pages/ResourcePage/ResourcePage'
import ResetPassword from './pages/Auth/ResetPassword'
import Profile from './pages/Profile/Profile.jsx'
import Forum from './pages/Forum/Forum.jsx'
import Dashboard from './pages/dashboard/dashboard.jsx'
import Opportunities from './pages/Opportunities/Opportunities.jsx'
import './App.css'

export default function App() {
  // Fix: Read from environment variable instead of hardcoded value
  useEffect(() => {
    // Read from environment variable - not hardcoded
    const api = import.meta.env.VITE_API_URL || ''
    console.log('VITE_API_URL=', api)
    if (!api) {
      console.warn('VITE_API_URL is not set. Set it in .env (local) and in Vercel env vars.')
    } else if (!/^https?:\/\/.+/.test(api)) {
      console.warn('VITE_API_URL looks malformed. It should start with "https://" (e.g. https://herraise-hub-backend-1.onrender.com). Check your .env / Vercel config.')
    }
  }, [])

  return (
    <div className="app-root">
      <Header />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/resources" element={<ResourcePage />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forum" element={<Forum />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/opportunities" element={<Opportunities />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}