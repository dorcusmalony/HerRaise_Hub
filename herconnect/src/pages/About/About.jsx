import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import styles from '../../styles/Pages.module.css'

// image assets within src/images
const heroImg = new URL('../../images/girl2.jpg', import.meta.url).href
const alumniImg1 = new URL('../../images/adich-pic.jpg', import.meta.url).href
const alumniImg2 = new URL('../../images/adich-pic.jpg', import.meta.url).href
const alumniImg3 = new URL('../../images/adich-pic.jpg', import.meta.url).href

export default function About() {
  const { t } = useLanguage()
  
  const values = [
    { name: t('respect'), icon: '', color: '#FFD700' },
    { name: t('mentorship'), icon: '', color: '#E84393' },
    { name: t('diversity'), icon: '', color: '#4A90E2' },
    { name: t('equality'), icon: '', color: '#9B59B6' },
    { name: t('inclusion'), icon: '', color: '#FF6B6B' },
    { name: t('empowerment'), icon: '', color: '#F39C12' },
    { name: t('collaboration'), icon: '', color: '#3498DB' },
    { name: t('lifelong_learning'), icon: '', color: '#8E44AD' }
  ]

  const testimonials = [
    {
      name: 'Dorcus Alier',
      image: alumniImg1,
      role: 'Secondary School Student',
      testimony: 'HerRaise Hub connected me with an amazing mentor who guided me through my college application process. I never thought I could apply to universities abroad, but now I have acceptance letters from three universities! This platform changed my life and showed me that my dreams are valid and achievable.'
    },
    {
      name: 'Adich Alier',
      image: alumniImg2,
      role: 'University Student',
      testimony: 'Through HerRaise Hub, I found scholarship opportunities I never knew existed. The community here is so supportive and encouraging. I secured a full scholarship for my undergraduate studies and now I mentor younger girls on the platform. It\'s incredible to pay forward the help I received.'
    },
    {
      name: 'Abuk Mayen',
      image: alumniImg3,
      role: 'High School Graduate',
      testimony: 'Before joining HerRaise Hub, I felt alone in my journey. Now I have a network of peers and mentors who understand my challenges. The resources section helped me prepare for standardized tests, and I just got accepted into my dream internship program. I\'m so grateful for this platform!'
    }
  ]

  const communityGuidelines = [
    { icon: '', title: 'Be Respectful', description: 'Treat everyone with kindness and dignity' },
    { icon: '', title: 'Embrace Inclusivity', description: 'Celebrate diversity and welcome all voices' },
    { icon: '', title: 'Communicate Positively', description: 'Use encouraging and constructive language' },
    { icon: '', title: 'Stay Safe', description: 'Protect your privacy and report concerns' },
    { icon: '', title: 'Support Each Other', description: 'Lift others up and share knowledge' },
    { icon: '', title: 'Be Authentic', description: 'Share genuine experiences and advice' }
  ]

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="position-relative mb-5">
        <div className={styles.heroWrapper}>
          <img src={heroImg} alt="Empowering young women" className={`img-fluid w-100 ${styles.heroImg}`} />
          <div className={styles.heroOverlay}>
            <div className="container">
              <h1 className={`${styles.heroTitle} display-3 fw-bold text-white mb-4`}>
                {t('hero_title') || 'Every Girl Deserves Education & A Bright Future'}
              </h1>
              
              <div className="d-flex gap-3">
                <Link to="/register" className={`btn btn-lg ${styles.brandButton}`}>
                  {t('join_community')}
                </Link>
                <Link to="/about" className="btn btn-lg btn-outline-light">
                  {t('learn_more')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-5">
        {/* Mission Statement */}
        <section className="mb-5 text-center">
          <h2 className="display-5 fw-bold mb-4">
            {t('our_mission')}
          </h2>
          <p className="lead mx-auto" style={{ maxWidth: '800px' }}>
            {t('mission_text')}
          </p>
          <h2 className="display-5 fw-bold mb-4">
            {t('our_vision')}
          </h2>
          <p className="lead mx-auto" style={{ maxWidth: '800px' }}>
            {t('vision_text')}
          </p>
        </section>

        {/* Our Values */}
        <section className="mb-5">
          <h2 className="text-center mb-4 fw-bold">{t('core_values')}</h2>
          <div className="row g-3">
            {values.map((value, idx) => (
              <div key={idx} className="col-6 col-md-3">
                <div 
                  className="card h-100 text-center border-0 shadow-sm hover-shadow"
                  style={{
                    background: `linear-gradient(135deg, ${value.color}15, ${value.color}30)`,
                    borderLeft: `4px solid ${value.color}`
                  }}
                >
                  <div className="card-body d-flex flex-column align-items-center justify-content-center py-4">
                    <div className="fs-1 mb-2">{value.icon}</div>
                    <h6 className="fw-bold mb-0" style={{ color: value.color }}>
                      {value.name}
                    </h6>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Impact Goal Section */}
        <section className="mb-5">
          <div className="card border-0 shadow-lg" style={{ background: 'linear-gradient(135deg, #E84393 0%, #c33764 100%)' }}>
            <div className="card-body text-white p-5">
              <div className="row align-items-center">
                <div className="col-lg-8">
                  <h2 className="display-6 fw-bold mb-4">{t('goal_2030')}</h2>
                  <p className="lead mb-4">
                    {t('goal_text')}
                  </p>
                  <div className="mb-4">
                    <h5 className="fw-bold mb-3">{t('fight_against')}</h5>
                    <div className="row g-2">
                      <div className="col-md-6">
                        <div className="d-flex align-items-center gap-2 bg-white bg-opacity-10 rounded p-2">
                          
                          <span>{t('gender_inequality')}</span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center gap-2 bg-white bg-opacity-10 rounded p-2">
                          
                          <span>{t('gender_violence')}</span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center gap-2 bg-white bg-opacity-10 rounded p-2">
                          
                          <span>{t('early_marriage')}</span>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-center gap-2 bg-white bg-opacity-10 rounded p-2">
                          
                          <span>{t('lack_opportunities')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h5 className="fw-bold mb-3">{t('help_reach_goal')}</h5>
                  <ul className="list-unstyled mb-4">
                    <li className="mb-2">{t('joining_platform')}</li>
                    <li className="mb-2">{t('becoming_mentor')}</li>
                    <li className="mb-2">{t('spreading_word')}</li>
                    <li className="mb-2">{t('supporting_mission')}</li>
                  </ul>
                </div>
                <div className="col-lg-4 text-center">
                  <div className="bg-white text-dark rounded-circle mx-auto mb-3" style={{ width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div>
                      <div className="display-4 fw-bold" style={{ color: 'var(--brand-magenta)' }}>{t('10K')}</div>
                      <div className="small fw-bold">{t('BY 2030')}</div>
                    </div>
                  </div>
                  <Link to="/register" className="btn btn-light btn-lg fw-bold">
                    {t('Join Our Mission')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Alumni Testimonials */}
        <section className="mb-5">
          <h2 className="text-center mb-4 fw-bold">{t('Success Stories from Our Community')}</h2>
          <p className="text-center text-muted mb-5">
            {t('Hear from young women whose lives have been transformed by HerRaise Hub')}
          </p>
          <div className="row g-4">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="col-md-4">
                <div className="card h-100 border-0 shadow hover-shadow">
                  <div className="card-body p-4">
                    <div className="text-center mb-3">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="rounded-circle mb-3"
                        style={{ width: 100, height: 100, objectFit: 'cover', border: '4px solid var(--brand-magenta)' }}
                      />
                      <h5 className="fw-bold mb-1">{testimonial.name}</h5>
                      <p className="text-muted small mb-0">{t(testimonial.role)}</p>
                    </div>
                    <div className="position-relative">
                      <div className="text-muted mb-2" style={{ fontSize: '2rem', lineHeight: 1, opacity: 0.3 }}>"</div>
                      <p className="text-muted fst-italic" style={{ fontSize: '0.95rem' }}>
                        {t(testimonial.testimony)}
                      </p>
                      <div className="text-end text-muted" style={{ fontSize: '2rem', lineHeight: 1, opacity: 0.3 }}>"</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Community Guidelines */}
        <section className="mb-5">
          <h2 className="text-center mb-4 fw-bold">{t('Our Community Guidelines')}</h2>
          <p className="text-center text-muted mb-5">
            {t('Creating a safe, supportive, and empowering space for all members')}
          </p>
          <div className="row g-4">
            {communityGuidelines.map((guideline, idx) => (
              <div key={idx} className="col-md-4">
                <div className="card h-100 border-0 bg-light">
                  <div className="card-body text-center p-4">
                    <div className="fs-1 mb-3">{guideline.icon}</div>
                    <h5 className="fw-bold mb-2">{t(guideline.title)}</h5>
                    <p className="text-muted mb-0 small">{t(guideline.description)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center mb-5">
          <div className="card border-0 bg-light">
            <div className="card-body p-5">
              <h2 className="display-6 fw-bold mb-4">{t('Ready to Make a Difference?')}</h2>
              <p className="lead text-muted mb-4">
                {t('Join thousands of young women and mentors creating positive change together')}
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link to="/register" className={`btn btn-lg ${styles.brandButton}`}>
                  {t('Create Account')}
                </Link>
                <Link to="/opportunities" className="btn btn-lg btn-primary">
                  {t('Explore Opportunities')}
                </Link>
                <Link to="/about" className="btn btn-lg btn-outline-secondary">
                  {t('learn_more')}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}