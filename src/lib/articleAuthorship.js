// articleAuthorship — who is named at the end of every article and which
// date is shown (website brief for renewhealthcare.in, checked 23 Oct 2026:
// "articles still have no doctor author box and no last-reviewed date").
//
// Two cases:
//  - Pages whose text Dr. Rajeev Agarwal wrote (src/lib/doctorArticles.js):
//    the box names him as the author, with qualifications, council
//    registration and a link to his profile, and the date the text went live.
//  - Every other article: published by Renew Healthcare, with the date the
//    post was last updated in the CMS. A "Medically reviewed by" line is added
//    only once ARTICLE_REVIEWER is set, because naming a reviewer is a claim
//    that the doctor has actually read and approved that text.
//
// Pure functions, so the page and tests share them.
import { DOCTOR_ARTICLES, formatLastUpdated } from './doctorArticles.js'
import { DOCTOR_REGISTRATIONS, formatRegistration } from './doctorRegistrations.js'

export const DOCTOR_PROFILE = {
  name: 'Dr. Rajeev Agarwal',
  qualifications: 'MBBS, MD (Obstetrics & Gynaecology)',
  role: 'Medical Director, Renew Healthcare',
  registration: formatRegistration(DOCTOR_REGISTRATIONS['dr-rajeev-agarwal']),
  photo: '/images/renew/uploads/2026/05/Dr-Rajeev-Agarwal.webp',
  url: '/doctor/dr-rajeev-agarwal',
}

// Owner's confirmation, 24 Oct 2026: Dr. Agarwal has reviewed every article
// that is not his own, and the box is to say exactly
// "Medically reviewed by Dr. Rajeev Agarwal, MBBS, MD (O&G), WBMC 52540"
// (registration written as the client supplied it on 26 Oct 2026, task B1).
// REVIEW_DATE is the date of that confirmation; change it (or make it
// per-article) when an article is re-reviewed.
export const ARTICLE_REVIEWER = {
  name: 'Dr. Rajeev Agarwal',
  credentials: `MBBS, MD (O&G), ${DOCTOR_REGISTRATIONS['dr-rajeev-agarwal'].number}`,
  url: '/doctor/dr-rajeev-agarwal',
}
export const REVIEW_DATE = '2026-10-24'

export const TEAM_PROFILE = {
  name: 'Renew Healthcare',
  role: 'Fertility, IVF and women’s health clinics in Kolkata and Jamshedpur',
  photo: '/images/renew/uploads/2024/07/renew-healthcare-logo.jpg.webp',
  url: '/about-us',
}

/**
 * The author box data for one article.
 * `article` is a blog directory entry (slug, iso, modifiedIso).
 */
export function articleAuthorship(article = {}) {
  const slug = String(article.slug || '')
  const doctor = DOCTOR_ARTICLES[slug] || null
  if (doctor) {
    return {
      kind: 'doctor',
      heading: 'Written by',
      ...DOCTOR_PROFILE,
      dateLabel: 'Last updated',
      dateIso: doctor.updated || article.modifiedIso || article.iso || '',
      date: formatLastUpdated(doctor.updated || article.modifiedIso || article.iso),
      reviewer: null,
    }
  }
  const dateIso = ARTICLE_REVIEWER ? REVIEW_DATE : article.modifiedIso || article.iso || ''
  return {
    kind: 'team',
    heading: 'Published by',
    ...TEAM_PROFILE,
    qualifications: '',
    registration: '',
    dateLabel: ARTICLE_REVIEWER ? 'Last reviewed' : 'Last updated',
    dateIso,
    date: formatLastUpdated(dateIso),
    reviewer: ARTICLE_REVIEWER,
  }
}
