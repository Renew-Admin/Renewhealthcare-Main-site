// seoRemoved — pages taken off the site for good, and pages kept for patients
// but taken out of search (website brief for renewhealthcare.in, checked by
// the owner on 23–24 Oct 2026).
//
// REMOVED_BLOG_SLUGS: off-topic articles that are deleted rather than
// redirected. Each URL answers 410 Gone at the edge (custom-worker.js) and is
// dropped from the blog listing, the sitemaps, the hreflang pairs and the
// route manifest, whatever the CMS still holds for that slug.
//
// NOINDEX_FINAL_PAGES: static content pages that stay reachable (they are
// patient resources) but carry "noindex, follow" and an X-Robots-Tag header,
// and are left out of the sitemaps.
//
// Placentrex is NOT here: Dr. Rajeev Agarwal's brief of 23 Oct 2026 replaced
// the English article with his own text and 301'd the Bengali copy to it
// (seoDuplicates.js), which supersedes the earlier "delete both" instruction.
import { goneResponse } from './goneResponse.js'
import { normalizePath } from './seoUtils.js'

export const REMOVED_BLOG_SLUGS = new Set([
  'what-is-nightfall-in-men-causes-myths-health-effects',
  'sperm-cramps-in-men',
  'what-is-usg-full-form',
])

export const NOINDEX_FINAL_PAGES = new Set(['injection-instruction'])

/** Every path that answers 410 Gone (bare form; the trailing-slash form is matched too). */
export const REMOVED_PATHS = new Set([...REMOVED_BLOG_SLUGS].map(slug => normalizePath(`/blogs/${slug}`)))

export function isRemovedPath(pathname) {
  return REMOVED_PATHS.has(normalizePath(pathname))
}

/** 410 Gone for a removed page, or null when the request is for anything else. */
export function removedPageResponse(url) {
  return isRemovedPath(url.pathname) ? goneResponse() : null
}
