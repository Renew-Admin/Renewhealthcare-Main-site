import { Link } from 'react-router-dom'
import { useState } from 'react'
import './GlobalHeader.css'

const serviceColumns = [
  {
    title: 'Conception',
    items: [
      ['Pre-Conception Counseling', 'pre-conception-counseling'],
      ['IUI', 'intra-uterine-insemination-iui'],
      ['IVF', 'in-vitro-fertilization-ivf'],
      ['ICSI', 'intracytoplasmic-sperm-injection-icsi'],
      ['Surrogacy', 'surrogacy'],
      ['Embryo Freezing', 'embryo-freezing'],
      ['Semen Freezing', 'semen-freezing'],
      ['Egg Freezing', 'oocyte-freezing'],
      ['Andrology Clinic', 'andrology-clinic'],
      ['TESA & PESA', 'tesa-pesa'],
      ['Hormone Analysis', 'hormone-analysis'],
      ['PGD', 'pre-implantation-genetic-diagnosis'],
      ['PGS', 'pre-implantation-genetic-screening'],
      ['PRP Therapy', 'platelet-rich-plasma-therapy'],
      ['Laser Assisted Hatching', 'laser-assisted-hatching'],
      ['Advanced Sperm Function Tests', 'advanced-sperm-function-tests'],
    ],
  },
  {
    title: "Women's Health",
    items: [
      ['Gynaecology', 'gynaecology'],
      ['PCOS', 'pcos-management'],
      ['Menstrual Disorder', 'menstrual-disorder-management'],
      ['Menopause', 'menopause-management'],
      ['PMS', 'premenstrual-syndrome'],
      ['Painful Periods', 'painful-periods'],
      ['Pregnancy Care', 'pregnancy'],
      ['High-Risk Pregnancy', 'high-risk-pregnancy-management'],
      ['Recurrent Miscarriage', 'recurrent-miscarriage-evaluation'],
      ['Fetal Medicine', 'fetal-medicine'],
      ['Hysteroscopy', 'hysteroscopy'],
      ['Laparoscopy', 'laparoscopy'],
      ['Aesthetic Gynaecology', 'aesthetic-gynaecology'],
    ],
  },
  {
    title: 'Genetic Health',
    items: [
      ['Preconception', 'preconception-genetic-counselling'],
      ['Infertility & Prenatal', 'infertility-prenatal-genetic-counselling'],
      ['PGT', 'pgt-counselling'],
      ['Paediatric', 'paediatric-genetic-counselling'],
      ['Autism', 'autism-genetic-counselling'],
      ['Thalassemia', 'thalassemia-genetic-counselling'],
      ['Adult', 'adult-genetic-counselling'],
      ['Hereditary Cancer', 'hereditary-cancer-genetic-counselling'],
      ['Learning Disability', 'learning-disability-genetic-counselling'],
      ['Cardiac', 'cardiac-genetic-counselling'],
      ['Neurology Genetic Counselling', 'neurology-genetic-counselling'],
    ],
  },
  {
    title: 'Wellness & Nutrition',
    items: [
      ['Weight Management Clinic', 'weight-management-clinic'],
      ['Pregnancy & Postpartum Nutrition Clinic', 'pregnancy-and-postpartum-nutrition-clinic'],
    ],
  },
]

const dropdowns = [
  ['Fellowship Programs', ['12 Months Fellowship', '3 Months Course']],
  ['About Us', ['Fertility Without Borders', 'IVF Success Factors And Rates']],
  ['Resources', ['Male Infertility', 'Female Infertility', 'Injection Instruction', 'Mental Health']],
  ['International Patients', ['Bangladesh']],
  ['Our Clinics', ['Jamshedpur', 'Saltlake', 'Gariahat']],
]

const routeMap = {
  'Why Renew': '/why-renew',
  Services: '/services',
  'Our Doctors': '/doctors',
  'Success Stories': '/success-stories',
  'About Us': '/about-us',
  Blogs: '/blogs',
  Packages: '/packages',
  Contact: '/contact',
  'IVF Success Factors And Rates': '/ivf-success-factors-and-rates',
  '12 Months Fellowship': '/course/12-months-fellowship-in-reproductive-medicine',
  '3 Months Course': '/course/3-months-course-on-reproductive-medicine',
  'Male Infertility': '/male-infertility',
  'Female Infertility': '/female-infertility',
  'Injection Instruction': '/injection-instruction',
  'Mental Health': '/mental-health',
  'International Patients': '/international-patients',
  Bangladesh: '/bangladesh',
  Genetics: '/genetic',
  Jamshedpur: '/locations/jamshedpur',
  Saltlake: '/locations/saltlake',
  Gariahat: '/locations/gariahat',
}

const externalMap = {
  'Fertility Without Borders': 'https://www.drrajeevagarwal.co.in/',
}

function toPath(label) {
  return routeMap[label] || '/services'
}

