// /success-stories — static HTML; regenerated every 5 minutes because the
// reviews wall shows testimonials managed in the admin panel.
import SuccessStoriesPage from '../../../views/SuccessStoriesPage.jsx'
import JsonLd from '../../../components/JsonLd.js'
import { breadcrumbSchema, metadataForPath } from '../../../lib/nextSeo.js'
import { getTestimonialRows } from '../../../lib/serverData.js'

export const revalidate = 300

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
