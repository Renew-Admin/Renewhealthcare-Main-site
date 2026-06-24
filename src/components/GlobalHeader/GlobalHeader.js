import { Link } from 'react-router-dom'
import { useState } from 'react'
import { doctors } from '../../data/doctors.js'
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

const moreGroups = [
  ['About', ['About Us', 'Fertility Without Borders', 'IVF Success Factors And Rates']],
  ['Resources', ['Blogs', 'Male Infertility', 'Female Infertility', 'Injection Instruction', 'Mental Health']],
  ['Programs', ['12 Months Fellowship', '3 Months Course', 'Packages']],
  ['Patients & Clinics', ['International Patients', 'Bangladesh', 'Jamshedpur', 'Saltlake', 'Gariahat', 'Contact']],
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

function NavChevron() {
  return (
    <svg className="chevron-icon" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  )
}

function SimpleDropdown({ label, children, className = '' }) {
  return (
    <div className={`global-nav-dropdown ${className}`}>
      <button type="button" className="global-nav-link">
        {label}
        <NavChevron />
      </button>
      {children}
    </div>
  )
}

const featuredDoctors = doctors.filter(doctor => doctor.category === 'Our Experts').slice(0, 6)

export default function GlobalHeader({ onCallback }) {
  const [open, setOpen] = useState(false)
  const [panel, setPanel] = useState('')

  return (
    <>
      <header className="global-header">
        <div className="global-header-inner">
          <Link to="/" className="top-logo" aria-label="Renew Healthcare home">
            <img src="/images/renew/uploads/2024/07/renew-healthcare-logo.webp" alt="Renew Healthcare" />
          </Link>

          <nav className="global-nav" aria-label="Main navigation">
            <Link to="/why-renew" className="global-nav-link">Why Renew</Link>

            <div className="global-nav-dropdown is-mega">
              <Link to="/services" className="global-nav-link">
                Services
                <NavChevron />
              </Link>
              <div className="global-nav-panel global-mega">
                {serviceColumns.map(column => (
                  <div className="global-mega-column" key={column.title}>
                    <h3>{column.title}</h3>
                    {column.items.slice(0, 5).map(([item, slug]) => (
                      <Link key={slug} to={`/services/${slug}`}>{item}</Link>
                    ))}
                    <Link className="global-mega-all" to="/services">View all services</Link>
                  </div>
                ))}
              </div>
            </div>

            <SimpleDropdown label="Doctors" className="is-doctors">
              <div className="global-nav-panel doctor-panel">
                <div className="doctor-panel-head">
                  <span>Fertility Experts</span>
                  <Link to="/doctors">View all doctors</Link>
                </div>
                <div className="doctor-panel-grid">
                  {featuredDoctors.map(doctor => (
                    <Link className="doctor-panel-card" to={`/doctor/${doctor.slug}`} key={doctor.slug}>
                      <img src={doctor.photo} alt="" />
                      <span>
                        <strong>{doctor.name}</strong>
                        <small>{doctor.role}</small>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </SimpleDropdown>
            <Link to="/success-stories" className="global-nav-link">Stories</Link>
            <SimpleDropdown label="More" className="is-more">
              <div className="global-nav-panel more-panel">
                {moreGroups.map(([group, items]) => (
                  <div className="more-panel-group" key={group}>
                    <h3>{group}</h3>
                    {items.map(item => externalMap[item] ? (
                      <a key={item} href={externalMap[item]} target="_blank" rel="noreferrer">{item}</a>
                    ) : (
                      <Link key={item} to={toPath(item)}>{item}</Link>
                    ))}
                  </div>
                ))}
              </div>
            </SimpleDropdown>
          </nav>

          <div className="top-actions">
            <Link to="/contact" className="btn-book">Book Your Appointment</Link>
            <button type="button" onClick={onCallback} className="btn-callback">Request Call Back</button>
          </div>

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
                    {column.items.slice(0, 2).map(([item, slug]) => <Link key={slug} to={`/services/${slug}`} onClick={() => setOpen(false)}>{item}</Link>)}
                  </div>
                ))}
                <Link to="/services" onClick={() => setOpen(false)}>View all services</Link>
              </div>
            )}
            <button type="button" onClick={() => setPanel(panel === 'Doctors' ? '' : 'Doctors')}>Doctors <span>{panel === 'Doctors' ? '−' : '+'}</span></button>
            {panel === 'Doctors' && (
              <div className="mobile-panel">
                <Link to="/doctors" onClick={() => setOpen(false)}>All Doctors</Link>
                {featuredDoctors.map(doctor => <Link key={doctor.slug} to={`/doctor/${doctor.slug}`} onClick={() => setOpen(false)}>{doctor.name}</Link>)}
              </div>
            )}
            <Link to="/success-stories" onClick={() => setOpen(false)}>Stories</Link>
            <button type="button" onClick={() => setPanel(panel === 'More' ? '' : 'More')}>More <span>{panel === 'More' ? '−' : '+'}</span></button>
            {panel === 'More' && (
              <div className="mobile-panel">
                {moreGroups.map(([group, items]) => (
                  <div key={group}>
                    <strong>{group}</strong>
                    {items.map(item => externalMap[item] ? (
                      <a key={item} href={externalMap[item]} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>{item}</a>
                    ) : (
                      <Link key={item} to={toPath(item)} onClick={() => setOpen(false)}>{item}</Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
            <div className="mobile-contact-block">
              <a href="tel:06292269060">Call: 062922 69060</a>
              <a href="mailto:info@renewhealthcare.in">info@renewhealthcare.in</a>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
