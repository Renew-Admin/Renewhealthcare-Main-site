import { Link } from 'react-router-dom'
import './ServicesPages.css'

export default function NotFound() {
  return (
    <main className="content-page">
      <section className="notfound-band">
        <div className="notfound-inner">
          <span className="notfound-code">404</span>
          <h1>We couldn’t find that page</h1>
          <p>
            The page you were looking for may have moved or no longer exists. Let’s get you
            back on track to your parenthood journey.
          </p>
          <div className="notfound-actions">
            <Link to="/" className="notfound-primary">Back to Home</Link>
            <Link to="/services" className="notfound-secondary">Explore Services</Link>
            <a href="tel:06292312076" className="notfound-secondary">Call 062923 12076</a>
          </div>
          <div className="notfound-links">
            <Link to="/doctors">Our Doctors</Link>
            <Link to="/blogs">Blogs</Link>
            <Link to="/success-stories">Success Stories</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
