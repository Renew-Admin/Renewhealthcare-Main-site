import { Children, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useBlogs } from '../../hooks/useBlogs.js'
import './HomeSections.css'

const whyItems = [
  ['why-ch-ic1.png', 'More than two decades of experience', 'Highly experienced IVF fertility specialists in Kolkata for diagnosis and treatments for varied fertility issues.'],
  ['why-ch-ic2.png', 'Cost', 'Best possible treatment for every section of society, with subsidised support through Renewing Hope Foundation.'],
  ['why-ch-ic3.png', 'Own eggs and sperm', 'Encouragement of using own eggs and sperm, even in complex fertility conditions.'],
  ['why-ch-ic5.png', 'Referral centre for genetics', 'Solving complex genetic problems through the IVF process with advanced counselling.'],
  ['why-ch-ic6.png', 'Focus on natural conception', 'Woman care from adolescence to menopause with emphasis on natural conception whenever possible.'],
  ['why-ch-ic7.png', 'Transparency', 'Clear clinical practices, costing, success rates, stimulation updates, egg retrieval, and embryo development details.'],
]

const services = [
  ['Conception', 'IVF, IUI, ICSI, fertility preservation, and advanced embryology support.', '/services'],
  ["Women's Health", 'Gynaecology, pregnancy care, endoscopy, and aesthetic gynaecology services.', '/services'],
  ['Genetic Health', 'Preconception, prenatal, paediatric, cardiac, cancer, and neurology genetic counselling.', '/services'],
  ['Wellness & Nutrition', 'Weight management plus pregnancy and postpartum nutrition clinics.', '/services'],
]

const doctors = [
  ['Dr. Rajeev Agarwal', 'Medical Director | Fertility Specialist | IVF Doctor', '/images/renew/uploads/2026/05/Dr-Rajeev-Agarwal.webp', '/doctor/dr-rajeev-agarwal'],
  ['Dr. Dorothy P Ghosh', 'MBBS DNB | Infertility Specialist', '/images/renew/uploads/2024/07/Dr-Dorothy-Ghosh-1.jpg', '/doctor/dr-dorothy-p-ghosh'],
  ['Dr. Neha Yadav', 'Associate Consultant', '/images/renew/uploads/2024/07/Dr-Neha-Yadav-1.jpg', '/doctor/dr-neha-yadav'],
  ['Dr. Arnab Kundu', 'Associate Consultant', '/images/renew/uploads/2025/06/Dr-Arnab-Side-View-rotated.jpg', '/doctor/dr-arnab-kundu'],
  ['Dr. Sonam Agarwal', 'Associate Consultant', '/images/renew/uploads/2026/05/Dr-Sonam.jpg', '/doctor/dr-sonam-agarwal'],
]

const mediaLogos = ['TOI.png', 'Zee-News.png', 'ABP-live.png', 'Daily-Hunt.png', 'Doctube.png', 'Hindusthan-Times.png', 'India-TV.png', 'Mid-Day.png', 'News-18.png', 'News-Nine.png']

const journeyCards = [
  ['I am having problems conceiving', '/images/renew/uploads/2024/12/best-ivf-treatment-centre-in-kolkata.png'],
  ['I want to Start my family building journey', '/images/renew/uploads/2024/12/best-ivf-centre-in-kolkata.png'],
  ['I am looking for a donor (Egg/Sperm)', '/images/renew/uploads/2024/12/low-cost-ivf-hospital-in-kolkata.png'],
  ['I want to freeze my gametes (Egg/Sperm/Embryo)', '/images/renew/uploads/2024/12/top-ivf-centre-in-kolkata.png'],
  ['Preconception Counselling', '/images/renew/uploads/2024/12/top-5-ivf-centre-in-kolkata.png'],
]

