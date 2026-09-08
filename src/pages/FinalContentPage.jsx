import { useRef, useState } from 'react'
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
    phone: '+91 6292312076',
    map: 'https://www.google.com/maps?q=Renew+Healthcare+Mandeville+Gardens+Kolkata',
  },
  {
    name: 'Saltlake',
    address: 'CB 69, CB Block, Sector 1, Bidhannagar, Kolkata, West Bengal 700064',
    phone: '+91 6292312076',
    map: 'https://www.google.com/maps?q=Renew+Healthcare+Saltlake+Kolkata',
  },
  {
    name: 'Jamshedpur',
    address: 'Michael John Tower, 1st Floor, Southern Area 06, K-Road Bistupur 831001',
    phone: '+91 6292312076',
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

function compactText(part) {
  const clean = String(part || '').replace(/\s+/g, ' ').trim()
  const sentence = clean.match(/^(.{70,220}?[.!?])(\s|$)/)
  if (sentence) return sentence[1]
  return clean.split(' ').slice(0, 24).join(' ')
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
      body: 'Call us at 062923 12076 or email info@renewhealthcare.in for appointments and patient support.\n- Saltlake: EN-26, Sector V, Saltlake City, Kolkata, West Bengal\n- Gariahat: 46B, Rafi Ahmed Kidwai Road, Kolkata, West Bengal\n- Jamshedpur: Renew Healthcare, Jamshedpur, Jharkhand',
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
            <div className={`final-intro-split${page.video ? ' final-intro-split-video' : ''}`}>
              <div className="service-heading-block is-left">
                <span>{page.eyebrow}</span><h2>{page.title}</h2>{page.intro && <p>{page.intro}</p>}
              </div>
              <FinalFeatureMedia page={page} />
            </div>
          ) : (
            <div className="service-heading-block">
              <span>{page.eyebrow}</span><h2>{page.title}</h2>{page.intro && <p>{page.intro}</p>}
            </div>
          )}
          {isContact && <ContactBlock />}
          {isPackages && <PackageContent />}
          {!isPackages && (
            <div className="service-section-stack">
              {page.sections.map(section => (
                <article className="service-detail-card" key={section.heading}>
                  <h3>{section.heading}</h3>
                  <div className="service-rich-text">
                    {section.body.split('\n').filter(Boolean).map((line, i) => line.startsWith('- ')
                      ? <li key={i}>{line.slice(2)}</li>
                      : (
                        <p key={i}>
                          <span className="mobile-copy-short">{compactText(line)}</span>
                          <span className="desktop-copy-full">{line}</span>
                        </p>
                      ))}
                  </div>
                </article>
              ))}
            </div>
          )}
          {!isContact && <section className="service-cta-band">
            <div><span>Renew Healthcare</span><h2>Talk to our team</h2><p>For appointments, treatment planning, and patient guidance.</p></div>
            <div className="service-cta-actions"><Link to="/contact">Book Appointment</Link><a href="tel:06292312076">Call 062923 12076</a></div>
          </section>}
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

