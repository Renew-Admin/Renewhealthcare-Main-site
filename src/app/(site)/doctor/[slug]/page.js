// /doctor/<slug> — one page per doctor in the live doctor list.
//
// Every doctor known at build time is prerendered. A doctor added in the admin
// panel later is rendered on request from Supabase (dynamicParams),
// so the page, its metadata, the /doctors listing and the sitemap all come
// from the same list and cannot disagree. Unknown slugs are a real 404.
import { notFound } from 'next/navigation'
import DoctorDetailPage from '../../../../views/DoctorDetailPage.jsx'
import JsonLd from '../../../../components/JsonLd.js'
import {
  breadcrumbSchema,
  faqPageSchema,
  isPhysician,
  metadataForPath,
  physicianSchema,
  toMetadata,
} from '../../../../lib/nextSeo.js'
import { getSeoForPath } from '../../../../lib/seoRoutes.js'
import { getDoctors } from '../../../../lib/serverData.js'

export const dynamicParams = true

export async function generateStaticParams() {
  const doctors = await getDoctors()
  return doctors.map((doctor) => ({ slug: doctor.slug }))
}

async function findDoctor(slug) {
  const doctors = await getDoctors()
  return doctors.find((doctor) => doctor.slug === slug) || null
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const path = `/doctor/${slug}`
  const doctor = await findDoctor(slug)
  if (!doctor) return metadataForPath('/404-not-a-route')

  // Built-in doctors have a manifest entry; admin-added ones are described
  // from their own record.
  const seo = getSeoForPath(path) || {
    path,
    title: doctor.name,
    description: `${doctor.name}${doctor.role ? `, ${doctor.role}` : ''} at Renew Healthcare. View profile and appointment information.`,
    image: doctor.photo,
  }
  return toMetadata(seo)
}

export default async function DoctorRoute({ params }) {
  const { slug } = await params
  const doctor = await findDoctor(slug)
  if (!doctor) notFound()

  const path = `/doctor/${doctor.slug}`
  const faqs = Array.isArray(doctor.faqs) ? doctor.faqs : []

  return (
    <>
      <JsonLd
        data={[
          isPhysician(doctor) ? physicianSchema(doctor) : null,
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Doctors', path: '/doctors' },
            { name: doctor.name, path },
          ]),
          faqPageSchema(faqs, path),
        ]}
      />
      <DoctorDetailPage doctor={doctor} />
    </>
  )
}
