// /<pageKey> — the content pages from src/data/finalPages.js (packages,
// patient resources, policies) plus /contact. Fully static; any other
// top-level path that is not a real route is a 404 (dynamicParams = false).
// Specific routes (/services, /doctors, …) always take precedence over this.
import { notFound } from 'next/navigation'
import FinalContentByKey from '../../../views/FinalContentPage.jsx'
import JsonLd from '../../../components/JsonLd.js'
import { getFinalPage, TOP_LEVEL_FINAL_PAGE_KEYS } from '../../../data/finalPageLookup.js'
import { breadcrumbSchema, metadataForPath } from '../../../lib/nextSeo.js'

export const dynamicParams = false

export function generateStaticParams() {
  return ['contact', ...TOP_LEVEL_FINAL_PAGE_KEYS].map((pageKey) => ({ pageKey }))
}

export async function generateMetadata({ params }) {
  const { pageKey } = await params
  return metadataForPath(`/${pageKey}`)
}

export default async function FinalContentRoute({ params }) {
  const { pageKey } = await params
  const page = getFinalPage(pageKey)
  if (!page) notFound()

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: page.title, path: `/${pageKey}` }])} />
      <FinalContentByKey pageKey={pageKey} page={page} />
    </>
  )
}