const clinics = [
  {
    name: 'Renew IVF Saltlake',
    place: 'Saltlake, Kolkata',
    image: '/images/renew/uploads/2025/03/renew-ivf-saltlake.jpg',
    to: '/locations/saltlake',
  },
  {
    name: 'Renew IVF Jamshedpur',
    place: 'Bistupur, Jamshedpur',
    image: '/images/renew/uploads/2025/03/renew-ivf-jamshedpur.jpg',
    to: '/locations/jamshedpur',
  },
  {
    name: 'Renew Ballygunge',
    place: 'Ballygunge, Kolkata',
    image: '/images/renew/uploads/2026/07/renew-healthcare-mandeville-gardens.webp',
    to: '/locations/gariahat',
  },
]

export function SectionHeading({ eyebrow, title, text }) {
  return (
    <div className="home-section-heading">
      {eyebrow && <span className="home-section-eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  )
}

export function CardCarousel({ children, className, label, autoPlayMs = 0, autoPlayOnlyMobile = false, autoPlayOnMobile = true, autoPlayDirection = 1, loop = false }) {
  const viewportRef = useRef(null)
  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)
  const [hasOverflow, setHasOverflow] = useState(false)
  const [isMobileViewport, setIsMobileViewport] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(max-width: 767px)').matches
  })
  const items = Children.toArray(children)
  const shouldLoop = loop && items.length > 1
  const displayItems = shouldLoop ? [...items, ...items, ...items] : items

  const setScrollLeftImmediately = useCallback((viewport, left) => {
    const previousBehavior = viewport.style.scrollBehavior
    const previousSnapType = viewport.style.scrollSnapType

    viewport.style.scrollBehavior = 'auto'
    viewport.style.scrollSnapType = 'none'
    viewport.scrollLeft = left
    // Force the instant internal loop reset to apply before smooth user scrolling resumes.
    viewport.getBoundingClientRect()
    viewport.style.scrollBehavior = previousBehavior
    viewport.style.scrollSnapType = previousSnapType
  }, [])

  const getSlideStep = useCallback(() => {
    const viewport = viewportRef.current
    if (!viewport) return 0

    const slide = viewport.querySelector('.card-carousel-slide')
    if (!slide) return 0

    const track = viewport.querySelector('.card-carousel-track')
    const gap = track ? Number.parseFloat(window.getComputedStyle(track).gap || '0') || 0 : 0
    return slide.getBoundingClientRect().width + gap
  }, [])

  const getLoopMetrics = useCallback(() => {
    const viewport = viewportRef.current
    if (!viewport || !shouldLoop) return null

    const slides = viewport.querySelectorAll('.card-carousel-slide')
    const firstSlide = slides[0]
    const middleSlide = slides[items.length]
    const finalSlideSet = slides[items.length * 2]
    if (!firstSlide || !middleSlide || !finalSlideSet) return null

    const firstStart = firstSlide.offsetLeft
    const middleStart = middleSlide.offsetLeft - firstStart
    const finalStart = finalSlideSet.offsetLeft - firstStart
    return {
      viewport,
      middleStart,
      finalStart,
      setWidth: finalStart - middleStart,
    }
  }, [items.length, shouldLoop])

  const normalizeLoopPosition = useCallback(() => {
    if (!shouldLoop) return

    const metrics = getLoopMetrics()
    if (!metrics || !metrics.setWidth) return

    if (metrics.viewport.scrollLeft < metrics.middleStart - 1) {
      setScrollLeftImmediately(metrics.viewport, metrics.viewport.scrollLeft + metrics.setWidth)
    } else if (metrics.viewport.scrollLeft >= metrics.finalStart - 1) {
      setScrollLeftImmediately(metrics.viewport, metrics.viewport.scrollLeft - metrics.setWidth)
    }
  }, [getLoopMetrics, setScrollLeftImmediately, shouldLoop])

  const updateControls = useCallback(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const maxScroll = viewport.scrollWidth - viewport.clientWidth
    setHasOverflow(shouldLoop || maxScroll > 4)
    setCanGoBack(shouldLoop || viewport.scrollLeft > 4)
    setCanGoForward(shouldLoop || viewport.scrollLeft < maxScroll - 4)
  }, [shouldLoop])

  useLayoutEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    if (!shouldLoop) {
      updateControls()
      return
    }

    const scrollToMiddleSet = () => {
      const metrics = getLoopMetrics()
      if (!metrics) return

      setScrollLeftImmediately(metrics.viewport, metrics.middleStart)
      updateControls()
    }

    scrollToMiddleSet()
    const frame = window.requestAnimationFrame(scrollToMiddleSet)
    const lateFrame = window.setTimeout(scrollToMiddleSet, 150)
    updateControls()

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(lateFrame)
    }
  }, [getLoopMetrics, setScrollLeftImmediately, shouldLoop, updateControls])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return undefined

    const handleScroll = () => {
      normalizeLoopPosition()
      updateControls()
    }
    const handleResize = () => {
      if (shouldLoop) {
        const metrics = getLoopMetrics()
        if (metrics) setScrollLeftImmediately(viewport, metrics.middleStart)
      }
      updateControls()
    }

    updateControls()
    viewport.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      viewport.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [getLoopMetrics, normalizeLoopPosition, setScrollLeftImmediately, shouldLoop, updateControls])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const media = window.matchMedia('(max-width: 767px)')
    const handleChange = () => setIsMobileViewport(media.matches)

    handleChange()
    if (media.addEventListener) {
      media.addEventListener('change', handleChange)
    } else {
      media.addListener(handleChange)
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', handleChange)
      } else {
        media.removeListener(handleChange)
      }
    }
  }, [])

  useEffect(() => {
    if (!autoPlayMs) return undefined
    if (autoPlayOnlyMobile && !isMobileViewport) return undefined
    if (!autoPlayOnMobile && isMobileViewport) return undefined
    if (typeof window === 'undefined') return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const timer = window.setInterval(() => {
      const viewport = viewportRef.current
      if (!viewport) return

      const slides = viewport.querySelectorAll('.card-carousel-slide')
      if (!slides.length) return

      const step = getSlideStep()
      if (!step) return

      if (shouldLoop) {
        normalizeLoopPosition()
        viewport.scrollBy({ left: autoPlayDirection * step, behavior: 'smooth' })
        return
      }

      const maxScroll = viewport.scrollWidth - viewport.clientWidth
      const nextLeft = viewport.scrollLeft + (autoPlayDirection * step)
      const target = autoPlayDirection < 0
        ? (nextLeft <= 4 ? maxScroll : nextLeft)
        : (nextLeft >= maxScroll - 4 ? 0 : nextLeft)

      viewport.scrollTo({ left: target, behavior: 'smooth' })
    }, autoPlayMs)

    return () => window.clearInterval(timer)
  }, [autoPlayDirection, autoPlayMs, autoPlayOnMobile, autoPlayOnlyMobile, getSlideStep, isMobileViewport, normalizeLoopPosition, shouldLoop])

  const moveCarousel = (direction) => {
    const viewport = viewportRef.current
    if (!viewport) return

    if (shouldLoop) {
      const step = getSlideStep()
      if (!step) return

      normalizeLoopPosition()
      viewport.scrollBy({
        left: direction * step,
        behavior: 'smooth',
      })
      return
    }

    viewport.scrollBy({
      left: direction * viewport.clientWidth,
      behavior: 'smooth',
    })
  }

  return (
    <div className={`card-carousel ${className} ${hasOverflow ? 'is-scrollable' : ''} ${shouldLoop ? 'is-looping' : ''}`} aria-label={label}>
      {hasOverflow && (
        <div className="card-carousel-controls">
          <button type="button" onClick={() => moveCarousel(-1)} disabled={!canGoBack} aria-label={`Previous ${label}`}>
            <span className="card-carousel-arrow card-carousel-arrow-left" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => moveCarousel(1)} disabled={!canGoForward} aria-label={`Next ${label}`}>
            <span className="card-carousel-arrow card-carousel-arrow-right" aria-hidden="true" />
          </button>
        </div>
      )}
      <div className="card-carousel-viewport" ref={viewportRef}>
        <div className="card-carousel-track">
          {displayItems.map((item, index) => (
            <div className="card-carousel-slide" key={index}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function HomeSections() {
  const { blogs } = useBlogs()
  const homeBlogs = blogs.slice(0, 4)
  const leadDoctor = doctors[0]
  const scrollingDoctors = doctors.slice(1)
  const [whyExpanded, setWhyExpanded] = useState(false)
  return (
    <>
      <section className="home-band why-renew-section" id="why-renew">
        <div className="home-band-inner">
          <SectionHeading
            eyebrow="Why Renew Healthcare"
            title={<><span>Advanced fertility care</span><span className="heading-blue">with transparent guidance.</span></>}
            text="Our IVF Centre in Kolkata offers advanced and reliable solutions for couples looking to start their parenthood journey, with strict protocols, global expertise, and compassionate support."
          />

          <div className="video-why-card">
            <div className={`video-why-copy ${whyExpanded ? 'is-expanded' : ''}`}>
              <h3>Why Renew Healthcare</h3>
              <p className="video-why-summary">Advanced IVF care with safe lab protocols and compassionate support.</p>
              <p className="video-why-intro" id="why-renew-mobile-copy">Our IVF Centre in Kolkata offers advanced and reliable solutions for couples looking to start their parenthood journey. Our IVF laboratories follow strict international protocols for handling eggs and sperm, ensuring the safest and most optimal conditions.</p>
              <p className="video-why-detail">We provide a wide range of infertility treatments under one roof, making the process seamless and convenient. Backed by experienced embryologists, gynaecologists, and specialists with global expertise, we focus on delivering high-quality care with a personalized approach.</p>
              <button
                className="video-why-read-more"
                type="button"
                aria-expanded={whyExpanded}
                aria-controls="why-renew-mobile-copy"
                onClick={() => setWhyExpanded(value => !value)}
              >
                {whyExpanded ? 'Read less' : 'Read more'}
              </button>
            </div>
            <a className="video-why-media" href="https://www.youtube.com/watch?v=lepLNR46L-c" target="_blank" rel="noreferrer" aria-label="Watch Renew Healthcare video">
              <img src="/images/renew/uploads/2025/01/Collage-Banner2.png" alt="Renew Healthcare patient success collage" />
              <span aria-hidden="true">▶</span>
            </a>
          </div>

          <div>
            <CardCarousel className="why-grid" label="Why Renew Healthcare blocks">
              {whyItems.map(([icon, title, text]) => (
                <article className="home-card why-card" key={title}>
                  <div className="why-icon">
                    <img src={`/images/renew/uploads/2024/07/${icon}`} alt="" />
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </CardCarousel>
          </div>
        </div>
      </section>

      <section className="home-band journey-section" id="parenthood-journey">
        <div className="home-band-inner">
          <SectionHeading
            eyebrow="Parenthood Journey"
            title={<><span>Where are you in your</span> <span className="heading-blue">journey to parenthood?</span></>}
          />
          <CardCarousel className="journey-grid" label="Parenthood journey blocks">
            {journeyCards.map(([title, image]) => (
              <button type="button" className="home-card journey-stage-card" key={title}>
                <img src={image} alt={title} />
                <span>{title}</span>
              </button>
            ))}
          </CardCarousel>
        </div>
      </section>

      <section className="home-band services-section" id="services">
        <div className="home-band-inner">
          <SectionHeading
            eyebrow="Treatments"
            title={<><span>Treatments Provided By</span> <span className="heading-blue">Renew Healthcare</span></>}
            text="End-to-end support through advanced fertility treatments, varied gynaecology services, and women’s aesthetic health services."
          />
          <CardCarousel className="service-showcase" label="Treatment blocks" autoPlayMs={2000} autoPlayOnlyMobile>
            {services.map(([title, text, to], index) => (
              <article className="home-card service-card" key={title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{text}</p>
                <Link to={to}>Explore Services <span aria-hidden="true">→</span></Link>
              </article>
            ))}
          </CardCarousel>
        </div>
      </section>

      <section className="home-band doctors-section" id="doctors">
        <div className="home-band-inner">
          <SectionHeading
            eyebrow="Doctors"
            title={<><span>Meet Our Team Of</span> <span className="heading-blue">Infertility Specialists</span></>}
          />
          <div className="doctor-desktop-layout">
            <article className="home-card doctor-card doctor-feature-card">
              <div className="doctor-image">
                <img src={leadDoctor[2]} alt={leadDoctor[0]} />
              </div>
              <div className="doctor-info">
                <h3>{leadDoctor[0]}</h3>
                <p>{leadDoctor[1]}</p>
                <Link to={leadDoctor[3]}>Know About {leadDoctor[0]} <span aria-hidden="true">→</span></Link>
              </div>
            </article>

            <CardCarousel className="doctor-grid doctor-scroll-grid" label="Doctor blocks" loop autoPlayMs={3500} autoPlayOnMobile={false} autoPlayDirection={-1}>
              {scrollingDoctors.map(([name, role, image, to]) => (
                <article className="home-card doctor-card" key={name}>
                  <div className="doctor-image">
                    <img src={image} alt={name} />
                  </div>
                  <div className="doctor-info">
                    <h3>{name}</h3>
                    <p>{role}</p>
                    <Link to={to}>Know About {name} <span aria-hidden="true">→</span></Link>
                  </div>
                </article>
              ))}
            </CardCarousel>
          </div>

          <CardCarousel className="doctor-grid doctor-mobile-grid" label="Doctor blocks" loop autoPlayMs={3500} autoPlayOnMobile={false}>
            {doctors.map(([name, role, image, to]) => (
              <article className="home-card doctor-card" key={name}>
                <div className="doctor-image">
                  <img src={image} alt={name} />
                </div>
                <div className="doctor-info">
                  <h3>{name}</h3>
                  <p>{role}</p>
                  <Link to={to}>Know About {name} <span aria-hidden="true">→</span></Link>
                </div>
              </article>
            ))}
          </CardCarousel>
          <div className="home-center-action">
            <Link to="/doctors" className="home-pill-link">View All</Link>
          </div>
        </div>
      </section>

      <section className="home-band media-section" id="media">
        <div className="home-band-inner">
          <SectionHeading
            eyebrow="As Featured In"
            title={<><span>Trusted by leading</span> <span className="heading-blue">media houses</span></>}
          />
          <div className="media-carousel" aria-label="Media logos">
            <div className="media-track">
              {[...mediaLogos, ...mediaLogos].map((logo, index) => (
                <div className="media-logo" key={`${logo}-${index}`}>
                  <img src={`/images/renew/uploads/2024/08/${logo}`} alt={logo.replace('.png', '').replace(/-/g, ' ')} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="home-band clinics-section" id="clinics">
        <div className="home-band-inner">
          <SectionHeading
            eyebrow="Our Clinics"
            title={<><span>Locate Renew Healthcare</span> <span className="heading-blue">near you</span></>}
          />
          <div className="clinic-grid">
            {clinics.map(({ name, place, image, to }) => (
              <Link className="home-card clinic-card" to={to} key={name}>
                <img src={image} alt={name} />
                <div>
                  <span>{place}</span>
                  <h3>{name}</h3>
                  <p className="clinic-card-link">Get directions <span aria-hidden="true">→</span></p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-band blogs-section" id="blogs">
        <div className="home-band-inner">
          <SectionHeading
            eyebrow="Latest Blogs"
            title={<><span>Fertility and pregnancy</span> <span className="heading-blue">care insights</span></>}
          />
          <CardCarousel className="blog-grid" label="Blog blocks">
            {homeBlogs.map(blog => (
              <Link className="home-card blog-card" to={`/blogs/${blog.slug}`} key={blog.slug}>
                <div className="blog-card-media">
                  <img src={blog.image} alt={blog.title} loading="lazy" />
                  <span className="blog-card-tag">{blog.category}</span>
                </div>
                <div className="blog-card-body">
                  <span className="blog-card-date">{blog.date}</span>
                  <h3>{blog.title}</h3>
                  <p>{blog.excerpt}</p>
                  <strong className="blog-card-link">Read More <span aria-hidden="true">→</span></strong>
                </div>
              </Link>
            ))}
          </CardCarousel>
          <div className="home-center-action">
            <Link to="/blogs" className="home-pill-link">View All Blogs</Link>
          </div>
        </div>
      </section>
    </>
  )
}
