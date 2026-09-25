// /sitemap_index.xml — the index robots.txt points to.
import { sitemapIndexResponse } from '../../lib/sitemapRoute.js'

export const revalidate = 300

export function GET() {
  return sitemapIndexResponse()
}
