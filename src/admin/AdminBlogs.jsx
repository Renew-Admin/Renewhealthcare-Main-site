// AdminBlogs — list every blog post (published + drafts) with edit / delete.
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllPosts, deletePost } from '../lib/blogApi.js'
import { invalidateBlogsCache } from '../hooks/useBlogs.js'
import { EmptyState, Spinner, useToast } from './ui.jsx'

export default function AdminBlogs() {
  const toast = useToast()
  const [posts, setPosts] = useState([])
  const [status, setStatus] = useState('loading')
  const [query, setQuery] = useState('')

  const load = () => {
    setStatus('loading')
    fetchAllPosts()
      .then((rows) => { setPosts(rows); setStatus('ready') })
      .catch((err) => { toast(err?.message || 'Failed to load', 'error'); setStatus('error') })
  }
  useEffect(load, []) // eslint-disable-line react-hooks/exhaustive-deps

  const remove = async (post) => {
    if (!window.confirm(`Delete “${post.title}”? This cannot be undone.`)) return
    try {
      await deletePost(post.id)
      invalidateBlogsCache()
      setPosts((p) => p.filter((x) => x.id !== post.id))
      toast('Post deleted')
    } catch (err) {
      toast(err?.message || 'Delete failed', 'error')
    }
  }

  const shown = posts.filter((p) => `${p.title} ${p.category}`.toLowerCase().includes(query.toLowerCase()))

  return (
    <section className="admin-page">
      <div className="admin-page-head">
        <div>
          <h1>Blog posts</h1>
          <p className="admin-muted">Added to the website alongside the existing articles.</p>
        </div>
        <Link to="/admin/new" className="admin-btn primary">+ New post</Link>
      </div>

      {status === 'loading' && <Spinner />}

      {status === 'ready' && posts.length === 0 && (
        <EmptyState icon="✍" title="No posts yet">
          <Link to="/admin/new" className="admin-btn primary">Create your first post</Link>
        </EmptyState>
      )}

      {status === 'ready' && posts.length > 0 && (
        <>
          <div className="admin-toolbar">
            <input className="admin-search" placeholder="Search posts…" value={query} onChange={(e) => setQuery(e.target.value)} />
            <span className="admin-muted">{shown.length} of {posts.length}</span>
          </div>
          <div className="admin-table blogs">
            <div className="admin-tr admin-th">
              <span>Title</span><span>Category</span><span>Date</span><span>Status</span><span></span>
            </div>
            {shown.map((p) => (
              <div className="admin-tr" key={p.id}>
                <span className="admin-td-title">
                  {p.image && <img src={p.image} alt="" />}
                  <span className="admin-clip">{p.title}</span>
                </span>
                <span>{p.category}</span>
                <span className="admin-muted">{p.date}</span>
                <span><em className={`admin-pill ${p.published ? 'live' : 'draft'}`}>{p.published ? 'Published' : 'Draft'}</em></span>
                <span className="admin-td-actions">
                  <Link to={`/admin/edit/${p.id}`} className="admin-btn ghost sm">Edit</Link>
                  <a href={`/blogs/${p.slug}`} target="_blank" rel="noreferrer" className="admin-btn ghost sm">View</a>
                  <button type="button" className="admin-btn danger sm" onClick={() => remove(p)}>Delete</button>
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
