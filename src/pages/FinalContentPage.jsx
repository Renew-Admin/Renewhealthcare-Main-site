import { Link, useParams } from 'react-router-dom'
import { finalPages } from '../data/finalPages.js'
import './FinalPages.css'
import './ServicesPages.css'

const pageByRoute = {
  packages: 'packages',
  contact: 'contact',
  'male-infertility': 'male-infertility',
  'female-infertility': 'female-infertility',
  'injection-instruction': 'injection-instruction',
  'mental-health': 'mental-health',
  'international-patients': 'international-patients',
  bangladesh: 'bangladesh',
  genetic: 'genetic',
}

const contactPage = {
  title: 'Contact',
  banner: 'https://renewhealthcare.in/wp-content/uploads/2024/12/Inner-Page-Banner-3.jpg',
  eyebrow: 'Contact Us',
  intro: 'Want to get in touch? We would love to hear from you. Reach Renew Healthcare for appointments, consultation support, clinic guidance, and patient care coordination.',
  image: 'https://renewhealthcare.in/wp-content/uploads/2024/07/counseling-img.png',
  sections: [
    {
      heading: 'Renew Healthcare Clinics',
      body: 'Call us at 062922 69060 or email info@renewhealthcare.in for appointments and patient support.\n- Saltlake: EN-26, Sector V, Saltlake City, Kolkata, West Bengal\n- Gariahat: 46B, Rafi Ahmed Kidwai Road, Kolkata, West Bengal\n- Jamshedpur: Renew Healthcare, Jamshedpur, Jharkhand',
    },
    {
      heading: 'Clinic Timings',
      body: 'Clinic Timings Monday to Saturday 9:00 AM - 6:00 PM. Appointment slots, doctor availability, and consultation timing can vary by clinic, so please call before visiting.',
    },
  ],
}

export function FinalContentByKey({ pageKey }) {
  const page = pageKey === 'contact' ? contactPage : finalPages[pageKey]
  if (!page) return null
  const isContact = pageKey === 'contact'
  const isPackages = pageKey === 'packages'

  return (
    <main className="content-page">
      <section className="service-banner">
        <img src={page.banner} alt={page.title} />
        <div className="service-banner-overlay" />
        <div className="service-banner-content"><span>Home / {page.title}</span><h1>{page.title}</h1></div>
      </section>
      <section className="service-content-band">
        <div className="service-content-inner">
          <div className="service-heading-block">
            <span>{page.eyebrow}</span><h2>{page.title}</h2>{page.intro && <p>{page.intro}</p>}
          </div>
          {isContact && <ContactBlock />}
          {isPackages && <PackageCards />}
          {page.image && <div className="final-feature-image"><img src={page.image} alt={page.title} /></div>}
          <div className="service-section-stack">
            {page.sections.map(section => (
              <article className="service-detail-card" key={section.heading}>
                <h3>{section.heading}</h3>
                <div className="service-rich-text">{section.body.split('\n').filter(Boolean).map((line, i) => line.startsWith('- ') ? <li key={i}>{line.slice(2)}</li> : <p key={i}>{line}</p>)}</div>
              </article>
            ))}
          </div>
          <section className="service-cta-band">
            <div><span>Renew Healthcare</span><h2>Talk to our team</h2><p>For appointments, treatment planning, and patient guidance.</p></div>
            <div className="service-cta-actions"><Link to="/contact">Book Appointment</Link><a href="tel:06292269060">Call 062922 69060</a></div>
          </section>
        </div>
      </section>
    </main>
  )
}

export default function FinalContentPage() {
  const params = useParams()
  return <FinalContentByKey pageKey={pageByRoute[params.pageKey] || params.pageKey} />
}

export function CoursePage({ pageKey }) {
  return <FinalContentByKey pageKey={pageKey} />
}

function PackageCards() {
  const cards = [
    ['Fertility Enhancing Surgery', 'Used to treat infertility, improve fertility treatment outcomes, or preserve fertility in selected cases.', 'Transparent costing discussed after clinical evaluation'],
    ['IVF Planning', 'Costs depend on protocol, medication, injections, lab needs, and individual treatment plan.', 'Discuss with care team'],
    ['Transparency', 'Renew Healthcare shares detailed information from stimulation, egg retrieval, embryo development, and expected outcomes.', 'Clear counselling before treatment'],
  ]
  return <div className="package-grid">{cards.map(([name, body, price]) => <article className="package-card" key={name}><h3>{name}</h3><p>{body}</p><strong>{price}</strong></article>)}</div>
}

function ContactBlock() {
  return (
    <>
      <div className="contact-grid">
        <form className="contact-form">
          <input placeholder="Name" /><input placeholder="Phone" /><input placeholder="Email" />
          <select defaultValue=""><option value="" disabled>Service</option><option>IVF Consultation</option><option>Pregnancy Care</option><option>Gynaecology</option></select>
          <textarea placeholder="Message" /><button type="button">Submit Request</button>
        </form>
        <div className="contact-info-card">
          <img src="https://renewhealthcare.in/wp-content/uploads/2024/07/headphone.png" alt="Contact Renew Healthcare" />
          <h3>Contact Us</h3>
          <p>Want to get in touch? We would love to hear from you. Here is how you can reach us.</p>
          <a href="tel:06292269060">062922 69060</a>
          <a href="mailto:info@renewhealthcare.in">info@renewhealthcare.in</a>
          <span>Clinic Timings Monday to Saturday 9:00 AM - 6:00 PM</span>
          <div className="contact-social-row">
            <a href="https://www.facebook.com/renewhealthcareindia" target="_blank" rel="noreferrer">Facebook</a>
            <a href="https://www.instagram.com/renewhealthcare/" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://www.youtube.com/@RenewHealthcare" target="_blank" rel="noreferrer">YouTube</a>
          </div>
        </div>
      </div>
      <div className="contact-map-card">
        <iframe
          title="Renew Healthcare map"
          src="https://www.google.com/maps?q=Renew%20Healthcare%20Saltlake%20Kolkata&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </>
  )
}
