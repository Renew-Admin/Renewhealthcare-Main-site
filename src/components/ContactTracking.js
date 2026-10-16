'use client'
// ContactTracking — one delegated click listener for contact-intent links
// (tel:, WhatsApp, mailto:) and appointment CTAs. Mounted once in SiteShell.
//
// * Listens on document in the capture phase, so links rendered later or
//   inside portals are covered without per-component wiring.
// * Never calls preventDefault: navigation, dialers and WhatsApp open exactly
//   as before.
// * Keyboard activation (Enter on a link/button) dispatches a click, so it is
//   covered too.
// * Sends only the event name, a CTA placement and the page category — never
//   the number, address or link text.
import { useEffect } from 'react'
import { track } from '../lib/analytics.js'

function ctaLocation(el) {
  const explicit = el.closest('[data-cta-location]')
  if (explicit) return explicit.getAttribute('data-cta-location')
  if (el.closest('.fab-root')) return 'floating'
  if (el.closest('.callback-modal')) return 'callback_modal'
  if (el.closest('header, .global-header')) return 'header'
  if (el.closest('footer')) return 'footer'
  return 'body'
}

export function classifyContactTarget(el) {
  const link = el.closest('a[href]')
  if (link) {
    const href = (link.getAttribute('href') || '').trim().toLowerCase()
    if (href.startsWith('tel:')) return { name: 'phone_click', el: link }
    if (href.startsWith('mailto:')) return { name: 'email_click', el: link }
    if (/^https?:\/\/(wa\.me|api\.whatsapp\.com|chat\.whatsapp\.com|web\.whatsapp\.com)\//.test(href) || href.startsWith('whatsapp:')) {
      return { name: 'whatsapp_click', el: link }
    }
    if (href.includes('#book-appointment') || link.matches('.btn-book, [data-cta="appointment"]')) {
      return { name: 'appointment_cta_click', el: link, ctaType: 'appointment_link' }
    }
  }
  const button = el.closest('button')
  if (button && button.matches('.btn-callback, .fab-opt.is-book, [data-cta="callback"]')) {
    return { name: 'appointment_cta_click', el: button, ctaType: 'callback' }
  }
  return null
}

let installed = false

export default function ContactTracking() {
  useEffect(() => {
    if (installed) return undefined
    installed = true
    const onClick = (event) => {
      try {
        if (!(event.target instanceof Element)) return
        const hit = classifyContactTarget(event.target)
        if (!hit) return
        const params = { cta_location: ctaLocation(hit.el) }
        if (hit.ctaType) params.cta_type = hit.ctaType
        track(hit.name, params)
      } catch {
        /* analytics must never break a click */
      }
    }
    // Validation failures: the browser's required-field check and
    // reportValidity() both fire `invalid` on each bad field. One form_error per
    // attempt, carrying the first field's NAME only — never its value.
    const reported = new WeakSet()
    const onInvalid = (event) => {
      try {
        const field = event.target
        const form = field && field.form
        if (!form || !form.hasAttribute('data-form-type') || reported.has(form)) return
        reported.add(form)
        window.setTimeout(() => reported.delete(form), 0)
        track('form_error', {
          form_type: form.getAttribute('data-form-type'),
          error_field: field.name || field.type || 'field',
          error_type: 'validation',
        })
      } catch {
        /* never break validation */
      }
    }
    document.addEventListener('click', onClick, true)
    document.addEventListener('invalid', onInvalid, true)
    return () => {
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('invalid', onInvalid, true)
      installed = false
    }
  }, [])
  return null
}
