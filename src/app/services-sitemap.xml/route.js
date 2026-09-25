// /services-sitemap.xml — regenerated every 5 minutes from the live blog directory and doctor list.
import { sitemapResponse } from '../../lib/sitemapRoute.js'

export const revalidate = 300

export function GET() {
  return sitemapResponse('services')
}
