import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { serviceCategories, services } from '../data/services.js'
import './ServicesPages.css'

function CategorySection({ category, categoryServices }) {
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
  }, [updateScrollState, categoryServices.length])

  const scroll = (direction) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector('.service-index-card')
    if (!card) return
    const gap = parseFloat(getComputedStyle(el).gap) || 0
    el.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: 'smooth' })
    setTimeout(updateScrollState, 350)
  }

  return (
    <section className="service-category-block" key={category}>
      <div className="service-category-head">
        <h3>{category}</h3>
        <span>{categoryServices.length} Services</span>
      </div>

      <div className="service-index-viewport">
        <div className="service-index-grid" ref={trackRef} onScroll={updateScrollState}>
          {categoryServices.map(service => (
            <Link className="service-index-card" to={`/services/${service.slug}`} key={service.slug}>
              <img src={service.thumbnailImg} alt={service.title} />
              <div>
                <strong>{service.title}</strong>
                <p>{service.intro || service.sections[0]?.body || 'Learn more about this Renew Healthcare service.'}</p>
                <span>View Service →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {hasOverflow && (
        <div className="service-scroll-controls" aria-label={`${category} carousel controls`}>
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
    </section>
  )
}

export default function ServicesIndex() {
  return (
    <main className="services-page">
      <section className="service-banner service-index-banner">
        <img src="/images/renew/uploads/2024/12/Inner-Page-Banner.jpg" alt="Renew Healthcare services" />
        <div className="service-banner-overlay" />
        <div className="service-banner-content">
          <span>Home / Services</span>
          <h1>Services</h1>
        </div>
      </section>

      <section className="service-content-band">
        <div className="service-content-inner">
          <div className="service-heading-block">
            <span>Renew Healthcare</span>
            <h2>Treatments Provided By Renew Healthcare</h2>
            <p>Explore fertility care, women's health, genetic counselling, wellness, and nutrition services from Renew Healthcare.</p>
          </div>

          <div className="service-category-stack">
            {serviceCategories.map(category => {
              const categoryServices = services.filter(service => service.category === category)
              return (
                <CategorySection
                  key={category}
                  category={category}
                  categoryServices={categoryServices}
                />
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}