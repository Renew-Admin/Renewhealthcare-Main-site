export const SITE = 'https://renewhealthcare.in'
export const DEFAULT_SEO_IMAGE = '/images/renew/uploads/2024/07/renew-healthcare-logo.jpg.webp'
export const DEFAULT_TITLE = 'Renew Healthcare - Best IVF & Fertility Centre in Kolkata'
export const DEFAULT_DESCRIPTION = 'Renew Healthcare is a leading IVF and fertility centre in Kolkata, led by Dr. Rajeev Agarwal. Advanced IVF, IUI, gynaecology, pregnancy and genetic care with transparent costing.'

export function normalizePath(path = '/') {
  const raw = String(path || '/').split(/[?#]/)[0]
  const pathOnly = raw.startsWith('http') ? new URL(raw).pathname : raw
  const withSlash = pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`
  const collapsed = withSlash.replace(/\/{2,}/g, '/')
  return collapsed === '/' ? '/' : collapsed.replace(/\/+$/, '')
}

export function canonicalUrl(path = '/') {
  const cleanPath = normalizePath(path)
  return cleanPath === '/' ? `${SITE}/` : `${SITE}${cleanPath}`
}

export function absoluteImageUrl(image = DEFAULT_SEO_IMAGE) {
  if (!image) return `${SITE}${DEFAULT_SEO_IMAGE}`
  if (/^https?:\/\//i.test(image)) return image
  return `${SITE}${image.startsWith('/') ? '' : '/'}${image}`
}

export function pageTitle(title) {
  return title ? `${title} | Renew Healthcare` : 'Renew Healthcare'
}

export function truncateDescription(value, maxLength = 160) {
  const clean = String(value || DEFAULT_DESCRIPTION).replace(/\s+/g, ' ').trim()
  if (clean.length <= maxLength) return clean
  const clipped = clean.slice(0, maxLength - 3)
  const lastSpace = clipped.lastIndexOf(' ')
  return `${clipped.slice(0, lastSpace > 100 ? lastSpace : clipped.length).trim()}...`
}
