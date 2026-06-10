import React, { useState, useEffect } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import './Hero.css'

const AVATARS = [
  '/images/avatar1.webp',
  '/images/avatar2.webp',
  '/images/avatar3.webp',
]

const SLIDES = [
  {
    image: '/images/hero_woman_1.webp',
    alt: 'A woman smiling, looking toward the light',
    badge: 'WELCOME TO RENEW HEALTHCARE',
    titleA: 'Kolkata’s Trusted IVF',
    titleB: 'and Fertility Centre',
    desc: 'Expert and compassionate care for every step of your journey. Led by Dr. Rajeev Agarwal, we offer IVF, IUI, gynaecology and pregnancy care with a patient-first approach.',
    cardTitle: ['Start your', 'parenthood journey'],
    cardDesc: ['Personalized fertility care', 'for every step.'],
  },
  {
    image: '/images/hero_kid.webp',
    alt: 'A peacefully sleeping baby',
    imgClass: 'is-kid',
    badge: 'EVERY MIRACLE MATTERS',
    titleA: 'From hope to',
    titleB: 'a heartbeat',
    desc: 'Advanced IVF and IUI treatments with some of the highest success rates in Kolkata — bringing the joy of parenthood within reach of every family.',
    cardTitle: ['Welcome', 'little miracles'],
    cardDesc: ['Trusted by 2,000+', 'happy families.'],
  },
  {
    image: '/images/hero_family.webp',
    alt: 'A happy multi-generational family together',
    badge: 'CARE FOR EVERY GENERATION',
    titleA: 'Complete care for',
    titleB: 'growing families',
    desc: 'From fertility and pregnancy to gynaecology and beyond — holistic, compassionate care that supports your whole family at every stage of life.',
    cardTitle: ['Here for', 'your family'],
    cardDesc: ['Holistic care for a', 'healthier tomorrow.'],
  },
]

const pad = n => String(n).padStart(2, '0')
const total = SLIDES.length
const SLIDE_SCROLL = 600 // px of fake-scroll per slide
const PIN_DISTANCE = SLIDE_SCROLL * total // total pinned scroll distance

