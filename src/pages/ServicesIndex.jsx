import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { serviceCategories, services } from '../data/services.js'
import './ServicesPages.css'

function getServiceExcerpt(service) {
  const source = service.intro || service.sections[0]?.body || 'Learn more about this Renew Healthcare service.'
  return source
    .replace(service.title, '')
    .replace(service.heading || '', '')
    .replace(/\s+/g, ' ')
    .trim() || 'Learn more about this Renew Healthcare service.'
}

export default function ServicesIndex() {
  const [activeCategory, setActiveCategory] = useState(serviceCategories[0])
  const trackRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [hasOverflow, setHasOverflow] = useState(false)

  const activeServices = services.filter(service => service.category === activeCategory)

  const updateScrollState = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    setHasOverflow(maxScroll > 4)
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft < maxScroll - 4)
  }, [])

  // Reset scroll position and update scroll state when category changes
  useEffect(() => {
    const el = trackRef.current
    if (el) {
      el.scrollLeft = 0
    }
    updateScrollState()
  }, [activeCategory, updateScrollState])

  useEffect(() => {
    updateScrollState()
    window.addEventListener('resize', updateScrollState)
    return () => window.removeEventListener('resize', updateScrollState)
  }, [updateScrollState, activeServices.length])

  const scroll = (direction) => {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector('.services-mobile-card')
    if (!card) return
    const gap = parseFloat(getComputedStyle(el).gap) || 0
    el.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: 'smooth' })
    setTimeout(updateScrollState, 350)
  }

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
            <h2>Treatments Provided By <span className="heading-blue">Renew Healthcare</span></h2>
            <p>Explore fertility care, women's health, genetic counselling, wellness, and nutrition services from Renew Healthcare.</p>
          </div>

          {/* ───────────────── DESKTOP LAYOUT ───────────────── */}
          <div className="desktop-services-layout">
            <div className="service-category-stack">
              {serviceCategories.map(category => {
                const categoryServices = services.filter(service => service.category === category)
                return (
                  <section className="service-category-block" key={category}>
                    <div className="service-category-head">
                      <h3>{category}</h3>
                      <span>{categoryServices.length} Services</span>
                    </div>
                    <div className="service-index-grid">
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
                  </section>
                )
              })}
            </div>
          </div>

          {/* ───────────────── MOBILE LAYOUT ───────────────── */}
          <div className="mobile-services-layout">
            {/* Category tabs */}
            <div className="services-mobile-tabs">
              {serviceCategories.map(category => (
                <button
                  key={category}
                  type="button"
                  className={`services-mobile-tab-btn ${activeCategory === category ? 'is-active' : ''}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Slider for selected category */}
            <div className="services-mobile-slider-container">
              <div className="services-mobile-slider-viewport">
                <div className="services-mobile-slider-track" ref={trackRef} onScroll={updateScrollState}>
                  {activeServices.map(service => (
                    <Link className="services-mobile-card" to={`/services/${service.slug}`} key={service.slug}>
                      <div className="services-mobile-card-icon-wrap">
                        <img src={service.thumbnailImg} alt={service.title} />
                      </div>
                      <h3>{service.title}</h3>
                      <p>{getServiceExcerpt(service)}</p>
                      <span className="services-mobile-card-link">Explore Service →</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Single set of controls */}
              {hasOverflow && (
                <div className="services-mobile-slider-controls">
                  <button type="button" onClick={() => scroll(-1)} disabled={!canScrollLeft} aria-label="Previous service">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                  <button type="button" onClick={() => scroll(1)} disabled={!canScrollRight} aria-label="Next service">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>
    </main>
  )
}
