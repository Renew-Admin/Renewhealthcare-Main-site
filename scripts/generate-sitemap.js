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

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

getAllSeoRoutes().forEach(route => {
  const path = route.path
  const isBlogPost = path.startsWith('/blogs/')
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

const body = [...entries.values()].map(entry => `  <url>
    <loc>${escapeXml(urlFor(entry.path))}</loc>
    <lastmod>${escapeXml(entry.lastmod)}</lastmod>
    <changefreq>${escapeXml(entry.changefreq)}</changefreq>
    <priority>${escapeXml(entry.priority)}</priority>
  </url>`).join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`

const robots = `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${SITE}/sitemap.xml
`

await fs.writeFile('public/sitemap.xml', sitemap)
await fs.writeFile('public/robots.txt', robots)

console.log(`Generated ${entries.size} sitemap URLs for ${SITE}`)
