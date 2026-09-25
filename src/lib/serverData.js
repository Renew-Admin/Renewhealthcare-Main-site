import 'server-only'
// serverData — everything the public pages need from Supabase, fetched on the
// server while the page is rendered (at build time, or on ISR revalidation).
// The browser never has to fetch page content, so the HTML a crawler receives
// already contains it.
//
// Only the public anon key is used (reads are governed by RLS). With
// RENEW_OFFLINE=1, or when Supabase is not configured or unreachable, every
// function falls back to the static data in src/data so a page always renders.
import { cache } from 'react'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fetchBlogContent, getBlogDirectory } from './blogDirectory.js'
import { buildBlogListing } from './blogListing.js'
import { rewriteBlogImageUrls } from './blogImages.js'
import { buildDoctorList } from './doctorsModel.js'
import { rewriteInternalLinks } from './internalLinks.js'
import { getAllSeoRoutes } from './seoRoutes.js'

/** How often (seconds) pages built from Supabase data are regenerated. */
export const CONTENT_REVALIDATE_SECONDS = 300

export function serverSupabaseEnv() {
  if (process.env.RENEW_OFFLINE === '1') return {}
  return {
    SUPABASE_URL: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  }
}

async function selectRows(table, query) {
  const env = serverSupabaseEnv()
  const url = (env.SUPABASE_URL || '').replace(/\/+$/, '')
  const key = env.SUPABASE_ANON_KEY
  if (!url || !key) return []
  try {
    const response = await fetch(`${url}/rest/v1/${table}?${query}`, {
      headers: { apikey: key, authorization: `Bearer ${key}`, accept: 'application/json' },
      next: { revalidate: CONTENT_REVALIDATE_SECONDS },
    })
    if (!response.ok) throw new Error(`Supabase responded ${response.status}`)
    const rows = await response.json()
    return Array.isArray(rows) ? rows : []
  } catch (error) {
    console.warn(`[serverData] ${table} query failed:`, error.message)
    return []
  }
}

const ACTIVE_ORDERED = 'select=*&active=eq.true&order=display_order.asc,created_at.desc'

export const getDoctorRows = cache(() => selectRows('doctors', ACTIVE_ORDERED))
export const getFaqRows = cache(() => selectRows('faqs', ACTIVE_ORDERED))
export const getTestimonialRows = cache(() => selectRows('testimonials', ACTIVE_ORDERED))

export const getDoctors = cache(async () => buildDoctorList(await getDoctorRows()))

export const getDirectory = cache(() => getBlogDirectory(serverSupabaseEnv()))

export const getBlogListing = cache(async () => buildBlogListing(await getDirectory()))

// Article bodies of the WordPress-imported posts ship as static files. They
// are read from disk while the page is prerendered at build time.
async function readStaticArticle(slug) {
  const safeSlug = String(slug).replace(/[^a-z0-9-]/gi, '')
  const file = path.join(process.cwd(), 'public', 'blog-content', `${safeSlug}.html`)
  return readFile(file, 'utf8')
}

/**
 * One article with its body HTML, ready to render, or null if the slug is not
 * a live post. Internal links and image URLs are normalised here, on the
 * server, exactly as the browser used to do after fetching the fragment.
 */
export const getArticle = cache(async (slug) => {
  const directory = await getDirectory()
  const article = directory.find((item) => item.slug === slug)
  if (!article) return null

  let raw = ''
  if (article.remote) raw = await fetchBlogContent(slug, serverSupabaseEnv())
  if (!raw) {
    try {
      raw = await readStaticArticle(slug)
    } catch (error) {
      // Throwing keeps the previously generated page in the ISR cache instead
      // of replacing a published article with an empty one.
      throw new Error(`Article body unavailable for ${slug}: ${error.message}`)
    }
  }

  const linkContext = {
    blogSlugs: new Set(directory.map((item) => item.slug)),
    routePaths: new Set([
      ...getAllSeoRoutes().map((route) => route.path),
      ...directory.map((item) => `/blogs/${item.slug}`),
    ]),
  }
  const html = rewriteInternalLinks(rewriteBlogImageUrls(raw), linkContext).html
  return { article, html, directory }
})
