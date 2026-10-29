// Next.js configuration for the Renew Healthcare site.
//
// Environment: the project's .env still uses the VITE_* names from the Vite
// build. Rather than rename the variables, they are mapped to NEXT_PUBLIC_*
// here. Everything mapped below was already shipped to the browser by the Vite
// build (the Supabase anon key is public by design and guarded by RLS; the
// webhook URLs were VITE_* too), so exposure is unchanged. Never map a
// service-role key or any other secret here.
//
// RENEW_OFFLINE=1 blanks the Supabase config for both the server and the
// browser bundle, so a local build/serve never contacts the production
// project and renders from the static data in src/data instead.

import { DUPLICATE_REDIRECTS } from './src/lib/seoDuplicates.js'
import { getLegacyRedirects } from './src/lib/seoRoutes.js'
import { getLiveExternalRedirects } from './src/lib/externalRedirects.js'

const offline = process.env.RENEW_OFFLINE === '1'
const pick = (...names) => {
  if (offline) return ''
  for (const name of names) {
    if (process.env[name]) return process.env[name]
  }
  return ''
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Trailing-slash URLs are 301-redirected by redirects() below, the same way
  // the old Cloudflare Worker did it, instead of Next's default 308.
  skipTrailingSlashRedirect: true,

  // Do not advertise the framework (health report 2026-10-18, item 6).
  poweredByHeader: false,

  // Always emit <title>, meta and canonical tags in the initial <head>,
  // for every client (not only the user agents Next recognises as bots).
  htmlLimitedBots: /.*/,

  env: {
    NEXT_PUBLIC_SUPABASE_URL: pick('NEXT_PUBLIC_SUPABASE_URL', 'VITE_SUPABASE_URL'),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: pick('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY'),
    // The lead webhook is a server-only secret (MAKE_WEBHOOK_URL); it must never be NEXT_PUBLIC_.
    NEXT_PUBLIC_GMB_WEBHOOK_BALLYGUNGE: offline ? '' : process.env.VITE_GMB_WEBHOOK_BALLYGUNGE || '',
    NEXT_PUBLIC_GMB_WEBHOOK_SALTLAKE: offline ? '' : process.env.VITE_GMB_WEBHOOK_SALTLAKE || '',
    NEXT_PUBLIC_GMB_WEBHOOK_JAMSHEDPUR: offline ? '' : process.env.VITE_GMB_WEBHOOK_JAMSHEDPUR || '',
    // Meta Pixel (dataset) ID from Events Manager. Offline runs never load it,
    // unless META_PIXEL_ALLOW_OFFLINE=1 is set to test the integration locally.
    NEXT_PUBLIC_META_PIXEL_ID:
      offline && process.env.META_PIXEL_ALLOW_OFFLINE !== '1'
        ? ''
        : process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_META_PIXEL_ID || process.env.VITE_META_PIXEL_ID || '',
    RENEW_OFFLINE: offline ? '1' : '',
  },

  // Redirect rules carried over from the old Cloudflare Worker, as plain
  // config (no middleware) so they run on any host, including Cloudflare via
  // OpenNext. Every rule is a single 301 hop:
  //   0. www.renewhealthcare.in -> the apex host, same path (RH-06)
  //   1. retired duplicate URLs (RH-02) -> surviving URL
  //   2. legacy URLs (old root-level blog paths, /stories) -> canonical URL
  //   3. tag archives (/blogs/tag/*), which never existed here -> /blogs (RH-14)
  //   4. any other trailing-slash URL -> the same URL without the slash
  // Both the bare and the trailing-slash form of 1 and 2 go straight to the
  // final URL. Retired WordPress URLs answer 410 from route handlers
  // (src/app/comment.php, content.php, products/[id]).
  async redirects() {
    // Articles moved to drrajeevagarwal.co.in redirect only once the new page
    // is live (src/lib/externalRedirects.js, checked on every build).
    const moved = await getLiveExternalRedirects({ offline })
    const pairs = [...moved, ...DUPLICATE_REDIRECTS.entries(), ...getLegacyRedirects()]
    return [
      // The www host is a duplicate of the apex and must collapse onto it.
      // A Cloudflare redirect rule (www -> apex at the edge) is the recommended
      // belt-and-braces; this rule is the in-app fallback. OpenNext's handling
      // of host-conditioned (`has`) redirects must be confirmed after deploy.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.renewhealthcare.in' }],
        destination: 'https://renewhealthcare.in/:path*',
        statusCode: 301,
      },
      ...pairs.flatMap(([from, to]) => [
        { source: from, destination: to, statusCode: 301 },
        { source: `${from}/`, destination: to, statusCode: 301 },
      ]),
      // No tag archive exists; send the WordPress-era tag URLs to the listing.
      { source: '/blogs/tag/:tag*', destination: '/blogs', statusCode: 301 },
      { source: '/:path+/', destination: '/:path+', statusCode: 301 },
    ]
  },

  async headers() {
    return [
      {
        // Raw article fragments are read by the server to render /blogs/<slug>.
        // They must stay fetchable but should never be indexed on their own.
        source: '/blog-content/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/admin/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/admin',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        // Patient resource kept for direct links only (seoRemoved.js).
        source: '/injection-instruction',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, follow' }],
      },
      // Website brief (18 Oct 2026) tasks 4 and 5: WordPress-era URLs that
      // answer 404 on this site; the header keeps them out of the index even
      // if a page ever reappears at one of them.
      { source: '/landing-page', headers: [{ key: 'X-Robots-Tag', value: 'noindex, follow' }] },
      { source: '/landing-page-renew-healthcare-kolkata', headers: [{ key: 'X-Robots-Tag', value: 'noindex, follow' }] },
      { source: '/ivf-cost-in-kolkata/page/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, follow' }] },
      { source: '/newses/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, follow' }] },
    ]
  },
}

export default nextConfig
