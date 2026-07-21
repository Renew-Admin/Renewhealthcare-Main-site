import { blogs } from '../data/blogs.js'
import { doctors } from '../data/doctors.js'
import { finalPages } from '../data/finalPages.js'
import { locations } from '../data/locations.js'
import { services } from '../data/services.js'
import { resolveBlogImage } from './blogImages.js'
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_SEO_IMAGE,
  DEFAULT_TITLE,
  absoluteImageUrl,
  canonicalUrl,
  normalizePath,
  pageTitle,
  truncateDescription,
} from './seoUtils.js'

const routes = new Map()
const legacyRedirects = new Map()

function addRoute(path, meta = {}) {
  const cleanPath = normalizePath(path)
  const title = meta.title || 'Renew Healthcare'
  const description = truncateDescription(meta.description || meta.intro || `${title} at Renew Healthcare.`)
  const image = absoluteImageUrl(meta.image || meta.banner || meta.bannerImg || meta.thumbnailImg || DEFAULT_SEO_IMAGE)

  routes.set(cleanPath, {
    path: cleanPath,
    url: canonicalUrl(cleanPath),
    title,
    fullTitle: meta.fullTitle || pageTitle(title),
    description,
    image,
    type: meta.type || 'website',
    robots: meta.robots || 'index, follow',
  })
}

function addLegacyRedirect(fromPath, toPath) {
  legacyRedirects.set(normalizePath(fromPath), normalizePath(toPath))
}

addRoute('/', {
  title: 'Best IVF & Fertility Centre in Kolkata',
  fullTitle: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
})
addRoute('/services', {
  title: 'Fertility Services in Kolkata',
  description: 'Explore Renew Healthcare fertility care, IVF, IUI, ICSI, surrogacy, pregnancy care, gynaecology, genetics, wellness and nutrition services.',
  image: '/images/renew/uploads/2024/12/Inner-Page-Banner.jpg',
})
addRoute('/doctors', {
  title: 'Renew Healthcare Doctors',
  description: 'Meet Renew Healthcare fertility specialists, gynaecologists, genetic experts, embryologists, counsellors, nursing and care teams.',
  image: '/images/renew/uploads/2024/12/Inner-Page-Banner.jpg',
})
addRoute('/locations', {
  title: 'Renew Healthcare Clinics',
  description: 'Find Renew Healthcare clinics in Saltlake, Jamshedpur, and Ballygunge for IVF, fertility, gynaecology and pregnancy care.',
  image: '/images/renew/uploads/2024/12/Inner-Page-Banner-3.jpg',
})
addRoute('/about-us', {
  title: 'About Renew Healthcare',
  description: 'Renew Healthcare provides specialist-led fertility, IVF, gynaecology, pregnancy and women\'s health care in Kolkata.',
  image: '/images/renew/uploads/2024/12/Inner-Page-Banner.jpg',
})
addRoute('/ivf-success-factors-and-rates', {
  title: 'IVF Success Factors And Rates',
  description: 'Understand IVF success rates, treatment factors, self-cycle outcomes and how Renew Healthcare reports fertility care results.',
  image: '/images/renew/uploads/2024/12/Inner-Page-Banner-2.jpg',
})
addRoute('/why-renew', {
  title: 'Why Renew Healthcare',
  description: 'Learn why families choose Renew Healthcare for ethical, specialist-led fertility and women\'s health care in Kolkata.',
  image: '/images/renew/uploads/2024/12/why_renew-img1.webp',
})
addRoute('/success-stories', {
  title: 'Success Stories',
  description: 'Read Renew Healthcare patient success stories and real fertility, pregnancy and parenthood journeys.',
  image: '/images/renew/uploads/2025/01/Collage-Banner2.png',
})
addRoute('/blogs', {
  title: 'Renew Healthcare Blogs',
  description: 'Read Renew Healthcare articles on IVF, fertility, pregnancy, gynaecology, male fertility, genetics and women\'s health.',
  image: DEFAULT_SEO_IMAGE,
})
addRoute('/news', {
  title: 'Renew In The News',
  description: 'Renew Healthcare and Dr. Rajeev Agarwal featured across leading publications with expert insights on IVF, fertility and reproductive health.',
  image: '/assets/renew/cta/failed-ivf-banner.jpg',
})
addRoute('/contact', {
  title: 'Contact Renew Healthcare',
  description: 'Contact Renew Healthcare for appointments, consultation support, clinic guidance and patient care coordination.',
  image: '/images/renew/uploads/2024/07/counseling-img.png',
})

Object.entries(finalPages).forEach(([key, page]) => {
  addRoute(page.path || `/${key}`, {
    title: page.title,
    description: page.intro,
    image: page.image || page.banner,
  })
})

services.forEach(service => {
  addRoute(`/services/${service.slug}`, {
    title: service.title,
    description: service.intro || service.sections?.[0]?.body,
    image: service.bannerImg || service.thumbnailImg,
  })
})

locations.forEach(location => {
  addRoute(`/locations/${location.slug}`, {
    title: `${location.name} Clinic`,
    description: location.intro || `${location.name} Renew Healthcare clinic details, services, doctors and appointment information.`,
    image: location.image,
  })
})

doctors.forEach(doctor => {
  addRoute(`/doctor/${doctor.slug}`, {
    title: doctor.name,
    description: `${doctor.name}${doctor.role ? `, ${doctor.role}` : ''} at Renew Healthcare. View profile and appointment information.`,
    image: doctor.photo,
  })
})

blogs.forEach(blog => {
  addRoute(`/blogs/${blog.slug}`, {
    title: blog.title,
    description: blog.excerpt,
    image: resolveBlogImage(blog),
    type: 'article',
  })
})

blogs.forEach(blog => {
  const legacyPath = normalizePath(`/${blog.slug}`)
  if (!routes.has(legacyPath)) {
    addLegacyRedirect(legacyPath, `/blogs/${blog.slug}`)
  }
})

addLegacyRedirect('/stories', '/success-stories')

export function getSeoForPath(path) {
  return routes.get(normalizePath(path)) || null
}

export function getAllSeoRoutes() {
  return [...routes.values()]
}

export function getCanonicalRedirectPath(path) {
  const cleanPath = normalizePath(path)
  const legacyPath = legacyRedirects.get(cleanPath)
  if (legacyPath) return legacyPath
  const route = routes.get(cleanPath)
  if (route && cleanPath !== path) return route.path
  return null
}