function Dropdown({ label, items }) {
  return (
    <div className="global-nav-dropdown">
      <button type="button" className="global-nav-link">
        {label}
        <svg className="chevron-icon" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <div className="global-nav-panel is-small">
        {items.map(item => externalMap[item] ? (
          <a key={item} href={externalMap[item]} target="_blank" rel="noreferrer">{item}</a>
        ) : (
          <Link key={item} to={toPath(item)}>{item}</Link>
        ))}
      </div>
    </div>
  )
}

export default function GlobalHeader({ onCallback }) {
  const [open, setOpen] = useState(false)
  const [panel, setPanel] = useState('')

  return (
    <>
      <div className="top-strip">
        <div className="top-strip-inner">
          <Link to="/" className="top-logo" aria-label="Renew Healthcare home">
            <img src="https://renewhealthcare.in/wp-content/uploads/2024/07/renew-healthcare-logo.jpg.webp" alt="Renew Healthcare" />
          </Link>

          <div className="top-contact">
            <a href="tel:06292269060" className="top-contact-item">
              <svg className="top-contact-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span>CALL US NOW <strong>062922 69060</strong></span>
            </a>
            <a href="mailto:info@renewhealthcare.in" className="top-contact-item">
              <svg className="top-contact-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <span>EMAIL US <strong>info@renewhealthcare.in</strong></span>
            </a>
            <span className="top-contact-sep">|</span>
            <div className="top-consultation-modes">
              <Link to="/contact" className="top-consultation-tag">
                <span className="dot-pulse"></span>
                Online Consultation
              </Link>
              <Link to="/contact" className="top-consultation-tag">
                <span className="dot-pulse"></span>
                Center Consultation
              </Link>
            </div>
          </div>

          <div className="top-actions">
            <Link to="/contact" className="btn-book">Book Your Appointment</Link>
            <button type="button" onClick={onCallback} className="btn-callback">Request Call Back</button>
          </div>
        </div>
      </div>

      <header className="global-header">
        <div className="global-header-inner">
          <nav className="global-nav" aria-label="Main navigation">
            <Link to="/why-renew" className="global-nav-link">Why Renew</Link>

            <div className="global-nav-dropdown is-mega">
              <Link to="/services" className="global-nav-link">
                Services
                <svg className="chevron-icon" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </Link>
              <div className="global-nav-panel global-mega">
                {serviceColumns.map(column => (
                  <div className="global-mega-column" key={column.title}>
                    <h3>{column.title}</h3>
                    {column.items.map(([item, slug]) => (
                      <Link key={slug} to={`/services/${slug}`}>{item}</Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <Link to="/doctors" className="global-nav-link">Our Doctors</Link>
            {dropdowns.map(([label, items]) => <Dropdown key={label} label={label} items={items} />)}
            <Link to="/success-stories" className="global-nav-link">Success Stories</Link>
            <Link to="/blogs" className="global-nav-link">Blogs</Link>
            <Link to="/packages" className="global-nav-link">Packages</Link>
            <Link to="/contact" className="global-nav-link">Contact</Link>
          </nav>

          <button className={`global-menu-toggle ${open ? 'is-open' : ''}`} type="button" onClick={() => setOpen(value => !value)} aria-label="Toggle navigation menu" aria-expanded={open}>
            <span />
            <span />
            <span />
          </button>
        </div>

        {open && (
          <div className="mobile-accordion">
            <Link to="/why-renew" onClick={() => setOpen(false)}>Why Renew</Link>
            <button type="button" onClick={() => setPanel(panel === 'Services' ? '' : 'Services')}>Services <span>{panel === 'Services' ? '−' : '+'}</span></button>
            {panel === 'Services' && (
              <div className="mobile-panel">
                {serviceColumns.map(column => (
                  <div key={column.title}>
                    <strong>{column.title}</strong>
                    {column.items.map(([item, slug]) => <Link key={slug} to={`/services/${slug}`} onClick={() => setOpen(false)}>{item}</Link>)}
                  </div>
                ))}
              </div>
            )}
            <Link to="/doctors" onClick={() => setOpen(false)}>Our Doctors</Link>
            {dropdowns.map(([label, items]) => (
              <div key={label}>
                <button type="button" onClick={() => setPanel(panel === label ? '' : label)}>{label} <span>{panel === label ? '−' : '+'}</span></button>
                {panel === label && (
                  <div className="mobile-panel">
                    {items.map(item => externalMap[item] ? (
                      <a key={item} href={externalMap[item]} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>{item}</a>
                    ) : (
                      <Link key={item} to={toPath(item)} onClick={() => setOpen(false)}>{item}</Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {[
              ['Success Stories', '/success-stories'],
              ['Blogs', '/blogs'],
              ['Packages', '/packages'],
              ['Contact', '/contact'],
            ].map(([label, path]) => <Link key={path} to={path} onClick={() => setOpen(false)}>{label}</Link>)}
          </div>
        )}
      </header>
    </>
  )
}
