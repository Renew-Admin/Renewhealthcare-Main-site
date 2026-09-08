import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import GoogleReviews from '../components/GoogleReviews/GoogleReviews.js'
import './ContentPages.css'
import './ServicesPages.css'

const reveal = {
  initial: { opacity: 1, y: 0 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
}

const stats = [
  ['6,000+', 'Babies delivered'],
  ['9,000+', 'IVF procedures'],
  ['27+', 'Years of expertise'],
  ['4.9 ★', '2,500+ Google reviews'],
]

const stories = [
  {
    name: 'Devina Goenka',
    image: '/images/renew/uploads/2024/08/IMG-20220307-WA0010-1.webp',
    text: 'I delivered a baby boy last month under the care and supervision of Dr. Rajeev Agarwal and Renew Healthcare. Thanks to Dr. Rajeev and his team, my journey right from conception and pregnancy to delivery and postpartum has been so smooth.',
  },
  {
    name: 'Priyanka Somani',
    image: '/images/renew/uploads/2024/08/IMG-20220307-WA0026-e1646641589453.webp',
    text: 'It was really a great experience having delivered my baby under Dr. Rajeev Agarwal and his team of experts. The doctor listens and answers all the queries very patiently and he was always available for support and guidance.',
  },
  {
    name: 'Priyanka Agarwal',
    image: '/images/renew/uploads/2024/08/3220315.jpg.webp',
    text: 'I delivered a baby boy last month after facing a host of complications during the second and third trimesters. My belief is that I could achieve a full-term pregnancy only due to Dr. Rajeev Agarwal’s excellence in the field of gynecology.',
  },
]

export default function SuccessStoriesPage() {
  return (
    <main className="content-page">
      <section className="service-banner">
        <img src="/images/renew/uploads/2024/12/Inner-Page-Banner-3.jpg" alt="Success stories" />
        <div className="service-banner-overlay" />
        <div className="service-banner-content">
          <span>Home / Success Stories</span>
          <h1>Success Stories</h1>
        </div>
      </section>

      <section className="service-content-band">
        <div className="service-content-inner">
          <motion.div className="split-feature" {...reveal}>
            <div className="service-heading-block is-left">
              <span>Patient Stories</span>
              <h2>Real journeys, <span className="heading-blue">real joy</span></h2>
              <p>We are delighted to help our patients fulfill their dreams of growing their families and to be part of their journey towards improved health and happier lives. Some of our patients have been kind enough to share their experiences with Renew Healthcare.</p>
            </div>
            <div className="feature-image-card">
              <img src="/images/renew/uploads/2025/01/Collage-Banner2.png" alt="Renew Healthcare success stories" />
            </div>
          </motion.div>

          <motion.div className="stat-band" {...reveal}>
            {stats.map(([value, label]) => (
              <div className="stat-band-item" key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </motion.div>

          <div className="story-grid">
            {stories.map((story, index) => (
              <motion.article
                className="story-card"
                key={story.name}
                {...reveal}
                transition={{ ...reveal.transition, delay: index * 0.06 }}
              >
                <img src={story.image} alt={story.name} />
                <div>
                  <svg className="story-quote" viewBox="0 0 24 24" width="30" height="30" fill="currentColor" aria-hidden="true">
                    <path d="M9.5 7C6.5 7 4 9.5 4 12.5V18h6v-6H7.5c0-1.4 1.1-2.5 2.5-2.5V7zm9 0c-3 0-5.5 2.5-5.5 5.5V18h6v-6h-2.5c0-1.4 1.1-2.5 2.5-2.5V7z" />
                  </svg>
                  <h3>{story.name}</h3>
                  <p>{story.text}</p>
                </div>
              </motion.article>
            ))}
          </div>

          <GoogleReviews />

          <section className="service-cta-band">
            <div>
              <span>Your story matters</span>
              <h2>Start your parenthood journey</h2>
              <p>Speak with Renew Healthcare for personal guidance and care.</p>
            </div>
            <div className="service-cta-actions">
              <Link to="/contact">Book Your Appointment</Link>
              <a href="tel:06292312076">Call 062923 12076</a>
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
