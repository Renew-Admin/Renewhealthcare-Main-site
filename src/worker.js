import { fetchBlogContent, getBlogDirectory } from './lib/blogDirectory.js'
import {
  buildArticleSchemas,
  detectArticleLang,
  getHreflangAlternates,
} from './lib/blogSeo.js'
import { getDuplicateRedirect } from './lib/seoDuplicates.js'
import { getCanonicalRedirectPath, getSeoForPath } from './lib/seoRoutes.js'
import {
  absoluteImageUrl,
  canonicalUrl,
  normalizePath,
  pageTitle,
  truncateDescription,
} from './lib/seoUtils.js'
import { renderSitemap, SITEMAP_ROUTES } from './lib/sitemap.js'

const FILE_EXTENSION_PATTERN = /\.[a-z0-9]{1,12}$/i
const RETIRED_URL_PATTERN = /^\/(?:comment|content)\.php$|^\/products\/[0-9]+\/?$/i
const BLOG_PATH_PATTERN = /^\/blogs\/([^/]+)$/

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function stripSeoTags(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
    .replace(/<meta\b(?=[^>]*name=["']description["'])[^>]*>\s*/gi, '')
    .replace(/<meta\b(?=[^>]*name=["']robots["'])[^>]*>\s*/gi, '')
    .replace(/<meta\b(?=[^>]*property=["']og:title["'])[^>]*>\s*/gi, '')
    .replace(/<meta\b(?=[^>]*property=["']og:description["'])[^>]*>\s*/gi, '')
    .replace(/<meta\b(?=[^>]*property=["']og:type["'])[^>]*>\s*/gi, '')
    .replace(/<meta\b(?=[^>]*property=["']og:url["'])[^>]*>\s*/gi, '')
    .replace(/<meta\b(?=[^>]*property=["']og:image["'])[^>]*>\s*/gi, '')
    .replace(/<meta\b(?=[^>]*property=["']og:site_name["'])[^>]*>\s*/gi, '')
    .replace(/<meta\b(?=[^>]*name=["']twitter:card["'])[^>]*>\s*/gi, '')
    .replace(/<meta\b(?=[^>]*name=["']twitter:title["'])[^>]*>\s*/gi, '')
    .replace(/<meta\b(?=[^>]*name=["']twitter:description["'])[^>]*>\s*/gi, '')
    .replace(/<meta\b(?=[^>]*name=["']twitter:image["'])[^>]*>\s*/gi, '')
    .replace(/<link\b(?=[^>]*rel=["']canonical["'])[^>]*>\s*/gi, '')
    .replace(/<link\b(?=[^>]*rel=["']alternate["'])(?=[^>]*hreflang=)[^>]*>\s*/gi, '')
}

function seoBlock(meta) {
  const title = escapeHtml(meta.fullTitle || pageTitle(meta.title))
  const description = escapeHtml(truncateDescription(meta.description))
  const robots = escapeHtml(meta.robots || 'index, follow')
  const type = escapeHtml(meta.type || 'website')
  const url = escapeHtml(meta.url || canonicalUrl(meta.path))
  const image = escapeHtml(absoluteImageUrl(meta.image))

  const alternates = (meta.alternates || [])
    .map(alt => `    <link rel="alternate" hreflang="${escapeHtml(alt.hreflang)}" href="${escapeHtml(alt.href)}" />\n`)
    .join('')

  // JSON-LD is emitted here, in the served HTML, rather than injected by React
  // after load — crawlers that do not execute JavaScript could not see it
  // before (RH-05). data-seo="server" tells the client not to duplicate it.
  // data-seo-path lets the client tell "this is my page's schema, leave it" from
  // "this is the schema of the page the visitor navigated away from, replace it".
  const seoPath = escapeHtml(meta.path)
  const structuredData = (meta.jsonLd || [])
    .map(schema => `    <script type="application/ld+json" data-seo="server" data-seo-path="${seoPath}">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>\n`)
    .join('')

  return `    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="${robots}" />
    <link rel="canonical" href="${url}" />
${alternates}    <meta property="og:site_name" content="Renew Healthcare" />
    <meta property="og:type" content="${type}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:locale" content="${escapeHtml(meta.lang === 'bn' ? 'bn_IN' : 'en_IN')}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
${structuredData}`
}

function rewriteHtml(html, meta) {
  const cleanHtml = stripSeoTags(html)
  const withHead = cleanHtml.replace(/<\/head>/i, `${seoBlock(meta)}  </head>`)
  // index.html hardcodes lang="en". Bengali articles need lang="bn" (RH-04).
  return withHead.replace(/<html\b[^>]*\blang=["'][^"']*["']/i, match =>
    match.replace(/lang=["'][^"']*["']/i, `lang="${escapeHtml(meta.lang || 'en')}"`),
  )
}

function isPageRequest(request, url) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return false
  if (url.pathname.startsWith('/api/')) return false
  if (FILE_EXTENSION_PATTERN.test(url.pathname)) return false

  const accept = request.headers.get('accept') || ''
  return !accept || accept.includes('text/html') || accept.includes('*/*')
}

function redirectToPath(url, pathname) {
  const destination = new URL(url)
  destination.pathname = pathname
  return Response.redirect(destination.toString(), 301)
}

function goneResponse() {
  return new Response('Gone', {
    status: 410,
    headers: {
      'content-type': 'text/plain; charset=UTF-8',
      'x-robots-tag': 'noindex, nofollow',
      'cache-control': 'public, max-age=3600',
    },
  })
}

function noindexMeta(path, robots = 'noindex, follow') {
  const cleanPath = normalizePath(path)
  return {
    path: cleanPath,
    url: canonicalUrl(cleanPath),
    title: 'Page not found',
    fullTitle: 'Page not found | Renew Healthcare',
    description: 'The page you are looking for could not be found on Renew Healthcare.',
    image: absoluteImageUrl(),
    type: 'website',
    robots,
    lang: 'en',
  }
}

// ---------------------------------------------------------------------------
// Blog articles
//
// The static SEO manifest is a build-time snapshot, so it cannot know about
// posts published from the admin panel since the last deploy. Those are
// resolved here against the live blog directory, which is what RH-01 was
// about: a post visible on /blogs must return 200 on its own URL.
// ---------------------------------------------------------------------------

// The article body, needed to build FAQPage schema. Admin posts carry it in
// Supabase; WordPress-imported posts have it as a static asset.
async function loadArticleHtml(article, request, env) {
  if (article.remote) {
    const content = await fetchBlogContent(article.slug, env)
    if (content) return content
  }
  try {
    const assetUrl = new URL(`/blog-content/${article.slug}.html`, request.url)
    const response = await env.ASSETS.fetch(new Request(assetUrl, { method: 'GET' }))
    return response.ok ? await response.text() : ''
  } catch {
    return ''
  }
}

async function buildArticleMeta(article, request, env, directory) {
  const path = normalizePath(`/blogs/${article.slug}`)
  const lang = detectArticleLang(article)
  const liveSlugs = new Set(directory.map(item => item.slug))
  const articleHtml = await loadArticleHtml(article, request, env)
  const image = absoluteImageUrl(article.image)

  return {
    path,
    url: canonicalUrl(path),
    title: article.title,
    fullTitle: pageTitle(article.title),
    description: article.excerpt,
    image,
    type: 'article',
    robots: 'index, follow',
    lang,
    alternates: getHreflangAlternates(article.slug, { isLive: slug => liveSlugs.has(slug) }),
    jsonLd: buildArticleSchemas(article, articleHtml, { lang, image }),
  }
}

// ---------------------------------------------------------------------------

function sitemapResponse(xml) {
  return new Response(xml, {
    headers: {
      'content-type': 'application/xml; charset=UTF-8',
      'cache-control': 'public, max-age=300',
    },
  })
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname === '/api/health') {
      return Response.json({ ok: true })
    }

    // Sitemaps are generated from the same live directory as the routes, so a
    // published post cannot be missing from one and present in the other.
    const sitemapName = SITEMAP_ROUTES.get(normalizePath(url.pathname))
    if (sitemapName) {
      const directory = await getBlogDirectory(env)
      return sitemapResponse(renderSitemap(sitemapName, directory))
    }

    if (RETIRED_URL_PATTERN.test(url.pathname)) {
      return goneResponse()
    }

    const pageRequest = isPageRequest(request, url)

    if (pageRequest) {
      // Retired duplicate URLs (RH-02) go first: they must win over their own
      // route entry, and over the trailing-slash normalisation below.
      const duplicatePath = getDuplicateRedirect(url.pathname)
      if (duplicatePath && duplicatePath !== url.pathname) {
        return redirectToPath(url, duplicatePath)
      }

      const redirectPath = getCanonicalRedirectPath(url.pathname)
      if (redirectPath && redirectPath !== url.pathname) {
        return redirectToPath(url, redirectPath)
      }

      if (url.pathname !== '/' && url.pathname.endsWith('/')) {
        return redirectToPath(url, normalizePath(url.pathname))
      }
    }

    const assetResponse = await env.ASSETS.fetch(request)

    if (!pageRequest) {
      return assetResponse
    }

    let meta = null
    let found = false

    if (url.pathname.startsWith('/admin')) {
      meta = {
        ...noindexMeta(url.pathname, 'noindex, nofollow'),
        title: 'Renew Healthcare Admin',
        fullTitle: 'Renew Healthcare Admin',
        description: 'Renew Healthcare admin area.',
      }
      found = true
    } else {
      const blogMatch = BLOG_PATH_PATTERN.exec(normalizePath(url.pathname))
      if (blogMatch) {
        const directory = await getBlogDirectory(env)
        const article = directory.find(item => item.slug === decodeURIComponent(blogMatch[1]))
        if (article) {
          meta = await buildArticleMeta(article, request, env, directory)
          found = true
        }
      }

      if (!found) {
        const routeSeo = getSeoForPath(url.pathname)
        if (routeSeo) {
          meta = { ...routeSeo, lang: 'en' }
          found = true
        }
      }
    }

    if (!found) {
      meta = noindexMeta(url.pathname)
    }

    const contentType = assetResponse.headers.get('content-type') || ''
    if (!contentType.includes('text/html')) {
      return assetResponse
    }

    const html = request.method === 'HEAD' ? '' : rewriteHtml(await assetResponse.text(), meta)
    const headers = new Headers(assetResponse.headers)
    headers.set('content-type', 'text/html; charset=UTF-8')
    headers.set('content-language', meta.lang || 'en')
    headers.set('x-robots-tag', meta.robots)
    headers.set('cache-control', 'public, max-age=0, must-revalidate')
    headers.delete('content-length')

    return new Response(request.method === 'HEAD' ? null : html, {
      status: found ? 200 : 404,
      headers,
    })
  },
}
