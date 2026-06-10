import { Link } from 'react-router-dom'
import { serviceCategories, services } from '../data/services.js'
import './ServicesPages.css'

export default function ServicesIndex() {
  return (
    <main className="services-page">
      <section className="service-banner service-index-banner">
        <img src="https://renewhealthcare.in/wp-content/uploads/2024/12/Inner-Page-Banner.jpg" alt="Renew Healthcare services" />
        <div className="service-banner-overlay" />
        <div className="service-banner-content">
          <span>Home / Services</span>
          <h1>Services</h1>
        </div>
      </section>

      <section className="service-content-band">
        <div className="service-content-inner">
          <div className="service-heading-block">
            <span>Renew Healthcare</span>
            <h2>Treatments Provided By Renew Healthcare</h2>
            <p>Explore fertility care, women’s health, genetic counselling, wellness, and nutrition services from Renew Healthcare.</p>
          </div>

          <div className="service-category-stack">
            {serviceCategories.map(category => {
              const categoryServices = services.filter(service => service.category === category)

              return (
                <section className="service-category-block" key={category}>
                  <div className="service-category-head">
                    <h3>{category}</h3>
                    <span>{categoryServices.length} Services</span>
                  </div>
                  <div className="service-index-grid">
                    {categoryServices.map(service => (
                      <Link className="service-index-card" to={`/services/${service.slug}`} key={service.slug}>
                        <img src={service.thumbnailImg} alt={service.title} />
                        <div>
                          <strong>{service.title}</strong>
                          <p>{service.intro || service.sections[0]?.body || 'Learn more about this Renew Healthcare service.'}</p>
                          <span>View Service →</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
