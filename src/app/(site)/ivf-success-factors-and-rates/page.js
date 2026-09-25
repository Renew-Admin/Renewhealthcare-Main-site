// /ivf-success-factors-and-rates — fully static.
import IvfSuccessPage from '../../../views/IvfSuccessPage.jsx'
import JsonLd from '../../../components/JsonLd.js'
import { breadcrumbSchema, metadataForPath } from '../../../lib/nextSeo.js'

export const metadata = metadataForPath('/ivf-success-factors-and-rates')

export default function IvfSuccessPageRoute() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'IVF Success Factors And Rates', path: '/ivf-success-factors-and-rates' }])} />
      <IvfSuccessPage />
    </>
  )
}
