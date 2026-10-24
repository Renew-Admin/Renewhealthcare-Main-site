// articleSeoOverrides — exact <title> and meta description for blog posts
// where the SEO brief supplies them (the same mechanism the doctor's site
// uses in src/data/articleSeoOverrides.js). URL, H1 and body text are never
// touched here.
//
// Keyed by slug. `metaTitle` is used word for word as the full <title> (no
// "| Renew Healthcare" suffix is added); `metaDescription` is used word for
// word (not clipped). Pages in src/lib/doctorArticles.js take their meta
// from there and ignore this list.
//
// The brief's list of seven title changes (checked 23 Oct 2026) is still to
// be supplied; add the entries here when it arrives.

export const ARTICLE_SEO_OVERRIDES = {}

export function getArticleSeoOverride(slug) {
  return ARTICLE_SEO_OVERRIDES[String(slug || '')] || null
}
