// /about-us — fully static.
import AboutPage from '../../../views/AboutPage.jsx'
import JsonLd from '../../../components/JsonLd.js'
import { breadcrumbSchema, metadataForPath } from '../../../lib/nextSeo.js'

export const metadata = metadataForPath('/about-us')

export default function AboutPageRoute() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'About Us', path: '/about-us' }])} />
      <AboutPage />
    </>
  )
}
