import 'server-only'
// serverData — everything the public pages need from Supabase, fetched on the
// server while the page is rendered: at build time for every known page, or
// on the first request for a blog post / doctor added after the deploy.
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
      // No fetch caching: the data is fetched when a page is built, and fresh
      // when a new post/doctor page is rendered on demand.
      headers: { apikey: key, authorization: `Bearer ${key}`, accept: 'application/json' },
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

// Article bodies of the WordPress-imported posts ship as static files in
// public/blog-content. They are read from disk while pages are prerendered;
// inside the Cloudflare Worker (no filesystem) the same file is read through
// the Workers static-assets binding instead.
async function readStaticArticle(slug) {
  const safeSlug = String(slug).replace(/[^a-z0-9-]/gi, '')
  try {
    return await readFile(path.join(process.cwd(), 'public', 'blog-content', `${safeSlug}.html`), 'utf8')
  } catch (fsError) {
    try {
      const { getCloudflareContext } = await import('@opennextjs/cloudflare')
      const assets = getCloudflareContext().env.ASSETS
      const response = await assets.fetch(new Request(`http://assets.local/blog-content/${safeSlug}.html`))
      if (response.ok) return await response.text()
    } catch {
      // Not running on Cloudflare — fall through to the original error.
    }
    throw fsError
  }
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
      // Never publish an article page without its body: fail loudly instead.
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
