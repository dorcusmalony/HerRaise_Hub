import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styles from '../../styles/Pages.module.css'

// image assets from src/images
const heroImg = new URL('../../images/girl2.jpg', import.meta.url).href

export default function Home() {
  const { t } = useTranslation()
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="position-relative mb-5">
        <div className={styles.heroWrapper}>
          <img src={heroImg} alt={t('empowering_img_alt')} className={`img-fluid w-100 ${styles.heroImg}`} />
          <div className={styles.heroOverlay}>
            <div className="container text-center">
              <h1 className={`${styles.heroTitle} display-2 fw-bold text-white mb-4`}>
                {t('empowerment')}
              </h1>
              <p className="lead text-white mb-4 mx-auto" style={{ maxWidth: '700px', fontSize: '1.3rem' }}>
                {t('empowerment')}
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link to="/register" className={`btn btn-lg ${styles.brandButton}`} style={{ fontSize: '1.2rem', padding: '0.8rem 2rem' }}>
                  {t('join hub')}
                </Link>
                <Link to="/about" className="btn btn-lg btn-outline-light" style={{ fontSize: '1.2rem', padding: '0.8rem 2rem' }}>
                  {t('learn more')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-5">
        {/* What We Do Section */}
        <section className="text-center mb-5">
          <h2 className="display-5 fw-bold mb-4">{t('what we do')}</h2>
          <p className="lead mx-auto" style={{ maxWidth: '800px' }}>
            {t('What we do')}
          </p>
        </section>

        {/* Key Features */}
        <section className="mb-5">
          <div className="row g-4">
            {/* Feature 1: Mentorship */}
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm text-center p-4">
                <div className="mb-3" style={{ fontSize: '3rem' }}>👩‍🏫</div>
                <h4 className="fw-bold mb-3">{t('Find mentorship here')}</h4>
                <p className="text-muted">
                  {t('Connect with Peers')}
                </p>
                <Link to="/register" className="btn btn-outline-primary mt-auto">
                  {t('get started')}
                </Link>
              </div>
            </div>

            {/* Feature 2: Resources */}
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm text-center p-4">
                <div className="mb-3" style={{ fontSize: '3rem' }}>📚</div>
                <h4 className="fw-bold mb-3">{t('access resources')}</h4>
                <p className="text-muted">
                  {t('access resources')}
                </p>
                <Link to="/resources" className="btn btn-outline-primary mt-auto">
                  {t('browse resources')}
                </Link>
              </div>
            </div>

            {/* Feature 3: Opportunities */}
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm text-center p-4">
                <div className="mb-3" style={{ fontSize: '3rem' }}></div>
                <h4 className="fw-bold mb-3">{t('discover opportunities')}</h4>
                <p className="text-muted">
                  {t('discover opportunities')}
                </p>
                <Link to="/opportunities" className="btn btn-outline-primary mt-auto">
                  {t('view opportunities')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why Join Section */}
        <section className="mb-5">
          <div className="card border-0" style={{ background: 'linear-gradient(135deg, #E84393 0%, #c33764 100%)' }}>
            <div className="card-body text-white p-5 text-center">
              <h2 className="display-6 fw-bold mb-4">{t('why join herraise')}</h2>
              <div className="row g-4 text-start">
                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="fs-3"></div>
                    <div>
                      <h5 className="fw-bold">{t('Build your network')}</h5>
                      <p className="mb-0">{t('build your network')}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="fs-3"></div>
                    <div>
                      <h5 className="fw-bold">{t('Develop your skills')}</h5>
                      <p className="mb-0">{t('develop your skills')}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="fs-3">🎓</div>
                    <div>
                      <h5 className="fw-bold">{t('Unlock opportunities')}</h5>
                      <p className="mb-0">{t('Unlock opportunities')}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start gap-3">
                    <div className="fs-3"></div>
                    <div>
                      <h5 className="fw-bold">{t('Join our supportive community')}</h5>
                      <p className="mb-0">{t('Join')}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Link to="/register" className="btn btn-light btn-lg fw-bold">
                  {t('join our community today')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-5">
          <h2 className="text-center fw-bold mb-5">{t('how it works')}</h2>
          <div className="row g-4">
            <div className="col-md-3 text-center">
              <div className="mb-3" style={{ fontSize: '2.5rem' }}>1️⃣</div>
              <h5 className="fw-bold">{t('signup')}</h5>
              <p className="text-muted small">{t('signup')}</p>
            </div>
            <div className="col-md-3 text-center">
              <div className="mb-3" style={{ fontSize: '2.5rem' }}>2️⃣</div>
              <h5 className="fw-bold">{t('build your profile')}</h5>
              <p className="text-muted small">{t('build your profile')}</p>
            </div>
            <div className="col-md-3 text-center">
              <div className="mb-3" style={{ fontSize: '2.5rem' }}>3️⃣</div>
              <h5 className="fw-bold">{t('connect with peers')}</h5>
              <p className="text-muted small">{t('connect learn')}</p>
            </div>
            <div className="col-md-3 text-center">
              <div className="mb-3" style={{ fontSize: '2.5rem' }}>4️⃣</div>
              <h5 className="fw-bold">{t('Achieve your goals')}</h5>
              <p className="text-muted small">{t('Achieve your goals')}</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center mb-5">
          <div className="card border-0 bg-light">
            <div className="card-body p-5">
              <h2 className="display-6 fw-bold mb-3">{t(' Star your journey')}</h2>
              <p className="lead text-muted mb-4">
                {t('join_thousands_of_young_women')}
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link to="/register" className={`btn btn-lg ${styles.brandButton}`}>
                  {t('create_free_account')}
                </Link>
                <Link to="/login" className="btn btn-lg btn-outline-primary">
                  {t('sign_in')}
                </Link>
              </div>
              <p className="text-muted small mt-3 mb-0">
                {t('already_have_an_account')} <Link to="/login">{t('login here')}</Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}