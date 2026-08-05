// Writes the static sitemap files and robots.txt at build time.
//
// The Worker serves post-sitemap.xml and sitemap.xml from the live blog
// directory, so these files are the offline baseline rather than the single
// source of truth (RH-01). They are still generated from the same code path,
// so build output and live output cannot drift apart.
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const formatLocalDate = date => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const LASTMOD = process.env.SITEMAP_LASTMOD || formatLocalDate(new Date())

// Stamp the build date before importing anything that reads it.
const stampPath = path.join(projectRoot, 'src/lib/buildStamp.js')
await fs.writeFile(
  stampPath,
  `// Overwritten by scripts/generate-sitemap.js on every build. Committed with a
// fallback so \`wrangler dev\` and a fresh clone work before the first build.
export const BUILD_DATE = '${LASTMOD}'
`,
)

const { getBlogDirectory, getStaticDirectory } = await import('../src/lib/blogDirectory.js')
const { SITE } = await import('../src/lib/seoUtils.js')
const { SITEMAP_FILES, buildSitemapEntries, renderSitemap, renderSitemapIndex } =
  await import('../src/lib/sitemap.js')

// Read .env so the build can reach Supabase the same way the app does.
async function loadEnvFile() {
  try {
    const raw = await fs.readFile(path.join(projectRoot, '.env'), 'utf8')
    const parsed = {}
    raw.split('\n').forEach(line => {
      const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i.exec(line)
      if (match) parsed[match[1]] = match[2].replace(/^["']|["']$/g, '')
    })
    return parsed
  } catch {
    return {}
  }
}

const env = { ...(await loadEnvFile()), ...process.env }

let directory = await getBlogDirectory(env)
if (!directory.length) {
  console.warn('[sitemap] blog directory came back empty — falling back to the built-in list')
  directory = getStaticDirectory()
}

const allEntries = buildSitemapEntries(directory)
const groups = SITEMAP_FILES
  .map(file => ({ ...file, xml: renderSitemap(file.name, directory) }))
  .filter(group => group.xml.includes('<loc>'))

const robots = `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${SITE}/sitemap_index.xml
`

const publicDir = path.join(projectRoot, 'public')
await Promise.all([
  fs.writeFile(path.join(publicDir, 'sitemap.xml'), renderSitemap('all', directory)),
  fs.writeFile(
    path.join(publicDir, 'sitemap_index.xml'),
    renderSitemapIndex(groups.map(group => group.filename), LASTMOD),
  ),
  fs.writeFile(path.join(publicDir, 'robots.txt'), robots),
  ...groups.map(group => fs.writeFile(path.join(publicDir, group.filename), group.xml)),
])

const blogCount = allEntries.filter(entry => entry.path.startsWith('/blogs/')).length
console.log(
  `Generated ${allEntries.length} sitemap URLs (${blogCount} articles) across ${groups.length} indexed sitemaps for ${SITE}`,
)
