// serviceCards — the few fields a service card needs, so pages can pass cards
// to client components without shipping the whole services catalogue.
import { services } from '../data/services.js'

export function toServiceCard(service) {
  return {
    slug: service.slug,
    title: service.title,
    heading: service.heading || '',
    intro: service.intro || '',
    category: service.category,
    thumbnailImg: service.thumbnailImg,
    sections: service.sections?.length ? [{ body: service.sections[0].body }] : [],
  }
}

export function getService(slug) {
  return services.find((service) => service.slug === slug) || null
}

export function getRelatedServiceCards(service) {
  return (service.relatedSlugs || [])
    .map((relatedSlug) => getService(relatedSlug))
    .filter(Boolean)
    .map(toServiceCard)
}
