// /services — fully static (content lives in src/data/services.js).
import ServicesIndex from '../../../views/ServicesIndex.jsx'
import JsonLd from '../../../components/JsonLd.js'
import { serviceCategories, services } from '../../../data/services.js'
import { breadcrumbSchema, metadataForPath } from '../../../lib/nextSeo.js'
import { toServiceCard } from '../../../lib/serviceCards.js'

export const metadata = metadataForPath('/services')

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }])} />
      <ServicesIndex services={services.map(toServiceCard)} serviceCategories={serviceCategories} />
    </>
  )
}
