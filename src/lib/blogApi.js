// blogApi.js — everything the app needs to talk to the Supabase backend for
// blog posts and images. Static (built-in) blogs are NOT handled here; they
// live in src/data/blogs.js. This module only deals with posts created in the
// admin panel.
import { supabase, isSupabaseConfigured } from './supabase.js'
import { uploadImage } from './storage.js'

// Re-export so existing imports (RichEditor, AdminEditor) keep working.
export { uploadImage }

// ---------------------------------------------------------------------------
// Shape mapping: a Supabase row -> the object shape the blog UI already uses.
// The website's BlogCard / BlogPostPage expect: slug, title, date, iso,
// category, excerpt, image, readMins. We add `content` (full HTML, rendered
// directly) and `_remote: true` so pages know not to fetch a static .html file.
// ---------------------------------------------------------------------------
function toBlog(row) {
  const iso = (row.published_at || row.created_at || '').slice(0, 10)
  const date = iso
    ? new Date(row.published_at || row.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category || 'General',
    excerpt: row.excerpt || '',
    content: row.content || '',
    image: row.cover_image || '/images/renew/uploads/2024/12/Inner-Page-Banner-3.jpg',
    readMins: row.read_mins || 5,
    published: row.published,
    isFeatured: !!row.is_featured,
    iso,
    date,
    _remote: true,
  }
}

// ---------------------------------------------------------------------------
// PUBLIC SITE READS
// ---------------------------------------------------------------------------

// Published posts only, newest first. Used to merge into the public blog list.
// Never throws — on any error it returns [] so the public site keeps working.
export async function fetchPublishedPosts() {
  if (!isSupabaseConfigured) return []
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })
  if (error) {
    console.warn('[blogApi] fetchPublishedPosts failed:', error.message)
    return []
  }
  return (data || []).map(toBlog)
}

// ---------------------------------------------------------------------------
// ADMIN READS / WRITES (require an authenticated session)
// ---------------------------------------------------------------------------

// All posts including drafts, newest first.
export async function fetchAllPosts() {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .order('published_at', { ascending: false })
  if (error) throw error
  return (data || []).map(toBlog)
}

export async function fetchPostById(id) {
  const { data, error } = await supabase.from('blogs').select('*').eq('id', id).single()
  if (error) throw error
  return toBlog(data)
}

export async function createPost(input) {
  const { data, error } = await supabase
    .from('blogs')
    .insert(toRow(input))
    .select()
    .single()
  if (error) throw error
  return toBlog(data)
}

export async function updatePost(id, input) {
  const { data, error } = await supabase
    .from('blogs')
    .update(toRow(input))
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return toBlog(data)
}

export async function deletePost(id) {
  const { error } = await supabase.from('blogs').delete().eq('id', id)
  if (error) throw error
}

// Map an admin form object -> a database row.
function toRow(input) {
  const row = {
    slug: input.slug,
    title: input.title,
    category: input.category,
    excerpt: input.excerpt,
    content: input.content,
    cover_image: input.cover_image,
    read_mins: input.read_mins,
    published: input.published,
    is_featured: input.is_featured,
  }
  if (input.published_at) row.published_at = input.published_at
  // Strip undefined so we don't overwrite columns with null on update.
  Object.keys(row).forEach((k) => row[k] === undefined && delete row[k])
  return row
}

// ---------------------------------------------------------------------------
// Small helpers used by the editor.
// ---------------------------------------------------------------------------
export function slugify(text) {
  return (text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// Estimate read time from HTML content (~200 words / minute).
export function estimateReadMins(html) {
  const text = (html || '').replace(/<[^>]+>/g, ' ')
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

// ---------------------------------------------------------------------------
// LEADS — every lead form on the website submits through createLead().
// Anyone can insert (RLS), but only a logged-in admin can read them.
// ---------------------------------------------------------------------------

// Submit one enquiry. `source` says which form it came from.
export async function createLead(input) {
  if (!isSupabaseConfigured) throw new Error('Lead form is not connected (Supabase missing).')
  const row = {
    name: input.name?.trim() || null,
    phone: input.phone?.trim() || null,
    email: input.email?.trim() || null,
    service: input.service?.trim() || null,
    message: input.message?.trim() || null,
    source: input.source || 'website',
    page_path: input.page_path || (typeof window !== 'undefined' ? window.location.pathname : null),
  }
  const { error } = await supabase.from('leads').insert(row)
  if (error) throw error
}

// Admin: read every lead, newest first.
export async function fetchLeads() {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

// Admin: delete a lead.
export async function deleteLead(id) {
  const { error } = await supabase.from('leads').delete().eq('id', id)
  if (error) throw error
}

// Lead pipeline statuses (shared between the admin UI and CSV export).
export const LEAD_STATUSES = ['new', 'contacted', 'converted', 'closed']

// Admin: move a lead along the pipeline.
export async function updateLeadStatus(id, status) {
  const { error } = await supabase.from('leads').update({ status }).eq('id', id)
  if (error) throw error
}
