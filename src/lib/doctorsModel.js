// doctorsModel — turns Supabase `doctors` rows into the shape the site renders,
// merged with the built-in list in src/data/doctors.js. Pure functions, so the
// server (page rendering, routes, sitemap) and the browser (admin preview,
// hooks) build exactly the same list and cannot drift apart.
import { doctors as staticDoctors } from '../data/doctors.js'

export const HIDDEN_DOCTOR_SLUGS = new Set(['dr-ruby-yadav'])
const staticDoctorsBySlug = new Map(staticDoctors.map((doctor) => [doctor.slug, doctor]))

// Identical to blogApi.slugify — duplicated so this module (which the server
// imports) does not pull in the Supabase client.
export function slugifyName(text) {
  return (text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function parseJsonArray(value) {
  if (typeof value !== 'string') return null
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function toStringList(value) {
  const source = Array.isArray(value) ? value : parseJsonArray(value) || []
  return source.map((item) => String(item || '').trim()).filter(Boolean)
}

function toPairList(value, keys) {
  const source = Array.isArray(value) ? value : parseJsonArray(value) || []
  return source
    .map((item) => Object.fromEntries(keys.map((key) => [key, String(item?.[key] || '').trim()])))
    .filter((item) => keys.some((key) => item[key]))
}

function formatPhoto(path, name) {
  if (name === 'Dr. Rajeev Agarwal' || (path && (path.includes('Dr-rajeev-agarwal') || path.includes('Dr-Rajeev-Agarwal') || path.includes('Dr. Rajeev Agarwal')))) {
    return '/images/renew/uploads/2026/05/Dr-Rajeev-Agarwal.webp'
  }
  if (!path) return ''
  const cleaned = String(path).trim()
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://') || cleaned.startsWith('/')) return cleaned
  return `/images/renew/uploads/${cleaned}`
}

function normalizeRemoteDoctor(d) {
  const slug = slugifyName(d.name)
  const fallback = staticDoctorsBySlug.get(slug)
  const qualificationList = toStringList(d.qualifications)
  const qualification = d.qualification || fallback?.qualification || qualificationList[0] || ''
  return {
    slug,
    name: d.name,
    qualification,
    qualifications: qualificationList.length ? qualificationList : qualification ? [qualification] : toStringList(fallback?.qualifications),
    role: d.role || fallback?.role || '',
    category: d.category || fallback?.category || 'Our Experts',
    photo: formatPhoto(d.photo, d.name) || fallback?.photo || '',
    bio: d.bio || fallback?.bio || '',
    experience_years: d.experience_years || fallback?.experience_years || '',
    milestone_stat: d.milestone_stat || fallback?.milestone_stat || '',
    specializations: toStringList(d.specializations),
    languages: toStringList(d.languages),
    past_attachments: toPairList(d.past_attachments, ['institution', 'description']),
    clinic_address: d.clinic_address || fallback?.clinic_address || '',
    service_areas: toStringList(d.service_areas),
    faqs: toPairList(d.faqs, ['question', 'answer']),
    _remote: true,
  }
}

/**
 * The public doctor list. Once Supabase has doctors it is the source of truth;
 * the in-code list is only the fallback when the table is empty/unreachable.
 */
export function buildDoctorList(remoteRows = []) {
  const remote = (remoteRows || []).filter((row) => row && row.name).map(normalizeRemoteDoctor)
  return (remote.length ? remote : staticDoctors).filter((d) => !HIDDEN_DOCTOR_SLUGS.has(d.slug))
}

export function doctorCategories(list) {
  return [...new Set(list.map((d) => d.category))]
}
