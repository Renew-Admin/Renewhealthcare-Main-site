import { getCanonicalRedirectPath, getSeoForPath } from './lib/seoRoutes.js'
import {
  absoluteImageUrl,
  canonicalUrl,
  normalizePath,
  pageTitle,
  truncateDescription,
} from './lib/seoUtils.js'

const FILE_EXTENSION_PATTERN = /\.[a-z0-9]{1,12}$/i
const RETIRED_URL_PATTERN = /^\/(?:comment|content)\.php$|^\/products\/[0-9]+\/?$/i

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
}

function seoBlock(meta) {
  const title = escapeHtml(meta.fullTitle || pageTitle(meta.title))
  const description = escapeHtml(truncateDescription(meta.description))
  const robots = escapeHtml(meta.robots || 'index, follow')
  const type = escapeHtml(meta.type || 'website')
  const url = escapeHtml(meta.url || canonicalUrl(meta.path))
  const image = escapeHtml(absoluteImageUrl(meta.image))

  return `    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="${robots}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:site_name" content="Renew Healthcare" />
    <meta property="og:type" content="${type}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:url" content="${url}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
`
}

function rewriteHtml(html, meta) {
  const cleanHtml = stripSeoTags(html)
  return cleanHtml.replace(/<\/head>/i, `${seoBlock(meta)}  </head>`)
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
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname === '/api/health') {
      return Response.json({ ok: true })
    }

    if (RETIRED_URL_PATTERN.test(url.pathname)) {
      return goneResponse()
    }

    const pageRequest = isPageRequest(request, url)

    if (pageRequest) {
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

    const routeSeo = getSeoForPath(url.pathname)
    const meta = url.pathname.startsWith('/admin')
      ? {
        ...noindexMeta(url.pathname, 'noindex, nofollow'),
        title: 'Renew Healthcare Admin',
        fullTitle: 'Renew Healthcare Admin',
        description: 'Renew Healthcare admin area.',
      }
      : routeSeo || noindexMeta(url.pathname)

    const contentType = assetResponse.headers.get('content-type') || ''
    if (!contentType.includes('text/html')) {
      return assetResponse
    }

    const html = request.method === 'HEAD' ? '' : rewriteHtml(await assetResponse.text(), meta)
    const headers = new Headers(assetResponse.headers)
    headers.set('content-type', 'text/html; charset=UTF-8')
    headers.set('x-robots-tag', meta.robots)
    headers.set('cache-control', 'public, max-age=0, must-revalidate')
    headers.delete('content-length')

    return new Response(request.method === 'HEAD' ? null : html, {
      status: routeSeo || url.pathname.startsWith('/admin') ? 200 : 404,
      headers,
    })
  },
}
