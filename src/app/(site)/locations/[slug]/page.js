// /locations/<slug> — one static page per clinic in src/data/locations.js.
// Regenerated every 5 minutes because the "Doctors at this clinic" list comes
// from the live doctor list.
import { notFound } from 'next/navigation'
import LocationPage from '../../../../views/LocationPage.jsx'
import JsonLd from '../../../../components/JsonLd.js'
import { locations } from '../../../../data/locations.js'
import { breadcrumbSchema, locationClinicSchema, metadataForPath } from '../../../../lib/nextSeo.js'
import { getDoctors } from '../../../../lib/serverData.js'

export const revalidate = 300
export const dynamicParams = false

export function generateStaticParams() {
  return locations.map((location) => ({ slug: location.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  return metadataForPath(`/locations/${slug}`)
}

export default async function LocationRoute({ params }) {
  const { slug } = await params
  const location = locations.find((item) => item.slug === slug)
  if (!location) notFound()

  const doctors = await getDoctors()
  const clinicDoctors = doctors.filter((doctor) => location.doctors.includes(doctor.name))
  const path = `/locations/${location.slug}`

  return (
    <>
      <JsonLd
        data={[
          locationClinicSchema(location),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Clinics', path: '/locations' },
            { name: location.name, path },
          ]),
        ]}
      />
      <LocationPage location={location} clinicDoctors={clinicDoctors} />
    </>
  )
}
