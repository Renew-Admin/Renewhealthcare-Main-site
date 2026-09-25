// /doctors — static HTML built from the doctor list (Supabase, or the
// built-in list) at deploy time, refreshed in the browser after load.
import DoctorsPage from '../../../views/DoctorsPage.jsx'
import JsonLd from '../../../components/JsonLd.js'
import { breadcrumbSchema, metadataForPath } from '../../../lib/nextSeo.js'
import { getDoctorRows } from '../../../lib/serverData.js'

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
