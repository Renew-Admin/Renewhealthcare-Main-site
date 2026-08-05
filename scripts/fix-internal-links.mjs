// Rewrites internal links in the exported article HTML so none of them goes
// through a 301 (ticket RH-03).
//
//   node scripts/fix-internal-links.mjs --check   report only, exit 1 if dirty
//   node scripts/fix-internal-links.mjs           rewrite the files in place
//
// Run --check in CI to keep the "zero internal links to legacy URLs" acceptance
// criterion from quietly regressing the next time content is imported.
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const contentDir = path.join(projectRoot, 'public/blog-content')
const checkOnly = process.argv.includes('--check')

const { getBlogDirectory, getStaticDirectory } = await import('../src/lib/blogDirectory.js')
const { rewriteInternalLinks } = await import('../src/lib/internalLinks.js')
const { getAllSeoRoutes } = await import('../src/lib/seoRoutes.js')

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
if (!directory.length) directory = getStaticDirectory()

const blogSlugs = new Set(directory.map(article => article.slug))
const routePaths = new Set(getAllSeoRoutes().map(route => route.path))
// Live article routes are not all in the static manifest yet (RH-01), so add
// them from the directory too or the report flags them as unknown.
directory.forEach(article => routePaths.add(`/blogs/${article.slug}`))

const files = (await fs.readdir(contentDir)).filter(name => name.endsWith('.html'))
const unresolvedTotals = new Map()
let changedFiles = 0
let changedLinks = 0

for (const name of files) {
  const filePath = path.join(contentDir, name)
  const original = await fs.readFile(filePath, 'utf8')
  const { html, unresolved, changed } = rewriteInternalLinks(original, { blogSlugs, routePaths })

  unresolved.forEach(link => {
    unresolvedTotals.set(link, (unresolvedTotals.get(link) || 0) + 1)
  })

  if (changed > 0) {
    changedFiles += 1
    changedLinks += changed
    if (!checkOnly) await fs.writeFile(filePath, html)
  }
}

console.log(
  checkOnly
    ? `[links] ${changedLinks} redirecting link(s) across ${changedFiles} file(s) still need rewriting`
    : `[links] rewrote ${changedLinks} redirecting link(s) across ${changedFiles} of ${files.length} file(s)`,
)

if (unresolvedTotals.size) {
  console.warn('\n[links] internal links pointing at paths with no known route — check these by hand:')
  ;[...unresolvedTotals.entries()]
    .sort((a, b) => b[1] - a[1])
    .forEach(([link, count]) => console.warn(`  ${String(count).padStart(4)}x  ${link}`))
}

if (checkOnly && changedLinks > 0) process.exit(1)
