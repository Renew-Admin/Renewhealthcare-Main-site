import { Link } from 'react-router-dom'
import './ContentPages.css'
import './ServicesPages.css'

export default function AboutPage() {
  return (
    <main className="content-page">
      <section className="service-banner">
        <img src="https://renewhealthcare.in/wp-content/uploads/2024/12/Inner-Page-Banner.jpg" alt="Renew Healthcare about us" />
        <div className="service-banner-overlay" />
        <div className="service-banner-content">
          <span>Home / About Us</span>
          <h1>About Us</h1>
        </div>
      </section>

      <section className="service-content-band">
        <div className="service-content-inner">
          <div className="split-feature">
            <div className="service-heading-block is-left">
              <span>Welcome to Renew Healthcare</span>
              <h2>Welcome to Renew Healthcare!</h2>
              <p>We are a team of highly experienced and dedicated healthcare professionals, under the leadership of Dr. Rajeev Agarwal, committed to providing the highest quality reproductive and gynaecological care to our patients.</p>
              <p>We offer a range of services including IVF treatment, gynaecology, aesthetic gynaecology, and pregnancy care. Our IVF clinic is equipped with state-of-the-art technology, and our highly experienced team of fertility specialists are committed to providing personalized and comprehensive care.</p>
            </div>
            <div className="feature-image-card">
              <img src="https://renewhealthcare.in/wp-content/uploads/2024/07/Dr-rajeev-agarwal.png" alt="Dr. Rajeev Agarwal" />
              <h3>Dr. Rajeev Agarwal</h3>
              <p>Medical Director | Fertility Specialist | IVF Doctor</p>
            </div>
          </div>

          <section className="content-panel">
            <h3>Renew Healthcare attempts to make changes in your lives by:</h3>
            <p>Renew Healthcare offers comprehensive medical care that focuses on the unique needs of women. This includes preconception planning, fertility testing, fertility treatment, and care for associated health conditions.</p>
            <p>Modern technologies such as telemedicine, electronic health records, and mobile applications can help improve access to care, promote continuity of care, and reduce healthcare costs.</p>
            <p>Many women lack access to comprehensive information about fertility and reproductive health. Renew Healthcare provides educational resources such as blog posts, videos, and infographics to educate women about fertility, reproductive health, and family planning.</p>
            <p>Renew Healthcare advocates for policies that promote women’s health and access to care, including advocating for insurance coverage of fertility services and supporting legislation that addresses disparities in healthcare access and quality.</p>
          </section>

          <div className="values-grid">
            {[
              ['Mission', 'Our mission is to provide comprehensive, accessible, and patient-centered healthcare services that address the unique health needs of women at all stages of life.'],
              ['Vision', 'All women of every age should achieve best possible health through Renew Healthcare.'],
              ['Values', 'Respecting a woman’s autonomy in healthcare decisions, ensuring informed consent, prioritizing her well-being, and advocating for her needs.'],
            ].map(([title, text]) => (
              <article className="content-panel" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>

          <section className="service-cta-band">
            <div>
              <span>Hope finds happiness</span>
              <h2>Plan your visit</h2>
              <p>Get in touch with us for reproductive, gynaecological, and pregnancy care needs.</p>
            </div>
            <div className="service-cta-actions">
              <Link to="/contact">Contact Us</Link>
              <a href="tel:06292269060">Call 062922 69060</a>
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}
