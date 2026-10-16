// leadValidation — server-side checks for /api/lead. Shared with tests.
// The browser already validates, but nothing the browser sends is trusted.
export const MAX_BODY_BYTES = 8 * 1024

const FIELD_LIMITS = {
  name: 80,
  phone: 15,
  email: 120,
  service: 80,
  message: 2000,
  source: 40,
  page_path: 200,
  customer_number: 15,
  whatsapp_number: 15,
  purpose: 80,
  purpose_details: 120,
  date: 40,
  submitted_at: 40,
}
const UTM_KEYS = ['utm_campaign', 'utm_source', 'utm_medium', 'utm_term', 'utm_content', 'gclid']

const NAME = /^[\p{L}]+(?: [\p{L}.'-]+)*$/u
const PHONE = /^\+?\d{10,13}$/
const EMAIL = /^[^\s@]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/
const SOURCE = /^[a-z0-9-]{1,40}$/
const PATH = /^\/[A-Za-z0-9/_\-.]*$/

const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : null)

/**
 * Returns { ok: true, lead } or { ok: false, error }.
 * `website` is a honeypot: real visitors never see or fill it.
 */
export function validateLead(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { ok: false, error: 'invalid_body' }
  if (typeof input.website === 'string' && input.website.trim() !== '') return { ok: false, error: 'rejected' }

  const lead = {}
  for (const [key, max] of Object.entries(FIELD_LIMITS)) {
    const value = clean(input[key], max)
    lead[key] = value || null
  }
  for (const key of UTM_KEYS) {
    const value = clean(input[key], 150)
    if (value) lead[key] = value
  }

  const phone = (lead.customer_number || lead.phone || '').replace(/[\s-]/g, '')
  if (!PHONE.test(phone)) return { ok: false, error: 'invalid_phone' }
  if (!lead.name || !NAME.test(lead.name)) return { ok: false, error: 'invalid_name' }
  if (lead.email && !EMAIL.test(lead.email)) return { ok: false, error: 'invalid_email' }
  if (lead.whatsapp_number && !PHONE.test(lead.whatsapp_number.replace(/[\s-]/g, ''))) return { ok: false, error: 'invalid_whatsapp' }
  if (!lead.source || !SOURCE.test(lead.source)) lead.source = 'website'
  if (lead.page_path && !PATH.test(lead.page_path)) lead.page_path = null

  return { ok: true, lead }
}

// Best-effort per-isolate limiter. The authoritative limit is the Cloudflare
// WAF rate-limiting rule on /api/lead (see docs/ANALYTICS.md); this only stops
// a single client hammering one isolate.
// 20 per 10 minutes: Indian mobile carriers put many users behind one IP
// (CGNAT), so a tight per-IP limit would drop genuine enquiries.
export function createRateLimiter({ limit = 20, windowMs = 10 * 60 * 1000 } = {}) {
  const hits = new Map()
  return function allow(key, now = Date.now()) {
    const recent = (hits.get(key) || []).filter((t) => now - t < windowMs)
    if (recent.length >= limit) {
      hits.set(key, recent)
      return false
    }
    recent.push(now)
    hits.set(key, recent)
    if (hits.size > 5000) hits.clear()
    return true
  }
}

// Same lead (phone + source) inside 2 minutes is treated as a duplicate
// (double click, retry, refresh) and not forwarded twice.
export function createDuplicateGuard(windowMs = 2 * 60 * 1000) {
  const seen = new Map()
  return function isDuplicate(key, now = Date.now()) {
    const last = seen.get(key)
    seen.set(key, now)
    if (seen.size > 5000) seen.clear()
    return last !== undefined && now - last < windowMs
  }
}
