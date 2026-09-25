// useContent — cached hooks the public site uses to read admin-managed content
// (doctors, testimonials, faqs, settings) and merge it with the static data.
//
// Pages are prerendered at deploy time with this content fetched on the
// server and passed in as `initial`: the first render uses it, so the server
// HTML and the hydrated page agree. After mount the hook refreshes from
// Supabase and swaps in newer admin edits (an empty/failed read keeps
// `initial`). Without `initial` (e.g. the announcement bar) it is a plain
// client fetch.
import { useEffect, useState } from 'react'
import { fetchPublicSettings, listActiveRows } from '../lib/publicApi.js'
import { buildDoctorList, doctorCategories } from '../lib/doctorsModel.js'

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

function hasContent(value) {
  return Array.isArray(value) ? value.length > 0 : Boolean(value && Object.keys(value).length)
}

function useResource(res, initial) {
  const hasInitial = initial !== undefined
  const [data, setData] = useState(hasInitial ? initial : res.state.fallback)
  const [loading, setLoading] = useState(!hasInitial)
  useEffect(() => {
    let active = true
    res.load().then((d) => {
      if (!active) return
      if (!hasInitial || hasContent(d)) setData(d)
      setLoading(false)
    })
    return () => { active = false }
  }, [res, hasInitial])
  return { data, loading }
}

// Browser reads go through the lightweight REST client (src/lib/publicApi.js),
// not the Supabase SDK, so the public bundle stays small.
const doctorsRes = createResource(() => listActiveRows('doctors'), [])
const testimonialsRes = createResource(() => listActiveRows('testimonials'), [])
const faqsRes = createResource(() => listActiveRows('faqs'), [])
const settingsRes = createResource(() => fetchPublicSettings(), {})

export const invalidateDoctors = doctorsRes.invalidate
export const invalidateTestimonials = testimonialsRes.invalidate
export const invalidateFaqs = faqsRes.invalidate
export const invalidateSettings = settingsRes.invalidate

// Doctors: admin-managed first, then the built-in static team list.
// `initialRows` are raw Supabase rows fetched on the server.
export function useDoctors(initialRows) {
  const { data, loading } = useResource(doctorsRes, initialRows)
  const doctors = buildDoctorList(data)
  return { doctors, categories: doctorCategories(doctors), loading }
}

export function mapTestimonials(rows = []) {
  return rows.map((t) => ({
    author: t.name,
    rating: t.rating || 5,
    text: t.quote || '',
    date: t.location || t.treatment || '',
    photo: t.photo || '',
    _remote: true,
  }))
}

// Testimonials mapped to the shape the reviews wall expects.
export function useTestimonials(initialRows) {
  const { data, loading } = useResource(testimonialsRes, initialRows)
  return { testimonials: mapTestimonials(data), loading }
}

// FAQs as {question, answer}.
export function useFaqs(initialRows) {
  const { data, loading } = useResource(faqsRes, initialRows)
  const faqs = data.map((f) => ({ question: f.question, answer: f.answer }))
  return { faqs, loading }
}

export function useSettings() {
  const { data, loading } = useResource(settingsRes)
  return { settings: data || {}, loading }
}
