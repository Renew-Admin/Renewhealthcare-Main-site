// blogSeo — language targeting (RH-04) and structured data (RH-05) for blog
// articles. Pure functions with no platform dependencies, so the Worker can
// call them while rendering and tests can call them directly.
import { SITE, absoluteImageUrl, canonicalUrl, normalizePath } from './seoUtils.js'

const PUBLISHER = {
  '@type': 'Organization',
  name: 'Renew Healthcare',
  logo: {
    '@type': 'ImageObject',
    url: `${SITE}/images/renew/uploads/2024/07/renew-healthcare-logo.jpg.webp`,
  },
}

// ---------------------------------------------------------------------------
// RH-04 — language
// ---------------------------------------------------------------------------

// Bengali script block. Detecting from the title rather than keeping a slug
// list means a Bengali post published tomorrow is tagged correctly with no
// code change — the failure mode that produced this ticket in the first place.
const BENGALI_PATTERN = /[ঀ-৿]/

/** BCP 47 language tag for an article, from its own title. Defaults to 'en'. */
export function detectArticleLang(article = {}) {
  return BENGALI_PATTERN.test(String(article.title || '')) ? 'bn' : 'en'
}

/**
 * Translation pairs, Bengali slug -> English slug.
 *
 * -------------------------------------------------------------------------
 * PROPOSED PAIRINGS, PENDING EDITORIAL CONFIRMATION. These four are the
 * closest English articles by subject, not verified translations. hreflang
 * between pages that are not genuine equivalents is worse than no hreflang
 * at all, so delete any line the content team does not endorse.
 * -------------------------------------------------------------------------
 */
const TRANSLATION_PAIRS = [
  ['placentrex-infertility-treatment-bengali', 'placentrex-injection-uses-benefits-risks-dosage'],
  ['high-amh-level-pregnancy-bengali', 'what-is-a-good-amh-level-to-get-pregnant'],
  ['daily-masturbation-side-effects-men-bengali', 'releasing-sperm-daily-side-effects'],
  ['pre-gorbhobostha-counseling-keno-guruttopurno', 'common-myths-about-preconception-counselling'],
]

const ENGLISH_BY_BENGALI = new Map(TRANSLATION_PAIRS)
const BENGALI_BY_ENGLISH = new Map(TRANSLATION_PAIRS.map(([bn, en]) => [en, bn]))

/**
 * Reciprocal hreflang entries for an article, or [] when it has no counterpart.
 * Both sides of a pair produce the same set — that reciprocity is what Search
 * Console validates.
 */
export function getHreflangAlternates(slug, { isLive = () => true } = {}) {
  let pair = null
  if (ENGLISH_BY_BENGALI.has(slug)) {
    pair = { bn: slug, en: ENGLISH_BY_BENGALI.get(slug) }
  } else if (BENGALI_BY_ENGLISH.has(slug)) {
    pair = { bn: BENGALI_BY_ENGLISH.get(slug), en: slug }
  }

  if (!pair) return []
  // Never advertise a counterpart that is not actually live.
  if (!isLive(pair.bn) || !isLive(pair.en)) return []

  const bnUrl = canonicalUrl(`/blogs/${pair.bn}`)
  const enUrl = canonicalUrl(`/blogs/${pair.en}`)
  return [
    { hreflang: 'bn', href: bnUrl },
    { hreflang: 'en', href: enUrl },
    // x-default points at the English version, per the ticket.
    { hreflang: 'x-default', href: enUrl },
  ]
}

// ---------------------------------------------------------------------------
// RH-05 — FAQ extraction
// ---------------------------------------------------------------------------

const NAMED_ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’',
  hellip: '…', ndash: '–', mdash: '—', deg: '°',
}

function decodeEntities(value) {
  return String(value)
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (match, name) => {
      const key = name.toLowerCase()
      return Object.prototype.hasOwnProperty.call(NAMED_ENTITIES, key) ? NAMED_ENTITIES[key] : match
    })
}

