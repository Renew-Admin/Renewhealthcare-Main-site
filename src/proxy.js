// proxy — request-level SEO rules that used to live in the Cloudflare Worker
// (src/worker.js before the Next.js migration). Runs before routing:
//
//   1. Retired WordPress URLs            -> 410 Gone (noindex)
//   2. Retired duplicate URLs (RH-02)    -> 301 to the surviving URL
//   3. Legacy URLs (old blog paths, …)   -> 301 to the canonical URL
//   4. Trailing slash                    -> 301 to the slash-less URL
//
// Everything else (page rendering, 404s, metadata, sitemaps) is handled by the
// App Router. The redirect maps are the same modules the Worker used, so the
// rules are unchanged.
import { NextResponse } from 'next/server'
import { getDuplicateRedirect } from './lib/seoDuplicates.js'
import { getCanonicalRedirectPath } from './lib/seoRoutes.js'
import { normalizePath } from './lib/seoUtils.js'

const RETIRED_URL_PATTERN = /^\/(?:comment|content)\.php$|^\/products\/[0-9]+\/?$/i
const FILE_EXTENSION_PATTERN = /\.[a-z0-9]{1,12}$/i

// A plain URL, not request.nextUrl.clone(): NextURL remembers that the
// incoming path had a trailing slash and re-appends it, which would turn the
// trailing-slash redirect into a loop.
function redirect301(request, pathname) {
  const url = new URL(request.url)
  url.pathname = pathname
  return NextResponse.redirect(url, 301)
}

export function proxy(request) {
  const { pathname } = request.nextUrl

  if (RETIRED_URL_PATTERN.test(pathname)) {
    return new NextResponse('Gone', {
      status: 410,
      headers: {
        'content-type': 'text/plain; charset=UTF-8',
        'x-robots-tag': 'noindex, nofollow',
        'cache-control': 'public, max-age=3600',
      },
    })
  }

  // Redirects only apply to page URLs, never to files or the API.
  if (pathname.startsWith('/api/') || FILE_EXTENSION_PATTERN.test(pathname)) {
    return NextResponse.next()
  }

  // Retired duplicates go first: they must win over their own route entry and
  // over the trailing-slash normalisation below (no 301 -> 301 chains).
  const duplicatePath = getDuplicateRedirect(pathname)
  if (duplicatePath && duplicatePath !== pathname) return redirect301(request, duplicatePath)

  const canonicalPath = getCanonicalRedirectPath(pathname)
  if (canonicalPath && canonicalPath !== pathname) return redirect301(request, canonicalPath)

  if (pathname !== '/' && pathname.endsWith('/')) return redirect301(request, normalizePath(pathname))

  return NextResponse.next()
}

export const config = {
  // Skip Next.js internals and static files served from public/ — except the
  // retired *.php URLs, which must still answer 410.
  matcher: [
    '/((?!_next/static|_next/image|favicon.png|images/|assets/|blog-content/).*)',
  ],
}
