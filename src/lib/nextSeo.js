// nextSeo — the single source of truth for page metadata and structured data.
//
// Before the migration three layers wrote head tags: static index.html, the
// Cloudflare Worker (rewriting <head> per route) and a client-side <Seo>
// component. Now every page exports Next.js metadata built here from the same
// route manifest (src/lib/seoRoutes.js), and JSON-LD is rendered into the page
// HTML on the server. Nothing is patched into <head> by client JavaScript.
import { getSeoForPath } from './seoRoutes.js'
import {
  SITE,
  DEFAULT_SEO_IMAGE,
  absoluteImageUrl,
  canonicalUrl,
  normalizePath,
  pageTitle,
  truncateDescription,
} from './seoUtils.js'

/**
 * Route SEO entry -> Next.js Metadata.
 * `seo` has the shape produced by seoRoutes.addRoute (path, title, fullTitle,
 * description, image, type, robots) plus optional lang and alternates.
 */
export function toMetadata(seo) {
  const path = normalizePath(seo.path)
  const url = seo.url || canonicalUrl(path)
  const fullTitle = seo.fullTitle || pageTitle(seo.title)
  const description = truncateDescription(seo.description)
  const image = absoluteImageUrl(seo.image || DEFAULT_SEO_IMAGE)
  const languages = Object.fromEntries((seo.alternates || []).map((alt) => [alt.hreflang, alt.href]))

  return {
    title: { absolute: fullTitle },
    description,
    robots: seo.robots || 'index, follow',
    alternates: {
      canonical: url,
      ...(Object.keys(languages).length ? { languages } : {}),
    },
    openGraph: {
      siteName: 'Renew Healthcare',
      type: seo.type === 'article' ? 'article' : 'website',
      title: fullTitle,
      description,
      url,
      images: [{ url: image }],
      locale: seo.lang === 'bn' ? 'bn_IN' : 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
  }
}

/** Metadata for a path registered in the route manifest. */
export function metadataForPath(path) {
  const seo = getSeoForPath(path)
  if (!seo) return { title: { absolute: 'Page not found | Renew Healthcare' }, robots: 'noindex, follow' }
  return toMetadata(seo)
}

// ---------------------------------------------------------------------------
// Structured data. Every schema here describes content that is visible on the
// page it is rendered into.
// ---------------------------------------------------------------------------

const LOGO = `${SITE}/images/renew/uploads/2024/07/renew-healthcare-logo.jpg.webp`

/** The organisation. Rendered once, on the homepage only. */
export function medicalClinicSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    '@id': `${SITE}/#organization`,
    name: 'Renew Healthcare',
    url: `${SITE}/`,
    logo: LOGO,
    image: LOGO,
    telephone: '+91-6292312076',
    email: 'info@renewhealthcare.in',
    medicalSpecialty: ['Reproductive', 'Gynecologic', 'Obstetric'],
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '18C, Mandeville Gardens, Ballygunge',
      addressLocality: 'Kolkata',
      addressRegion: 'West Bengal',
      postalCode: '700019',
      addressCountry: 'IN',
    },
    sameAs: [
      'https://www.facebook.com/renewhealthcare.in',
      'https://www.instagram.com/renewhealthcare/',
      'https://www.youtube.com/channel/UCE28jj3ng2d313UbiVYUxdQ',
      'https://www.linkedin.com/company/renew-healthcare/',
    ],
  }
}

/** A branch clinic, on its own location page. */
export function locationClinicSchema(location) {
  const path = `/locations/${location.slug}`
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    '@id': `${canonicalUrl(path)}#clinic`,
    name: `Renew Healthcare ${location.name}`.replace('Renew Healthcare Renew', 'Renew'),
    url: canonicalUrl(path),
    image: absoluteImageUrl(location.image),
    telephone: location.phone || undefined,
    address: location.address ? { '@type': 'PostalAddress', streetAddress: location.address, addressCountry: 'IN' } : undefined,
    parentOrganization: { '@id': `${SITE}/#organization`, name: 'Renew Healthcare' },
  }
}

/** Only medical doctors get Physician markup; other team members do not. */
export function isPhysician(doctor) {
  return /^dr\.?\s/i.test(String(doctor?.name || ''))
}

export function physicianSchema(doctor) {
  const path = `/doctor/${doctor.slug}`
  const description = String(doctor.bio || '').split('\n').map((p) => p.trim()).find(Boolean)
  return {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    '@id': `${canonicalUrl(path)}#physician`,
    name: doctor.name,
    url: canonicalUrl(path),
    image: doctor.photo ? absoluteImageUrl(doctor.photo) : undefined,
    description: description ? truncateDescription(description, 300) : undefined,
    jobTitle: doctor.role || undefined,
    address: doctor.clinic_address ? { '@type': 'PostalAddress', streetAddress: doctor.clinic_address, addressCountry: 'IN' } : undefined,
    memberOf: { '@id': `${SITE}/#organization`, name: 'Renew Healthcare' },
  }
}

/** items: [{ name, path }] from Home down to the current page. */
export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  }
}

/** faqs: [{ question, answer }] that are rendered on the page. */
export function faqPageSchema(faqs, path) {
  const clean = (faqs || []).filter((faq) => faq && faq.question && faq.answer)
  if (!clean.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${canonicalUrl(path)}#faq`,
    mainEntity: clean.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
}
