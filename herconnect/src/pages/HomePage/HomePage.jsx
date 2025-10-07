import React from 'react'
import ReportButton from '../../components/ReportsButton/ReportButton'
import SearchBar from '../../components/SearchBar/SearchBar'
import heroImg from '../../images/girl.jpg' // import image from src/images

// added image URLs (use exact filenames present in src/images)
const alum1 = new URL('../../images/adich pic.jpg', import.meta.url).href
const alum2 = new URL('../../images/adich pic.jpg', import.meta.url).href
const alum3 = new URL('../../images/peter.jpg', import.meta.url).href

export default function HomePage(){
  // Add centralized inline styles for the Impact section and buttons
  const impactStyles = {
    wrapper: {
      background: 'linear-gradient(90deg, rgba(232,67,147,0.95), rgba(75,15,119,0.95))',
      color: '#fff',
      borderRadius: 12,
      padding: '2rem 1.25rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      flexWrap: 'wrap'
    },
    content: {
      flex: '1 1 60%',
      minWidth: 240
    },
    actions: {
      display: 'flex',
      gap: 12,
      alignItems: 'center',
      flex: '0 0 auto',
      minWidth: 240,
      // ensure right column stacks nicely on small screens
      flexWrap: 'wrap',
      justifyContent: 'flex-end'
    },
    primaryBtn: {
      background: 'var(--brand-magenta, #E84393)', // fallback color
      color: '#fff',
      padding: '0.95rem 1.5rem',
      borderRadius: 10,
      border: 'none',
      fontSize: '1rem',
      fontWeight: 600,
      boxShadow: '0 8px 20px rgba(120,30,110,0.18)',
      cursor: 'pointer',
      minWidth: 220,
      height: 52
    },
    secondaryBtn: {
      background: 'transparent',
      color: '#fff',
      padding: '0.85rem 1.25rem',
      borderRadius: 10,
      border: '1px solid rgba(255,255,255,0.18)',
      fontSize: '0.95rem',
      cursor: 'pointer',
      minWidth: 220,
      height: 52
    },
    stackedGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    },
    // New: large card-like div styles to replace the small buttons
    actionCardPrimary: {
      background: 'var(--brand-magenta, #E84393)',
      color: '#fff',
      padding: '1.1rem 1.5rem',
      borderRadius: 12,
      fontSize: '1.05rem',
      fontWeight: 700,
      boxShadow: '0 12px 28px rgba(120,30,110,0.18)',
      cursor: 'pointer',
      minWidth: 260,
      height: 64,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    },
    actionCardSecondary: {
      background: 'transparent',
      color: '#fff',
      padding: '0.95rem 1.25rem',
      borderRadius: 12,
      border: '1px solid rgba(255,255,255,0.18)',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      minWidth: 260,
      height: 64,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
    },
    measureBtn: {
      background: 'rgba(255,255,255,0.10)',
      color: '#fff',
      padding: '0.9rem 1.25rem',
      borderRadius: 10,
      border: '1px solid rgba(255,255,255,0.12)',
      fontSize: '0.95rem',
      cursor: 'pointer',
      minWidth: 220,
      height: 52
    }
  }

  return (
    <div>
      {/* hero image - first section */}
      <section className="text-center py-4">
        <img src={heroImg} alt="hero" className="img-fluid rounded mb-3 hero-img" />

        <h2>Welcome to HerRaise Hub</h2>
        <p className="lead">
          HerRaise Hub is a mentorship platform for South Sudanese girls  connecting girls to support each other through peer support,
          learning from educated women, and access to opportunities, resources and community connections.
        </p>
        <p>
          A mentorship platform that brings together opportunities, resources and community discussion forums to help girls learn,
          network and grow.
        </p>
        <ReportButton onClick={() => alert('Report flow: open modal / form')} />
      </section>

      {/* search bar directly under header */}
      <div className="container">
        <SearchBar />
      </div>

      {/* Team — professional cards (replaces previous alumni block) */}
      <section className="my-5">
        <h3 className="mb-4">Meet our team</h3>
        <div className="row g-3">
          <div className="col-12 col-md-4">
            <div style={{padding:20, borderRadius:10, boxShadow:'0 6px 18px rgba(0,0,0,0.06)', textAlign:'center', height:'100%'}}>
              <img src={alum1} alt="Malony Alier" style={{width:120, height:120, objectFit:'cover', borderRadius:'50%'}} />
              <h5 className="mt-3 mb-1">Malony Alier</h5>
              <div className="text-muted">Software Developer</div>
              <p className="small mt-3">Leads product engineering and builds scalable tech solutions to connect mentors and mentees.</p>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div style={{padding:20, borderRadius:10, boxShadow:'0 6px 18px rgba(0,0,0,0.06)', textAlign:'center', height:'100%'}}>
              <img src={alum2} alt="Abuk Mayen" style={{width:120, height:120, objectFit:'cover', borderRadius:'50%'}} />
              <h5 className="mt-3 mb-1">Abuk Mayen</h5>
              <div className="text-muted">UX Designer</div>
              <p className="small mt-3">Designs user-centered experiences making it easy for girls to discover mentorship and resources.</p>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div style={{padding:20, borderRadius:10, boxShadow:'0 6px 18px rgba(0,0,0,0.06)', textAlign:'center', height:'100%'}}>
              <img src={alum3} alt="Kur Peter" style={{width:120, height:120, objectFit:'cover', borderRadius:'50%'}} />
              <h5 className="mt-3 mb-1">Kur Peter</h5>
              <div className="text-muted">Program Manager</div>
              <p className="small mt-3">Coordinates mentorship programs and partnerships that open opportunities for learners.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact — improved layout & buttons/cards */}
      <section className="my-5">
        <div style={impactStyles.wrapper}>
          <div style={impactStyles.content}>
            <h3 style={{margin: 0, fontSize: '1.6rem'}}>Our goals is to reach 10,000 girls by 2030</h3>
            <p style={{marginTop:8, opacity:0.95, maxWidth: 700}}>
              We are scaling mentorship, resources and partnerships to connect girls with educational and career pathways.
              Join us to provide guidance, funding opportunities and peer support to help the next generation succeed.
            </p>
          </div>

          <div style={impactStyles.actions}>
            {/* Left side: two large card-like divs (primary + secondary) */}
            <div style={impactStyles.stackedGroup}>
              <div
                role="button"
                tabIndex={0}
                style={impactStyles.actionCardPrimary}
                onKeyDown={() => {}}
                // add onClick handler here when needed
              >
                Connect 10,000 girls
              </div>

              <div
                role="button"
                tabIndex={0}
                style={impactStyles.actionCardSecondary}
                onKeyDown={() => {}}
                // add onClick handler here when needed
              >
                Recruit 100+ mentors
              </div>
            </div>

            {/* Right side: measurement / learn more CTA */}
            <button style={impactStyles.measureBtn}>Learn how we measure impact</button>
          </div>
        </div>
      </section>

      {/* Vision / Mission / Values removed from Home — available on the About page */}

      {/* ...existing remaining code (if any) ... */}
    </div>
  )
}