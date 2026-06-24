import { Link } from 'react-router-dom'
import './ContentPages.css'
import './ServicesPages.css'

export default function IvfSuccessPage() {
  return (
    <main className="content-page">
      <section className="service-banner">
        <img src="/images/renew/uploads/2024/12/Inner-Page-Banner-2.jpg" alt="IVF success factors" />
        <div className="service-banner-overlay" />
        <div className="service-banner-content">
          <span>Home / IVF Success Factors And Rates</span>
          <h1>IVF Success Factors And Rates</h1>
        </div>
      </section>

      <section className="service-content-band">
        <div className="service-content-inner">
          <div className="service-heading-block">
            <span>IVF Success</span>
            <h2>Understanding IVF success rates</h2>
            <p>In vitro fertilization (IVF) is a popular and highly effective method of assisted reproduction. IVF success rates have improved significantly over the years, and many couples can conceive with the help of this technology.</p>
          </div>
          {[
            ['What success means', 'There are three important things to be considered when talking about the highest IVF success rates. Success may be counted as positive beta-hcg pregnancy, clinical pregnancy when heartbeat is detected, or final delivery and take-home baby rates.'],
            ['Treatment conditions', 'Talking of the best IVF success, it is important to consider under what conditions and what cost to the patient the IVF treatment was done. Many clinics may resort to donor eggs and donor sperm to increase success rates.'],
            ['Renew Healthcare outcomes', 'Renew Healthcare performs more than 60% of the IVF cycles with self-eggs and 78% of the IVF cycles with husband sperms and yet achieves internationally comparable IVF success rates.'],
            ['Factors that impact success', 'The success of IVF depends on several factors, including the woman’s age, the cause of infertility, and the quality of the eggs and sperm. Women under the age of 35 have the highest IVF success rates.'],
          ].map(([heading, body]) => (
            <article className="service-detail-card" key={heading}>
              <h3>{heading}</h3>
              <div className="service-rich-text"><p>{body}</p></div>
            </article>
          ))}
          <section className="service-cta-band">
            <div>
              <span>Need clarity?</span>
              <h2>Speak with Renew Healthcare</h2>
              <p>Choose an experienced fertility clinic and understand the right course of care.</p>
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
