import fs from 'node:fs/promises'

import { blogs } from '../src/data/blogs.js'
import { getAllSeoRoutes } from '../src/lib/seoRoutes.js'
import { SITE, canonicalUrl, normalizePath } from '../src/lib/seoUtils.js'

const formatLocalDate = date => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const LASTMOD = process.env.SITEMAP_LASTMOD || formatLocalDate(new Date())

const entries = new Map()
const blogLastmodByPath = new Map(blogs.map(blog => [normalizePath(`/blogs/${blog.slug}`), blog.iso]))

function addUrl(path, { lastmod = LASTMOD, changefreq = 'monthly', priority = '0.8' } = {}) {
  const cleanPath = normalizePath(path)
  entries.set(cleanPath, { path: cleanPath, lastmod, changefreq, priority })
}

function urlFor(path) {
  return canonicalUrl(path)
}

function sitemapUrlFor(filename) {
  return `${SITE}/${filename}`
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function isBlogPostPath(path) {
  return path.startsWith('/blogs/')
}

function isServicePath(path) {
  return path === '/services' || path.startsWith('/services/')
}

function isCoursePath(path) {
  return path.startsWith('/course/')
}

function isPagePath(path) {
  return !isBlogPostPath(path) && !isServicePath(path) && !isCoursePath(path)
}

function renderUrlset(urls) {
  const body = urls.map(entry => `  <url>
    <loc>${escapeXml(urlFor(entry.path))}</loc>
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

function renderSitemapIndex(sitemaps) {
  const body = sitemaps.map(sitemap => `  <sitemap>
    <loc>${escapeXml(sitemapUrlFor(sitemap.filename))}</loc>
    <lastmod>${escapeXml(LASTMOD)}</lastmod>
  </sitemap>`).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>
`
}

getAllSeoRoutes().forEach(route => {
  const path = route.path
  const isBlogPost = isBlogPostPath(path)
  const isService = path.startsWith('/services/')
  const isDoctor = path.startsWith('/doctor/')

  addUrl(path, {
    lastmod: blogLastmodByPath.get(path) || LASTMOD,
    changefreq: path === '/' || path === '/services' || path === '/blogs' || path === '/news' ? 'weekly' : 'monthly',
    priority: path === '/'
      ? '1.0'
      : path === '/why-renew' || path === '/services'
        ? '0.9'
        : isService
          ? '0.7'
          : isBlogPost || isDoctor
            ? '0.6'
            : '0.8',
  })
})

const allEntries = [...entries.values()]
const sitemapGroups = [
  { filename: 'page-sitemap.xml', entries: allEntries.filter(entry => isPagePath(entry.path)) },
  { filename: 'services-sitemap.xml', entries: allEntries.filter(entry => isServicePath(entry.path)) },
  { filename: 'course-sitemap.xml', entries: allEntries.filter(entry => isCoursePath(entry.path)) },
  { filename: 'post-sitemap.xml', entries: allEntries.filter(entry => isBlogPostPath(entry.path)) },
].filter(group => group.entries.length)

const robots = `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${SITE}/sitemap_index.xml
`

await Promise.all([
  fs.writeFile('public/sitemap.xml', renderUrlset(allEntries)),
  fs.writeFile('public/sitemap_index.xml', renderSitemapIndex(sitemapGroups)),
  fs.writeFile('public/robots.txt', robots),
  ...sitemapGroups.map(group => fs.writeFile(`public/${group.filename}`, renderUrlset(group.entries))),
])

console.log(`Generated ${entries.size} sitemap URLs across ${sitemapGroups.length} indexed sitemaps for ${SITE}`)
