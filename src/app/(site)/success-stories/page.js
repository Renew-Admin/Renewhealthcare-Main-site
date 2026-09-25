// /success-stories — static HTML built at deploy time; the reviews wall
// refreshes admin-managed testimonials in the browser after load.
import SuccessStoriesPage from '../../../views/SuccessStoriesPage.jsx'
import JsonLd from '../../../components/JsonLd.js'
import { breadcrumbSchema, metadataForPath } from '../../../lib/nextSeo.js'
import { getTestimonialRows } from '../../../lib/serverData.js'

export const metadata = metadataForPath('/success-stories')

export default async function SuccessStoriesRoute() {
  const testimonialRows = await getTestimonialRows()
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Success Stories', path: '/success-stories' }])} />
      <SuccessStoriesPage testimonialRows={testimonialRows} />
    </>
  )
}
