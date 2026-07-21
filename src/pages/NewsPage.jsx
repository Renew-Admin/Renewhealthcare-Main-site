import { Link } from 'react-router-dom'
import Seo from '../components/Seo.js'
import { NewsCard } from '../components/HomeFeatures/HomeFeatures.js'
import { newsItems } from '../data/homeFeatures.js'
import '../components/HomeFeatures/HomeFeatures.css'
import './ContentPages.css'

export default function NewsPage() {
  return (
    <main className="content-page">
      <Seo
        title="Renew In The News"
        description="Renew Healthcare and Dr. Rajeev Agarwal featured across leading publications — expert insights on IVF, fertility myths and reproductive health."
        path="/news"
      />

      <section className="service-banner">
        <img src="/assets/renew/cta/failed-ivf-banner.jpg" alt="Renew Healthcare in the news" />
        <div className="service-banner-overlay" />
        <div className="service-banner-content">
          <span>Home / News</span>
          <h1>Renew In The News</h1>
        </div>
      </section>

      <section className="service-content-band">
        <div className="service-content-inner">
          <div className="rh-news-page-intro">
            <span>Publications</span>
            <h2>As featured across <span className="heading-blue">leading publications</span></h2>
            <p>
              Dr. Rajeev Agarwal and the Renew Healthcare team are regularly invited by national
              media to share expert perspectives on IVF, fertility and reproductive health. Explore
              our press coverage below.
            </p>
          </div>

          <div className="rh-news-page-grid">
            {newsItems.map((item) => (
              <NewsCard key={item.link} item={item} />
            ))}
          </div>

          <div className="home-center-action">
            <Link to="/" className="home-pill-link">Back to Home</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
