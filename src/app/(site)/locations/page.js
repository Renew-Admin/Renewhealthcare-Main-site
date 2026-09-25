// /locations — fully static.
import LocationsPage from '../../../views/LocationsPage.jsx'
import JsonLd from '../../../components/JsonLd.js'
import { breadcrumbSchema, metadataForPath } from '../../../lib/nextSeo.js'

export const metadata = metadataForPath('/locations')

export default function LocationsRoute() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Clinics', path: '/locations' }])} />
      <LocationsPage />
    </>
  )
}
