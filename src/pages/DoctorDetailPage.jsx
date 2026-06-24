import { Link, useParams } from 'react-router-dom'
import { useDoctors } from '../hooks/useContent.js'
import './ContentPages.css'
import './ServicesPages.css'

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
            <aside className="feature-image-card doctor-detail-photo">
              <img src={doctor.photo} alt={doctor.name} />
            </aside>
            <div>
              <div className="service-heading-block is-left">
                <span>{doctor.category}</span>
                <h2>{doctor.name}</h2>
                <p>{doctor.role}</p>
              </div>
              <div className="content-panel">
                <h3>Profile</h3>
                {doctor.bio
                  ? doctor.bio.split('\n').filter(Boolean).map((para, i) => <p key={i}>{para}</p>)
                  : <p>{doctor.name} is part of the Renew Healthcare team, supporting patients through fertility, reproductive health, and family-building care.</p>}
                <p>For appointments, consultation details, and availability, contact Renew Healthcare directly.</p>
                <div className="doctor-detail-actions">
                  <Link to="/contact">Book an appointment</Link>
                  <Link to="/doctors">Back to doctors</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
