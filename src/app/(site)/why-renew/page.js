// /why-renew — fully static.
import WhyRenewPage from '../../../views/WhyRenewPage.jsx'
import JsonLd from '../../../components/JsonLd.js'
import { breadcrumbSchema, metadataForPath } from '../../../lib/nextSeo.js'

export const metadata = metadataForPath('/why-renew')

export default function WhyRenewPageRoute() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Why Renew', path: '/why-renew' }])} />
      <WhyRenewPage />
    </>
  )
}
