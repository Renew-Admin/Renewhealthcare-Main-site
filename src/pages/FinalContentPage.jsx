import { Link, useParams } from 'react-router-dom'
import { finalPages } from '../data/finalPages.js'
import NotFound from './NotFound.jsx'
import Seo from '../components/Seo.js'
import { useLeadSubmit } from '../hooks/useLeadSubmit.js'
import './FinalPages.css'
import './ServicesPages.css'

const clinics = [
  {
    name: 'Gariahat (Main)',
    address: '18C, Mandeville Gardens, Ballygunge, Kolkata, West Bengal 700019',
    phone: '+91 6292 269 060',
    map: 'https://www.google.com/maps?q=Renew+Healthcare+Mandeville+Gardens+Kolkata',
  },
  {
    name: 'Saltlake',
    address: 'CB 69, CB Block, Sector 1, Bidhannagar, Kolkata, West Bengal 700064',
    phone: '+91 8336 968 661',
    map: 'https://www.google.com/maps?q=Renew+Healthcare+Saltlake+Kolkata',
  },
  {
    name: 'Jamshedpur',
    address: 'Michael John Tower, 1st Floor, Southern Area 06, K-Road Bistupur 831001',
    phone: '+91 9153 994 100',
    map: 'https://www.google.com/maps?q=Renew+Healthcare+Bistupur+Jamshedpur',
  },
]

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
  banner: '/images/renew/uploads/2024/12/Inner-Page-Banner-3.jpg',
  eyebrow: 'Contact Us',
  intro: 'Want to get in touch? We would love to hear from you. Reach Renew Healthcare for appointments, consultation support, clinic guidance, and patient care coordination.',
  image: '/images/renew/uploads/2024/07/counseling-img.png',
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
  if (!page) return <NotFound />
  const isContact = pageKey === 'contact'
  const isPackages = pageKey === 'packages'
  const seoPath = page.path ? page.path.replace(/\/+$/, '') : '/' + pageKey
  const seoDesc = (page.intro || `${page.title} at Renew Healthcare, Kolkata.`).slice(0, 160)

  return (
    <main className="content-page">
      <Seo title={page.title} description={seoDesc} path={seoPath} image={page.banner} />
      <section className="service-banner">
        <img src={page.banner} alt={page.title} />
        <div className="service-banner-overlay" />
        <div className="service-banner-content"><span>Home / {page.title}</span><h1>{page.title}</h1></div>
      </section>
      <section className="service-content-band">
        <div className="service-content-inner">
          {page.image && !isContact ? (
            <div className="final-intro-split">
              <div className="service-heading-block is-left">
                <span>{page.eyebrow}</span><h2>{page.title}</h2>{page.intro && <p>{page.intro}</p>}
              </div>
              <div className="final-feature-image"><img src={page.image} alt={page.title} loading="lazy" /></div>
            </div>
          ) : (
            <div className="service-heading-block">
              <span>{page.eyebrow}</span><h2>{page.title}</h2>{page.intro && <p>{page.intro}</p>}
            </div>
          )}
          {isContact && <ContactBlock />}
          {isPackages && <PackageCards />}
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

const quickContacts = [
  ['Call us', '062922 69060', 'tel:06292269060', 'phone'],
  ['WhatsApp', 'Chat with our team', 'https://api.whatsapp.com/send?phone=916292269060', 'whatsapp'],
  ['Email', 'info@renewhealthcare.in', 'mailto:info@renewhealthcare.in', 'mail'],
  ['Online consultation', 'Book a video consult', '/contact', 'video'],
]

function QuickIcon({ name }) {
  const c = { viewBox: '0 0 24 24', width: 22, height: 22, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  if (name === 'phone') return <svg {...c}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
  if (name === 'whatsapp') return <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M.5 23.5l1.65-6A11.4 11.4 0 0 1 .6 11.6C.6 5.3 5.8.1 12.1.1c3 0 5.9 1.2 8 3.3a11.3 11.3 0 0 1 3.4 8.2c0 6.3-5.2 11.5-11.5 11.5-1.9 0-3.8-.5-5.4-1.4l-6.1 1.8zm6.4-3.7l.4.2c1.4.8 3 1.3 4.7 1.3 5.2 0 9.5-4.3 9.5-9.6 0-2.5-1-5-2.8-6.8a9.5 9.5 0 0 0-6.7-2.8C6.9 2.3 2.6 6.6 2.6 11.8c0 1.8.5 3.5 1.4 5l.3.4-1 3.6 3.6-1z" /></svg>
  if (name === 'mail') return <svg {...c}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
  return <svg {...c}><rect x="2" y="6" width="14" height="12" rx="2" /><path d="m16 10 6-3v10l-6-3z" /></svg>
}

function ContactBlock() {
  const { status, error, submit } = useLeadSubmit()
  const onSubmit = async event => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const ok = await submit({
      name: data.get('name'),
      phone: data.get('phone'),
      email: data.get('email'),
      service: data.get('service'),
      message: data.get('message'),
      source: 'contact-page',
    })
    if (ok) form.reset()
  }
  return (
    <>
      <div className="contact-quick-row">
        {quickContacts.map(([label, value, href, icon]) => {
          const internal = href.startsWith('/')
          const Inner = (
            <>
              <span className="contact-quick-icon"><QuickIcon name={icon} /></span>
              <span><strong>{label}</strong><small>{value}</small></span>
            </>
          )
          return internal
            ? <Link className="contact-quick-card" to={href} key={label}>{Inner}</Link>
            : <a className="contact-quick-card" href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" key={label}>{Inner}</a>
        })}
      </div>

      <div className="contact-grid">
        <form className="contact-form" onSubmit={onSubmit}>
          <input name="name" placeholder="Name" required /><input name="phone" placeholder="Phone" required /><input name="email" placeholder="Email" />
          <select name="service" defaultValue=""><option value="" disabled>Service</option><option>IVF Consultation</option><option>Pregnancy Care</option><option>Gynaecology</option></select>
          <textarea name="message" placeholder="Message" /><button type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Submit Request'}</button>
          {status === 'sent' && <p className="lead-form-msg ok">Thank you! Our team will reach out shortly.</p>}
          {status === 'error' && <p className="lead-form-msg err">{error}</p>}
        </form>
        <div className="contact-info-card">
          <img src="/images/renew/uploads/2024/07/headphone.png" alt="Contact Renew Healthcare" />
          <h3>Contact Us</h3>
          <p>Want to get in touch? We would love to hear from you. Here is how you can reach us.</p>
          <a href="tel:06292269060">062922 69060</a>
          <a href="mailto:info@renewhealthcare.in">info@renewhealthcare.in</a>
          <span>Clinic Timings Monday to Saturday 9:00 AM - 6:00 PM</span>
          <div className="contact-social-row">
            <a href="https://www.facebook.com/renewhealthcare.in" target="_blank" rel="noreferrer">Facebook</a>
            <a href="https://www.instagram.com/renewhealthcare/" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://www.youtube.com/channel/UCE28jj3ng2d313UbiVYUxdQ" target="_blank" rel="noreferrer">YouTube</a>
          </div>
        </div>
      </div>

      <div className="contact-clinics">
        <h3 className="contact-clinics-title">Visit a Renew Healthcare clinic</h3>
        <div className="contact-clinics-grid">
          {clinics.map(clinic => (
            <article className="contact-clinic-card" key={clinic.name}>
              <h4>{clinic.name}</h4>
              <p>{clinic.address}</p>
              <a href={`tel:${clinic.phone.replace(/\s/g, '')}`}>{clinic.phone}</a>
              <a className="contact-clinic-dir" href={clinic.map} target="_blank" rel="noreferrer">Get directions →</a>
            </article>
          ))}
        </div>
      </div>

    </>
  )
}
