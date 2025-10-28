import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import styles from './Home.module.css'

export default function Home() {
  const { t } = useLanguage()

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          {t('HerRaise Hub')}  Empowering the Next Generation of Women Leaders
        </h1>
        <p className={`${styles.heroSubtitle} text-white mb-4`} style={{ maxWidth: '700px' }}>
          HerRaise Hub is a women led initiative dedicated to mentoring and empowering girls through education, confidence-building, and storytelling. 
          We believe that every girl deserves the chance to rise above societal pressures, to dream boldly, and to take accountability for shaping her own future.
        </p>
        <Link to="/register" className={styles.ctaButton}>
          Join the Movement
        </Link>
      </section>

      {/* Welcome Video Section */}
      <section className={styles.videoSection}>
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-4">{t('Welcome to HerRaise Hub')}</h2>
          <p className="lead mb-4">{t('Watch our founder share the vision behind HerRaise Hub')}</p>
          <div className={styles.videoContainer}>
            <video 
              className={styles.welcomeVideo}
              controls 
              poster="/path/to/video-thumbnail.jpg"
            >
              <source src="/path/to/welcome-video.mp4" type="video/mp4" />
              <source src="/path/to/welcome-video.webm" type="video/webm" />
              {t('Your browser does not support the video tag.')}
            </video>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="text-center mb-5 mt-5">
        <h2 className="display-5 fw-bold mb-4">{t('About HerRaise')}</h2>
        <p className="lead mx-auto" style={{ maxWidth: '850px' }}>
          We exist to support and guide young women in South Sudan and across Africa to pursue their education, careers, and passions with courage and clarity.
          Through mentorship, learning programs, and storytelling, HerRaise connects girls to role models and opportunities that open doors to growth and independence.
          Together, we are shaping a future where girls choose purpose over pressure and leadership over limitation.
        </p>
      </section>

      {/* What We Do Section */}
      <section className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>🤝</div>
          <h3 className={styles.featureTitle}>{t('Find Mentorship')}</h3>
          <p className={styles.featureDescription}>
            Connect with inspiring mentors who guide you in education, career, and personal growth. You don’t walk this journey alone.
          </p>
          <Link to="/register" className={styles.ctaButton}>{t('Get Started')}</Link>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>📚</div>
          <h3 className={styles.featureTitle}>{t('Access Resources')}</h3>
          <p className={styles.featureDescription}>
            Explore learning materials on confidence, leadership, career building, and personal development designed just for young women.
          </p>
          <Link to="/resources" className={styles.ctaButton}>{t('Browse Resources')}</Link>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}>🌍</div>
          <h3 className={styles.featureTitle}>{t('Discover Opportunities')}</h3>
          <p className={styles.featureDescription}>
            Learn about scholarships, internships, and global opportunities that can help you take charge of your dreams.
          </p>
          <Link to="/opportunities" className={styles.ctaButton}>{t('View Opportunities')}</Link>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="mb-5">
        <div className="card border-0" style={{ background: 'linear-gradient(135deg, #E84393 0%, #c33764 100%)' }}>
          <div className="card-body text-white p-5 text-center">
            <h2 className="display-6 fw-bold mb-4">{t('Why Join HerRaise?')}</h2>
            <p className="lead mb-5">Because when you rise, your community rises with you.</p>
            <div className="row g-4 justify-content-center text-start">
              {[
                ['Build your network', 'Meet other ambitious young women and grow together through mentorship and friendship.'],
                ['Develop your skills', 'Access training and workshops to build confidence, leadership, and tech skills.'],
                ['Unlock opportunities', 'Find the tools and connections that turn your dreams into action.'],
                ['Join our community', 'Be part of a safe, supportive, and inspiring space made by women, for women.']
              ].map(([title, desc]) => (
                <div key={title} className="col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="fs-3"></div>
                    <div>
                      <h5 className="fw-bold">{t(title)}</h5>
                      <p className="mb-0">{t(desc)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <Link to="/register" className="btn btn-light btn-lg fw-bold">
                {t('Join Our Community Today')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="mb-5">
        <h2 className="text-center fw-bold mb-5">{t('How It Works')}</h2>
        <div className="row g-4 justify-content-center">
          {[
            ['Sign Up', 'Create your free HerRaise account in minutes.'],
            ['Build Your Profile', 'Tell us about your goals and interests.'],
            ['Connect With Mentors', 'Join mentorship programs and forums.'],
            ['Achieve Your Goals', 'Turn your learning into real-world action.']
          ].map(([title, desc], index) => (
            <div key={title} className="col-md-3 text-center">
              <div className="mb-3" style={{ fontSize: '2.5rem' }}>{index + 1}️⃣</div>
              <h5 className="fw-bold">{t(title)}</h5>
              <p className="text-muted small">{t(desc)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="text-center mb-5">
        <div className="card border-0 bg-light">
          <div className="card-body p-5">
            <h2 className="display-6 fw-bold mb-3">{t('Start Your Journey Today')}</h2>
            <p className="lead text-muted mb-4">
              Join thousands of young women taking charge of their future with courage, education, and purpose.
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <Link to="/register" className={`btn btn-lg ${styles.brandButton}`}>
                {t('Create Free Account')}
              </Link>
              <Link to="/login" className="btn btn-lg btn-outline-primary">
                {t('Sign In')}
              </Link>
            </div>
            <p className="text-muted small mt-3 mb-0">
              {t('Already have an account?')} <Link to="/login">{t('Login here')}</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
