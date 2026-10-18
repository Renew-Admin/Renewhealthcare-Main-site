// seoDuplicates — the retirement list for duplicate URLs (ticket RH-02).
//
// Seven topics are currently published at two URLs each. Left alone they compete
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
  // RH-05 (Technical Health Status Report, 13 Oct 2026): five pairs share a
  // title and body. Default rule for all five: keep the OLDER URL (indexed
  // longer) and retire the newer re-publish. GA4 page views over the 90 days to
  // 18 Oct 2026 are too small to decide it (2–14 per URL), but the kept URL
  // wins or ties within one view in four of five pairs; the exception is the
  // embryo pair (8 vs 4). Swap a pair's sides to flip it.
  {
    // Kept: 5 Sep 2026, 12 views. Retired: 29 Sep 2026, 11 views.
    retire: '/blogs/antagonist-vs-long-agonist-protocol-your-ivf-calendar-day-by-day',
    keep: '/blogs/antagonist-vs-long-protocol-calendar',
  },
  {
    // Kept: 6 Sep 2026, 4 views. Retired: 29 Sep 2026, 8 views.
    retire: '/blogs/what-happens-to-unused-embryos-in-india-the-10-year-rule-and-your-real-choices',
    keep: '/blogs/unused-embryos-india-10-year-rule',
  },
  {
    // Kept: 28 Jul 2026, 14 views. Retired: 28 Sep 2026, 3 views.
    retire: '/blogs/endometriosis-and-fertility-from-diagnosis-to-ivf',
    keep: '/blogs/endometriosis-and-fertility',
  },
  {
    // Kept: 28 Jul 2026, 11 views. Retired: 30 Sep 2026, 12 views.
    retire: '/blogs/can-you-get-pregnant-with-amh-below-1-real-answers',
    keep: '/blogs/can-you-get-pregnant-with-amh-below-1',
  },
  {
    // Kept: 25 Jul 2025, 3 views; its slug matches the shared title.
    // Retired: 13 Nov 2025, 2 views.
    retire: '/blogs/genetic-testing-in-ivf',
    keep: '/blogs/the-power-of-genetics-in-ivf',
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
