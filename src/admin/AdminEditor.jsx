// AdminEditor — create a new post or edit an existing one.
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import RichEditor from './RichEditor.jsx'
import MediaPicker from './MediaPicker.jsx'
import { Spinner, useToast } from './ui.jsx'
import {
  fetchPostById, createPost, updatePost,
  slugify, estimateReadMins,
} from '../lib/blogApi.js'
import { invalidateBlogsCache } from '../hooks/useBlogs.js'

const EMPTY = {
  title: '', slug: '', category: 'Fertility', excerpt: '',
  content: '', cover_image: '', read_mins: 5, published: true, is_featured: false,
  published_at: new Date().toISOString().slice(0, 10),
}

const CATEGORIES = ['Fertility', 'IVF & IUI', 'Male Fertility', 'Pregnancy', 'Gynaecology', 'Wellness', 'General']

export default function AdminEditor() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const toast = useToast()

  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState(isEdit ? 'loading' : 'ready')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const slugTouched = useRef(isEdit)

  useEffect(() => {
    if (!isEdit) return
    fetchPostById(id)
      .then((post) => {
        setForm({
          title: post.title, slug: post.slug, category: post.category,
          excerpt: post.excerpt, content: post.content, cover_image: post.image,
          read_mins: post.readMins, published: post.published, is_featured: post.isFeatured,
          published_at: post.iso || EMPTY.published_at,
        })
        setStatus('ready')
      })
      .catch((err) => { setError(err?.message || 'Failed to load post'); setStatus('error') })
  }, [id, isEdit])

  const set = (patch) => setForm((f) => ({ ...f, ...patch }))

  const onTitle = (title) => {
    set({ title })
    if (!slugTouched.current) set({ slug: slugify(title) })
  }

  const save = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return toast('Title is required', 'error')
    if (!form.slug.trim()) return toast('Slug is required', 'error')

    const payload = {
      ...form,
      slug: slugify(form.slug),
      read_mins: form.read_mins || estimateReadMins(form.content),
      published_at: new Date(form.published_at).toISOString(),
    }

    try {
      setSaving(true)
      if (isEdit) await updatePost(id, payload)
      else await createPost(payload)
      invalidateBlogsCache()
      toast(isEdit ? 'Post saved' : 'Post published')
      navigate('/admin/blogs')
    } catch (err) {
      const msg = /duplicate|unique/i.test(err?.message || '')
        ? 'That slug is already used by another post. Change the slug and try again.'
        : err?.message || 'Save failed.'
      toast(msg, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading') return <Spinner />
  if (status === 'error') return <div className="admin-error">{error}</div>

  return (
    <form className="admin-page admin-editor" onSubmit={save}>
      <div className="admin-page-head">
        <div>
          <Link to="/admin/blogs" className="admin-back">← Back to posts</Link>
          <h1>{isEdit ? 'Edit post' : 'New post'}</h1>
        </div>
        <div className="admin-head-actions">
          <label className="admin-switch">
            <input type="checkbox" checked={form.published} onChange={(e) => set({ published: e.target.checked })} />
            <span>{form.published ? 'Published' : 'Draft'}</span>
          </label>
          <button type="submit" className="admin-btn primary" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Publish post'}
          </button>
        </div>
      </div>

      <div className="admin-editor-grid">
        <div className="admin-editor-main">
          <div className="admin-card">
            <label className="admin-field full">Title
              <input value={form.title} onChange={(e) => onTitle(e.target.value)} placeholder="Post title" required />
            </label>
          </div>
          <label className="admin-field full">Content
            <RichEditor value={form.content} onChange={(content) => set({ content })} />
          </label>
        </div>

        <aside className="admin-editor-side">
          <div className="admin-card">
            <label className="admin-field admin-switch full">
              <input type="checkbox" checked={!!form.is_featured} onChange={(e) => set({ is_featured: e.target.checked })} />
              <span>Feature this blog on the blog page?</span>
            </label>
            <small className="admin-muted">Turn this on when this post should appear as the large Featured article.</small>
          </div>

          <div className="admin-card">
            <label className="admin-field full">Cover image
              <MediaPicker value={form.cover_image} onChange={(url) => set({ cover_image: url })} kind="blog" />
              <small className="admin-muted">Required format: WebP (.webp), under 200 KB.</small>
            </label>
          </div>

          <div className="admin-card admin-form-grid">
            <label className="admin-field full">Slug (URL)
              <input value={form.slug} onChange={(e) => { slugTouched.current = true; set({ slug: e.target.value }) }} placeholder="post-url-slug" />
              <small className="admin-muted">/blogs/{form.slug || 'your-slug'}</small>
            </label>
            <label className="admin-field full">Category
              <input list="admin-cats" value={form.category} onChange={(e) => set({ category: e.target.value })} />
              <datalist id="admin-cats">{CATEGORIES.map((c) => <option key={c} value={c} />)}</datalist>
            </label>
            <label className="admin-field">Date
              <input type="date" value={form.published_at} onChange={(e) => set({ published_at: e.target.value })} />
            </label>
            <label className="admin-field">Read (min)
              <input type="number" min="1" value={form.read_mins} onChange={(e) => set({ read_mins: Number(e.target.value) })} />
            </label>
          </div>

          <div className="admin-card">
            <label className="admin-field full">Excerpt (card summary)
              <textarea rows={4} value={form.excerpt} onChange={(e) => set({ excerpt: e.target.value })} placeholder="One or two sentences shown on the blog list." />
            </label>
          </div>
        </aside>
      </div>
    </form>
  )
}
