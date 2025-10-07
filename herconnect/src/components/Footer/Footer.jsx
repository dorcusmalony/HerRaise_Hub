import React from 'react'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa'

export default function Footer(){
  return (
    <footer
      className="site-footer"
      role="contentinfo"
      aria-labelledby="site-footer-heading"
    >
      <div className="container">
        <h2 id="site-footer-heading" className="visually-hidden">Site footer</h2>

        <div className="row">
          <div className="col-12 col-md-4 mb-4">
            <h5>HerRaise Hub</h5>
            <p className="small text-white-50">We support girls through resource opportunities, mentorship and track of goals setting to help them achive their careers.</p>
          </div>

          <div className="col-6 col-md-4 mb-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled small">
              <li><a href="/resources" className="text-white">Resources</a></li>
              <li><a href="/forum" className="text-white">Forum</a></li>
              <li><a href="/reports" className="text-white">Reports</a></li>
              <li><a href="/about" className="text-white">About</a></li>
            </ul>
          </div>

          <div className="col-6 col-md-4 mb-4">
            <h5>Contact & Newsletter</h5>
            <p className="small text-white-50 mb-2">Join our mailing list for updates.</p>
            <form className="d-flex newsletter" onSubmit={e => e.preventDefault()}>
              <input className="form-control form-control-sm me-2" placeholder="Email address" aria-label="Email address" />
              <button className="btn btn-sm btn-light">Subscribe</button>
            </form>
            <div className="social mt-3">
              <a href="#" className="text-white me-3" aria-label="Facebook"><FaFacebook /></a>
              <a href="#" className="text-white me-3" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" className="text-white me-3" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" className="text-white" aria-label="LinkedIn"><FaLinkedin /></a>
            </div>
          </div>
        </div>

        <div className="text-center small mt-4">© {new Date().getFullYear()} HerRaise Hub All rights reserved</div>
      </div>
    </footer>
  )
}