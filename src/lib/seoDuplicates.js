// seoDuplicates — the retirement list for duplicate URLs (ticket RH-02).
//
// Two topics are currently published at two URLs each. Left alone they compete
// with each other for the same queries, so one URL in each pair is retired with
// a permanent redirect and dropped from the sitemap and the blog listing.
//
// -------------------------------------------------------------------------
// THE SURVIVING URL IN EACH PAIR IS AN SEO DECISION, NOT AN ENGINEERING ONE.
// The defaults below are placeholders pending sign-off. To flip a pair, swap
// the two sides of its entry — nothing else needs to change.
// -------------------------------------------------------------------------
import { normalizePath } from './seoUtils.js'

const PAIRS = [
  {
    // The PCOS -> PMOS renaming story. Default keeps the longer, more current
    // article: it names PMOS in the title and answers "has PCOS really been
    // renamed?" directly, which is the query this pair is competing for.
    retire: '/blogs/why-pcos-is-being-renamed',
    keep: '/blogs/pcos-renamed-pmos',
  },
  {
    // IVF success rates. Default keeps the established root-level landing page
    // (its own React page, the older URL of the two) and retires the blog copy.
    retire: '/blogs/ivf-success-factors-and-rates',
    keep: '/ivf-success-factors-and-rates',
  },
]

/** Retired path -> surviving path. Consumed by the Worker's redirect step. */
export const DUPLICATE_REDIRECTS = new Map(
  PAIRS.map(pair => [normalizePath(pair.retire), normalizePath(pair.keep)]),
)

/**
 * Blog slugs that must not appear as live routes, sitemap entries or listing
 * cards. Only covers retired URLs under /blogs/ — a retired root-level page
 * would be handled by DUPLICATE_REDIRECTS alone.
 */
export const RETIRED_BLOG_SLUGS = new Set(
  [...DUPLICATE_REDIRECTS.keys()]
    .filter(path => path.startsWith('/blogs/'))
    .map(path => path.slice('/blogs/'.length)),
)

export function getDuplicateRedirect(path) {
  return DUPLICATE_REDIRECTS.get(normalizePath(path)) || null
}
