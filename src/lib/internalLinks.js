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

// Whole anchors, non-greedy so each match stops at its own </a>. Used to
// unlink tag archives, which this site never had (RH-03).
const ANCHOR_PATTERN = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi
const TAG_ARCHIVE_PATTERN = /^\/blogs\/tag(?:\/|$)/i

// Internal paths that have no live destination at all, so the anchor is
// turned into plain text rather than pointed somewhere (RH-02). The static
// copy of an article can be edited by hand, but the same body also lives in
// Supabase for CMS-served posts, so this has to happen at render time too.
const UNLINK_PATHS = new Set([
  // "standard care protocol" link to a WordPress page that no longer exists.
  '/how-can-you-access-ipgc',
])

function hasNoDestination(path) {
  if (!path) return false
  if (TAG_ARCHIVE_PATTERN.test(path)) return true
  return UNLINK_PATHS.has(normalizePath(path))
}

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

// Query-string hygiene (RH-04/RH-13). Tracking parameters pasted into the
// site's own links split analytics sessions, and the chatgpt.com attribution
// tag some articles were drafted with does not belong in any link we emit.
const isTrackingParam = param => /^utm_/i.test(param)
const isChatGptTag = param => param.toLowerCase() === 'utm_source=chatgpt.com'

// Drop the query parameters `shouldDrop` matches from a `?query#hash` suffix,
// keeping the rest (and the hash) in place. The "?" goes when nothing is left.
function stripQueryParams(suffix, shouldDrop) {
  const hashIndex = suffix.indexOf('#')
  const query = hashIndex === -1 ? suffix : suffix.slice(0, hashIndex)
  const hash = hashIndex === -1 ? '' : suffix.slice(hashIndex)
  if (!query.startsWith('?')) return suffix
  // HTML attributes may spell the separator as &amp; — keep whichever is used.
  const separator = query.includes('&amp;') ? '&amp;' : '&'
  const kept = query.slice(1).split(separator).filter(param => param && !shouldDrop(param))
  return `${kept.length ? `?${kept.join(separator)}` : ''}${hash}`
}

// The site-relative path of an internal href, or '' for anything else.
function internalPath(href) {
  if (!isInternal(href)) return ''
  const withoutOrigin = /^https?:\/\//i.test(href) ? href.slice(SITE.length) || '/' : href
  return splitHref(withoutOrigin).path
}

/**
 * Replace every link to a tag archive (/blogs/tag/…) or to a path in
 * UNLINK_PATHS with a <span>, keeping the anchor's class and inner HTML.
 * WordPress emitted the tag links under the "Popular Searches" block; the
 * site has no tag pages, so they all 404.
 */
function unlinkTagArchives(html) {
  let changed = 0
  const output = html.replace(ANCHOR_PATTERN, (match, attrs, inner) => {
    const href = /\bhref=(["'])([^"']*)\1/i.exec(attrs)
    if (!href || !hasNoDestination(internalPath(href[2]))) return match
    const className = /\bclass=(["'])([^"']*)\1/i.exec(attrs)
    changed += 1
    return `<span${className ? ` class=${className[1]}${className[2]}${className[1]}` : ''}>${inner}</span>`
  })
  return { html: output, changed }
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
  const unlinked = unlinkTagArchives(String(html || ''))
  let changed = unlinked.changed

  const output = unlinked.html.replace(HREF_PATTERN, (match, prefix, quote, href) => {
    if (!isInternal(href)) {
      // External link: only the chatgpt.com attribution tag is removed.
      const external = splitHref(href)
      const cleaned = `${external.path}${stripQueryParams(external.suffix, isChatGptTag)}`
      if (cleaned === href) return match
      changed += 1
      return `${prefix}${quote}${cleaned}${quote}`
    }

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
    // is just a longer way of saying the same thing — and without utm_* tags.
    const next = `${resolved}${stripQueryParams(suffix, isTrackingParam)}`
    if (next === href) return match

    changed += 1
    return `${prefix}${quote}${next}${quote}`
  })

  return { html: output, unresolved: [...unresolved], changed }
}