/** HTML fragment -> plain text, with entities decoded and whitespace collapsed. */
export function htmlToText(html) {
  return decodeEntities(
    String(html || '')
      .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<\/(p|div|li|h[1-6])>/gi, ' ')
      .replace(/<[^>]+>/g, ''),
  )
    .replace(/ /g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const FAQ_HEADING_PATTERN = /^(?:frequently\s+asked\s+questions?|faqs?|common\s+questions)\b/i

// Questions in the WordPress exports are numbered ("1. How does…"); the schema
// should carry the question, not the list position.
function cleanQuestion(text) {
  return text.replace(/^\s*(?:q\s*[:.)-]?\s*)?\d+\s*[.):-]\s*/i, '').trim()
}

/**
 * Pull question/answer pairs out of an article's FAQ section.
 *
 * Handles both markup styles present on the site: admin posts wrap answers in
 * <p>, WordPress-exported posts leave them as bare text after the heading.
 * Returns [] when the article has no FAQ block.
 */
export function extractFaqs(html) {
  const source = String(html || '')
  if (!source) return []

  const headings = [...source.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map(match => ({
    level: Number(match[1]),
    text: htmlToText(match[2]),
    start: match.index,
    end: match.index + match[0].length,
  }))

  const faqIndex = headings.findIndex(heading => FAQ_HEADING_PATTERN.test(heading.text))
  if (faqIndex === -1) return []

  const faqHeading = headings[faqIndex]
  const rest = headings.slice(faqIndex + 1)

  // The FAQ block ends at the next heading of the same or higher rank.
  const endHeading = rest.find(heading => heading.level <= faqHeading.level)
  const blockEnd = endHeading ? endHeading.start : source.length
  const inBlock = rest.filter(heading => heading.start < blockEnd)
  if (!inBlock.length) return []

  // Questions sit at whatever level the first heading inside the block uses.
  const questionLevel = inBlock[0].level
  const questions = inBlock.filter(heading => heading.level === questionLevel)

  const faqs = []
  questions.forEach((heading, index) => {
    const next = questions[index + 1]
    const answerHtml = source.slice(heading.end, next ? next.start : blockEnd)
    const question = cleanQuestion(heading.text)
    const answer = htmlToText(answerHtml)
    if (question && answer) faqs.push({ question, answer })
  })

  return faqs
}

// ---------------------------------------------------------------------------
// RH-05 — JSON-LD
// ---------------------------------------------------------------------------

export function buildBlogPostingSchema(article, { lang = 'en', image } = {}) {
  const path = normalizePath(`/blogs/${article.slug}`)
  const url = canonicalUrl(path)
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt || undefined,
    image: [absoluteImageUrl(image || article.image)],
    datePublished: article.iso || undefined,
    dateModified: article.modifiedIso || article.iso || undefined,
    // The CMS has no per-post author column, so the organisation is the
    // accurate author. Add an `author` column and map it here if that changes.
    author: { '@type': 'Organization', name: 'Renew Healthcare', url: SITE },
    publisher: PUBLISHER,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    articleSection: article.category || undefined,
    inLanguage: lang,
    url,
  }
}

export function buildBreadcrumbSchema(article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'Blogs', item: canonicalUrl('/blogs') },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: canonicalUrl(`/blogs/${article.slug}`),
      },
    ],
  }
}

export function buildFaqSchema(faqs, article) {
  if (!faqs || !faqs.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${canonicalUrl(`/blogs/${article.slug}`)}#faq`,
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
}

/** Every schema an article should carry, ready to serialise. */
export function buildArticleSchemas(article, articleHtml, { lang = 'en', image } = {}) {
  return [
    buildBlogPostingSchema(article, { lang, image }),
    buildBreadcrumbSchema(article),
    buildFaqSchema(extractFaqs(articleHtml), article),
  ].filter(Boolean)
}
