// edgeSecurity — http→https and baseline security headers for the Worker
// (Website Health Report 2026-10-18, items 2 and 6). Used by custom-worker.js,
// which wraps the OpenNext handler so every page, redirect and API response
// gets the same treatment. Static files served straight from Workers assets
// get the same headers from public/_headers.
//
// Pure functions, no Next.js imports, so they run in the Worker and in tests.

export const PRODUCTION_HOSTS = new Set(['renewhealthcare.in', 'www.renewhealthcare.in'])

// HSTS starts short (1 day), as the report recommends. Raise it to 31536000
// after a week without issues; add includeSubDomains only once every
// subdomain is confirmed to serve HTTPS.
export const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=86400',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  // Clickjacking protection only. A full script/style CSP needs testing with
  // gtag, the Meta Pixel and the map embeds first, so it is deliberately not set.
  'Content-Security-Policy': "frame-ancestors 'self'; base-uri 'self'; object-src 'none'",
}

/** 301 to https:// for plain http:// on a production host; null otherwise. */
export function httpsRedirect(url) {
  if (url.protocol !== 'http:' || !PRODUCTION_HOSTS.has(url.hostname)) return null
  return new Response(null, {
    status: 301,
    headers: { Location: `https://${url.hostname}${url.pathname}${url.search}` },
  })
}

/** Copy of the response with any missing security header added. */
export function withSecurityHeaders(response, url) {
  // Upgrade (WebSocket) responses must be returned untouched.
  if (response.status === 101) return response
  const secured = new Response(response.body, response)
  const https = url.protocol === 'https:' && PRODUCTION_HOSTS.has(url.hostname)
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    if (name === 'Strict-Transport-Security' && !https) continue
    if (!secured.headers.has(name)) secured.headers.set(name, value)
  }
  secured.headers.delete('x-powered-by')
  return secured
}
