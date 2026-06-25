// tracking.js — capture marketing attribution (UTM params + gclid) once per
// session and hand it to lead forms. Values persist across client-side
// navigation, so a visitor who arrives from an ad and books later still
// carries the original campaign attribution.
const TRACKING_KEYS = ['utm_campaign', 'utm_source', 'utm_medium', 'utm_term', 'utm_content', 'gclid']
const STORAGE_KEY = 'rh_tracking'

export { TRACKING_KEYS }

function readStore() {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(window.sessionStorage.getItem(STORAGE_KEY)) || {}
  } catch {
    return {}
  }
}

// Merge any UTM/gclid params from the current URL into session storage, then
// return the full attribution object. Safe to call on every mount — the first
// value seen for a key wins, so deeper navigation never clobbers the landing
// campaign.
export function captureTracking() {
  if (typeof window === 'undefined') return {}
  const stored = readStore()
  const params = new URLSearchParams(window.location.search)
  let changed = false
  TRACKING_KEYS.forEach((key) => {
    const val = params.get(key)
    if (val && !stored[key]) {
      stored[key] = val
      changed = true
    }
  })
  if (changed) {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
    } catch {
      /* storage unavailable (private mode) — attribution is best-effort */
    }
  }
  return stored
}

export function getTracking() {
  return readStore()
}

// Build a short, human-readable note so attribution stays visible in the admin
// leads table, which has no dedicated UTM columns.
export function trackingNote(tracking) {
  const parts = TRACKING_KEYS.filter((key) => tracking[key]).map((key) => `${key}=${tracking[key]}`)
  return parts.length ? `Attribution: ${parts.join(' | ')}` : ''
}
