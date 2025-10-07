import React from 'react'

// image assets from src/images
const heroImg = new URL('../../images/girl2.jpg', import.meta.url).href
const teamImg1 = new URL('../../images/adich pic.jpg', import.meta.url).href
const teamImg2 = new URL('../../images/adich pic.jpg', import.meta.url).href
const teamImg3 = new URL('../../images/adich pic.jpg', import.meta.url).href

export default function About() {
  return (
    <div className="container py-4">
      {/* Hero with overlay text and CTAs */}
      <section className="mb-5 position-relative">
        <div className="position-relative overflow-hidden" style={{ borderRadius: 8 }}>
          <img
            src={heroImg}
            alt="About hero"
            className="img-fluid w-100"
            style={{ maxHeight: 520, objectFit: 'cover' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '2rem',
            }}
          >
            <h2 style={{ color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.6)', maxWidth: 900 }}>
              Every girl deserves a chance to education and a bright future
            </h2>
            <div className="mt-3 d-flex gap-2">
              <button className="btn btn-primary btn-lg">Become Mentor</button>
              <button className="btn btn-lg" style={{ background: 'var(--brand-magenta)', color: '#fff' }}>
                Learn
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="mb-5">
        <h3>What we do</h3>
        <p>
          HerRaise Hub bridges the gap by connecting primary and high school girls with aspiring opportunities,
          mentors and peer networks. We enable girls to learn from peers and educated women who dedicate time to
          guide them toward their goals and access career-building resources. Together with our diverse community of
          mentors, mentees, students and supporters, we expand opportunities for the next generation of women leaders to
          succeed.
        </p>
        <div className="mb-3">
          <button className="btn btn-primary me-2">Get involved</button>
          <button className="btn" style={{ background: 'var(--footer-bg)', color: '#fff' }}>Learn more</button>
        </div>
      </section>

      {/* Values (separated) */}
      <section className="mb-5">
        <h3>Values</h3>
        <p>
          Respect • Mentorship • Equality  • Inclusion • Empowerment • Collaboration • Lifelong learning.
        </p>
      </section>

      {/* Team */}
      <section className="mb-5">
        <h3>Alumai</h3>
        <div className="row align-items-center">
          <div className="col-12 col-sm-4 text-center mb-4">
            <img
              src={teamImg2}
              alt="Adich Moses"
              className="rounded-circle mb-2"
              style={{ width: 120, height: 120, objectFit: 'cover' }}
            />
            <h5 className="mb-0">Dorcus Alier</h5>
            <small className="text-muted">student</small>
          </div>
          <div className="col-12 col-sm-4 text-center mb-4">
            <img
              src={teamImg2}
              alt="Adich Moses"
              className="rounded-circle mb-2"
              style={{ width: 120, height: 120, objectFit: 'cover' }}
            />
            <h5 className="mb-0">Kur Peter</h5>
            <small className="text-muted">student</small>
          </div>
          <div className="col-12 col-sm-4 text-center mb-4">
            <img
              src={teamImg3}
              alt="Abuk Mayen"
              className="rounded-circle mb-2"
              style={{ width: 120, height: 120, objectFit: 'cover' }}
            />
            <h5 className="mb-0">Abuk Mayen</h5>
            <small className="text-muted">student</small>
          </div>
        </div>
      </section>

      {/* Impact goals with two buttons (pink + blue) */}
      <section className="mb-5">
        <h3>Our impact goals</h3>
        <p>By 2030 we aim to connect thousands of girls to opportunities and to recruit experienced mentors to guide them.</p>
        <div className="d-flex gap-2 mt-3">
          <button className="btn" style={{ background: 'var(--brand-magenta)', color: '#fff' }}>Connect 10,000 girls</button>
          <button className="btn btn-primary">Recruit 100+ mentors</button>
        </div>
      </section>
    </div>
  )
}
