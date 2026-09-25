import 'server-only'
// sitemapRoute — builds the Response for each sitemap route handler in
// src/app/<name>.xml/route.js, from the live blog directory and doctor list.
import { BUILD_DATE } from './buildStamp.js'
import { renderSitemap, renderSitemapIndex, SITEMAP_FILES } from './sitemap.js'
import { getDirectory, getDoctors } from './serverData.js'

function xmlResponse(xml) {
  return new Response(xml, {
    headers: {
      'content-type': 'application/xml; charset=UTF-8',
      'cache-control': 'public, max-age=300',
    },
  })
}

export async function sitemapResponse(name) {
  const [directory, doctors] = await Promise.all([getDirectory(), getDoctors()])
  return xmlResponse(renderSitemap(name, directory, { doctors }))
}

export async function sitemapIndexResponse() {
  const [directory, doctors] = await Promise.all([getDirectory(), getDoctors()])
  // Only list sitemaps that actually contain URLs.
  const filenames = SITEMAP_FILES
    .filter(file => renderSitemap(file.name, directory, { doctors }).includes('<loc>'))
    .map(file => file.filename)
  return xmlResponse(renderSitemapIndex(filenames, BUILD_DATE))
}
