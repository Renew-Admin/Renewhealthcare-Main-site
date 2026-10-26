// finalPageLookup — resolves the content pages rendered by FinalContentPage
// (packages, contact, courses, policies, patient resources) on the server.
import { finalPages } from './finalPages.js'
import { OPENING_HOURS, OPENING_HOURS_NOTE, locations } from './locations.js'

const BRANCH_NAMES = { saltlake: 'Salt Lake', gariahat: 'Gariahat', jamshedpur: 'Jamshedpur' }

export const contactPage = {
  title: 'Contact',
  banner: '/images/renew/uploads/2024/12/Inner-Page-Banner-3.jpg',
  eyebrow: 'Contact Us',
  intro: 'Want to get in touch? We would love to hear from you. Reach Renew Healthcare for appointments, consultation support, clinic guidance, and patient care coordination.',
  image: '/images/renew/uploads/2024/07/counseling-img.png',
  sections: [
    {
      heading: 'Renew Healthcare Clinics',
      // Branch addresses and hours from src/data/locations.js (26 Oct 2026):
      // this list still carried the old WordPress addresses (EN-26, Sector V
      // and 46B Rafi Ahmed Kidwai Road) and no PIN codes.
      body: `Call us at 062923 12076 or email info@renewhealthcare.in for appointments and patient support.\n${locations.map((location) => `- ${BRANCH_NAMES[location.slug]}: ${location.address}`).join('\n')}`,
    },
    {
      heading: 'Clinic Timings',
      body: `Clinic Timings ${OPENING_HOURS}. ${OPENING_HOURS_NOTE} Appointment slots, doctor availability, and consultation timing can vary by clinic, so please call before visiting.`,
    },
  ],
}

/** The page data for a key, or null. */
export function getFinalPage(pageKey) {
  if (pageKey === 'contact') return contactPage
  return Object.prototype.hasOwnProperty.call(finalPages, pageKey) ? finalPages[pageKey] : null
}

/** Top-level keys served by /[pageKey] (courses have their own /course/ route). */
export const TOP_LEVEL_FINAL_PAGE_KEYS = Object.entries(finalPages)
  .filter(([, page]) => !String(page.path || '').startsWith('/course/'))
  .map(([key]) => key)

export const COURSE_PAGE_KEYS = Object.entries(finalPages)
  .filter(([, page]) => String(page.path || '').startsWith('/course/'))
  .map(([key]) => key)
