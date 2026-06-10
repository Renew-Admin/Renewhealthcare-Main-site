import { motion } from 'framer-motion'
import './AboutRenew.css'

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
}

export default function AboutRenew() {
  return (
    <section className="about-renew" id="about-renew">
      <div className="about-renew-glow" aria-hidden="true" />

      <div className="about-renew-inner">
        <motion.div className="about-renew-copy" {...reveal}>
          <div className="about-renew-eyebrow">
            <span className="about-renew-eyebrow-mark" aria-hidden="true" />
            Welcome To Renew Healthcare
          </div>

          <h2>
            Best IVF Centre
            <span>in Kolkata</span>
          </h2>

          <p>
            We are a team of experienced and compassionate healthcare professionals,
            led by Dr. Rajeev Agarwal, best fertility specialist in Kolkata. We offer
            IVF, laparoscopy, gynaecology and pregnancy care, supported by advanced
            technology and a patient-first approach.
          </p>

          <p>
            We understand that the journey to parenthood can be emotional and
            challenging. As a trusted IVF Centre in Kolkata, we provide personalized
            care, clear guidance, and continuous support at every step.
          </p>

          <div className="about-renew-actions">
            <a className="about-renew-primary" href="#about-renew">
              More About Us
              <span aria-hidden="true">→</span>
            </a>
            <a className="about-renew-secondary" href="#contact">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7.2 3.5 10 8.7 7.8 10c1.3 2.8 3.5 5 6.3 6.3l1.3-2.2 5.2 2.8-.8 3c-.2.8-.9 1.3-1.7 1.4C10.2 21.7 2.3 13.8 2.7 5.9c0-.8.6-1.5 1.4-1.7l3.1-.7Z" />
              </svg>
              Request A Call Back
            </a>
          </div>

          <div className="about-renew-trust">
            <strong>2,000+</strong>
            <span>families supported with compassionate, expert care</span>
          </div>
        </motion.div>

        <motion.div
          className="about-renew-visual"
          initial={{ opacity: 0, x: 45 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="about-renew-image-shell">
            <img
              src="https://renewhealthcare.in/wp-content/uploads/2024/12/ivf-treatment-near-me.png"
              alt="Renew Healthcare clinic, consultation spaces, and patient care team"
            />
          </div>

          <div className="about-renew-floating-note">
            <svg viewBox="0 0 32 36" aria-hidden="true">
              <path d="M16 2 29 7v10c0 8-5 14-13 17C8 31 3 25 3 17V7l13-5Z" />
              <path d="M16 10v14M10 17h12" />
            </svg>
            <span>Advanced technology.<br />Human-centered care.</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
