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
  // Trailing-slash URLs are 301-redirected by src/proxy.js, the same way the
  // old Cloudflare Worker did it, instead of Next's default 308.
  skipTrailingSlashRedirect: true,

  // Always emit <title>, meta and canonical tags in the initial <head>,
  // for every client (not only the user agents Next recognises as bots).
  htmlLimitedBots: /.*/,

  env: {
    NEXT_PUBLIC_SUPABASE_URL: pick('NEXT_PUBLIC_SUPABASE_URL', 'VITE_SUPABASE_URL'),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: pick('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY'),
    NEXT_PUBLIC_WEBHOOK_URL: offline ? '' : process.env.NEXT_PUBLIC_WEBHOOK_URL || process.env.VITE_WEBHOOK_URL || '',
    NEXT_PUBLIC_GMB_WEBHOOK_BALLYGUNGE: offline ? '' : process.env.VITE_GMB_WEBHOOK_BALLYGUNGE || '',
    NEXT_PUBLIC_GMB_WEBHOOK_SALTLAKE: offline ? '' : process.env.VITE_GMB_WEBHOOK_SALTLAKE || '',
    NEXT_PUBLIC_GMB_WEBHOOK_JAMSHEDPUR: offline ? '' : process.env.VITE_GMB_WEBHOOK_JAMSHEDPUR || '',
    RENEW_OFFLINE: offline ? '1' : '',
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
    ]
  },
}

export default nextConfig
