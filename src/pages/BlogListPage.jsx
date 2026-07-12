import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useBlogs } from '../hooks/useBlogs.js'
import { useLeadSubmit } from '../hooks/useLeadSubmit.js'
import Seo, { SITE } from '../components/Seo.js'
import './ServicesPages.css'
import './Blog.css'

const PAGE = 4

export default function BlogListPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [page, setPage] = useState(0)
  const topRef = useRef(null)
  const { blogs, categories } = useBlogs()

  const filtered = useMemo(() => blogs.filter(blog => {
    const matchesQuery = `${blog.title} ${blog.excerpt} ${blog.category}`.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = category === 'All' || blog.category === category
    return matchesQuery && matchesCategory
  }), [blogs, query, category])

  const isDefault = category === 'All' && !query.trim()
  const featured = isDefault ? (filtered.find(blog => blog.isFeatured) || filtered[0]) : null
  const rest = isDefault && featured ? filtered.filter(blog => blog.slug !== featured.slug) : filtered
  const firstPageRestCount = featured ? PAGE - 1 : PAGE
  const remainingAfterFirstPage = Math.max(0, rest.length - firstPageRestCount)
  const pageCount = isDefault
    ? 1 + Math.ceil(remainingAfterFirstPage / PAGE)
    : Math.max(1, Math.ceil(rest.length / PAGE))
  const current = Math.min(page, pageCount - 1)
  const shownStart = isDefault && current > 0
    ? firstPageRestCount + (current - 1) * PAGE
    : current * PAGE
  const shownCount = isDefault && current === 0 ? firstPageRestCount : PAGE
  const shown = rest.slice(shownStart, shownStart + shownCount)

  const reset = fn => { fn(); setPage(0) }
  const goToPage = p => {
    setPage(p)
    if (topRef.current) topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Renew Healthcare Blog',
    url: `${SITE}/blogs`,
    description: 'Expert articles on IVF, IUI, fertility, pregnancy, and reproductive health from Renew Healthcare, Kolkata.',
    blogPost: blogs.slice(0, 20).map(b => ({
      '@type': 'BlogPosting',
      headline: b.title,
      datePublished: b.iso,
      url: `${SITE}/blogs/${b.slug}`,
      image: SITE + b.image,
    })),
  }

  return (
    <main className="content-page">
      <Seo
        title="Blogs — IVF, Fertility & Pregnancy Insights"
        description="Read Renew Healthcare articles on IVF, IUI, fertility, pregnancy, gynaecology, and reproductive health — written by Kolkata's leading fertility specialists."
        path="/blogs"
        type="website"
        jsonLd={jsonLd}
      />
      <section className="service-banner">
        <img src="/images/renew/uploads/2024/12/Inner-Page-Banner-3.jpg" alt="Renew Healthcare blogs" />
        <div className="service-banner-overlay" />
        <div className="service-banner-content"><span>Home / Blogs</span><h1>Blogs</h1></div>
      </section>

      <section className="service-content-band">
        <div className="service-content-inner">
          <div className="service-heading-block">
            <span>Renew Healthcare Blog</span>
            <h2>Fertility &amp; pregnancy care insights</h2>
            <p>{blogs.length} expert articles on IVF, IUI, fertility, pregnancy, wellness, and reproductive health.</p>
          </div>

          <div className="blogx-layout">
            <div className="blogx-main">
              {featured && current === 0 && (
                <div>
                  <Link className="blogx-feature" to={`/blogs/${featured.slug}`}>
                    <div className="blogx-feature-media">
                      <img src={featured.image} alt={featured.title} />
                      <span className="blogx-feature-badge">
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M12 2l2.9 6.3 6.8.7-5.1 4.6 1.4 6.7L12 17.8 6 20.6l1.4-6.7L2.3 9l6.8-.7L12 2z" /></svg>
                        Featured
                      </span>
                    </div>
                    <div className="blogx-feature-body">
                      <span className="blogx-feature-tag">{featured.category}</span>
                      <h2>{featured.title}</h2>
                      <p>{featured.excerpt}</p>
                      <div className="blogx-feature-foot">
                        <span>{featured.date} · {featured.readMins} min read</span>
                        <strong>Read article <span className="blogx-inline-arrow" aria-hidden="true" /></strong>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              <div className="blogx-toolbar" ref={topRef}>
                <div className="blogx-search">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
                  <input value={query} onChange={e => reset(() => setQuery(e.target.value))} placeholder="Search articles…" />
                </div>
                <div className="blogx-chips">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      className={cat === category ? 'is-active' : ''}
                      onClick={() => reset(() => setCategory(cat))}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <p className="blogx-count">
                {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}{category !== 'All' ? ` in ${category}` : ''}
                {pageCount > 1 && <span className="blogx-count-page"> · Page {current + 1} of {pageCount}</span>}
              </p>

              {shown.length > 0 ? (
                <div className="blogx-grid">
                  {shown.map(blog => <BlogCard blog={blog} key={blog.slug} />)}
                </div>
              ) : (
                <p className="blogx-empty">No articles match your search. Try a different keyword or category.</p>
              )}

              <Pagination page={current} pageCount={pageCount} onChange={goToPage} />
            </div>

            <aside className="blogx-side">
              <BlogEnquiryForm />
              <div className="blogx-side-topics">
                <h4>Browse by topic</h4>
                <div className="blogx-side-chips">
                  {categories.filter(c => c !== 'All').map(cat => (
                    <button key={cat} type="button" className={cat === category ? 'is-active' : ''} onClick={() => { reset(() => setCategory(cat)); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>{cat}</button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  )
}

function pageWindow(current, count) {
  const cur = current + 1
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1)
  const out = [1]
  if (cur > 3) out.push('gap-l')
  for (let i = Math.max(2, cur - 1); i <= Math.min(count - 1, cur + 1); i++) out.push(i)
  if (cur < count - 2) out.push('gap-r')
  out.push(count)
  return out
}

function Pagination({ page, pageCount, onChange }) {
  if (pageCount <= 1) return null
  const Arrow = ({ dir }) => (
    <span className={`blogx-pager-chevron blogx-pager-chevron-${dir}`} aria-hidden="true" />
  )
  return (
    <nav className="blogx-pager" aria-label="Blog pages">
      <button type="button" className="blogx-pager-arrow" disabled={page === 0} onClick={() => onChange(page - 1)} aria-label="Previous page">
        <Arrow dir="prev" />
      </button>
      <div className="blogx-pager-nums">
        {pageWindow(page, pageCount).map((item, i) => (
          typeof item === 'string'
            ? <span key={item} className="blogx-pager-gap" aria-hidden="true">…</span>
            : <button key={i} type="button" className={`blogx-pager-num ${item - 1 === page ? 'is-active' : ''}`} onClick={() => onChange(item - 1)} aria-current={item - 1 === page ? 'page' : undefined}>{item}</button>
        ))}
      </div>
      <button type="button" className="blogx-pager-arrow" disabled={page === pageCount - 1} onClick={() => onChange(page + 1)} aria-label="Next page">
        <Arrow dir="next" />
      </button>
    </nav>
  )
}

const getTodayDateStr = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yy = String(today.getFullYear()).slice(-2);
  return `${dd}-${mm}-${yy}`;
};

function BlogEnquiryForm() {
  const { status, error, submit } = useLeadSubmit()
  const onSubmit = async event => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const ok = await submit({
      name: data.get('name'),
      customer_number: data.get('customer_number'),
      whatsapp_number: data.get('whatsapp_number'),
      email: data.get('email'),
      purpose: data.get('purpose'),
      message: data.get('message'),
      date: data.get('date'),
      source: 'blog-enquiry',
    })
    if (ok) form.reset()
  }
  return (
    <form className="blogx-side-form" onSubmit={onSubmit}>
      <div className="blogx-side-form-head">
        <span className="blogx-side-form-dot" />
        <div>
          <strong>Request a Call Back</strong>
          <small>Free consultation with our fertility experts</small>
        </div>
      </div>
      <input type="text" name="name" placeholder="Your name" required />
      <input type="tel" name="customer_number" placeholder="Customer Number" required />
      <input type="tel" name="whatsapp_number" placeholder="WhatsApp Number" required />
      <input type="email" name="email" placeholder="Email address" />
      <select name="purpose" defaultValue="" required>
        <option value="" disabled>Choose a purpose</option>
        <option value="Surrogacy">Surrogacy</option>
        <option value="Egg Freezing">Egg Freezing</option>
        <option value="Genetic">Genetic</option>
        <option value="IUI">IUI</option>
        <option value="IVF">IVF</option>
        <option value="New Fertility">New Fertility</option>
        <option value="New Gynae">New Gynae</option>
        <option value="New Pregnancy">New Pregnancy</option>
        <option value="Others">Others</option>
        <option value="Pre-Conception">Pre-Conception</option>
        <option value="Sperm Donation">Sperm Donation</option>
      </select>
      <input type="hidden" name="date" value={getTodayDateStr()} />
      <textarea name="message" placeholder="Your message (optional)" rows={3} />
      <button type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Get a Free Consultation'}</button>
      {status === 'sent' && <p className="lead-form-msg ok">Thank you! We&rsquo;ll be in touch shortly.</p>}
      {status === 'error' && <p className="lead-form-msg err">{error}</p>}
      <a className="blogx-side-call" href="tel:06292269060">or call 062922 69060</a>
    </form>
  )
}


export function BlogCard({ blog }) {
  return (
    <Link
      className="blogx-card"
      to={`/blogs/${blog.slug}`}
    >
      <div className="blogx-card-media">
        <img src={blog.image} alt={blog.title} loading="lazy" />
        <span className="blogx-card-tag">{blog.category}</span>
      </div>
      <div className="blogx-card-body">
        <span className="blogx-card-meta">{blog.date} · {blog.readMins} min read</span>
        <h3>{blog.title}</h3>
        <p>{blog.excerpt}</p>
        <strong className="blogx-card-link">Read article <span className="blogx-inline-arrow" aria-hidden="true" /></strong>
      </div>
    </Link>
  )
}
