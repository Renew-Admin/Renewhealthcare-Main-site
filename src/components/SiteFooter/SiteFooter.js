import { motion } from 'framer-motion'
import './SiteFooter.css'

const CARDS = [
  {
    number: '01',
    label: 'Start here',
    title: 'Plan your first consultation',
    text: 'Speak with our care team and understand the right next step for your journey.',
    link: 'Request a call back',
    href: '#contact',
  },
  {
    number: '02',
    label: 'Visit us',
    title: 'A calm clinic in Kolkata',
    text: 'Modern fertility care designed around privacy, comfort, and clear guidance.',
    link: 'Get directions',
    href: '#contact',
  },
  {
    number: '03',
    label: 'Talk to us',
    title: 'Questions deserve clear answers',
    text: 'Connect with a fertility coordinator for appointments, treatments, and support.',
    link: 'Contact our team',
    href: '#contact',
  },
  {
    number: '04',
    label: 'Patient care',
    title: 'Support beyond appointments',
    text: 'Continuous, compassionate support for every stage of fertility and pregnancy care.',
    link: 'Explore patient care',
    href: '#about-renew',
  },
]

export default function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="site-footer-intro">
        <div>
          <span className="site-footer-eyebrow">YOUR NEXT STEP</span>
          <h2>Care that continues<br /><span>beyond the clinic.</span></h2>
        </div>
        <p>
          Renew Healthcare combines clinical expertise with personal support,
          helping every family move forward with confidence.
        </p>
      </div>

      <motion.div
        className="site-footer-cards"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
      >
        {CARDS.map(card => (
          <motion.a
            href={card.href}
            className="site-footer-card"
            key={card.number}
            variants={{
              hidden: { opacity: 0, y: 24 },
              show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
            }}
          >
            <div className="site-footer-card-top">
              <span className="site-footer-number">{card.number}</span>
              <span className="site-footer-label">{card.label}</span>
            </div>
            <h3>{card.title}</h3>
            <p>{card.text}</p>
            <span className="site-footer-link">
              {card.link}
              <span aria-hidden="true">↗</span>
            </span>
          </motion.a>
        ))}
      </motion.div>

      <div className="site-footer-bottom">
        <a className="site-footer-brand" href="#" aria-label="Renew Healthcare">
          <img src="/images/Logo.png" alt="Renew Healthcare" />
        </a>

        <div className="site-footer-details">
          <span>Kolkata, West Bengal</span>
          <a href="mailto:care@renewhealthcare.in">care@renewhealthcare.in</a>
          <a href="tel:+910000000000">+91 00000 00000</a>
        </div>

        <span className="site-footer-copy">© {new Date().getFullYear()} Renew Healthcare</span>
      </div>
    </footer>
  )
}
