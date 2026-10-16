// consent — the visitor's analytics/ads choice, stored first-party and mirrored
// into Google Consent Mode v2. Defaults (everything denied) are set in the
// <head> snippet before gtag loads; this module only records updates.
//
// ad_personalization is never granted: the site does not build remarketing or
// personalised-ad audiences from fertility-related browsing.
export const CONSENT_KEY = 'rh_consent'
export const CONSENT_VERSION = 1
export const CONSENT_EVENT = 'rh:consent-change'
export const OPEN_SETTINGS_EVENT = 'rh:open-consent-settings'

export function readConsent() {
  if (typeof window === 'undefined') return null
  try {
    const value = JSON.parse(window.localStorage.getItem(CONSENT_KEY) || 'null')
    return value && value.v === CONSENT_VERSION ? value : null
  } catch {
    return null
  }
}

export function consentSignals(choice) {
  const analytics = choice?.analytics === 'granted' ? 'granted' : 'denied'
  const ads = analytics === 'granted' && choice?.ads === 'granted' ? 'granted' : 'denied'
  return {
    analytics_storage: analytics,
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: 'denied',
  }
}

/** Save a choice ({ analytics, ads } each 'granted' | 'denied') and apply it. */
export function saveConsent({ analytics, ads }) {
  const choice = {
    v: CONSENT_VERSION,
    analytics: analytics === 'granted' ? 'granted' : 'denied',
    ads: analytics === 'granted' && ads === 'granted' ? 'granted' : 'denied',
    at: new Date().toISOString(),
  }
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(choice))
  } catch {
    /* storage blocked — the choice still applies for this page view */
  }
  try {
    if (typeof window.gtag === 'function') window.gtag('consent', 'update', consentSignals(choice))
  } catch {
    /* analytics must never break the page */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: choice }))
  return choice
}

export function adsConsentGranted() {
  return readConsent()?.ads === 'granted'
}

/** Ask the banner to reopen (footer "Cookie settings" link). */
export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT))
}
