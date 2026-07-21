const LEGACY_UPLOADS_PREFIX = 'http://162.240.240.17/~alaniqfz/dev/renew/wp-content/uploads/'
const LEGACY_UPLOADS_PREFIX_HTTPS = 'https://162.240.240.17/~alaniqfz/dev/renew/wp-content/uploads/'

const FALLBACK_IMAGES = {
  'save-the-sibling-at-renew-healthcare': '/images/renew/uploads/2024/12/Inner-Page-Banner-3.jpg',
  'why-does-iui-fail': '/images/renew/uploads/2022/07/IN_VITRO-fertilization.webp',
  'what-is-a-good-amh-level-to-get-pregnant': '/images/renew/uploads/2022/12/Low-AMH-Levels-Step-13.jpg',
  'is-ivf-painful': '/images/renew/uploads/2022/07/IVF.webp',
  'polycystic-ovarian-syndrome-pcos': '/images/renew/uploads/2022/07/pcos-.jpg',
  'hysteroscopy-and-ivf-success': '/images/renew/uploads/2022/03/istockphoto-1306700026-612x612-1.jpeg',
  'men-have-feelings-too': '/images/renew/uploads/2022/05/istockphoto-1191509927-612x612-1.jpeg',
  'do-fertility-treatment-cause-cancer': '/images/renew/uploads/2022/04/istockphoto-1035004756-612x612-1.jpeg',
  'embryo-transfer-how-does-it-happen': '/images/renew/uploads/2022/04/istockphoto-1141479775-612x612-1.jpeg',
  'iui-how-to-best-prepare-for-it': '/images/renew/uploads/2022/04/istockphoto-1141371582-612x612-1.jpeg',
  'what-happens-during-the-embryo-transfer-cycle': '/images/renew/uploads/2022/04/istockphoto-973924624-170667a.jpeg',
  'obesity-and-male-infertility': '/images/renew/uploads/2022/03/istockphoto-825974460-612x612-1-300x246.jpeg',
  'role-of-vitamins-in-sperm-improvement': '/images/renew/uploads/2022/03/istockphoto-1211514984-612x612-1.jpeg',
  'what-is-dfi': '/images/renew/uploads/2022/02/dna-1.jpeg',
  'learn-about-azoospermia': '/images/renew/uploads/2022/02/Azoospermia—Male-Infertility1.png',
  'natural-way-to-improve-sperms': '/images/renew/uploads/2022/02/istockphoto-1182221658-612x612-1.jpeg',
}

const IMAGE_SRC_PATTERN = /<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/i

function isLegacyUploadsUrl(value) {
  return String(value || '').startsWith(LEGACY_UPLOADS_PREFIX) || String(value || '').startsWith(LEGACY_UPLOADS_PREFIX_HTTPS)
}

export function normalizeBlogImage(image, slug = '') {
  const raw = String(image || '').trim()
  if (!raw) return ''
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    if (isLegacyUploadsUrl(raw)) {
      return FALLBACK_IMAGES[slug] || raw.replace(LEGACY_UPLOADS_PREFIX, '/images/renew/uploads/').replace(LEGACY_UPLOADS_PREFIX_HTTPS, '/images/renew/uploads/')
    }
    return raw
  }
  return raw
}

export function firstImageFromHtml(html = '') {
  const match = String(html).match(IMAGE_SRC_PATTERN)
  return match ? match[1] : ''
}

export function rewriteBlogImageUrls(html = '') {
  return String(html).replace(
    /(<img\b[^>]*\bsrc=["'])(https?:\/\/162\.240\.240\.17\/~alaniqfz\/dev\/renew\/wp-content\/uploads\/[^"']+)(["'])/gi,
    (_, prefix, legacyUrl, suffix) => `${prefix}${legacyUrl.replace(LEGACY_UPLOADS_PREFIX, '/images/renew/uploads/').replace(LEGACY_UPLOADS_PREFIX_HTTPS, '/images/renew/uploads/')}${suffix}`,
  )
}

export function resolveBlogImage(blog, html = '') {
  const image = normalizeBlogImage(blog?.image, blog?.slug)
  if (image && !isLegacyUploadsUrl(blog?.image)) return image

  const fallback = FALLBACK_IMAGES[blog?.slug]
  if (fallback) return fallback

  const inline = normalizeBlogImage(firstImageFromHtml(html), blog?.slug)
  if (inline) return inline

  return image
}
