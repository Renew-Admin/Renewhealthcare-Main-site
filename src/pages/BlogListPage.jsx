import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { blogs } from '../data/blogs.js'
import './FinalPages.css'
import './ServicesPages.css'

export default function BlogListPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const categories = ['All', ...new Set(blogs.map(blog => blog.category))]
  const filtered = useMemo(() => blogs.filter(blog => {
    const matchesQuery = `${blog.title} ${blog.excerpt}`.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = category === 'All' || blog.category === category
    return matchesQuery && matchesCategory
  }), [query, category])

  return (
    <main className="content-page">
      <section className="service-banner">
        <img src="https://renewhealthcare.in/wp-content/uploads/2024/12/Inner-Page-Banner-3.jpg" alt="Renew Healthcare blogs" />
        <div className="service-banner-overlay" />
        <div className="service-banner-content"><span>Home / Blogs</span><h1>Blogs</h1></div>
      </section>
      <section className="service-content-band">
        <div className="service-content-inner">
          <div className="service-heading-block">
            <span>Renew Healthcare Blog</span>
            <h2>Latest fertility and healthcare insights</h2>
            <p>Read Renew Healthcare articles on IVF, pregnancy, fertility, wellness, and reproductive health.</p>
          </div>
          <div className="blog-filter-bar">
            <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search blogs" />
            <select value={category} onChange={event => setCategory(event.target.value)}>
              {categories.map(item => <option key={item}>{item}</option>)}
            </select>
          </div>
          <div className="final-card-grid">
            {filtered.map(blog => <BlogCard blog={blog} key={blog.slug} />)}
          </div>
        </div>
      </section>
    </main>
  )
}

export function BlogCard({ blog }) {
  return (
    <Link className="final-blog-card" to={`/blogs/${blog.slug}`}>
      <img src={blog.image} alt={blog.title} />
      <div>
        <span>{blog.date}</span>
        <h3>{blog.title}</h3>
        <p>{blog.excerpt}</p>
        <strong>Read More →</strong>
      </div>
    </Link>
  )
}
