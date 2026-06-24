// AdminDashboard — overview: KPIs, lead-source breakdown, and recent leads.
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllPosts, fetchLeads } from '../lib/blogApi.js'
import { doctorsApi, testimonialsApi, faqsApi } from '../lib/content.js'
import { SOURCE_LABELS } from './leadsMeta.js'
import { Spinner } from './ui.jsx'

const within = (iso, days) => (Date.now() - new Date(iso).getTime()) / 86400000 <= days

export default function AdminDashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    Promise.allSettled([
      fetchAllPosts(), fetchLeads(), doctorsApi.listAll(), testimonialsApi.listAll(), faqsApi.listAll(),
    ]).then(([posts, leads, doctors, testimonials, faqs]) => {
      const val = (r) => (r.status === 'fulfilled' ? r.value : [])
      setData({ posts: val(posts), leads: val(leads), doctors: val(doctors), testimonials: val(testimonials), faqs: val(faqs) })
    })
  }, [])

  if (!data) return <Spinner />

  const { posts, leads, doctors, testimonials, faqs } = data
  const leads7 = leads.filter((l) => within(l.created_at, 7)).length
  const newLeads = leads.filter((l) => l.status === 'new').length

  const sources = {}
  leads.forEach((l) => { sources[l.source] = (sources[l.source] || 0) + 1 })
  const sourceRows = Object.entries(sources).sort((a, b) => b[1] - a[1])
  const maxSource = Math.max(1, ...sourceRows.map(([, n]) => n))

  const kpis = [
    { label: 'Published posts', value: posts.filter((p) => p.published).length, to: '/admin/blogs', accent: 'blue' },
    { label: 'Total leads', value: leads.length, sub: `${newLeads} new`, to: '/admin/leads', accent: 'green' },
    { label: 'Leads · last 7 days', value: leads7, to: '/admin/leads', accent: 'amber' },
    { label: 'Doctors', value: doctors.length, to: '/admin/doctors', accent: 'violet' },
    { label: 'Testimonials', value: testimonials.length, to: '/admin/testimonials', accent: 'pink' },
    { label: 'FAQs', value: faqs.length, to: '/admin/faqs', accent: 'teal' },
  ]

  return (
    <section className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>Dashboard</h1>
          <p className="admin-muted">A quick pulse of your site’s content and enquiries.</p>
        </div>
        <Link to="/admin/new" className="admin-btn primary">+ New post</Link>
      </div>

      <div className="kpi-grid">
        {kpis.map((k) => (
          <Link to={k.to} className={`kpi kpi-${k.accent}`} key={k.label}>
            <span className="kpi-value">{k.value}</span>
            <span className="kpi-label">{k.label}</span>
            {k.sub && <span className="kpi-sub">{k.sub}</span>}
          </Link>
        ))}
      </div>

      <div className="admin-cols">
        <div className="admin-card">
          <div className="admin-card-head"><h3>Leads by source</h3></div>
          {sourceRows.length === 0 ? (
            <p className="admin-muted">No leads yet.</p>
          ) : (
            <ul className="bar-list">
              {sourceRows.map(([src, n]) => (
                <li key={src}>
                  <span className="bar-label">{SOURCE_LABELS[src] || src}</span>
                  <span className="bar-track"><span className="bar-fill" style={{ width: `${(n / maxSource) * 100}%` }} /></span>
                  <span className="bar-num">{n}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="admin-card">
          <div className="admin-card-head">
            <h3>Recent leads</h3>
            <Link to="/admin/leads" className="admin-link">View all →</Link>
          </div>
          {leads.length === 0 ? (
            <p className="admin-muted">No leads yet.</p>
          ) : (
            <ul className="recent-list">
              {leads.slice(0, 6).map((l) => (
                <li key={l.id}>
                  <div>
                    <strong>{l.name || 'Unknown'}</strong>
                    <span className="admin-muted">{l.phone || l.email || '—'}</span>
                  </div>
                  <em className="admin-pill src">{SOURCE_LABELS[l.source] || l.source}</em>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
