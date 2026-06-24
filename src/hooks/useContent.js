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

export const invalidateDoctors = doctorsRes.invalidate
export const invalidateTestimonials = testimonialsRes.invalidate
export const invalidateFaqs = faqsRes.invalidate
export const invalidateSettings = settingsRes.invalidate

// Doctors: admin-managed first, then the built-in static team list.
export function useDoctors() {
  const { data, loading } = useResource(doctorsRes)
  const remote = data.map((d) => ({
    slug: slugify(d.name),
    name: d.name,
    qualification: d.qualification || '',
    role: d.role || '',
    category: d.category || 'Our Experts',
    photo: d.photo || '',
    bio: d.bio || '',
    _remote: true,
  }))
  // Once Supabase has doctors (e.g. after seeding), it is the source of truth.
  // The in-code list is only a fallback when the table is empty.
  const doctors = remote.length ? remote : staticDoctors
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
