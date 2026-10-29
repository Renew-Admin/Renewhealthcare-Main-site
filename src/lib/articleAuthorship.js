// articleAuthorship — who is named at the end of every article and which
// date is shown (website brief for renewhealthcare.in, checked 23 Oct 2026:
// "articles still have no doctor author box and no last-reviewed date").
//
// Two cases:
//  - Pages whose text Dr. Rajeev Agarwal wrote (src/lib/doctorArticles.js):
//    the box names him as the author, with qualifications, council
//    registration and a link to his profile, and the date the text went live.
//  - Every other article: the box shows the reviewing doctor with photo,
//    qualifications, registration and profile link, under "Medically reviewed
//    by", and names Renew Healthcare as the publisher (checklist, 29 Oct 2026).
//    The reviewer is the doctor the article itself names (Dr. Arnab Kundu or
//    Dr. Neha Yadav, whichever is named first); an article that names neither
//    is reviewed by Dr. Rajeev Agarwal (client's rule, 29 Oct 2026).
//
// Pure functions, so the page, the schema and the tests share them.
import { DOCTOR_ARTICLES, formatLastUpdated } from './doctorArticles.js'
import { DOCTOR_REGISTRATIONS, formatRegistration } from './doctorRegistrations.js'
import { CONFIRMED_DOCTOR_DETAILS, doctors } from '../data/doctors.js'

export const DOCTOR_PROFILE = {
  name: 'Dr. Rajeev Agarwal',
  qualifications: CONFIRMED_DOCTOR_DETAILS['dr-rajeev-agarwal'].qualification,
  role: 'Medical Director, Renew Healthcare',
  registration: formatRegistration(DOCTOR_REGISTRATIONS['dr-rajeev-agarwal']),
  photo: '/images/renew/uploads/2026/05/Dr-Rajeev-Agarwal.webp',
  url: '/doctor/dr-rajeev-agarwal',
}

const photoOf = (slug) => doctors.find((doctor) => doctor.slug === slug)?.photo || ''

// One entry per doctor who can be named as an article's medical reviewer.
// Dr. Arnab Kundu's qualifications are the ones on his profile
// and in his articles. Dr. Neha Yadav's are not on record yet, so her box
// shows none until the clinic confirms them.
const REVIEWERS = {
  'dr-rajeev-agarwal': DOCTOR_PROFILE,
  'dr-arnab-kundu': {
    name: 'Dr. Arnab Kundu',
    qualifications: 'MBBS, DGO, DNB (Obstetrics & Gynaecology)',
    role: 'Infertility Specialist, Renew Healthcare',
    registration: formatRegistration(DOCTOR_REGISTRATIONS['dr-arnab-kundu']),
    photo: photoOf('dr-arnab-kundu'),
    url: '/doctor/dr-arnab-kundu',
  },
  'dr-neha-yadav': {
    name: 'Dr. Neha Yadav',
    qualifications: '',
    role: 'Infertility Specialist, Renew Healthcare',
    registration: formatRegistration(DOCTOR_REGISTRATIONS['dr-neha-yadav']),
    photo: photoOf('dr-neha-yadav'),
    url: '/doctor/dr-neha-yadav',
  },
}

// Qualifications as written in the reviewer line at the top of the article.
const SHORT_QUALIFICATIONS = {
  'dr-rajeev-agarwal': 'MBBS, MD (O&G)',
  'dr-arnab-kundu': 'MBBS, DGO, DNB (O&G)',
}

// How each doctor is named in article text (English and Bengali articles both
// write the name in English, e.g. "Dr. Arnab Kundu-র").
const NAMED_IN_TEXT = [
  ['dr-arnab-kundu', /Dr\.?\s*Arnab\s+Kundu/i],
  ['dr-neha-yadav', /Dr\.?\s*Neha\s+Yadav/i],
]
export const DEFAULT_REVIEWER_SLUG = 'dr-rajeev-agarwal'

// Owner's confirmation, 24 Oct 2026: Dr. Agarwal has reviewed every article
// that is not his own. That date is shown as "Last reviewed" on his reviews;
// the other doctors' reviews show the article's own last-updated date.
export const REVIEW_DATE = '2026-10-24'

/** Slug of the doctor named first in the article's text, else Dr. Agarwal. */
export function reviewerSlugFor(html = '') {
  const text = String(html || '').replace(/<[^>]+>/g, ' ')
  let found = DEFAULT_REVIEWER_SLUG
  let firstAt = Infinity
  for (const [slug, pattern] of NAMED_IN_TEXT) {
    const at = text.search(pattern)
    if (at >= 0 && at < firstAt) {
      found = slug
      firstAt = at
    }
  }
  return found
}

/** The reviewer line data: name, credentials ("MBBS, MD (O&G), WBMC 52540"), url. */
export function articleReviewer(html = '') {
  const slug = reviewerSlugFor(html)
  const profile = REVIEWERS[slug]
  return {
    name: profile.name,
    qualifications: profile.qualifications,
    credentials: [SHORT_QUALIFICATIONS[slug], DOCTOR_REGISTRATIONS[slug]?.number].filter(Boolean).join(', '),
    url: profile.url,
  }
}

/**
 * The author box data for one article.
 * `article` is a blog directory entry (slug, iso, modifiedIso); `html` is the
 * article body, used to find the doctor it names.
 */
export function articleAuthorship(article = {}, html = '') {
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
  const reviewerSlug = reviewerSlugFor(html)
  const isDefault = reviewerSlug === DEFAULT_REVIEWER_SLUG
  const dateIso = isDefault ? REVIEW_DATE : article.modifiedIso || article.iso || ''
  return {
    kind: 'reviewed',
    heading: 'Medically reviewed by',
    ...REVIEWERS[reviewerSlug],
    publisher: { name: 'Renew Healthcare', url: '/about-us' },
    dateLabel: isDefault ? 'Last reviewed' : 'Last updated',
    dateIso,
    date: formatLastUpdated(dateIso),
    reviewer: articleReviewer(html),
  }
}
