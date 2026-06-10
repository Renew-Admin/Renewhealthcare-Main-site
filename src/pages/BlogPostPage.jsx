import { Link, useParams } from 'react-router-dom'
import { blogs } from '../data/blogs.js'
import { BlogCard } from './BlogListPage.jsx'
import './FinalPages.css'
import './ServicesPages.css'

export default function BlogPostPage() {
  const { slug } = useParams()
  const blog = blogs.find(item => item.slug === slug)

  if (!blog) {
    return (
      <main className="content-page">
        <section className="service-content-band">
          <div className="service-content-inner service-not-found">
            <span>Blogs</span><h1>Blog not found</h1><Link className="service-pill-link" to="/blogs">Back to Blogs</Link>
          </div>
        </section>
      </main>
    )
  }

  const related = blogs.filter(item => item.slug !== blog.slug).slice(0, 3)

  return (
    <main className="content-page">
      <section className="service-banner">
        <img src={blog.image} alt={blog.title} />
        <div className="service-banner-overlay" />
        <div className="service-banner-content"><span>Home / Blogs / {blog.category}</span><h1>{blog.title}</h1></div>
      </section>
      <section className="service-content-band">
        <div className="service-content-inner">
          <article className="final-article">
            <div className="final-meta">{blog.author} · {blog.date}</div>
            {blog.body.split('\n\n').filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          </article>
          <section className="service-cta-band">
            <div><span>Need guidance?</span><h2>Book Your Appointment</h2><p>Speak with Renew Healthcare for the right next step.</p></div>
            <div className="service-cta-actions"><Link to="/contact">Book Appointment</Link><a href="tel:06292269060">Call 062922 69060</a></div>
          </section>
          <section className="final-related">
            <div className="service-heading-block"><span>Related Posts</span><h2>More from Renew Healthcare</h2></div>
            <div className="final-card-grid">{related.map(item => <BlogCard blog={item} key={item.slug} />)}</div>
          </section>
        </div>
      </section>
    </main>
  )
}
