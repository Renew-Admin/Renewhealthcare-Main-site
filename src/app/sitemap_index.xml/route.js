// /sitemap_index.xml — the index robots.txt points to (generated live).
import { sitemapIndexResponse } from '../../lib/sitemapRoute.js'

// Rendered on every request (cheap: two Supabase reads, cached briefly in
// memory) so a post published in the admin panel is listed immediately.
export const dynamic = 'force-dynamic'

export function GET() {
  return sitemapIndexResponse()
}
