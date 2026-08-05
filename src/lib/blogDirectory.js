// blogDirectory — the one place that answers "which blog posts exist?".
//
// Before this module the answer was hardcoded in src/data/blogs.js, which is a
// build-time snapshot. Posts published from the admin panel live in Supabase
// and never reached it, so they showed up in the /blogs listing (which reads
// Supabase at runtime) while their own URLs fell through to the Worker's 404
// branch and never made it into post-sitemap.xml. See ticket RH-01.
//
// Everything that needs the blog list — the Worker's route resolution, the
// sitemap generator, the SEO manifest — now goes through here, so a published
// post cannot be visible in one place and missing from another.
//
// Runs in both the Cloudflare Worker (config from `env`) and Node build
// scripts (config from `process.env`). Supabase is the source of truth;
// src/data/blogs.js is the offline fallback if the query fails.
import { blogs as staticBlogs } from '../data/blogs.js'
import { RETIRED_BLOG_SLUGS } from './seoDuplicates.js'

// Columns the directory needs. Deliberately excludes `content` — pulling full
// article HTML for 143 posts on every cold request would be wasteful. Article
// content is fetched per-slug by fetchBlogContent().
const LIST_COLUMNS = 'slug,title,excerpt,category,cover_image,published_at,created_at,updated_at,read_mins'

// How long a resolved directory is reused within one Worker isolate.
const MEMORY_TTL_MS = 60_000

let memoryCache = null
let memoryCachedAt = 0
let inflight = null

export function getSupabaseConfig(source = {}) {
  const url = source.SUPABASE_URL || source.VITE_SUPABASE_URL || ''
  const key = source.SUPABASE_ANON_KEY || source.VITE_SUPABASE_ANON_KEY || ''
  return { url: url.replace(/\/+$/, ''), key, configured: Boolean(url && key) }
}

function toIso(row) {
  return String(row.published_at || row.created_at || '').slice(0, 10)
}

function toDisplayDate(iso) {
  if (!iso) return ''
  const parsed = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(parsed.getTime())) return ''
  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

// Supabase row -> the same shape the rest of the app already uses for blogs.
function normalizeRemote(row) {
  const iso = toIso(row)
  return {
    slug: row.slug,
    title: row.title || '',
    excerpt: row.excerpt || '',
    category: row.category || 'General',
    image: row.cover_image || '',
    readMins: row.read_mins || 5,
    iso,
    modifiedIso: String(row.updated_at || '').slice(0, 10) || iso,
    date: toDisplayDate(iso),
    remote: true,
  }
}

function normalizeStatic(blog) {
  return {
    slug: blog.slug,
    title: blog.title || '',
    excerpt: blog.excerpt || '',
    category: blog.category || 'General',
    image: blog.image || '',
    readMins: blog.readMins || 5,
    iso: blog.iso || '',
    modifiedIso: blog.iso || '',
    date: blog.date || toDisplayDate(blog.iso),
    remote: false,
  }
}

// Remote posts win on slug collisions — that mirrors useBlogs().merge(), so the
// listing and the routes cannot disagree about which version of a post is live.
function mergeDirectory(remote) {
  const bySlug = new Map()
  staticBlogs.forEach(blog => bySlug.set(blog.slug, normalizeStatic(blog)))
  remote.forEach(row => bySlug.set(row.slug, normalizeRemote(row)))

  // Retired duplicates (RH-02) are redirected, so they must not appear as
  // live routes or sitemap entries.
  RETIRED_BLOG_SLUGS.forEach(slug => bySlug.delete(slug))

  return [...bySlug.values()].sort((a, b) => String(b.iso).localeCompare(String(a.iso)))
}

// The static list on its own, used when Supabase is unreachable.
export function getStaticDirectory() {
  return mergeDirectory([])
}

async function queryPublishedRows(config, fetchImpl) {
  const endpoint = `${config.url}/rest/v1/blogs?select=${LIST_COLUMNS}&published=eq.true&order=published_at.desc`
  const response = await fetchImpl(endpoint, {
    headers: {
      apikey: config.key,
      authorization: `Bearer ${config.key}`,
      accept: 'application/json',
    },
  })
  if (!response.ok) throw new Error(`Supabase responded ${response.status}`)
  const rows = await response.json()
  return Array.isArray(rows) ? rows.filter(row => row && row.slug) : []
}

/**
 * Every published blog post, newest first. Never throws: on any Supabase
 * failure it falls back to the built-in list so the site keeps serving.
 */
export async function getBlogDirectory(source = {}, { fetchImpl = fetch, now = Date.now() } = {}) {
  if (memoryCache && now - memoryCachedAt < MEMORY_TTL_MS) return memoryCache

  const config = getSupabaseConfig(source)
  if (!config.configured) return getStaticDirectory()

  if (!inflight) {
    inflight = queryPublishedRows(config, fetchImpl)
      .then(rows => {
        memoryCache = mergeDirectory(rows)
        memoryCachedAt = Date.now()
        return memoryCache
      })
      .catch(error => {
        console.warn('[blogDirectory] Supabase query failed:', error.message)
        // Serve the stale copy if we have one, otherwise the static list.
        return memoryCache || getStaticDirectory()
      })
      .finally(() => {
        inflight = null
      })
  }

  return inflight
}

/** Full article HTML for one slug, or '' when the post has no remote body. */
export async function fetchBlogContent(slug, source = {}, { fetchImpl = fetch } = {}) {
  const config = getSupabaseConfig(source)
  if (!config.configured) return ''

  try {
    const endpoint = `${config.url}/rest/v1/blogs?select=content&published=eq.true&slug=eq.${encodeURIComponent(slug)}&limit=1`
    const response = await fetchImpl(endpoint, {
      headers: {
        apikey: config.key,
        authorization: `Bearer ${config.key}`,
        accept: 'application/json',
      },
    })
    if (!response.ok) throw new Error(`Supabase responded ${response.status}`)
    const rows = await response.json()
    return (Array.isArray(rows) && rows[0] && rows[0].content) || ''
  } catch (error) {
    console.warn(`[blogDirectory] content fetch failed for ${slug}:`, error.message)
    return ''
  }
}

/** Test/build hook — drops the in-isolate cache. */
export function resetBlogDirectoryCache() {
  memoryCache = null
  memoryCachedAt = 0
}
