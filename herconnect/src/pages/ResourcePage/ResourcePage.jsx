import React from 'react'

export default function ResourcePage(){
  // grouped resource data (replace links with real URLs later)
  const groupedResources = {
    'CV & Cover Letter Guides': [
      { title: 'CV Templates & Examples', desc: 'Modern and traditional CV templates to get you started.', type: 'PDF', link: '#' },
      { title: 'Cover Letter Samples', desc: 'Cover letters tailored for internships, entry roles and scholarships.', type: 'Article', link: '#' }
    ],
    'Resume Guides': [
      { title: 'Resume Writing Best Practices', desc: 'How to craft a concise resume that gets noticed.', type: 'Article', link: '#' },
      { title: 'ATS-Friendly Resume Tips', desc: 'Formatting and keywords to pass applicant tracking systems.', type: 'PDF', link: '#' }
    ],
    'Leadership & Development': [
      { title: 'Leadership Fundamentals', desc: 'Short guide on leading teams and peer mentorship.', type: 'Presentation', link: '#' },
      { title: 'Career Growth Planning', desc: 'Worksheet to set goals and map career milestones.', type: 'DOC', link: '#' }
    ],
    'Presentations & Slides': [
      { title: 'Public Speaking Slides', desc: 'Templates and tips for confident presentations.', type: 'Slides', link: '#' }
    ]
  }

  const videos = [
    { title: 'Values by Example — Michelle Obama (Highlights)', src: 'https://www.youtube.com/embed/4Qm7x1k8b6U' },
    { title: 'Leadership for Young Women — Talk', src: 'https://www.youtube.com/embed/2X4Qx0g9n3k' },
    { title: 'Career Stories — Pathways to STEM', src: 'https://www.youtube.com/embed/dQw4w9WgXcQ' } // replace with real video links
  ]

  const styles = {
    page: { padding: '2rem 0' },
    header: { marginBottom: '1rem' },
    lead: { color: '#6c757d', marginBottom: '1.5rem' },
    card: { padding: '1rem', borderRadius: 12, boxShadow: '0 8px 24px rgba(12,20,40,0.06)', background: '#fff', height: '100%' },
    badge: { fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: 8, background: 'rgba(0,0,0,0.06)', color: '#333' },
    sectionTitle: { margin: '1.5rem 0 1rem', fontSize: '1.25rem' },
    iframeWrapper: { position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 10, boxShadow: '0 8px 18px rgba(12,20,40,0.06)' },
    iframe: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }
  }

  return (
    <div className="container" style={styles.page}>
      <header style={styles.header}>
        <h1>Resources</h1>
        <p className="lead" style={styles.lead}>
          A curated library of articles, templates, presentations and videos to support learning, leadership and career growth.
        </p>
      </header>

      {/* Articles / Documents / Presentations section */}
      <section aria-labelledby="resources-heading">
        <h2 id="resources-heading" style={styles.sectionTitle}>Guides, Templates & Presentations</h2>

        {Object.entries(groupedResources).map(([category, items]) => (
          <div key={category} className="mb-4">
            <h3 className="mb-3" style={{fontSize: '1.05rem'}}>{category}</h3>
            <div className="row g-3">
              {items.map((r, idx) => (
                <div key={idx} className="col-12 col-md-6 col-lg-4">
                  <article style={styles.card} aria-label={r.title}>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <strong>{r.title}</strong>
                      <span style={styles.badge}>{r.type}</span>
                    </div>
                    <p className="small text-muted" style={{marginBottom: '1rem'}}>{r.desc}</p>
                    <div className="mt-auto d-flex gap-2">
                      <a href={r.link} className="btn btn-sm btn-outline-primary" role="button">Open / Download</a>
                      <a href="#" className="btn btn-sm btn-light">Save</a>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Videos section */}
      <section aria-labelledby="videos-heading" className="mt-5">
        <h2 id="videos-heading" style={styles.sectionTitle}>Videos & Talks</h2>
        <p className="small text-muted">Watch short talks and examples  great for inspiration and learning on the go.</p>

        <div className="row g-4 mt-2">
          {videos.map((v, i) => (
            <div key={i} className="col-12 col-md-6 col-lg-4">
              <div>
                <div style={styles.iframeWrapper}>
                  <iframe
                    title={v.title}
                    src={v.src}
                    style={styles.iframe}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <h4 style={{fontSize: '1rem', marginTop: '.75rem'}}>{v.title}</h4>
                <p className="small text-muted mb-0">Short description or takeaways can be added here.</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}