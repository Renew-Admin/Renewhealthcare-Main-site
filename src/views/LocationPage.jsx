import DoctorCard from '../components/DoctorCard.jsx'
import ClinicPhotoGallery from '../components/ClinicPhotoGallery.jsx'
import { branchContact, directionsUrl, whatsappUrl } from '../lib/branchContacts.js'
import { consultationDaysForBranch } from '../lib/consultationDays.js'
import './ContentPages.css'
import './ServicesPages.css'

// Server component: `location` and `clinicDoctors` (from the live doctor list)
// are resolved in src/app/(site)/locations/[slug]/page.js.
export default function LocationPage({ location, clinicDoctors = [] }) {
  // This branch's own call and WhatsApp lines (src/lib/branchContacts.js).
  const contact = branchContact(location)
  // Owner-confirmed consultation days (src/lib/consultationDays.js).
  const consultationDays = consultationDaysForBranch(location.slug)
  // Clinic-supplied directions (src/data/locations.js); blank fields are skipped.
  const directions = [
    ['Nearest landmark', location.directions?.landmark],
    ['Main road', location.directions?.road],
    ['Metro / transport', location.directions?.transit],
    ['Parking', location.directions?.parking],
  ].filter(([, text]) => text && String(text).trim())
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
              <a href={contact.tel}>{location.phone}</a>
              <span>{location.hours}</span>
              {location.hoursNote && <span className="location-hours-note">{location.hoursNote}</span>}
              {/* Each branch's own lines, so a visitor reaches this clinic and not another. */}
              <div className="location-contact-actions">
                <a className="location-contact-btn is-call" href={contact.tel}>Call {contact.shortName}</a>
                <a className="location-contact-btn is-whatsapp" href={whatsappUrl(contact.whatsapp, contact.message)} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                <a className="location-contact-btn is-directions" href={directionsUrl(location)} target="_blank" rel="noopener noreferrer">Get directions</a>
              </div>
            </div>
          </div>

          <div className="location-map-card">
            <iframe src={location.mapEmbed} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen title={`${location.name} map`} />
          </div>

          {directions.length > 0 && (
            <section className="content-panel">
              <h3>How To Reach Us</h3>
              <dl className="location-directions">
                {directions.map(([label, text]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{text}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {clinicDoctors.length > 0 && (
            <section className="content-panel">
              <h3>Doctors At This Clinic</h3>
              <div className="people-grid is-compact">
                {clinicDoctors.map(doctor => <DoctorCard doctor={doctor} key={doctor.slug} />)}
              </div>
              {consultationDays.length > 0 && (
                <div className="location-consult-days">
                  <h4>Consultation days</h4>
                  <ul>
                    {consultationDays.map(entry => (
                      <li key={entry.doctor}><strong>{entry.doctor}</strong> — {entry.days}</li>
                    ))}
                  </ul>
                  <p>During clinic hours, {location.hours}. Appointments are recommended.</p>
                </div>
              )}
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
              <ClinicPhotoGallery
                photos={location.gallery.map((photo, index) => ({
                  ...photo,
                  alt: photo.alt || `${location.gbpName || location.name}, ${location.name}: clinic photo ${index + 1}`,
                }))}
              />
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
