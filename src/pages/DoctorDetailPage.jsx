import { Link, useParams } from 'react-router-dom'
import { useDoctors } from '../hooks/useContent.js'
import './ContentPages.css'
import './ServicesPages.css'

function getDisplayCategory(category) {
  return category === 'Our Experts' ? 'Fertility Experts' : category
}

function asList(value) {
  return Array.isArray(value) ? value.map((item) => String(item || '').trim()).filter(Boolean) : []
}

function hasText(value) {
  return String(value || '').trim().length > 0
}

function ProfileList({ title, items }) {
  if (!items.length) return null
  return (
    <div className="doctor-profile-subsection">
      <h4>{title}</h4>
      <ul className="doctor-profile-list">
        {items.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
      </ul>
    </div>
  )
}

function AttachmentList({ items }) {
  if (!items.length) return null
  return (
    <div className="doctor-profile-pairs">
      {items.map((item, index) => (
        <article key={`${item.institution}-${index}`}>
          {item.institution && <h4>{item.institution}</h4>}
          {item.description && <p>{item.description}</p>}
        </article>
      ))}
    </div>
  )
}

function DoctorFaqs({ items }) {
  if (!items.length) return null
  return (
    <div className="doctor-faq-list">
      {items.map((item, index) => (
        <details key={`${item.question}-${index}`}>
          <summary>{item.question}</summary>
          <p>{item.answer}</p>
        </details>
      ))}
    </div>
  )
}

export default function DoctorDetailPage() {
  const { slug } = useParams()
  const { doctors, loading } = useDoctors()
  const doctor = doctors.find(item => item.slug === slug)

  if (!doctor) {
    if (loading) {
      return (
        <main className="content-page">
          <section className="service-content-band"><div className="service-content-inner"><p>Loading…</p></div></section>
        </main>
      )
    }
    return (
      <main className="content-page">
        <section className="notfound-band">
          <div className="notfound-inner">
            <span className="notfound-code">404</span>
            <h1>Doctor not found</h1>
            <p>The profile you are looking for is not available.</p>
            <Link className="notfound-primary" to="/doctors">View all doctors</Link>
          </div>
        </section>
      </main>
    )
  }

  const bioParagraphs = doctor.bio?.split('\n').map(para => para.trim()).filter(Boolean)
  const displayCategory = getDisplayCategory(doctor.category)
  const qualifications = asList(doctor.qualifications).length ? asList(doctor.qualifications) : asList([doctor.qualification])
  const specializations = asList(doctor.specializations)
  const languages = asList(doctor.languages)
  const serviceAreas = asList(doctor.service_areas)
  const attachments = Array.isArray(doctor.past_attachments) ? doctor.past_attachments.filter((item) => hasText(item?.institution) || hasText(item?.description)) : []
  const faqs = Array.isArray(doctor.faqs) ? doctor.faqs.filter((item) => hasText(item?.question) && hasText(item?.answer)) : []
  const hasClinicalDetails = hasText(doctor.experience_years) || hasText(doctor.milestone_stat) || qualifications.length || specializations.length || languages.length
  const hasLocationDetails = hasText(doctor.clinic_address) || serviceAreas.length
  const hasAttachments = attachments.length > 0
  const hasFaqs = faqs.length > 0

  return (
    <main className="content-page">
      <section className="service-banner doctor-detail-hero">
        <img src="/images/renew/uploads/2024/12/Inner-Page-Banner.jpg" alt="" />
        <div className="service-banner-overlay" />
        <div className="service-banner-content">
          <span>Home / Doctors / {doctor.name}</span>
          <h1>{doctor.name}</h1>
        </div>
      </section>

      <section className="service-content-band">
        <div className="service-content-inner">
          <div className="doctor-detail-grid">
            <aside className="doctor-detail-photo-card">
              <div className="doctor-detail-photo-frame">
                <img src={doctor.photo} alt={doctor.name} />
              </div>
            </aside>
            <section className="doctor-detail-main">
              <div className="doctor-profile-head">
                <span>{displayCategory || 'Renew Healthcare'}</span>
                <h2>{doctor.name}</h2>
                <p>{doctor.role || 'Renew Healthcare specialist'}</p>
              </div>

              <div className="doctor-profile-panel">
                <h3>Profile</h3>
                {bioParagraphs?.length
                  ? bioParagraphs.map((para, i) => <p key={i}>{para}</p>)
                  : <p>{doctor.name} is part of the Renew Healthcare team, supporting patients through fertility, reproductive health, and family-building care.</p>}
                <p>For appointments, consultation details, and availability, contact Renew Healthcare directly.</p>
                <div className="doctor-detail-actions">
                  <Link to="/contact">Book an appointment</Link>
                  <Link to="/doctors">Back to doctors</Link>
                </div>
              </div>

              {hasClinicalDetails && (
                <div className="doctor-profile-panel">
                  <h3>Clinical Details</h3>
                  {(hasText(doctor.experience_years) || hasText(doctor.milestone_stat)) && (
                    <div className="doctor-stat-grid">
                      {hasText(doctor.experience_years) && (
                        <div>
                          <span>Experience</span>
                          <strong>{doctor.experience_years}</strong>
                        </div>
                      )}
                      {hasText(doctor.milestone_stat) && (
                        <div>
                          <span>Milestone</span>
                          <strong>{doctor.milestone_stat}</strong>
                        </div>
                      )}
                    </div>
                  )}
                  <ProfileList title="Academic Background" items={qualifications} />
                  <ProfileList title="Core Specializations" items={specializations} />
                  <ProfileList title="Languages" items={languages} />
                </div>
              )}

              {(hasAttachments || hasLocationDetails) && (
                <div className="doctor-profile-panel">
                  <h3>Practice Details</h3>
                  {hasAttachments && (
                    <div className="doctor-profile-subsection">
                      <h4>Past Attachments</h4>
                      <AttachmentList items={attachments} />
                    </div>
                  )}
                  {hasText(doctor.clinic_address) && (
                    <div className="doctor-profile-subsection">
                      <h4>Clinic Address</h4>
                      <p>{doctor.clinic_address}</p>
                    </div>
                  )}
                  <ProfileList title="Service Areas" items={serviceAreas} />
                </div>
              )}

              {hasFaqs && (
                <div className="doctor-profile-panel">
                  <h3>FAQs</h3>
                  <DoctorFaqs items={faqs} />
                </div>
              )}
            </section>
          </div>
        </div>
      </section>
    </main>
  )
}
