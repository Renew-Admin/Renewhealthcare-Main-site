// /doctors — static HTML built from the live doctor list (Supabase, or the
// built-in list), regenerated every 5 minutes.
import DoctorsPage from '../../../views/DoctorsPage.jsx'
import JsonLd from '../../../components/JsonLd.js'
import { breadcrumbSchema, metadataForPath } from '../../../lib/nextSeo.js'
import { getDoctorRows } from '../../../lib/serverData.js'

export const revalidate = 300

export const metadata = metadataForPath('/doctors')

export default async function DoctorsRoute() {
  const doctorRows = await getDoctorRows()
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Doctors', path: '/doctors' }])} />
      <DoctorsPage doctorRows={doctorRows} />
    </>
  )
}
