import fs from 'node:fs/promises'

import { blogs } from '../src/data/blogs.js'
import { doctors } from '../src/data/doctors.js'
import { finalPages } from '../src/data/finalPages.js'
import { locations } from '../src/data/locations.js'
import { services } from '../src/data/services.js'

const SITE_URL = 'https://renewhealthcare.in'
const formatLocalDate = date => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const LASTMOD = process.env.SITEMAP_LASTMOD || formatLocalDate(new Date())

const entries = new Map()

function normalizePath(path) {
  const withSlash = path.startsWith('/') ? path : `/${path}`
  return withSlash === '/' ? withSlash : withSlash.replace(/\/+$/, '')
}

function addUrl(path, { lastmod = LASTMOD, changefreq = 'monthly', priority = '0.8' } = {}) {
  const cleanPath = normalizePath(path)
  entries.set(cleanPath, { path: cleanPath, lastmod, changefreq, priority })
}

function urlFor(path) {
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

addUrl('/', { changefreq: 'weekly', priority: '1.0' })
addUrl('/why-renew', { priority: '0.9' })
addUrl('/services', { changefreq: 'weekly', priority: '0.9' })
addUrl('/doctors')
addUrl('/locations')
addUrl('/about-us')
addUrl('/ivf-success-factors-and-rates')
addUrl('/success-stories')
addUrl('/blogs', { changefreq: 'weekly' })
addUrl('/news', { changefreq: 'weekly' })
addUrl('/contact')

Object.values(finalPages).forEach(page => {
  if (page.path) addUrl(page.path)
})

services.forEach(service => {
  addUrl(`/services/${service.slug}`, { priority: '0.7' })
})

locations.forEach(location => {
  addUrl(`/locations/${location.slug}`)
})

doctors.forEach(doctor => {
  addUrl(`/doctor/${doctor.slug}`, { priority: '0.6' })
})

blogs.forEach(blog => {
  addUrl(`/blogs/${blog.slug}`, {
    lastmod: blog.iso || LASTMOD,
    changefreq: 'monthly',
    priority: '0.6',
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

Sitemap: ${SITE_URL}/sitemap.xml
`

await fs.writeFile('public/sitemap.xml', sitemap)
await fs.writeFile('public/robots.txt', robots)

console.log(`Generated ${entries.size} sitemap URLs for ${SITE_URL}`)