function Hero() {
  const [index, setIndex] = useState(0)

  // Pinned fake-scroll only on desktop + when motion is allowed.
  // Mobile gets a simple auto-rotating slider; reduced-motion stays static.
  const [animate, setAnimate] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 901px)')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      setReduceMotion(reduce.matches)
      setAnimate(wide.matches && !reduce.matches)
      const mobile = !wide.matches
      setIsMobile(mobile)
      if (mobile) {
        setIndex(0)
      }
    }
    update()
    wide.addEventListener('change', update)
    reduce.addEventListener('change', update)
    return () => {
      wide.removeEventListener('change', update)
      reduce.removeEventListener('change', update)
    }
  }, [])

  // Scroll position → active slide (while the hero is pinned).
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', y => {
    if (!animate) return
    const i = Math.min(total - 1, Math.max(0, Math.floor(y / SLIDE_SCROLL)))
    setIndex(i)
  })

  // Auto-rotate in the static fallback only (never under reduced-motion, and never on mobile).
  useEffect(() => {
    if (animate || reduceMotion || isMobile) return
    const t = setInterval(() => setIndex(i => (i + 1) % total), 5000)
    return () => clearInterval(t)
  }, [animate, reduceMotion, isMobile])

  const goTo = i => {
    const target = (i + total) % total
    if (animate) {
      window.scrollTo({ top: target * SLIDE_SCROLL + SLIDE_SCROLL / 2, behavior: 'smooth' })
    } else {
      setIndex(target)
    }
  }
  const prev = () => goTo(index - 1)
  const next = () => goTo(index + 1)

  const s = SLIDES[index]

  // Entrance choreography (only when animating).
  const container = animate
    ? { variants: { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } }, initial: 'hidden', animate: 'show' }
    : {}
  const item = animate
    ? { variants: { hidden: { opacity: 0, x: -48 }, show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } } }
    : {}
  const cardAnim = animate
    ? { initial: { opacity: 0, x: 70 }, animate: { opacity: 1, x: 0 }, transition: { duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] } }
    : {}

  return (
    <div className="hero-scroll" style={animate ? { height: `calc(${PIN_DISTANCE}px + 100svh)` } : undefined}>
      <section className={`hero-section ${animate ? 'is-pinned' : ''}`}>
        {/* Cross-fading slide images */}
        <div className="hero-photo">
          <div className="hero-photo-zoom">
            {SLIDES.map((slide, i) => (
              <motion.img
                key={i}
                src={isMobile && i === 0 ? '/images/About_renew.png' : slide.image}
                alt={slide.alt}
                className={`hero-photo-img ${slide.imgClass || ''}`}
                initial={false}
                animate={{ opacity: index === i ? 1 : 0, scale: index === i ? 1 : 1.04 }}
                transition={{ duration: 0.9, ease: 'easeInOut' }}
              />
            ))}
          </div>
          <div className="hero-photo-fade" />
        </div>

        {/* Copy — staggers in from the left, re-keyed per slide */}
        <div className="hero-inner">
          <motion.div className="hero-content" key={index} {...container}>
            <motion.div className="welcome-badge" {...item}>
              <svg viewBox="0 0 24 24" width="15" height="15" fill="#4CAF6E" aria-hidden="true">
                <path d="M12 21.3l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.3z" />
              </svg>
              <span>{s.badge}</span>
            </motion.div>

            <motion.h1 className="hero-heading" {...item}>
              <span>{s.titleA}</span>
              <span className="heading-blue">{s.titleB}</span>
            </motion.h1>

            <motion.span className="heading-underline" {...item} />

            <motion.p className="hero-desc" {...item}>{s.desc}</motion.p>

            <motion.div className="trust-block" {...item}>
              <div className="avatar-row">
                {AVATARS.map((src, i) => (
                  <img key={i} src={src} alt={`Patient ${i + 1}`} className="trust-avatar" />
                ))}
                <div className="avatar-count">+2k</div>
              </div>
              <span className="trust-text">Trusted by 2,000+ patients worldwide</span>
            </motion.div>

            <motion.div className="holistic" {...item}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
                <path
                  d="M12 2.5l7 2.8v5.2c0 4.5-3 8.6-7 9.9-4-1.3-7-5.4-7-9.9V5.3l7-2.8z"
                  stroke="#3B8E5A"
                  strokeWidth="1.5"
                  fill="#F2F8F3"
                />
                <path d="M12 8v5M9.5 10.5h5" stroke="#3B8E5A" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <span>Holistic care for a healthier tomorrow</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating journey card — slides in from the right, re-keyed per slide */}
        <motion.div className="journey-card" key={`card-${index}`} {...cardAnim}>
          <div className="journey-icon">
            <svg viewBox="0 0 40 40" width="30" height="30" fill="none" aria-hidden="true">
              <circle cx="15.5" cy="12.5" r="4.3" fill="#1565D8" />
              <circle cx="26.5" cy="14.5" r="3.3" fill="#1565D8" />
              <path d="M7.5 31c0-4.7 3-7.6 8-7.6s8 2.9 8 7.6" stroke="#1565D8" strokeWidth="2.2" strokeLinecap="round" />
              <path d="M21.5 31c0-3.8 2.3-6.2 5.5-6.2s5.5 2.4 5.5 6.2" stroke="#1565D8" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </div>

          <h3 className="journey-title">{s.cardTitle[0]}<br />{s.cardTitle[1]}</h3>
          <span className="journey-underline" />

          <div className="journey-bottom">
            <p className="journey-desc">{s.cardDesc[0]}<br />{s.cardDesc[1]}</p>
            {!isMobile && (
              <button className="journey-arrow" onClick={next} aria-label="Next slide">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
                  <path d="M5 12h13M13 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
        </motion.div>

        {/* Slider pagination */}
        {!isMobile && (
          <div className="slider">
            <button className="slider-btn" onClick={prev} aria-label="Previous slide">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                <path d="M14 6l-6 6 6 6" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className="slider-num">
              <span className="num-active">{pad(index + 1)}</span>
              <span className="slider-dash" />
              <span>{pad(total)}</span>
            </span>
            <button className="slider-btn" onClick={next} aria-label="Next slide">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
                <path d="M10 6l6 6-6 6" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

export default Hero
