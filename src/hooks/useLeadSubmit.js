// useLeadSubmit — shared logic so every lead form on the site behaves the same.
// Returns a submit() that saves to Supabase plus a status for showing feedback.
import { useState } from 'react'
import { createLead } from '../lib/leads.js'
import { trackMetaEvent } from '../lib/metaPixel.js'
import { track } from '../lib/analytics.js'

// Format rules shared by every lead form, keyed by field name (the footer form
// keeps its WordPress-era capitalised names).
const NAME_RULE = [/^[A-Za-z]+(?: [A-Za-z]+)*$/, 'Name can contain letters only.']
const EMAIL_RULE = [/^[^\s@]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/, 'Enter a valid email with @ followed by a domain, e.g. name@gmail.com.']
const PHONE_RULE = [/^\d{10}$/, 'Enter a 10-digit number (digits only).']
const FIELD_RULES = {
  name: NAME_RULE,
  Name: NAME_RULE,
  email: EMAIL_RULE,
  Email: EMAIL_RULE,
  customer_number: PHONE_RULE,
  whatsapp_number: PHONE_RULE,
  purpose_other: [/^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/, 'Use letters and numbers only.'],
}

function fieldError(el) {
  const value = typeof el.value === 'string' ? el.value.trim() : el.value
  if (value === '') return el.required ? 'Please fill out this field.' : ''
  const rule = FIELD_RULES[el.name]
  return rule && !rule[0].test(value) ? rule[1] : ''
}

// Checks required fields and field formats before a lead is sent. Native
// `required` accepts whitespace-only input, so those are flagged too. Shows the
// browser's message on the first invalid field and returns false if the form
// must not submit.
export function validateLeadForm(form) {
  for (const el of form.elements) {
    if (typeof el.setCustomValidity !== 'function' || el.type === 'hidden') continue
    const error = fieldError(el)
    el.setCustomValidity(error)
    // Clear the flag as soon as the visitor edits the field again.
    if (error) {
      const clear = () => el.setCustomValidity('')
      el.addEventListener('input', clear, { once: true })
      el.addEventListener('change', clear, { once: true })
    }
  }
  // reportValidity() fires the fields' `invalid` events, which ContactTracking
  // turns into a single form_error event (the same path the browser's own
  // required-field check uses), so nothing is tracked here.
  return form.reportValidity()
}

export function useLeadSubmit() {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')

  // Returns true on success, false on failure (so the form can reset itself).
  async function submit(payload) {
    if (status === 'sending') return false
    setStatus('sending')
    setError('')
    try {
      await createLead(payload)
      // The lead row was accepted by the server (Supabase insert resolved).
      // `submit` refuses re-entry while 'sending', so a double click or a
      // re-render cannot fire this twice for one submission.
      track('generate_lead', { form_type: payload?.source || 'website' })
      trackMetaEvent('Lead', { content_name: payload?.source || 'website' })
      setStatus('sent')
      return true
    } catch (err) {
      track('form_error', { form_type: payload?.source || 'website', error_type: 'submit_failed' })
      setError(err?.message || 'Something went wrong. Please call us instead.')
      setStatus('error')
      return false
    }
  }

  return { status, error, submit }
}
