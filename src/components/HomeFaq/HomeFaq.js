'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useFaqs } from '../../hooks/useContent.js'
import { STATIC_HOME_FAQS } from '../../data/homeFaqs.js'
import './HomeFaq.css'

const reveal = {
  initial: { opacity: 1, y: 0 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
}

// faqRows: admin FAQs fetched on the server; answers are always in the HTML
// (the accordion only toggles their visibility with CSS).
export default function HomeFaq({ faqRows }) {
  const [active, setActive] = useState(-1)
  const { faqs: remoteFaqs } = useFaqs(faqRows)
  // Supabase FAQs replace the in-code defaults once they exist.
  const items = remoteFaqs.length ? remoteFaqs : STATIC_HOME_FAQS

  return (
    <section className="home-faq" id="faq">
      <div className="home-faq-inner">
        <motion.div className="home-faq-intro" {...reveal}>
          <span className="home-faq-eyebrow">FAQs</span>
          <h2><span>Questions families</span><br /><span className="heading-blue">ask us most</span></h2>
          <p>Clear, honest answers about IVF, costs, and what to expect on your journey to parenthood. Still unsure? Our team is one message away.</p>
          <a className="home-faq-cta" href="tel:06292312076">
            Talk to a specialist <span aria-hidden="true">→</span>
          </a>
        </motion.div>

        <motion.div className="home-faq-list" {...reveal}>
          {items.map(({ question: q, answer: a }, i) => {
            const open = active === i
            return (
              <div className={`home-faq-item ${open ? 'is-open' : ''}`} key={`${q}-${i}`}>
                <button type="button" onClick={() => setActive(open ? -1 : i)} aria-expanded={open}>
                  <span>{q}</span>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
                <div className="home-faq-answer" role="region">
                  <p>{a}</p>
                </div>
              </div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
