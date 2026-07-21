import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useBlogs } from '../hooks/useBlogs.js'
import Seo, { SITE } from '../components/Seo.js'
import { resolveBlogImage, rewriteBlogImageUrls } from '../lib/blogImages.js'
import './ServicesPages.css'
import './Blog.css'

export default function BlogPostPage() {
  const { slug } = useParams()
  const { blogs, loading: blogsLoading } = useBlogs()
  const blog = blogs.find(item => item.slug === slug)
  const [html, setHtml] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    if (!blog) return
    // Posts created in the admin panel carry their full HTML inline.
    if (blog._remote) {
      setHtml(rewriteBlogImageUrls(blog.content || ''))
      setStatus('ready')
      return
    }
    // Static posts lazy-load their HTML from /public/blog-content/<slug>.html.
    let active = true
    setStatus('loading')
    setHtml(null)
    fetch(`/blog-content/${slug}.html`)
      .then(res => { if (!res.ok) throw new Error('not found'); return res.text() })
      .then(text => { if (active) { setHtml(rewriteBlogImageUrls(text)); setStatus('ready') } })
      .catch(() => { if (active) setStatus('error') })
    return () => { active = false }
  }, [slug, blog])

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

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: blog.title,
      description: blog.excerpt,
      image: [SITE + blog.image],
      datePublished: blog.iso,
      dateModified: blog.iso,
      author: { '@type': 'Organization', name: 'Renew Healthcare' },
      publisher: {
        '@type': 'Organization',
        name: 'Renew Healthcare',
        logo: { '@type': 'ImageObject', url: `${SITE}/images/renew/uploads/2024/07/renew-healthcare-logo.jpg.webp` },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}/blogs/${blog.slug}` },
      articleSection: blog.category,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
        { '@type': 'ListItem', position: 2, name: 'Blogs', item: `${SITE}/blogs` },
        { '@type': 'ListItem', position: 3, name: blog.title, item: `${SITE}/blogs/${blog.slug}` },
      ],
    },
  ]

  return (
    <main className="content-page">
      <Seo title={blog.title} description={blog.excerpt} path={`/blogs/${blog.slug}`} image={heroImage} type="article" jsonLd={jsonLd} />

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
                <a href="tel:06292269060" className="blogx-aside-cta-btn ghost">Call 062922 69060</a>
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
            <div className="service-cta-actions"><Link to="/contact">Book Appointment</Link><a href="tel:06292269060">Call 062922 69060</a></div>
          </section>
        </div>
      </section>
    </main>
  )
}
