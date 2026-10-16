// Tests for the GA4 helpers and the /api/lead validation — `npm test`.
import { test } from 'node:test'
import assert from 'node:assert/strict'

const { cleanPageLocation, sanitizeParams, pageCategory, isTrackedPath, gtagInitScript } = await import('../src/lib/analytics.js')
const { validateLead, createRateLimiter, createDuplicateGuard } = await import('../src/lib/leadValidation.js')

test('page_location keeps campaign params only, once', () => {
  const url = cleanPageLocation('https://renewhealthcare.in/contact?utm_source=ig&fbclid=AAA&mcp_token=eyJ.x.y&email=a@b.com#book')
  assert.equal(url, 'https://renewhealthcare.in/contact?utm_source=ig')
  assert.equal(cleanPageLocation('https://renewhealthcare.in/?v=1?v=1'), 'https://renewhealthcare.in/')
  assert.equal(cleanPageLocation('https://renewhealthcare.in/?gclid=G1&gclid=G2'), 'https://renewhealthcare.in/?gclid=G1')
})

test('event params are allow-listed and token-only', () => {
  const out = sanitizeParams('generate_lead', { form_type: 'callback-modal', name: 'Asha', phone: '9876543210', page_category: 'home' })
  assert.deepEqual(out, { form_type: 'callback-modal', page_category: 'home' })
  assert.deepEqual(sanitizeParams('phone_click', { cta_location: '+91 98765 43210' }), {})
  assert.deepEqual(sanitizeParams('form_error', { error_field: 'customer_number', error_type: 'validation' }), { error_field: 'customer_number', error_type: 'validation' })
  assert.equal(sanitizeParams('made_up_event', {}), null)
})

test('page category never exposes the condition in the path', () => {
  assert.equal(pageCategory('/services/surrogacy'), 'service_page')
  assert.equal(pageCategory('/blogs/sperm-cramps-in-men'), 'blog')
  assert.equal(pageCategory('/'), 'home')
  assert.equal(pageCategory('/male-infertility'), 'content_page')
})

test('admin is never tracked', () => {
  assert.equal(isTrackedPath('/admin'), false)
  assert.equal(isTrackedPath('/admin/leads'), false)
  assert.equal(isTrackedPath('/administration-fees'), true)
})

test('init snippet sets consent defaults before config', () => {
  const s = gtagInitScript()
  assert.ok(s.indexOf("'consent', 'default'") < s.indexOf("'config'"))
  assert.ok(s.includes("analytics_storage: 'denied'"))
  assert.ok(s.includes('ga-disable-G-VL7SJC7ENL'))
})

test('lead validation', () => {
  const good = { name: 'Asha Roy', customer_number: '9876543210', source: 'footer', email: 'asha@example.com' }
  assert.equal(validateLead(good).ok, true)
  assert.equal(validateLead({ ...good, customer_number: '12' }).error, 'invalid_phone')
  assert.equal(validateLead({ ...good, name: '<script>' }).error, 'invalid_name')
  assert.equal(validateLead({ ...good, website: 'spam.example' }).error, 'rejected')
  assert.equal(validateLead([]).error, 'invalid_body')
  assert.equal(validateLead({ ...good, source: 'DROP TABLE' }).lead.source, 'website')
  assert.equal(validateLead({ ...good, message: 'x'.repeat(5000) }).lead.message.length, 2000)
})

test('rate limiter and duplicate guard', () => {
  const allow = createRateLimiter({ limit: 2, windowMs: 1000 })
  assert.equal(allow('ip', 0), true)
  assert.equal(allow('ip', 1), true)
  assert.equal(allow('ip', 2), false)
  assert.equal(allow('ip', 2000), true)
  const dup = createDuplicateGuard(1000)
  assert.equal(dup('k', 0), false)
  assert.equal(dup('k', 10), true)
  assert.equal(dup('k', 5000), false)
})
