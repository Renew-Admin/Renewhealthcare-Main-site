// Runs before `next build` (npm "prebuild").
//
// Sitemaps are no longer written to public/: they are route handlers
// (src/app/*.xml/route.js) rendered from the live blog directory and doctor
// list. This script now only stamps the build date the sitemaps use as
// <lastmod> for non-blog pages, and rewrites robots.txt. It makes no network
// calls.
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

await fs.writeFile(
  path.join(projectRoot, 'src/lib/buildStamp.js'),
  `// Overwritten by scripts/generate-sitemap.js on every build. Committed with a
// fallback so \`next dev\` and a fresh clone work before the first build.
export const BUILD_DATE = '${LASTMOD}'
`,
)

const { SITE } = await import('../src/lib/seoUtils.js')

await fs.writeFile(
  path.join(projectRoot, 'public', 'robots.txt'),
  `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${SITE}/sitemap_index.xml
`,
)

console.log(`[prebuild] build date ${LASTMOD}; robots.txt written (sitemaps are served by route handlers)`)
