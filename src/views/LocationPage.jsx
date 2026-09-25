import DoctorCard from '../components/DoctorCard.jsx'
import './ContentPages.css'
import './ServicesPages.css'

// Server component: `location` and `clinicDoctors` (from the live doctor list)
// are resolved in src/app/(site)/locations/[slug]/page.js.
export default function LocationPage({ location, clinicDoctors = [] }) {
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
