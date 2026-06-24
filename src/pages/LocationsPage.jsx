import { Link } from 'react-router-dom'
import { locations } from '../data/locations.js'
import './ContentPages.css'
import './ServicesPages.css'

export default function LocationsPage() {
  return (
    <main className="content-page">
      <section className="service-banner">
        <img src="/images/renew/uploads/2024/12/Inner-Page-Banner-3.jpg" alt="Renew Healthcare clinics" />
        <div className="service-banner-overlay" />
        <div className="service-banner-content">
          <span>Home / Locations</span>
          <h1>Our Clinics</h1>
        </div>
      </section>

      <section className="service-content-band">
        <div className="service-content-inner">
          <div className="service-heading-block">
            <span>Locate Renew</span>
            <h2>Locate Your Nearest IVF Center</h2>
            <p>Find Renew Healthcare clinics in Saltlake, Jamshedpur, and Gariahat.</p>
          </div>

          <div className="location-grid">
            {locations.map(location => (
              <Link className="location-card" to={`/locations/${location.slug}`} key={location.slug}>
                <img src={location.image} alt={location.name} />
                <div>
                  <span>{location.phone}</span>
                  <h3>{location.name}</h3>
                  <p>{location.address}</p>
                  <strong>View Clinic →</strong>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
