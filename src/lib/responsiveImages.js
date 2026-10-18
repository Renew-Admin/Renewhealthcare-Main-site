// responsiveImages — srcset strings for images that have smaller WebP
// variants next to the original (health report item 8, mobile speed).
//
// Variants are generated files named <original-without-ext>-<width>w.webp in
// the same folder as the original. Only paths listed here get a srcset; any
// other path returns undefined, so <img srcSet={srcSetFor(src)}> is safe to use
// with data that may hold other images. The original stays the src fallback
// and the largest candidate.

const VARIANTS = {
  // Doctor photos (homepage doctor cards and the header Doctors menu).
  '/images/renew/uploads/2026/05/Dr-Rajeev-Agarwal.webp': { widths: [400, 800], original: 1123 },
  '/images/renew/uploads/2024/07/Dr-Dorothy-Ghosh-1.jpg': { widths: [400, 800], original: 1470 },
  '/images/renew/uploads/2024/07/Dr-Neha-Yadav-1.jpg': { widths: [400, 800], original: 1470 },
  '/images/renew/uploads/2025/06/Dr-Arnab-Side-View-rotated.jpg': { widths: [400, 800], original: 1470 },
  '/images/renew/uploads/2026/05/Dr-Sonam.jpg': { widths: [400, 800], original: 1470 },
  // Homepage hero slides.
  '/images/hero_woman_1.webp': { widths: [800, 1200], original: 1672 },
  '/images/hero_kid.webp': { widths: [800, 1200], original: 1672 },
  '/images/hero_family.webp': { widths: [800, 1200], original: 1672 },
}

/** srcset for a known image path, or undefined. */
export function srcSetFor(src) {
  const entry = VARIANTS[src]
  if (!entry) return undefined
  const base = src.replace(/\.(jpe?g|png|webp)$/i, '')
  return [...entry.widths.map(w => `${base}-${w}w.webp ${w}w`), `${src} ${entry.original}w`].join(', ')
}

export const RESPONSIVE_IMAGE_PATHS = Object.keys(VARIANTS)
