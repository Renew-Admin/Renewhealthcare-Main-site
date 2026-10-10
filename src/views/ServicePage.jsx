'use client'
import { useEffect, useState } from 'react'
import { Link } from '../lib/router.js'
import './ServicesPages.css'

function getServiceExcerpt(service) {
  const source = service.intro || service.sections[0]?.body || 'Learn more about this service.'
  return source
    .replace(service.title, '')
    .replace(service.heading || '', '')
    .replace(/\s+/g, ' ')
    .trim() || 'Learn more about this service.'
}

function TextBlock({ text }) {
  const compactText = part => {
    const clean = String(part || '').replace(/\s+/g, ' ').trim()
    const sentence = clean.match(/^(.{70,220}?[.!?])(\s|$)/)
    if (sentence) return sentence[1]
    return clean.split(' ').slice(0, 24).join(' ')
  }

  return String(text || '')
    .split('\n')
    .filter(Boolean)
    .map((part, index) => {
      if (part.startsWith('- ')) {
        return <li key={index}>{part.slice(2)}</li>
      }
      return (
        <p key={index}>
          <span className="mobile-copy-short">{compactText(part)}</span>
          <span className="desktop-copy-full">{part}</span>
        </p>
      )
    })
}

// The answer is always in the HTML (crawlers and the FAQPage schema need it);
// a collapsed item only hides it. The first item starts open on desktop and
// closes after mount on small screens, so server and client markup match.
function FaqItem({ faq, index }) {
  const [open, setOpen] = useState(index === 0)

  useEffect(() => {
    if (index === 0 && window.innerWidth <= 720) setOpen(false)
  }, [index])

  return (
    <div className={`service-faq-item ${open ? 'is-open' : ''}`}>
      <button type="button" onClick={() => setOpen(value => !value)} aria-expanded={open}>
        <span>{faq.q}</span>
        <strong>{open ? '−' : '+'}</strong>
      </button>
      <p hidden={!open}>{faq.a}</p>
    </div>
  )
}

// `service` and `relatedServices` are resolved on the server
// (src/app/(site)/services/[slug]/page.js), so the full services catalogue is
// not shipped to the browser.
export default function ServicePage({ service, relatedServices = [] }) {

  if (!service) {
    return (
      <main className="services-page">
        <section className="service-content-band">
          <div className="service-content-inner service-not-found">
            <span>Services</span>
            <h1>Service not found</h1>
            <Link className="service-pill-link" to="/services">Back to Services</Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="services-page">
      <section className="service-banner">
        <img src={service.bannerImg} alt={service.title} />
        <div className="service-banner-overlay" />
        <div className="service-banner-content">
          <span>Home / Services / {service.title}</span>
          <h1>{service.title}</h1>
        </div>
      </section>

      <section className="service-content-band">
        <div className="service-content-inner">
          <div className="service-intro-grid">
            <div className="service-heading-block is-left">
              <span>{service.category}</span>
              <h2>{service.heading}</h2>
              {service.intro && <p>{service.intro}</p>}
            </div>
            <div className="service-side-card">
              <img src={service.thumbnailImg} alt={service.title} />
              <h3>{service.category}</h3>
              <p>Renew Healthcare offers this service with specialist-led guidance, clinical clarity, and patient-first support.</p>
              <Link to="/contact">Enquire About Appointments →</Link>
            </div>
          </div>

          <div className="service-section-stack">
            {service.sections.map(section => (
              <article className="service-detail-card" key={section.heading}>
                <h3>{section.heading}</h3>
                <div className="service-rich-text">
                  <TextBlock text={section.body} />
                </div>
              </article>
            ))}
          </div>

          {service.faqs.length > 0 && (
            <section className="service-faq-section">
              <div className="service-heading-block">
                <span>FAQs</span>
                <h2>Frequently Asked Questions</h2>
              </div>
              <div className="service-faq-list">
                {service.faqs.map((faq, index) => (
                  <FaqItem faq={faq} index={index} key={faq.q} />
                ))}
              </div>
            </section>
          )}

          <section className="service-cta-band">
            <div>
              <span>Need guidance?</span>
              <h2>Contact the Clinic to Enquire About the Earliest Available Appointment Slot</h2>
              <p>Speak with Renew Healthcare for the right next step in your care journey.</p>
            </div>
            <div className="service-cta-actions">
              <Link to="/contact">Enquire About Appointments</Link>
              <a href="tel:06292312076">Call 062923 12076</a>
            </div>
          </section>

          {relatedServices.length > 0 && (
            <section className="service-related-section">
              <div className="service-heading-block">
                <span>Related Services</span>
                <h2>Explore more in {service.category}</h2>
              </div>
              <div className="service-related-grid">
                {relatedServices.map(related => (
                  <Link className="service-index-card" to={`/services/${related.slug}`} key={related.slug}>
                      <img src={related.thumbnailImg} alt={related.title} />
                      <div>
                        <strong>{related.title}</strong>
                        <p>{getServiceExcerpt(related)}</p>
                        <span>View Service →</span>
                      </div>
                    </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  )
}
