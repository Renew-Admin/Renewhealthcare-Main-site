// internalLinks — rewrite internal links in article HTML so none of them
// resolves through a redirect (ticket RH-03).
//
// The WordPress export left every "Popular Blogs" / "Popular Searches" link
// pointing at root-level, trailing-slash URLs (/why-does-iui-fail/). Each of
// those 301s to its current path, and five or six appear under every article,
// so the whole internal-linking module was spending a redirect hop per link.
//
// The 301s themselves stay in place — external inbound links still need them.
// This only fixes links the site emits itself.
import { getDuplicateRedirect } from './seoDuplicates.js'
import { SITE, normalizePath } from './seoUtils.js'

const HREF_PATTERN = /(<a\b[^>]*?\bhref=)(["'])([^"']*)\2/gi

// Links the export left pointing at pages that never existed on this site.
// They 404 today, so any of these is strictly an improvement — but the three
// near-matches at the bottom are judgment calls, not exact renames.
const LEGACY_PATH_ALIASES = new Map([
  ['/blog', '/blogs'],
  // Singular typo: the article slug is "role-of-vitamins-…".
  ['/blogs/role-of-vitamin-in-sperm-improvement', '/blogs/role-of-vitamins-in-sperm-improvement'],
  // Closest live service pages for three retired standalone URLs.
  ['/icsi-ivf-steps', '/services/intracytoplasmic-sperm-injection-icsi'],
  ['/preconception-counseling', '/services/pre-conception-counseling'],
  ['/high-risk-pregnancy', '/services/high-risk-pregnancy-management'],
  // Shortened/working-title slugs used in cross-links; the live slug differs (RH-02).
  ['/blogs/how-many-eggs-good-at-your-age', '/blogs/how-many-eggs-is-a-good-number'],
  // "really" was dropped from the published slug.
  ['/blogs/how-many-ivf-cycles-does-it-really-take', '/blogs/how-many-ivf-cycles-does-it-take'],
  // Cross-links use the short title; the published slug carries the full subtitle.
  ['/blogs/erectile-problems-while-trying-to-conceive', '/blogs/erectile-problems-while-trying-to-conceive-what-causes-them-and-what-can-be-done'],
  // Published as a question slug, linked by its short form.
  ['/blogs/ivf-kolkata-if-you-live-outside-the-city', '/blogs/how-do-i-plan-ivf-in-kolkata-if-i-live-outside-the-city'],
  // Retired WordPress "why choose" page -> the live high-risk pregnancy service.
  ['/why-choose-renew-healthcare-for-high-risk-pregnancy-management', '/services/high-risk-pregnancy-management'],
  // Retired WordPress child page -> the live pre-conception counselling service.
  ['/preconception-counseling/steps-of-preconception-counseling', '/services/pre-conception-counseling'],
  // Surgical sperm aspiration is offered as TESA/PESA; no page exists under the old name.
  ['/services/surgical-sperm-aspiration', '/services/tesa-pesa'],
  // Judgment call: the anchor text is "Book your appointment" and the old landing page is gone.
  ['/landing-page', '/contact'],
])

function isInternal(href) {
  if (!href) return false
  if (/^(?:#|mailto:|tel:|javascript:|data:)/i.test(href)) return false
  if (href.startsWith('//')) return false
  if (/^https?:\/\//i.test(href)) return href.toLowerCase().startsWith(`${SITE}/`.toLowerCase())
  return href.startsWith('/')
}

function splitHref(href) {
  const match = /^([^?#]*)([?#].*)?$/.exec(href)
  return { path: match[1] || '', suffix: match[2] || '' }
}

/**
 * Resolve one internal path to the URL that actually answers with 200.
 *
 * `blogSlugs` is the set of live article slugs and `routePaths` the set of
 * known non-blog routes; both come from the caller so this stays usable at
 * build time (full directory) and in the browser (whatever is loaded).
 */
export function resolveInternalPath(path, { blogSlugs, routePaths }) {
  const clean = normalizePath(path)
  if (clean === '/') return '/'

  // A retired duplicate always resolves to its survivor.
  const duplicate = getDuplicateRedirect(clean)
  if (duplicate) return duplicate

  // Already a known route or an already-correct /blogs/ URL: nothing to do
  // beyond the trailing-slash normalisation normalizePath just did.
  if (routePaths.has(clean)) return clean

  // WordPress used /blog/<slug>; this site uses /blogs/<slug>.
  const singular = clean.startsWith('/blog/') ? `/blogs/${clean.slice('/blog/'.length)}` : clean
  const aliased = LEGACY_PATH_ALIASES.get(singular) || singular
  if (aliased !== clean) return resolveInternalPath(aliased, { blogSlugs, routePaths })

  if (clean.startsWith('/blogs/')) return clean

  const slug = clean.slice(1)
  if (slug.includes('/')) return clean

  // Root-level blog URL from the WordPress era -> its current /blogs/ path.
  if (blogSlugs.has(slug)) {
    const blogPath = `/blogs/${slug}`
    return getDuplicateRedirect(blogPath) || blogPath
  }

  // Root-level service URL -> its current /services/ path.
  if (routePaths.has(`/services/${slug}`)) return `/services/${slug}`

  return clean
}

/**
 * Rewrite every internal href in a block of HTML.
 * Returns the new HTML plus the paths it could not resolve to a known route,
 * so callers can report them instead of silently leaving broken links.
 */
export function rewriteInternalLinks(html, { blogSlugs, routePaths }) {
  const unresolved = new Set()
  let changed = 0

  const output = String(html || '').replace(HREF_PATTERN, (match, prefix, quote, href) => {
    if (!isInternal(href)) return match

    const absolute = /^https?:\/\//i.test(href)
    const withoutOrigin = absolute ? href.slice(SITE.length) || '/' : href
    const { path, suffix } = splitHref(withoutOrigin)
    if (!path) return match

    const resolved = resolveInternalPath(path, { blogSlugs, routePaths })
    const isKnown =
      resolved === '/' ||
      routePaths.has(resolved) ||
      (resolved.startsWith('/blogs/') && blogSlugs.has(resolved.slice('/blogs/'.length)))
    if (!isKnown) unresolved.add(path)

    // Internal links are emitted as paths — an absolute URL to our own origin
    // is just a longer way of saying the same thing.
    const next = `${resolved}${suffix}`
    if (next === href) return match

    changed += 1
    return `${prefix}${quote}${next}${quote}`
  })

  return { html: output, unresolved: [...unresolved], changed }
}
