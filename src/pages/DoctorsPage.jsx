import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import DoctorCard from '../components/DoctorCard.jsx'
import { useDoctors } from '../hooks/useContent.js'
import './ContentPages.css'
import './ServicesPages.css'

const reveal = {
  initial: { opacity: 1, y: 0 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
}

function ScrollSection({ category, doctors }) {
  const trackRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [hasOverflow, setHasOverflow] = useState(false)

  const updateScrollState = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    setHasOverflow(maxScroll > 4)
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < maxScroll - 4)
  }, [])

  useEffect(() => {
    updateScrollState()
    window.addEventListener('resize', updateScrollState)
    return () => window.removeEventListener('resize', updateScrollState)
  }, [updateScrollState, doctors.length])

  const scroll = (direction) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector('.people-card')
    if (!card) return
    const gap = parseFloat(getComputedStyle(el).gap) || 0
    el.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: 'smooth' })
    setTimeout(updateScrollState, 350)
  }

  return (
    <motion.section className="people-scroll-section" key={category} {...reveal}>
      <div className="people-scroll-header">
        <h3>{category}</h3>
        <span>{doctors.length} Members</span>
      </div>
      <div className="people-scroll-viewport">
        <div className="people-scroll-track" ref={trackRef} onScroll={updateScrollState}>
          {doctors.map(doctor => <DoctorCard doctor={doctor} key={doctor.slug} />)}
        </div>
      </div>
      {hasOverflow && (
        <div className="people-scroll-controls" aria-label={`${category} carousel controls`}>
          <button type="button" onClick={() => scroll(-1)} disabled={!canScrollLeft} aria-label={`Previous ${category}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button type="button" onClick={() => scroll(1)} disabled={!canScrollRight} aria-label={`Next ${category}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </motion.section>
  )
}

function LeadDoctor({ doctor }) {
  return (
    <motion.section className="lead-doctor-section" {...reveal}>
      <div className="people-scroll-header">
        <h3>Medical Director</h3>
      </div>
      <Link className="lead-profile-card" to={`/doctor/${doctor.slug}`}>
        <div className="lead-profile-media">
          <img src={doctor.photo} alt={doctor.name} />
        </div>
        <div className="lead-profile-body">
          <span>Medical Director</span>
          <h3>{doctor.name}</h3>
          <p>{doctor.role}</p>
          <strong>View Profile</strong>
        </div>
      </Link>
    </motion.section>
  )
}

export default function DoctorsPage() {
  const { doctors, categories } = useDoctors()
  const leadDoctor = doctors.find(doctor => doctor.slug === 'dr-rajeev-agarwal')
  const carouselDoctors = doctors.filter(doctor => doctor.slug !== 'dr-rajeev-agarwal')
  const carouselCategories = categories.filter(category =>
    carouselDoctors.some(doctor => doctor.category === category)
  )

  return (
    <main className="content-page">
      <section className="service-banner">
        <img src="/images/renew/uploads/2024/12/Inner-Page-Banner.jpg" alt="Renew Healthcare doctors" />
        <div className="service-banner-overlay" />
        <div className="service-banner-content">
          <span>Home / Doctors</span>
          <h1>Doctors</h1>
        </div>
      </section>

      <section className="service-content-band">
        <div className="service-content-inner">
          <div className="service-heading-block">
            <span>Our Experts</span>
            <h2>Meet Our Team Of Infertility Specialists</h2>
            <p>Renew Healthcare brings together fertility specialists, genetic experts, embryologists, counsellors, nursing, operations, and support teams across departments.</p>
          </div>

          {leadDoctor && <LeadDoctor doctor={leadDoctor} />}

          <div className="people-category-stack">
            {carouselCategories.map(category => {
              const categoryDoctors = carouselDoctors.filter(doctor => doctor.category === category)
              return <ScrollSection key={category} category={category} doctors={categoryDoctors} />
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
