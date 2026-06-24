import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import './AdShowcase.css'

const SLIDES = [
  { src: '/images/renew/uploads/2026/03/Main-Banner-1.jpg.webp', alt: 'Renew Healthcare — crafting happy families, one baby at a time' },
  { src: '/images/renew/uploads/2026/03/IVF-IUI-Ad-English.jpg.webp', alt: 'IVF & IUI treatment offer at Renew Healthcare' },
  { src: '/images/renew/uploads/2026/03/IVF-IUI-Ad-Bengali.jpg.webp', alt: 'IVF ও IUI চিকিৎসা — Renew Healthcare' },
]

const STATS = [
  ['27+', 'Years of expertise'],
  ['9,000+', 'IVF procedures'],
  ['6,000+', 'Babies delivered'],
  ['4.9 ★', '2,500+ reviews'],
]

const POINTS = [
  'Personalised treatment plans with fully transparent costing',
  'Self-cycle-first — we prioritise your own eggs and sperm',
  'Month-on-month published IVF success rates',
  'Genetic, endoscopy & nutrition support under one roof',
]

const reveal = {
  initial: { opacity: 1, y: 0 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
}

export default function AdShowcase() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = SLIDES.length

  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setIndex(i => (i + 1) % total), 4500)
    return () => clearInterval(t)
  }, [paused, total])

  const go = i => setIndex((i + total) % total)

  return (
    <section className="wr-showcase" id="ivf-offer">
      <div
        className="wr-carousel"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        aria-roledescription="carousel"
      >
        {SLIDES.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            className={`wr-slide ${i === index ? 'is-active' : ''}`}
            aria-hidden={i !== index}
            draggable="false"
          />
        ))}

        <button type="button" className="wr-arrow wr-arrow-prev" onClick={() => go(index - 1)} aria-label="Previous slide">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
        </button>
        <button type="button" className="wr-arrow wr-arrow-next" onClick={() => go(index + 1)} aria-label="Next slide">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
        </button>

        <div className="wr-dots">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              className={i === index ? 'is-active' : ''}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
            />
          ))}
        </div>
      </div>

      <div className="wr-copy">
        <motion.span className="wr-eyebrow" {...reveal}>
          <span className="wr-eyebrow-dot" />
          Crafting Happy Families, One Baby At A Time
        </motion.span>

        <motion.h2 className="wr-title" {...reveal} transition={{ ...reveal.transition, delay: 0.05 }}>
          Advanced IVF &amp; IUI care, <span>built around you</span>
        </motion.h2>

        <motion.p className="wr-lead" {...reveal} transition={{ ...reveal.transition, delay: 0.1 }}>
          From your first consultation to the moment you hold your baby, Renew Healthcare guides
          you with compassion, clinical excellence, and complete transparency — among the highest
          IVF success rates in Kolkata.
        </motion.p>

        <motion.ul className="wr-points" {...reveal} transition={{ ...reveal.transition, delay: 0.12 }}>
          {POINTS.map(point => <li key={point}>{point}</li>)}
        </motion.ul>

        <motion.div className="wr-stats" {...reveal} transition={{ ...reveal.transition, delay: 0.14 }}>
          {STATS.map(([value, label]) => (
            <div className="wr-stat" key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div className="wr-actions" {...reveal} transition={{ ...reveal.transition, delay: 0.16 }}>
          <Link to="/contact" className="wr-primary">Book Your Appointment <span aria-hidden="true">→</span></Link>
          <a href="tel:06292269060" className="wr-secondary">Call 062922 69060</a>
        </motion.div>
      </div>
    </section>
  )
}
