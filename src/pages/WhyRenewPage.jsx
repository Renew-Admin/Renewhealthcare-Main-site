import { Link } from 'react-router-dom'
import './ContentPages.css'
import './ServicesPages.css'

const reasons = [
  'Founded on principles which make it stand apart.',
  'Headed by one of the most reputed IVF fertility specialists of the city.',
  'Complete care of women and not restricted to infertility only.',
  'Best possible fertility treatment in Kolkata for women of every age and clinical complication.',
  'Ethical treatment where patients are prioritised for natural conception.',
  'Patient-oriented approach guided by expert consultants and top IVF doctors in Kolkata.',
]

const proofItems = [
  ['+27', 'Years of Experience'],
  ['+12k', 'Happy Clients'],
  ['+6k', 'Babies Delivered'],
  ['+9k', 'IVF Journeys'],
]

export default function WhyRenewPage() {
  return (
    <main className="content-page">
      <section className="service-banner">
        <img src="/images/renew/uploads/2024/12/Inner-Page-Banner-3.jpg" alt="Why Renew Healthcare" />
        <div className="service-banner-overlay" />
        <div className="service-banner-content">
          <span>Home / Why Renew</span>
          <h1>Why Renew</h1>
        </div>
      </section>

      <section className="service-content-band">
        <div className="service-content-inner">
          <section className="why-proof-band">
            <div>
              <span>Why families choose Renew</span>
              <h2><span>Specialist-led fertility &amp; women&apos;s health care</span> <span className="heading-blue">without unnecessary noise.</span></h2>
              <p>Renew keeps the focus on diagnosis, ethical guidance, clear choices, and treatment plans that match each patient&apos;s real clinical need.</p>
            </div>
            <div className="why-proof-grid">
              {proofItems.map(([value, label]) => (
                <article key={label}>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </article>
              ))}
            </div>
          </section>

          <div className="split-feature">
            <div className="service-heading-block is-left">
              <span>Why Renew Healthcare?</span>
              <h2>Why Renew <span className="heading-blue">Healthcare?</span></h2>
              <p>Renew Healthcare is founded on certain principles which make it stand apart. Headed by one of the most reputed IVF fertility specialist of the city, it looks at providing complete care of women and not restricted to infertility only.</p>
              <p>Modes of ethical treatment are called such because patients are prioritised for natural conception. If artificial intervention is absolutely deemed necessary by our experts, only then will it be recommended.</p>
            </div>
            <div className="feature-image-card">
              <img src="/images/renew/uploads/2024/12/why_renew-img1.webp" alt="Why Renew Healthcare" />
            </div>
          </div>

          <div className="reason-grid">
            {reasons.map((reason, index) => (
              <article className="content-panel reason-card" key={reason}>
                <h3>{String(index + 1).padStart(2, '0')}</h3>
                <p>{reason}</p>
              </article>
            ))}
          </div>

          <section className="why-visual-band">
            <div className="service-heading-block is-left">
              <span>Inside Renew</span>
              <h2><span>Care spaces designed around</span> <span className="heading-blue">clarity and comfort.</span></h2>
              <p>Visuals are separated from the numbered cards so each point stays clean, readable, and easy to scan.</p>
            </div>
            <div className="why-visual-grid">
              <figure>
                <img src="/images/renew/uploads/2024/12/why_renew-img1.webp" alt="Renew Healthcare care environment" />
              </figure>
              <figure>
                <img src="/images/renew/uploads/2024/12/why_renew-img2.webp" alt="Renew Healthcare patient support" />
              </figure>
            </div>
          </section>

          <section className="service-cta-band">
            <div>
              <span>Renew Healthcare</span>
              <h2>Move forward <span className="heading-blue">with confidence</span></h2>
              <p>The patients are given information and allowed to make their own choices, guided by our expert consultants.</p>
            </div>
            <div className="service-cta-actions">
              <Link to="/contact">Book Your Appointment</Link>
              <a href="tel:06292269060">Call 062922 69060</a>
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
