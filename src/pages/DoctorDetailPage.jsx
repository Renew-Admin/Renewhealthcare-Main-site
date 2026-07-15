import { Link, useParams } from 'react-router-dom'
import { useDoctors } from '../hooks/useContent.js'
import './ContentPages.css'
import './ServicesPages.css'

function getDisplayCategory(category) {
  return category === 'Our Experts' ? 'Fertility Experts' : category
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
            </section>
          </div>
        </div>
      </section>
    </main>
  )
}
