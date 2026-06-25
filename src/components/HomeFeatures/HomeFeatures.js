import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { SectionHeading, CardCarousel } from '../HomeSections/HomeSections.js'
import { useLeadSubmit } from '../../hooks/useLeadSubmit.js'
import { captureTracking, getTracking, trackingNote, TRACKING_KEYS } from '../../lib/tracking.js'
import {
  newsItems,
  failedIvfCta,
  appointmentInfo,
  consultationOptions,
  testimonials,
} from '../../data/homeFeatures.js'
import './HomeFeatures.css'

// A single press / publication card. Exported so the /news page can reuse it.
export function NewsCard({ item }) {
  return (
    <a className="home-card rh-news-card" href={item.link} target="_blank" rel="noreferrer">
      <div className="rh-news-media">
        <img src={item.image} alt={item.title} loading="lazy" />
        {item.source && <span className="rh-news-source">{item.source}</span>}
      </div>
      <div className="rh-news-body">
        <h3>{item.title}</h3>
        <span className="rh-news-link">
          Read article <span aria-hidden="true">↗</span>
        </span>
      </div>
    </a>
  )
}

function PlayIcon() {
  return (
    <span className="rh-play" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
        <path d="M8 5v14l11-7z" />
      </svg>
    </span>
  )
}

function NewsSection() {
  return (
    <section className="home-band rh-news-section" id="news">
      <div className="home-band-inner">
        <SectionHeading eyebrow="Publications" title="Renew In The News" />
        <CardCarousel className="rh-news-grid" label="Renew Healthcare news cards">
          {newsItems.map((item) => (
            <NewsCard key={item.link} item={item} />
          ))}
        </CardCarousel>
        <div className="home-center-action">
          <Link to="/news" className="home-pill-link">View All News</Link>
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  return (
    <section className="home-band rh-testimonials-section" id="testimonials">
      <div className="home-band-inner">
        <SectionHeading eyebrow="Testimonials" title="Patients Experience" />
        <CardCarousel className="rh-testimonial-grid" label="Patient testimonials">
          {testimonials.map((item) => (
            <article className="home-card rh-testimonial-card" key={item.instagramLink}>
              <a
                className="rh-testimonial-media"
                href={item.instagramLink}
                target="_blank"
                rel="noreferrer"
                aria-label={`Watch ${item.name}'s story on Instagram`}
              >
                <img src={item.image} alt={item.imageAlt} loading="lazy" />
                <PlayIcon />
                <span className="rh-reel-tag">Watch reel</span>
              </a>
              <div className="rh-testimonial-body">
                <p className="rh-testimonial-quote">{item.message}</p>
                <h3>{item.name}</h3>
              </div>
            </article>
          ))}
        </CardCarousel>
      </div>
    </section>
  )
}

function FailedIvfCta() {
  return (
    <section
      className="rh-failed-cta"
      id="failed-ivf"
      style={{ backgroundImage: `url(${failedIvfCta.backgroundImage})` }}
    >
      <div className="rh-failed-cta-overlay" />
      <div className="rh-failed-cta-inner">
        <h2>{failedIvfCta.heading}</h2>
        <a className="rh-failed-cta-btn" href="#book-appointment">
          {failedIvfCta.buttonText}
        </a>
      </div>
    </section>
  )
}

function AppointmentSection() {
  const { status, error, submit } = useLeadSubmit()
  const [tracking, setTracking] = useState({})

  // Capture UTM/gclid attribution once the section mounts on the client.
  useEffect(() => {
    setTracking(captureTracking())
  }, [])

  async function onSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const address = (data.get('address') || '').toString().trim()
    const userMessage = (data.get('message') || '').toString().trim()
    const note = trackingNote(getTracking())

    // The leads table has no address/UTM columns, so fold them into the message
    // to preserve the data for the admin without a schema change.
    const message = [userMessage, address && `Address: ${address}`, note]
      .filter(Boolean)
      .join('\n')

    const ok = await submit({
      name: data.get('name'),
      email: data.get('email'),
      phone: data.get('phone'),
      service: data.get('consultationType'),
      message,
      source: 'appointment',
    })
    if (ok) form.reset()
  }

  return (
    <section className="home-band rh-appointment-section" id="book-appointment">
      <div className="home-band-inner rh-appointment-grid">
        <div className="rh-appointment-map">
          <span className="rh-map-label">{appointmentInfo.leftHeadingMobile}</span>
          <img
            src={appointmentInfo.mapImage.url}
            alt={appointmentInfo.mapImage.alt}
            title={appointmentInfo.mapImage.title}
            loading="lazy"
          />
        </div>

        <div className="rh-appointment-form-wrap">
          <span className="rh-appointment-eyebrow">Book An Appointment</span>
          <h2>{appointmentInfo.heading}</h2>
          <p className="rh-appointment-sub">
            Share your details and our fertility care team will get back to you to confirm your
            consultation.
          </p>

          <form className="rh-appointment-form" onSubmit={onSubmit} noValidate>
            {/* Hidden marketing attribution fields */}
            {TRACKING_KEYS.map((key) => (
              <input key={key} type="hidden" name={key} value={tracking[key] || ''} />
            ))}

            <div className="rh-field-row">
              <label className="rh-field">
                <span>Name<i>*</i></span>
                <input type="text" name="name" autoComplete="name" required />
              </label>
              <label className="rh-field">
                <span>Email<i>*</i></span>
                <input type="email" name="email" autoComplete="email" required />
              </label>
            </div>

            <div className="rh-field-row">
              <label className="rh-field">
                <span>Phone Number<i>*</i></span>
                <input type="tel" name="phone" autoComplete="tel" required />
              </label>
              <label className="rh-field">
                <span>Consultation Type<i>*</i></span>
                <select name="consultationType" defaultValue="" required>
                  <option value="" disabled>Select consultation type</option>
                  {consultationOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </label>
            </div>

            <label className="rh-field">
              <span>Address<i>*</i></span>
              <input type="text" name="address" autoComplete="street-address" required />
            </label>

            <label className="rh-field">
              <span>Your Message</span>
              <textarea name="message" rows={3} />
            </label>

            <button type="submit" className="rh-appointment-submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : appointmentInfo.submitText}
            </button>

            {status === 'sent' && (
              <p className="lead-form-msg ok">Thank you! Our team will reach out shortly to confirm your appointment.</p>
            )}
            {status === 'error' && <p className="lead-form-msg err">{error}</p>}
          </form>
        </div>
      </div>
    </section>
  )
}

export default function HomeFeatures() {
  return (
    <>
      <NewsSection />
      <TestimonialsSection />
      <FailedIvfCta />
      <AppointmentSection />
    </>
  )
}
