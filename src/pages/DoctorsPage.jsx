import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
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
  const [canScrollRight, setCanScrollRight] = useState(true)

  const updateScrollState = () => {
    const el = trackRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  const scroll = (direction) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector('.people-card')
    if (!card) return
    const amount = card.offsetWidth + (el.children.length > 1 ? parseFloat(getComputedStyle(el).gap) : 0)
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
    setTimeout(updateScrollState, 350)
  }

  return (
    <motion.section className="people-scroll-section" key={category} {...reveal}>
      <div className="people-scroll-header">
        <h3>{category}</h3>
        <span>{doctors.length} Members</span>
      </div>
      <div className="people-scroll-track-wrap">
        <button
          className={`scroll-overlay-btn left ${!canScrollLeft ? 'is-hidden' : ''}`}
          disabled={!canScrollLeft}
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <span className="scroll-btn-circle">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
          </span>
        </button>
        <div className="people-scroll-track" ref={trackRef} onScroll={updateScrollState}>
          {doctors.map(doctor => <DoctorCard doctor={doctor} key={doctor.slug} />)}
        </div>
        <button
          className={`scroll-overlay-btn right ${!canScrollRight ? 'is-hidden' : ''}`}
          disabled={!canScrollRight}
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <span className="scroll-btn-circle">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </span>
        </button>
      </div>
    </motion.section>
  )
}

export default function DoctorsPage() {
  const { doctors, categories } = useDoctors()

  const featured = doctors.find(d => d.slug === 'dr-rajeev-agarwal')
  const restDoctors = doctors.filter(d => d.slug !== 'dr-rajeev-agarwal')
  const restCategories = [...new Set(restDoctors.map(d => d.category))]

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

          {featured && (
            <div className="featured-doctor">
              <div className="featured-doctor-label">Medical Director</div>
              <DoctorCard doctor={featured} />
            </div>
          )}

          <div className="people-category-stack">
            {restCategories.map(category => {
              const categoryDoctors = restDoctors.filter(doctor => doctor.category === category)
              return <ScrollSection key={category} category={category} doctors={categoryDoctors} />
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
