// /course/<courseKey> — the two course pages from src/data/finalPages.js.
import { notFound } from 'next/navigation'
import FinalContentByKey from '../../../../views/FinalContentPage.jsx'
import JsonLd from '../../../../components/JsonLd.js'
import { COURSE_PAGE_KEYS, getFinalPage } from '../../../../data/finalPageLookup.js'
import { breadcrumbSchema, metadataForPath } from '../../../../lib/nextSeo.js'

export const dynamicParams = false

export function generateStaticParams() {
  return COURSE_PAGE_KEYS.map((courseKey) => ({ courseKey }))
}

export async function generateMetadata({ params }) {
  const { courseKey } = await params
  return metadataForPath(`/course/${courseKey}`)
}

export default async function CourseRoute({ params }) {
  const { courseKey } = await params
  const page = getFinalPage(courseKey)
  if (!page) notFound()

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: page.title, path: `/course/${courseKey}` },
        ])}
      />
      <FinalContentByKey pageKey={courseKey} page={page} />
    </>
  )
}
