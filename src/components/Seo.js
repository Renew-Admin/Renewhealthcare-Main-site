import { useEffect } from 'react'
import {
  SITE,
  absoluteImageUrl,
  canonicalUrl,
  pageTitle,
  truncateDescription,
} from '../lib/seoUtils.js'

export { SITE }

function upsertMeta(selector, attr, key, content) {
  if (!content) return
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href) {
  if (!href) return
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * Client-side SEO/meta manager for this SPA. Sets <title>, description,
 * Open Graph / Twitter tags, canonical, and optional JSON-LD structured data.
 */
export default function Seo({ title, description, path = '', image, type = 'website', robots = 'index, follow', jsonLd }) {
  useEffect(() => {
    const fullTitle = pageTitle(title)
    const cleanDescription = truncateDescription(description)
    const url = canonicalUrl(path)
    const img = absoluteImageUrl(image)

    document.title = fullTitle
    upsertMeta('meta[name="description"]', 'name', 'description', cleanDescription)
    upsertMeta('meta[name="robots"]', 'name', 'robots', robots)
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle)
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', cleanDescription)
    upsertMeta('meta[property="og:type"]', 'property', 'og:type', type)
    upsertMeta('meta[property="og:url"]', 'property', 'og:url', url)
    upsertMeta('meta[property="og:image"]', 'property', 'og:image', img)
    upsertMeta('meta[property="og:site_name"]', 'property', 'og:site_name', 'Renew Healthcare')
    upsertMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image')
    upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle)
    upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', cleanDescription)
    upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', img)
    upsertLink('canonical', url)

    let script
    if (jsonLd) {
      script = document.createElement('script')
      script.type = 'application/ld+json'
      script.setAttribute('data-seo', 'jsonld')
      script.text = JSON.stringify(jsonLd)
      document.head.appendChild(script)
    }
    return () => {
      if (script && script.parentNode) script.parentNode.removeChild(script)
    }
  }, [title, description, path, image, type, robots, jsonLd])

  return null
}
