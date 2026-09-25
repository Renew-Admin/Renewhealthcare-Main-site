// finalPageLookup — resolves the content pages rendered by FinalContentPage
// (packages, contact, courses, policies, patient resources) on the server.
import { finalPages } from './finalPages.js'

export const contactPage = {
  title: 'Contact',
  banner: '/images/renew/uploads/2024/12/Inner-Page-Banner-3.jpg',
  eyebrow: 'Contact Us',
  intro: 'Want to get in touch? We would love to hear from you. Reach Renew Healthcare for appointments, consultation support, clinic guidance, and patient care coordination.',
  image: '/images/renew/uploads/2024/07/counseling-img.png',
  sections: [
    {
      heading: 'Renew Healthcare Clinics',
      body: 'Call us at 062923 12076 or email info@renewhealthcare.in for appointments and patient support.\n- Saltlake: EN-26, Sector V, Saltlake City, Kolkata, West Bengal\n- Gariahat: 46B, Rafi Ahmed Kidwai Road, Kolkata, West Bengal\n- Jamshedpur: Renew Healthcare, Jamshedpur, Jharkhand',
    },
    {
      heading: 'Clinic Timings',
      body: 'Clinic Timings Monday to Saturday 9:00 AM - 6:00 PM. Appointment slots, doctor availability, and consultation timing can vary by clinic, so please call before visiting.',
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
