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
          {location.firstLine && <p className="location-first-line">{location.firstLine}</p>}
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
            {/* Order and wording follow the Google Business Profile brief
                (task 29): name and address exactly as on the profile, phone,
                hours, map, doctors, services, photos, then the Google Maps link. */}
            <div className="location-info-card">
              <h3>Clinic Details</h3>
              <p><strong>{location.gbpName || location.name}</strong><br />{location.gbpAddress || location.address}</p>
              <a href={`tel:${location.phone.replace(/\s/g, '')}`}>{location.phone}</a>
              <span>{location.hours}</span>
            </div>
          </div>

          <div className="location-map-card">
            <iframe src={location.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title={`${location.name} map`} />
          </div>

          {clinicDoctors.length > 0 && (
            <section className="content-panel">
              <h3>Doctors At This Clinic</h3>
              <div className="people-grid is-compact">
                {clinicDoctors.map(doctor => <DoctorCard doctor={doctor} key={doctor.slug} />)}
              </div>
            </section>
          )}

          <section className="content-panel">
            <h3>Services Offered</h3>
            <div className="content-chip-grid">
              {location.services.map(service => <span key={service}>{service}</span>)}
            </div>
          </section>

          {location.gallery?.length > 0 && (
            <section className="content-panel">
              <h3>Clinic Photos</h3>
              <div className="location-photo-grid">
                {location.gallery.map((src, index) => (
                  <img key={src} src={src} alt={`${location.gbpName || location.name}, ${location.name}: clinic photo ${index + 1}`} loading="lazy" decoding="async" />
                ))}
              </div>
            </section>
          )}

          {location.mapsUrl && (
            <p className="location-maps-link">
              <a href={location.mapsUrl} target="_blank" rel="noopener noreferrer">See us on Google Maps</a>
            </p>
          )}
        </div>
      </section>
    </main>
  )
}
