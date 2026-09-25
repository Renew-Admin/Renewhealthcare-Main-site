// /post-sitemap.xml — generated live from the blog directory and doctor list.
import { sitemapResponse } from '../../lib/sitemapRoute.js'

// Rendered on every request (cheap: two Supabase reads, cached briefly in
// memory) so a post published in the admin panel is listed immediately.
export const dynamic = 'force-dynamic'

export function GET() {
  return sitemapResponse('post')
}
