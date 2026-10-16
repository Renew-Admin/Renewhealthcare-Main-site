// analytics — the one place the public site talks to Google Analytics 4.
//
// Rules this module enforces (see docs/ANALYTICS.md):
//   * Only production hostnames send data. Localhost, previews and *.workers.dev
//     are switched off with gtag's documented `ga-disable-<ID>` flag.
//   * /admin is never tracked.
//   * Event parameters are allow-listed. Only short, generic tokens are sent
//     (form type, CTA placement, page category) — never form values, phone
//     numbers, emails, names, purposes of visit or free text.
//   * page_location keeps only campaign parameters (utm_*, gclid…); every other
//     query parameter is dropped before it reaches Google.
export const GA_MEASUREMENT_ID = 'G-VL7SJC7ENL'

export const PRODUCTION_HOSTS = ['renewhealthcare.in', 'www.renewhealthcare.in']

// Campaign parameters GA4 needs for attribution. Nothing else survives.
export const ALLOWED_QUERY_KEYS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id',
  'gclid', 'gbraid', 'wbraid', 'dclid',
]

// Event name -> parameters that event may carry.
const EVENT_PARAMS = {
  page_view: ['page_location', 'page_title', 'page_category', 'send_to'],
  generate_lead: ['form_type', 'page_category'],
  form_error: ['form_type', 'error_field', 'error_type', 'page_category'],
  phone_click: ['cta_location', 'page_category'],
  whatsapp_click: ['cta_location', 'page_category'],
  email_click: ['cta_location', 'page_category'],
  appointment_cta_click: ['cta_location', 'cta_type', 'page_category'],
}

const TOKEN = /^[a-z0-9][a-z0-9_-]{0,39}$/

export function isTrackedPath(pathname = '') {
  return !(pathname === '/admin' || pathname.startsWith('/admin/'))
}

export function isProductionHost(hostname = '') {
  return PRODUCTION_HOSTS.includes(hostname)
}

/** Strip every non-campaign query parameter and the fragment from a URL. */
export function cleanPageLocation(href) {
  try {
    const url = new URL(href)
    const kept = new URLSearchParams()
    for (const key of ALLOWED_QUERY_KEYS) {
      const value = url.searchParams.get(key)
      if (value) kept.set(key, value.slice(0, 100))
    }
    const query = kept.toString()
    return `${url.origin}${url.pathname}${query ? `?${query}` : ''}`
  } catch {
    return ''
  }
}

/**
 * Generic, non-identifying page category. Paths such as
 * /services/surrogacy describe a health interest, so only the section is sent.
 */
export function pageCategory(pathname = '/') {
  if (pathname === '/' || pathname === '') return 'home'
  const first = pathname.split('/').filter(Boolean)[0] || ''
  const map = {
    services: 'service_page',
    doctor: 'doctor_page',
    doctors: 'doctor_page',
    blogs: 'blog',
    locations: 'location_page',
    'contact-us': 'contact',
    contact: 'contact',
    packages: 'pricing',
    'international-patients': 'international',
    bangladesh: 'international',
    course: 'course',
    'success-stories': 'trust_page',
    'ivf-success-factors-and-rates': 'trust_page',
    'why-renew': 'trust_page',
    'about-us': 'trust_page',
  }
  return map[first] || 'content_page'
}

/** Keep only the allowed parameters for `name`, and only safe values. */
export function sanitizeParams(name, params = {}) {
  const allowed = EVENT_PARAMS[name]
  if (!allowed) return null
  const out = {}
  for (const key of allowed) {
    const value = params[key]
    if (value === undefined || value === null || value === '') continue
    if (key === 'page_location') {
      const cleaned = cleanPageLocation(String(value))
      if (cleaned) out.page_location = cleaned
    } else if (key === 'page_title') {
      out.page_title = String(value).slice(0, 120)
    } else if (key === 'send_to') {
      out.send_to = GA_MEASUREMENT_ID
    } else {
      const token = String(value).toLowerCase()
      if (TOKEN.test(token)) out[key] = token
    }
  }
  return out
}

/** True when this page may send analytics hits at all. */
export function analyticsAllowed() {
  if (typeof window === 'undefined') return false
  if (window[`ga-disable-${GA_MEASUREMENT_ID}`]) return false
  return isProductionHost(window.location.hostname) && isTrackedPath(window.location.pathname)
}

/** Send one GA4 event. Never throws, never blocks the caller. */
export function track(name, params = {}) {
  try {
    if (!analyticsAllowed() || typeof window.gtag !== 'function') return false
    const clean = sanitizeParams(name, {
      page_category: pageCategory(window.location.pathname),
      ...params,
    })
    if (!clean) return false
    window.gtag('event', name, { ...clean, send_to: GA_MEASUREMENT_ID })
    return true
  } catch {
    return false
  }
}

// Inline <head> snippet: consent defaults first, then the environment guard,
// then gtag config. Runs before any other tag.
export function gtagInitScript() {
  return `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied', wait_for_update: 500 });
gtag('set', 'ads_data_redaction', true);
gtag('set', 'url_passthrough', false);
try {
  var c = JSON.parse(localStorage.getItem('rh_consent') || 'null');
  if (c && c.v === 1 && c.analytics === 'granted') {
    gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: c.ads === 'granted' ? 'granted' : 'denied', ad_user_data: c.ads === 'granted' ? 'granted' : 'denied' });
  }
} catch (e) {}
(function () {
  var hosts = ${JSON.stringify(PRODUCTION_HOSTS)};
  var p = location.pathname;
  if (hosts.indexOf(location.hostname) === -1 || p === '/admin' || p.indexOf('/admin/') === 0) {
    window['ga-disable-${GA_MEASUREMENT_ID}'] = true;
  }
})();
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });`
}
