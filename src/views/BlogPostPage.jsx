import { Link } from '../lib/router.js'
import './ServicesPages.css'
import './Blog.css'

// Server component. The article body, sidebar and language are resolved on
// the server (src/app/(site)/blogs/[slug]/page.js), so the full article is in
// the HTML response — there is no client-side fetch and no loading state.
// Metadata, hreflang and JSON-LD are emitted by that page too.
export default function BlogPostPage({ blog, html, sidebar = [], heroImage, lang = 'en' }) {
  return (
    <main className="content-page blogx-post-page">
      <section className="blogx-post-head">
        <div className="blogx-post-head-inner">
          <nav className="blogx-crumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link><span aria-hidden="true">/</span>
            <Link to="/blogs">Blogs</Link><span aria-hidden="true">/</span>
            <span className="blogx-crumb-current">{blog.category}</span>
          </nav>
          <span className="blogx-post-pill">{blog.category}</span>
          <h1>{blog.title}</h1>
          <div className="blogx-post-meta">
            <span>{blog.date}</span>
            <span className="blogx-post-meta-dot" />
            <span>{blog.readMins} min read</span>
            <span className="blogx-post-meta-dot" />
            <span>Renew Healthcare</span>
          </div>
        </div>
      </section>

      <section className="service-content-band blogx-band">
        <div className="service-content-inner">
          <figure className="blogx-hero-figure blogx-enter">
            <img src={heroImage} alt={blog.title} />
          </figure>

          <div className="blogx-post-layout">
            <article className="blogx-article blogx-enter blogx-enter-delay" lang={lang}>
              <div className="blogx-prose" dangerouslySetInnerHTML={{ __html: html }} />

              <Link className="blogx-back" to="/blogs">← Back to all blogs</Link>
            </article>

            <aside className="blogx-aside">
              <div className="blogx-aside-card is-cta">
                <h4>Talk to a fertility specialist</h4>
                <p>Get personalised guidance from Renew Healthcare — among Kolkata’s most trusted IVF centres.</p>
                <Link to="/contact" className="blogx-aside-cta-btn primary">Book Appointment</Link>
                <a href="tel:06292312076" className="blogx-aside-cta-btn ghost">Call 062923 12076</a>
              </div>

              {sidebar.length > 0 && (
                <div className="blogx-aside-card">
                  <h4>Related reads</h4>
                  <div className="blogx-aside-list">
                    {sidebar.map(item => (
                      <Link className="blogx-aside-link" to={`/blogs/${item.slug}`} key={item.slug}>
                        <img src={item.image} alt={item.title} loading="lazy" />
                        <h5>{item.title}</h5>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>

          <section className="service-cta-band">
            <div><span>Need guidance?</span><h2>Book Your Appointment</h2><p>Speak with Renew Healthcare for the right next step in your journey.</p></div>
            <div className="service-cta-actions"><Link to="/contact">Book Appointment</Link><a href="tel:06292312076">Call 062923 12076</a></div>
          </section>
        </div>
      </section>
    </main>
  )
}
