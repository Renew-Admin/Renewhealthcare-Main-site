import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useBlogs } from '../hooks/useBlogs.js'
import Seo from '../components/Seo.js'
import { resolveBlogImage, rewriteBlogImageUrls } from '../lib/blogImages.js'
import { buildArticleSchemas, detectArticleLang, getHreflangAlternates } from '../lib/blogSeo.js'
import { rewriteInternalLinks } from '../lib/internalLinks.js'
import { getAllSeoRoutes } from '../lib/seoRoutes.js'
import './ServicesPages.css'
import './Blog.css'

export default function BlogPostPage() {
  const { slug } = useParams()
  const { blogs, loading: blogsLoading } = useBlogs()
  const blog = blogs.find(item => item.slug === slug)
  const [html, setHtml] = useState(null)
  const [status, setStatus] = useState('loading')

  // The exported article HTML is rewritten at rest by scripts/fix-internal-links.mjs,
  // but posts written in the admin panel are not, so links are normalised here
  // too — no internal link should cost a redirect hop (RH-03).
  const linkContext = useMemo(() => ({
    blogSlugs: new Set(blogs.map(item => item.slug)),
    routePaths: new Set([
      ...getAllSeoRoutes().map(route => route.path),
      ...blogs.map(item => `/blogs/${item.slug}`),
    ]),
  }), [blogs])

  useEffect(() => {
    if (!blog) return
    const prepare = raw => rewriteInternalLinks(rewriteBlogImageUrls(raw), linkContext).html

    // Posts created in the admin panel carry their full HTML inline.
    if (blog._remote) {
      setHtml(prepare(blog.content || ''))
      setStatus('ready')
      return
    }
    // Static posts lazy-load their HTML from /public/blog-content/<slug>.html.
    let active = true
    setStatus('loading')
    setHtml(null)
    fetch(`/blog-content/${slug}.html`)
      .then(res => { if (!res.ok) throw new Error('not found'); return res.text() })
      .then(text => { if (active) { setHtml(prepare(text)); setStatus('ready') } })
      .catch(() => { if (active) setStatus('error') })
    return () => { active = false }
  }, [slug, blog, linkContext])

  if (!blog) {
    if (blogsLoading) {
      return (
        <main className="content-page">
          <section className="service-content-band">
            <div className="service-content-inner"><p className="blogx-loading">Loading article…</p></div>
          </section>
        </main>
      )
    }
    return (
      <main className="content-page">
        <Seo title="Blog not found" path={`/blogs/${slug}`} robots="noindex, follow" />
        <section className="service-content-band">
          <div className="service-content-inner service-not-found">
            <span>Blogs</span><h1>Blog not found</h1>
            <Link className="service-pill-link" to="/blogs">Back to Blogs</Link>
          </div>
        </section>
      </main>
    )
  }

  const related = blogs.filter(b => b.slug !== blog.slug && b.category === blog.category).slice(0, 4)
  const fill = related.length < 4 ? blogs.filter(b => b.slug !== blog.slug && !related.includes(b)).slice(0, 4 - related.length) : []
  const sidebar = [...related, ...fill]
  const heroImage = resolveBlogImage(blog, html || '')

  const lang = detectArticleLang(blog)
  const alternates = getHreflangAlternates(blog.slug, {
    isLive: slug => blogs.some(item => item.slug === slug),
  })

  // Built from the same helpers the Worker uses, so the client-rendered copy
  // (dev, or after a client-side navigation) matches what ships in the HTML.
  // Seo skips injection when the Worker already served these (RH-05).
  const jsonLd = buildArticleSchemas(blog, html || '', { lang, image: heroImage })

  return (
    <main className="content-page blogx-post-page">
      <Seo
        title={blog.title}
        description={blog.excerpt}
        path={`/blogs/${blog.slug}`}
        image={heroImage}
        type="article"
        lang={lang}
        alternates={alternates}
        jsonLd={jsonLd}
      />

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
          <motion.figure
            className="blogx-hero-figure"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={heroImage} alt={blog.title} />
          </motion.figure>

          <div className="blogx-post-layout">
            <motion.article className="blogx-article" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}>
              {status === 'loading' && <p className="blogx-loading">Loading article…</p>}
              {status === 'error' && <p className="blogx-loading">This article could not be loaded right now. <Link to="/blogs">Browse all blogs →</Link></p>}
              {status === 'ready' && html != null && (
                <div className="blogx-prose" dangerouslySetInnerHTML={{ __html: html }} />
              )}

              <Link className="blogx-back" to="/blogs">← Back to all blogs</Link>
            </motion.article>

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
