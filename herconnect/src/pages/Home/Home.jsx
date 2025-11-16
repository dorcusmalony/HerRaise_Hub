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
          {t('HerRaise Hub')} {t('Empowering the Next Generation of Women Leaders')}
        </h1>
        <p className={`${styles.heroSubtitle} text-white mb-4`} style={{ maxWidth: '700px' }}>
          {t('HerRaise Hub is a women led initiative dedicated to mentoring and empowering girls through education, confidence-building, and storytelling. We believe that every girl deserves the chance to rise above societal pressures, to dream boldly, and to take accountability for shaping her own future.')}
        </p>
        <Link to="/register" className={styles.ctaButton}>
          {t('Join the Movement')}
        </Link>
      </section>

      {/* Welcome Video Section */}
      <section className="mb-5 py-5">
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-4">{t('Welcome to HerRaise Hub')}</h2>
          <p className="lead mb-4">{t('Watch our founder share the vision behind HerRaise Hub')}</p>
          <div className={styles.videoContainer}>
            <iframe 
              className={styles.welcomeVideo}
              src="https://drive.google.com/file/d/1zitqM39hIv82Q_nkELUY8Tb2f9F46uxe/preview"
              allow="autoplay"
              allowFullScreen
              title="Welcome to HerRaise Hub"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Mentorship Program Section */}
      <section className="mb-5 mt-5">
        <h2 className="display-5 fw-bold mb-5 text-center">{t('HerRaise Mentorship Program')}</h2>
        <div className="row g-5 align-items-start">
          {/* Become a Mentee */}
          <div className="col-lg-6">
            <div className="text-center mb-4">
              <img 
                src="https://files.globalgiving.org/pfil/44921/pict_grid7.jpg" 
                alt="Mentee learning" 
                className="img-fluid rounded-3 shadow"
                style={{ height: '300px', width: '100%', objectFit: 'cover' }}
              />
            </div>
            <h3 className="fw-bold mb-3 text-center">{t('Become a Mentee to Advance Your Future')}</h3>
            <p className="lead mb-4">
              {t('At HerRaise Hub, we believe that mentorship opens doors to growth and confidence. Whether you\'re exploring your education path, developing leadership and life skills, or preparing for career opportunities, this program connects you with inspiring women mentors who guide and empower you to reach higher.')}
            </p>
            <ul className="list-unstyled mb-4">
              <li className="mb-2">• <strong>{t('Access scholarships')}</strong> - {t('Find and apply for educational funding opportunities')}</li>
              <li className="mb-2">• <strong>{t('Discover internships')}</strong> - {t('Connect with career-building experiences')}</li>
              <li className="mb-2">• <strong>{t('Get guidance through forum discussions')}</strong> - {t('Connect with mentors in community forums')}</li>
              <li className="mb-2">• <strong>{t('Build confidence')}</strong> - {t('Develop skills and self-assurance for success')}</li>
              <li className="mb-2">• <strong>{t('Achieve your dreams')}</strong> - {t('Turn aspirations into reality with expert help')}</li>
            </ul>
            <p className="fw-bold">{t('Join HerRaise today and start your journey toward purpose, confidence, and success.')}</p>
            
            <div className="text-center">
              <Link to="/register" className="btn btn-lg" style={{background: '#E84393', color: 'white', border: 'none'}}>
                {t('Apply for Mentorship')}
              </Link>
            </div>
          </div>

          {/* Become a Mentor */}
          <div className="col-lg-6">
            <div className="text-center mb-4">
              <img 
                src="https://www.norway.no/contentassets/262345ea071e441b95f954c8e5b0f592/image4vif.jpg?preset=mainimagetop&v=-1852770130" 
                alt="Mentor guiding" 
                className="img-fluid rounded-3 shadow"
                style={{ height: '300px', width: '100%', objectFit: 'cover' }}
              />
            </div>
            <h3 className="fw-bold mb-3 text-center">{t('Become a Mentor to Bridge the Gap and Make an Impact')}</h3>
            <ul className="list-unstyled mb-4">
              <li className="mb-2">• <strong>{t('Guide and support')}</strong> - {t('Stand with young girls amid the challenges they face')}</li>
              <li className="mb-2">• <strong>{t('Inspire through forum discussions')}</strong> - {t('Share meaningful conversations and experiences')}</li>
              <li className="mb-2">• <strong>{t('Navigate opportunities')}</strong> - {t('Help them find scholarships, internships, and programs')}</li>
              <li className="mb-2">• <strong>{t('Lead by example')}</strong> - {t('Share your knowledge and life experiences')}</li>
              <li className="mb-2">• <strong>{t('Grow together')}</strong> - {t('Mentors can also be mentees in our community')}</li>
              <li className="mb-2">• <strong>{t('Empower the next generation')}</strong> - {t('Help them reach their full potential')}</li>
            </ul>
            <p className="fw-bold">{t('Together, we can empower young women to rise with confidence and purpose.')}</p>
            <div className="text-center">
              <Link to="/register" className="btn btn-lg" style={{background: '#8B5CF6', color: 'white', border: 'none'}}>
                {t('Become a Mentor')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Mentors Section */}
      <section className="mb-5">
        <h2 className="display-5 fw-bold mb-5 text-center">{t('Featured Mentors')}</h2>
        <p className="lead text-center mb-5 mx-auto" style={{ maxWidth: '600px' }}>
          {t('Meet the inspiring women leaders guiding and empowering young girls across South Sudan and Africa')}
        </p>
        <div className="row g-4 justify-content-center">
          {[
            {
              name: 'Eng. Abuk Mayen',
              profession: 'Education Director & Women Rights Advocate',
              image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
              expertise: 'Educational Leadership, Scholarship Guidance'
            },
            {
              name: 'Grace Akello',
              profession: 'Tech Entrepreneur & Startup Founder',
              image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face',
              expertise: 'Technology, Business Development'
            },
            {
              name: 'Mary Nyandeng',
              profession: 'Healthcare Professional & Community Leader',
              image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face',
              expertise: 'Healthcare, Community Development'
            },
            {
              name: 'Rebecca Garang',
              profession: 'Legal Advisor & Human Rights Lawyer',
              image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face'
            },
            {
              name: 'Amina Hassan',
              profession: 'Financial Advisor & Business Consultant',
              image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=300&h=300&fit=crop&crop=face'
            }
          ].map((mentor, index) => (
            <div key={index} className="col-lg-2 col-md-4 col-6">
              <div className="card border-0 shadow-sm h-100 text-center">
                <div className="card-body p-3">
                  <img 
                    src={mentor.image}
                    alt={mentor.name}
                    className="rounded-circle mb-3 shadow"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                  <h6 className="fw-bold mb-2">{t(mentor.name)}</h6>
                  <p className="text-muted small mb-0">{t(mentor.profession)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-5">
          <Link to="/register" className="btn btn-lg" style={{background: '#8B5CF6', color: 'white', border: 'none'}}>
            {t('Join Our Mentor Community')}
          </Link>
        </div>
      </section>

      {/* What We Do Section */}
      <section className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.featureIcon}></div>
          <h3 className={styles.featureTitle}>{t('Find Mentorship')}</h3>
          <p className={styles.featureDescription}>
            {t('Connect with inspiring mentors who guide you in education, career, and personal growth. You don\'t walk this journey alone.')}
          </p>
          <Link to="/register" className={styles.ctaButton}>{t('Get Started')}</Link>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}></div>
          <h3 className={styles.featureTitle}>{t('Access Resources')}</h3>
          <p className={styles.featureDescription}>
            {t('Explore learning materials on confidence, leadership, career building, and personal development designed just for young women.')}
          </p>
          <Link to="/resources" className={styles.ctaButton}>{t('Browse Resources')}</Link>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIcon}></div>
          <h3 className={styles.featureTitle}>{t('Discover Opportunities')}</h3>
          <p className={styles.featureDescription}>
            {t('Learn about scholarships, internships, and global opportunities that can help you take charge of your dreams.')}
          </p>
          <Link to="/opportunities" className={styles.ctaButton}>{t('View Opportunities')}</Link>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="mb-5">
        <div className="card border-0" style={{ background: 'linear-gradient(135deg, #E84393 0%, #c33764 100%)' }}>
          <div className="card-body text-white p-5 text-center">
            <h2 className="display-6 fw-bold mb-4">{t('Why Join HerRaise?')}</h2>
            <p className="lead mb-5">{t('Because when you rise, your community rises with you.')}</p>
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
              <div className="mb-3" style={{ fontSize: '2.5rem' }}>{t('step_' + (index + 1))}</div>
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
              {t('Join thousands of young women taking charge of their future with courage, education, and purpose.')}
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