// useContent — cached hooks the public site uses to read admin-managed content
// (doctors, testimonials, faqs, settings) and merge it with the static data.
import { useEffect, useState } from 'react'
import { doctorsApi, testimonialsApi, faqsApi, fetchSettings } from '../lib/content.js'
import { slugify } from '../lib/blogApi.js'
import { doctors as staticDoctors } from '../data/doctors.js'

// Module-level cache so the data is fetched once per page load.
function createResource(loader, fallback) {
  const state = { cache: null, inflight: null, fallback }
  const load = () => {
    if (state.cache != null) return Promise.resolve(state.cache)
    if (!state.inflight) {
      state.inflight = loader()
        .then((d) => (state.cache = d))
        .catch(() => (state.cache = fallback))
        .finally(() => { state.inflight = null })
    }
    return state.inflight
  }
  return { state, load, invalidate: () => { state.cache = null } }
}

function useResource(res) {
  const [data, setData] = useState(res.state.cache ?? res.state.fallback)
  const [loading, setLoading] = useState(res.state.cache == null)
  useEffect(() => {
    let active = true
    if (res.state.cache != null) { setData(res.state.cache); setLoading(false); return }
    res.load().then((d) => { if (active) { setData(d); setLoading(false) } })
    return () => { active = false }
  }, [res])
  return { data, loading }
}

const doctorsRes = createResource(() => doctorsApi.listActive(), [])
const testimonialsRes = createResource(() => testimonialsApi.listActive(), [])
const faqsRes = createResource(() => faqsApi.listActive(), [])
const settingsRes = createResource(() => fetchSettings(), {})
const hiddenDoctorSlugs = new Set(['dr-ruby-yadav'])
const staticDoctorsBySlug = new Map(staticDoctors.map((doctor) => [doctor.slug, doctor]))

function parseJsonArray(value) {
  if (typeof value !== 'string') return null
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

function toStringList(value) {
  const source = Array.isArray(value) ? value : parseJsonArray(value) || []
  return source.map((item) => String(item || '').trim()).filter(Boolean)
}

function toPairList(value, keys) {
  const source = Array.isArray(value) ? value : parseJsonArray(value) || []
  return source
    .map((item) => Object.fromEntries(keys.map((key) => [key, String(item?.[key] || '').trim()])))
    .filter((item) => keys.some((key) => item[key]))
}

export const invalidateDoctors = doctorsRes.invalidate
export const invalidateTestimonials = testimonialsRes.invalidate
export const invalidateFaqs = faqsRes.invalidate
export const invalidateSettings = settingsRes.invalidate

// Doctors: admin-managed first, then the built-in static team list.
export function useDoctors() {
  const { data, loading } = useResource(doctorsRes)
  const remote = data.map((d) => {
    const slug = slugify(d.name)
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
      photo: d.photo || fallback?.photo || '',
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
  })
  // Once Supabase has doctors (e.g. after seeding), it is the source of truth.
  // The in-code list is only a fallback when the table is empty.
  const doctors = (remote.length ? remote : staticDoctors).filter((d) => !hiddenDoctorSlugs.has(d.slug))
  const categories = [...new Set(doctors.map((d) => d.category))]
  return { doctors, categories, loading }
}

// Testimonials mapped to the shape the reviews wall expects.
export function useTestimonials() {
  const { data, loading } = useResource(testimonialsRes)
  const testimonials = data.map((t) => ({
    author: t.name,
    rating: t.rating || 5,
    text: t.quote || '',
    date: t.location || t.treatment || '',
    photo: t.photo || '',
    _remote: true,
  }))
  return { testimonials, loading }
}

// FAQs as {question, answer}.
export function useFaqs() {
  const { data, loading } = useResource(faqsRes)
  const faqs = data.map((f) => ({ question: f.question, answer: f.answer }))
  return { faqs, loading }
}

export function useSettings() {
  const { data, loading } = useResource(settingsRes)
  return { settings: data || {}, loading }
}