function FinalFeatureMedia({ page }) {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  const toggleVideo = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused || video.ended) {
      video.play().catch(() => setIsPlaying(false))
      return
    }

    video.pause()
  }

  const updateProgress = () => {
    const video = videoRef.current
    if (!video || !video.duration) {
      setProgress(0)
      return
    }

    setProgress(Math.min((video.currentTime / video.duration) * 100, 100))
  }

  if (page.video) {
    return (
      <div className="final-feature-image final-feature-video-card">
        <video
          ref={videoRef}
          className="final-feature-video"
          src={page.video}
          preload="metadata"
          playsInline
          onClick={toggleVideo}
          onLoadedMetadata={updateProgress}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={updateProgress}
          onEnded={() => {
            setIsPlaying(false)
            setProgress(0)
          }}
          aria-label={`${page.title} testimonial video`}
        />
        <button
          className={`final-video-playbar${isPlaying ? ' is-playing' : ''}`}
          type="button"
          onClick={toggleVideo}
          style={{ '--video-progress': `${progress}%` }}
          aria-label={isPlaying ? 'Pause testimonial video' : 'Play testimonial video'}
        >
          <span className="final-video-progress-track" aria-hidden="true">
            <span className="final-video-progress-fill" />
          </span>
          <span className="final-video-play-button" aria-hidden="true">
            {isPlaying ? (
              <svg viewBox="0 0 24 24">
                <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </span>
        </button>
      </div>
    )
  }

  return (
    <div className="final-feature-image">
      <img src={page.image} alt={page.title} loading="lazy" />
    </div>
  )
}

const packageRows = [
  ['1', 'Consultations with the Consultant/ Counsellor/ Coordinator after registering for the package from Day 2 till Ovum Retrieval', '3,000/-'],
  ['2', 'TVS for Folliculometry and Endometrial Preparation (Ave 4 scans)', '3,000/-'],
  ['3', 'Stimulation Injections (Urinary: Fixed Dose)', '40,000/-'],
  ['4', 'Antagonist (Fixed Dose)', '5,000/-'],
  ['5', 'Pre - Anesthesia Checkup Charges', '1,000/-'],
  ['6', 'Oocyte Retrieval and embryo transfer charges which include the OT Charges, Consultant Charges, Anesthesiologist Charges, Embryologist Charges, Nursing Team Charges and all Consumables used for Oocyte Retrieval and Embryo transfer procedure in the Fresh IVF Cycle.', '85,000/-'],
  ['7', 'Daycare Bed Charges', '8,000/-'],
  ['8', 'Fresh Embryo Transfer (Day 3/5 from OPU)', '10,000/-'],
  ['9', 'Intra Cytoplasmic Sperm Injection (ICSI)', '10,000/-'],
]

const tariffRows = [
  ['1', 'Follow-up Consultation – Ms. Ankita Mallick', '1,000', '1,500'],
  ['2', 'New Consultation – Ms. Ankita Mallick', '2,000', '2,500'],
  ['3', 'ERA', '56,000', '60,000'],
  ['4', 'IVF Charges', '85,000', '90,000'],
  ['5', 'FFI IVF Package', '1,15,000', '1,25,000'],
  ['6', 'Diathermy Charge', '500', '1,500'],
  ['7', 'Endoscopic Hardware Charge', '5,000', '6,000'],
  ['8', 'Procedure Charges on Holidays', '7,500', '10,000'],
  ['9', 'Nebulisation Charges', '500', '1,500'],
  ['10', 'Urine Pregnancy Test (UPT)', '100', '150'],
  ['11', 'Semen Analysis', '750', '1,000'],
  ['12', 'Automated Semen Analysis', '1,800', '2,000'],
  ['13', 'Semen Culture', '1,000', '1,500'],
  ['14', 'Semen Freezing (2 Months)', '3,000', '3,500'],
  ['15', 'Semen Freezing (TESA/PESA)', '5,000', '7,500'],
  ['16', 'Semen Freezing Extension (Per Month)', '200', '250'],
  ['17', 'JMSD – Semen Culture', '750', '1,000'],
  ['18', 'Semen Analysis with HBsAg/VDRL/HCV', '2,500', '4,500'],
  ['19', 'Embryo Glue', '3,500', '5,000'],
  ['20', 'IUI (AIH/HI)', '6,500', '8,000'],
]

const graphImages = [
  ['/images/renew/uploads/2024/12/grphs-img2.webp', 'Renew Healthcare success graph'],
  ['/images/renew/uploads/2024/12/grphs-img1.webp', 'Renew Healthcare treatment graph'],
  ['/images/renew/uploads/2024/12/grphs-img3.webp', 'Renew Healthcare outcome graph'],
]

const fertilitySurgeryCopy = 'Fertility enhancing surgery or minimally invasive reproductive surgery can be used to treat infertility, improve fertility treatment outcomes, or preserve fertility. This is particularly indicative in cases of endometriosis, PCOS, uterine fibroids, fallopian tube blockage etc. However, reproductive surgery may not improve fertility outcomes and may, in some instances, damage ovarian reserve. There fore it is always advised to get the surgery done under the same fertility specialist who is treating the patient for infertility treatment. The treating consultant will understand the boundary conditions of the surgery & will approach accordingly rather than regular surgeons. The success of the following treatment depends heavily on the quality of the surgery that takes place. The minimally invasive surgery is a part of the entire treatment process. In Renew Healthcare, we encompass every aspect of the treatment under one roof & provide 360degree solution. So before going under the knife, ask yourself, am I getting the best possible & holistic treatment under a single consultant & a single clinic? And last but not least, ensure that the surgery is documented & a video recording is provided to you. This helps a lot in your case discussion & future treatment plan.'

const transparencyCopy = 'Renew Healthcare is absolutely transparent in terms of clinical practices, costing & success rate. We are one of the few clinics in India who share detailed information right from the time of stimulation. We inform the patient on the number of eggs retrieved once ovum pick up is done, we keep the patient informed on the development of the embryos, and we discuss what is the best possible outcome. We are one of the few clinics in the country who promote "self cycle first" policy, which means that we try to reach conception through self egg & self sperm. As a policy, we counsel patients for self cycle & then if needed we go for donor support. Our self: donor cycle ratio is 90:10. In terms of financial counselling, we assure patients that there is no hidden costs unlike other IVF clinics. On the very first meeting we explain every aspect of the treatment plan with payment schedules. This apparently look to be on the higher side, but since we discuss every aspect of the treatment during financial counselling, patients do not end up paying anything more than what has been discussed. We are proud to share our detailed success rate in our website, month on month for the last 12 months. We update the details every month so that patients get clarity in terms of the quality of work that is done in Renew Healthcare.'

function PackageContent() {
  return (
    <div className="packages-content">
      <section className="packages-pricing">
        <div className="packages-section-head">
          <span>IVF Package</span>
          <h3>Our Honest Pricing Philosophy</h3>
        </div>
        <div className="packages-table-wrap">
          <table className="packages-table">
            <thead>
              <tr>
                <th>SL</th>
                <th>IVF Package Inclusions</th>
                <th>Standard Clinic Price</th>
                <th>Freedom From Infertility Package In Renew Fertility</th>
              </tr>
            </thead>
            <tbody>
              {packageRows.map(([sl, inclusion, price]) => (
                <tr key={sl}>
                  <td data-label="SL">{sl}</td>
                  <td data-label="IVF Package Inclusions">{inclusion}</td>
                  <td data-label="Standard Clinic Price">{price}</td>
                  <td data-label="Renew Package"><span className="package-check" aria-label="Included">Yes</span></td>
                </tr>
              ))}
              <tr className="packages-total-row">
                <td data-label="SL" />
                <td data-label="IVF Package Inclusions">Total</td>
                <td data-label="Standard Clinic Price">150000</td>
                <td data-label="Renew Package">100000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="packages-pricing packages-tariff">
        <div className="packages-section-head">
          <span>Revised Tariff</span>
          <h3>Revised Rates Effective 01 July 2026</h3>
        </div>
        <p className="packages-effective-note">
          The revised rates are effective from <strong>01 July 2026</strong> and are applicable to all new
          registrations, consultations, procedures, and packages booked on or after the effective date.
        </p>
        <div className="packages-table-wrap">
          <table className="packages-table packages-tariff-table">
            <thead>
              <tr>
                <th>Sl. No.</th>
                <th>Service</th>
                <th>Current Rate (₹)</th>
                <th>Revised Rate (₹)</th>
              </tr>
            </thead>
            <tbody>
              {tariffRows.map(([sl, service, current, revised]) => (
                <tr key={sl}>
                  <td data-label="Sl. No.">{sl}</td>
                  <td data-label="Service">{service}</td>
                  <td data-label="Current Rate"><span className="tariff-old">{current}</span></td>
                  <td data-label="Revised Rate"><span className="tariff-new">{revised}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="packages-copy-block">
        <h3>Fertility Enhancing Surgery</h3>
        <p>{fertilitySurgeryCopy}</p>
      </section>

      <section className="packages-graphs">
        <div className="packages-section-head">
          <span>Clinical Reporting</span>
          <h3>Graphs</h3>
        </div>
        <div className="packages-graph-grid">
          {graphImages.map(([src, alt]) => (
            <figure className="packages-graph-card" key={src}>
              <img src={src} alt={alt} loading="lazy" />
            </figure>
          ))}
        </div>
      </section>

      <section className="packages-copy-block">
        <h3>Transparency</h3>
        <p>{transparencyCopy}</p>
      </section>
    </div>
  )
}

const quickContacts = [
  ['Call us', '062923 12076', 'tel:06292312076', 'phone'],
  ['WhatsApp', 'Chat with our team', 'https://api.whatsapp.com/send?phone=916292269060', 'whatsapp'],
  ['Email', 'info@renewhealthcare.in', 'mailto:info@renewhealthcare.in', 'mail'],
]

function QuickIcon({ name }) {
  const c = { viewBox: '0 0 24 24', width: 22, height: 22, fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
  if (name === 'phone') return <svg {...c}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
  if (name === 'whatsapp') return <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M.5 23.5l1.65-6A11.4 11.4 0 0 1 .6 11.6C.6 5.3 5.8.1 12.1.1c3 0 5.9 1.2 8 3.3a11.3 11.3 0 0 1 3.4 8.2c0 6.3-5.2 11.5-11.5 11.5-1.9 0-3.8-.5-5.4-1.4l-6.1 1.8zm6.4-3.7l.4.2c1.4.8 3 1.3 4.7 1.3 5.2 0 9.5-4.3 9.5-9.6 0-2.5-1-5-2.8-6.8a9.5 9.5 0 0 0-6.7-2.8C6.9 2.3 2.6 6.6 2.6 11.8c0 1.8.5 3.5 1.4 5l.3.4-1 3.6 3.6-1z" /></svg>
  if (name === 'mail') return <svg {...c}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
  return <svg {...c}><rect x="2" y="6" width="14" height="12" rx="2" /><path d="m16 10 6-3v10l-6-3z" /></svg>
}

const getTodayDateStr = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yy = String(today.getFullYear()).slice(-2);
  return `${dd}-${mm}-${yy}`;
};

function ContactBlock() {
  const { status, error, submit } = useLeadSubmit()
  const onSubmit = async event => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const ok = await submit({
      name: data.get('name'),
      customer_number: data.get('customer_number'),
      whatsapp_number: data.get('whatsapp_number'),
      email: data.get('email'),
      purpose: data.get('purpose'),
      message: data.get('message'),
      date: data.get('date'),
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
          <input name="name" placeholder="Name" required />
          <input type="tel" name="customer_number" placeholder="Customer Number" required />
          <input type="tel" name="whatsapp_number" placeholder="WhatsApp Number" required />
          <input type="email" name="email" placeholder="Email" />
          <select name="purpose" defaultValue="" required>
            <option value="" disabled>Purpose</option>
            <option value="Surrogacy">Surrogacy</option>
            <option value="Egg Freezing">Egg Freezing</option>
            <option value="Genetic">Genetic</option>
            <option value="IUI">IUI</option>
            <option value="IVF">IVF</option>
            <option value="New Fertility">New Fertility</option>
            <option value="New Gynae">New Gynae</option>
            <option value="New Pregnancy">New Pregnancy</option>
            <option value="Others">Others</option>
            <option value="Pre-Conception">Pre-Conception</option>
            <option value="Sperm Donation">Sperm Donation</option>
          </select>
          <input type="hidden" name="date" value={getTodayDateStr()} />
          <textarea name="message" placeholder="Message" />
          <button type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Submit Request'}</button>
          {status === 'sent' && <p className="lead-form-msg ok">Thank you! Our team will reach out shortly.</p>}
          {status === 'error' && <p className="lead-form-msg err">{error}</p>}
        </form>

        <div className="contact-info-card">
          <img src="/images/renew/uploads/2024/07/headphone.png" alt="Contact Renew Healthcare" />
          <h3>Contact Us</h3>
          <p>Want to get in touch? We would love to hear from you. Here is how you can reach us.</p>
          <a href="tel:06292312076">062923 12076</a>
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
