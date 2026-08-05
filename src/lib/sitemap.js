// sitemap — one implementation shared by the build script and the Worker.
//
// Blog URLs come from the live directory rather than the build-time route
// manifest (RH-01), so post-sitemap.xml lists every published article the
// moment it is published, with no rebuild. The build script still writes the
// files so the site has a sane sitemap even if Supabase is unreachable; the
// Worker overrides the two blog-bearing sitemaps with live output.
import { BUILD_DATE } from './buildStamp.js'
import { getAllSeoRoutes } from './seoRoutes.js'
import { canonicalUrl, normalizePath, SITE } from './seoUtils.js'

/** URL path -> sitemap name, for the sitemaps the Worker serves dynamically. */
export const SITEMAP_ROUTES = new Map([
  ['/post-sitemap.xml', 'post'],
  ['/sitemap.xml', 'all'],
])

/** Files the build script writes. Blog-bearing ones are also served live. */
export const SITEMAP_FILES = [
  { filename: 'page-sitemap.xml', name: 'page' },
  { filename: 'services-sitemap.xml', name: 'services' },
  { filename: 'course-sitemap.xml', name: 'course' },
  { filename: 'post-sitemap.xml', name: 'post' },
]

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

const isBlogPostPath = path => path.startsWith('/blogs/')
const isServicePath = path => path === '/services' || path.startsWith('/services/')
const isCoursePath = path => path.startsWith('/course/')
const isPagePath = path => !isBlogPostPath(path) && !isServicePath(path) && !isCoursePath(path)

function priorityFor(path) {
  if (path === '/') return '1.0'
  if (path === '/why-renew' || path === '/services') return '0.9'
  if (path.startsWith('/services/')) return '0.7'
  if (isBlogPostPath(path) || path.startsWith('/doctor/')) return '0.6'
  return '0.8'
}

function changefreqFor(path) {
  return path === '/' || path === '/services' || path === '/blogs' || path === '/news'
    ? 'weekly'
    : 'monthly'
}

function entryFor(path, lastmod) {
  const cleanPath = normalizePath(path)
  return {
    path: cleanPath,
    lastmod: lastmod || BUILD_DATE,
    changefreq: changefreqFor(cleanPath),
    priority: priorityFor(cleanPath),
  }
}

/**
 * Every URL that belongs in a sitemap, deduplicated by path.
 *
 * Blog posts come from `directory`; everything else from the static route
 * manifest. Blog entries in the manifest are ignored so the two can never
 * disagree about which articles are live.
 */
export function buildSitemapEntries(directory = []) {
  const entries = new Map()

  getAllSeoRoutes().forEach(route => {
    if (isBlogPostPath(route.path)) return
    entries.set(route.path, entryFor(route.path))
  })

  directory.forEach(article => {
    const path = normalizePath(`/blogs/${article.slug}`)
    entries.set(path, entryFor(path, article.modifiedIso || article.iso))
  })

  return [...entries.values()]
}

function selectEntries(name, entries) {
  switch (name) {
    case 'post': return entries.filter(entry => isBlogPostPath(entry.path))
    case 'services': return entries.filter(entry => isServicePath(entry.path))
    case 'course': return entries.filter(entry => isCoursePath(entry.path))
    case 'page': return entries.filter(entry => isPagePath(entry.path))
    default: return entries
  }
}

export function renderUrlset(urls) {
  const body = urls.map(entry => `  <url>
    <loc>${escapeXml(canonicalUrl(entry.path))}</loc>
    <lastmod>${escapeXml(entry.lastmod)}</lastmod>
    <changefreq>${escapeXml(entry.changefreq)}</changefreq>
    <priority>${escapeXml(entry.priority)}</priority>
  </url>`).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`
}

export function renderSitemapIndex(filenames, lastmod = BUILD_DATE) {
  const body = filenames.map(filename => `  <sitemap>
    <loc>${escapeXml(`${SITE}/${filename}`)}</loc>
    <lastmod>${escapeXml(lastmod)}</lastmod>
  </sitemap>`).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>
`
}

/** One named sitemap, rendered from the live blog directory. */
export function renderSitemap(name, directory = []) {
  return renderUrlset(selectEntries(name, buildSitemapEntries(directory)))
}
