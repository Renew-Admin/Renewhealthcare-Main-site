// /services/<slug> — one static page per service in src/data/services.js.
// Any other slug is a real 404 (dynamicParams = false).
import { notFound } from 'next/navigation'
import ServicePage from '../../../../views/ServicePage.jsx'
import JsonLd from '../../../../components/JsonLd.js'
import { services } from '../../../../data/services.js'
import { breadcrumbSchema, faqPageSchema, metadataForPath } from '../../../../lib/nextSeo.js'
import { getRelatedServiceCards, getService } from '../../../../lib/serviceCards.js'

export const dynamicParams = false

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  return metadataForPath(`/services/${slug}`)
}

export default async function ServiceRoute({ params }) {
  const { slug } = await params
  const service = getService(slug)
  if (!service) notFound()

  const path = `/services/${service.slug}`
  const faqs = (service.faqs || []).map((faq) => ({ question: faq.q, answer: faq.a }))

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services' },
            { name: service.title, path },
          ]),
          faqPageSchema(faqs, path),
        ]}
      />
      <ServicePage service={service} relatedServices={getRelatedServiceCards(service)} />
    </>
  )
}
