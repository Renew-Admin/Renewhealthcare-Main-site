// metaPixel — Meta (Facebook) Pixel helpers for the public site.
//
// The Pixel ID comes from .env (META_PIXEL_ID, mapped to
// NEXT_PUBLIC_META_PIXEL_ID in next.config.mjs). With no ID — or in
// RENEW_OFFLINE=1 local runs — nothing is loaded and every call is a no-op.
const rawId = process.env.NEXT_PUBLIC_META_PIXEL_ID || ''

// Pixel IDs are numeric; anything else is ignored rather than injected.
export const META_PIXEL_ID = /^\d{5,20}$/.test(rawId) ? rawId : ''

/** fbq('track', name, params) if the Pixel is loaded. */
export function trackMetaEvent(name, params) {
  if (!META_PIXEL_ID || typeof window === 'undefined' || typeof window.fbq !== 'function') return
  if (params) window.fbq('track', name, params)
  else window.fbq('track', name)
}
