// / — homepage. Static HTML, regenerated every 5 minutes so FAQs and the
// latest posts managed in the admin panel appear without a rebuild.
import Home from '../../views/Home/Home.js'
import JsonLd from '../../components/JsonLd.js'
import { resolveHomeFaqs } from '../../data/homeFaqs.js'
import { faqPageSchema, medicalClinicSchema, metadataForPath } from '../../lib/nextSeo.js'
import { getBlogListing, getFaqRows } from '../../lib/serverData.js'

export const revalidate = 300

export const metadata = metadataForPath('/')

export default async function HomePage() {
  const [faqRows, listing] = await Promise.all([getFaqRows(), getBlogListing()])

  return (
    <>
      {/* The one MedicalClinic entity for the whole site, plus the FAQs shown on this page. */}
      <JsonLd data={[medicalClinicSchema(), faqPageSchema(resolveHomeFaqs(faqRows), '/')]} />
      <Home faqRows={faqRows} initialBlogs={listing.slice(0, 4)} />
    </>
  )
}
