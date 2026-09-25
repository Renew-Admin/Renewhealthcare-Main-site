// /news — fully static.
import NewsPage from '../../../views/NewsPage.jsx'
import JsonLd from '../../../components/JsonLd.js'
import { breadcrumbSchema, metadataForPath } from '../../../lib/nextSeo.js'

export const metadata = metadataForPath('/news')

export default function NewsPageRoute() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Renew In The News', path: '/news' }])} />
      <NewsPage />
    </>
  )
}
