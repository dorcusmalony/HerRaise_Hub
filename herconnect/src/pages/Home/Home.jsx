import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../../styles/Pages.module.css'

// image assets from src/images
const heroImg = new URL('../../images/girl2.jpg', import.meta.url).href

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="position-relative mb-5">
        <div className={styles.heroWrapper}>
          <img src={heroImg} alt="Empowering young women" className={`img-fluid w-100 ${styles.heroImg}`} />
          <div className={styles.heroOverlay}>
            <div className="container text-center">
              <h1 className={`${styles.heroTitle} display-2 fw-bold text-white mb-4`}>
                Empowering Young Women in South Sudan
              </h1>
              <p className="lead text-white mb-4 mx-auto" style={{ maxWidth: '700px', fontSize: '1.3rem' }}>
                Connect with mentors, access resources, and discover opportunities
                to build your future
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link to="/register" className={`btn btn-lg ${styles.brandButton}`} style={{ fontSize: '1.2rem', padding: '0.8rem 2rem' }}>
                  Join HerRaise Hub
                </Link>
                <Link to="/about" className="btn btn-lg btn-outline-light" style={{ fontSize: '1.2rem', padding: '0.8rem 2rem' }}>
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-5">
        {/* What We Do Section */}
        <section className="text-center mb-5">
          <h2 className="display-5 fw-bold mb-4">What We Do</h2>
          <p className="lead mx-auto" style={{ maxWidth: '800px' }}>
            HerRaise Hub is a platform dedicated to empowering young women in South Sudan
            through <strong>mentorship</strong>, <strong>educational resources</strong>, and
            <strong>career opportunities</strong>.
          </p>
        </section>

        {/* Key Features */}
        <section className="mb-5">
          <div className="row g-4">
            {/* Feature 1: Mentorship */}
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm text-center p-4">
                <div className="mb-3" style={{ fontSize: '3rem' }}>👩‍🏫</div>
                <h4 className="fw-bold mb-3">Find a Mentor</h4>
                <p className="text-muted">
                  Connect with experienced women leaders who will guide you through
                  your educational and career journey.
                </p>
                <Link to="/register" className="btn btn-outline-primary mt-auto">
                  Get Started
                </Link>
              </div>
            </div>

            {/* Feature 2: Resources */}
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm text-center p-4">
                <div className="mb-3" style={{ fontSize: '3rem' }}>📚</div>
                <h4 className="fw-bold mb-3">Access Resources</h4>
                <p className="text-muted">
                  Explore CV templates, scholarship guides, career tips, and
                  educational materials to help you succeed.
                </p>
                <Link to="/resources" className="btn btn-outline-primary mt-auto">
                  Browse Resources
                </Link>
              </div>
            </div>

            {/* Feature 3: Opportunities */}
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm text-center p-4">
                <div className="mb-3" style={{ fontSize: '3rem' }}>🎯</div>
                <h4 className="fw-bold mb-3">Discover Opportunities</h4>
                <p className="text-muted">
                  Find internships, scholarships, conferences, and events
                  designed for young women in South Sudan.
                </p>
                <Link to="/opportunities" className="btn btn-outline-primary mt-auto">
                  View Opportunities
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why Join Section */}
        <section className="mb-5">
          <div className="card border-0" style={{ background: 'linear-gradient(135deg, #E84393 0%, #c33764 100%)' }}>
            <div className="card-body text-white p-5 text-center">
              <h2 className="display-6 fw-bold mb-4">Why Join HerRaise Hub?</h2>
              <div className="row g-4 text-start">
                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="fs-3">✨</div>
                    <div>
                      <h5 className="fw-bold">Build Your Network</h5>
                      <p className="mb-0">Connect with peers and mentors who understand your challenges and aspirations.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="fs-3">💪</div>
                    <div>
                      <h5 className="fw-bold">Develop Your Skills</h5>
                      <p className="mb-0">Access free educational resources and training materials to advance your career.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="fs-3">🎓</div>
                    <div>
                      <h5 className="fw-bold">Unlock Opportunities</h5>
                      <p className="mb-0">Be the first to know about scholarships, internships, and leadership programs.</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="fs-3">🤝</div>
                    <div>
                      <h5 className="fw-bold">Join a Supportive Community</h5>
                      <p className="mb-0">Be part of a growing movement of young women supporting each other.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Link to="/register" className="btn btn-light btn-lg fw-bold">
                  Join Our Community Today
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-5">
          <h2 className="text-center fw-bold mb-5">How It Works</h2>
          <div className="row g-4">
            <div className="col-md-3 text-center">
              <div className="mb-3" style={{ fontSize: '2.5rem' }}>1️⃣</div>
              <h5 className="fw-bold">Sign Up</h5>
              <p className="text-muted small">Create your free account as a mentee or mentor</p>
            </div>
            <div className="col-md-3 text-center">
              <div className="mb-3" style={{ fontSize: '2.5rem' }}>2️⃣</div>
              <h5 className="fw-bold">Build Your Profile</h5>
              <p className="text-muted small">Share your interests, goals, and aspirations</p>
            </div>
            <div className="col-md-3 text-center">
              <div className="mb-3" style={{ fontSize: '2.5rem' }}>3️⃣</div>
              <h5 className="fw-bold">Connect & Learn</h5>
              <p className="text-muted small">Find mentors, access resources, and join discussions</p>
            </div>
            <div className="col-md-3 text-center">
              <div className="mb-3" style={{ fontSize: '2.5rem' }}>4️⃣</div>
              <h5 className="fw-bold">Achieve Your Goals</h5>
              <p className="text-muted small">Apply to opportunities and build your future</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center mb-5">
          <div className="card border-0 bg-light">
            <div className="card-body p-5">
              <h2 className="display-6 fw-bold mb-3">Ready to Start Your Journey?</h2>
              <p className="lead text-muted mb-4">
                Join thousands of young women building their futures together
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link to="/register" className={`btn btn-lg ${styles.brandButton}`}>
                  Create Free Account
                </Link>
                <Link to="/login" className="btn btn-lg btn-outline-primary">
                  Sign In
                </Link>
              </div>
              <p className="text-muted small mt-3 mb-0">
                Already have an account? <Link to="/login">Login here</Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}