import { Link, useParams } from 'react-router-dom'
import { doctors } from '../data/doctors.js'
import { locations } from '../data/locations.js'
import DoctorCard from '../components/DoctorCard.jsx'
import './ContentPages.css'
import './ServicesPages.css'

export default function LocationPage() {
  const { slug } = useParams()
  const location = locations.find(item => item.slug === slug)

  if (!location) {
    return (
      <main className="content-page">
        <section className="service-content-band">
          <div className="service-content-inner service-not-found">
            <span>Locations</span>
            <h1>Clinic not found</h1>
            <Link className="service-pill-link" to="/locations">Back to Locations</Link>
          </div>
        </section>
      </main>
    )
  }

  const clinicDoctors = doctors.filter(doctor => location.doctors.includes(doctor.name))

  return (
    <main className="content-page">
      <section className="service-banner">
        <img src={location.image} alt={location.name} />
        <div className="service-banner-overlay" />
        <div className="service-banner-content">
          <span>Home / Locations / {location.name}</span>
          <h1>{location.name}</h1>
        </div>
      </section>

      <section className="service-content-band">
        <div className="service-content-inner">
          <div className="location-detail-grid">
            <div className="service-heading-block is-left">
              <span>Renew Clinic</span>
              <h2>{location.name}</h2>
              <p>{location.intro}</p>
            </div>
            <div className="location-info-card">
              <h3>Clinic Details</h3>
              <p>{location.address}</p>
              <a href={`tel:${location.phone.replace(/\s/g, '')}`}>{location.phone}</a>
              <span>{location.hours}</span>
            </div>
          </div>

          <div className="location-map-card">
            <iframe src={location.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={`${location.name} map`} />
          </div>

          <section className="content-panel">
            <h3>Services Offered</h3>
            <div className="content-chip-grid">
              {location.services.map(service => <span key={service}>{service}</span>)}
            </div>
          </section>

          {clinicDoctors.length > 0 && (
            <section className="content-panel">
              <h3>Doctors At This Clinic</h3>
              <div className="people-grid is-compact">
                {clinicDoctors.map(doctor => <DoctorCard doctor={doctor} key={doctor.slug} />)}
              </div>
            </section>
          )}
        </div>
      </section>
    </main>
  )
}
