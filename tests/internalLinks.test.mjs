// Tests for src/lib/internalLinks.js — run with `npm test` (node:test, no deps).
import { test } from 'node:test'
import assert from 'node:assert/strict'

import { resolveInternalPath, rewriteInternalLinks } from '../src/lib/internalLinks.js'

// Minimal route knowledge: the service pages the aliases point at, plus one
// live article so /blogs/ resolution can be exercised without Supabase.
const routePaths = new Set([
  '/',
  '/blogs',
  '/contact',
  '/services/high-risk-pregnancy-management',
  '/services/pre-conception-counseling',
  '/services/tesa-pesa',
  '/blogs/how-many-eggs-is-a-good-number',
])
const blogSlugs = new Set(['how-many-eggs-is-a-good-number', 'what-is-era'])
const context = { blogSlugs, routePaths }

// RH-02 — broken cross-links resolve to the live URL through the alias map.
const ALIASES = [
  ['/blogs/how-many-eggs-good-at-your-age', '/blogs/how-many-eggs-is-a-good-number'],
  ['/blogs/how-many-ivf-cycles-does-it-really-take', '/blogs/how-many-ivf-cycles-does-it-take'],
  ['/blogs/erectile-problems-while-trying-to-conceive', '/blogs/erectile-problems-while-trying-to-conceive-what-causes-them-and-what-can-be-done'],
  ['/blogs/ivf-kolkata-if-you-live-outside-the-city', '/blogs/how-do-i-plan-ivf-in-kolkata-if-i-live-outside-the-city'],
  ['/why-choose-renew-healthcare-for-high-risk-pregnancy-management', '/services/high-risk-pregnancy-management'],
  ['/preconception-counseling/steps-of-preconception-counseling', '/services/pre-conception-counseling'],
  ['/services/surgical-sperm-aspiration', '/services/tesa-pesa'],
  ['/landing-page', '/contact'],
]

for (const [from, to] of ALIASES) {
  test(`RH-02 resolveInternalPath: ${from} -> ${to}`, () => {
    assert.equal(resolveInternalPath(from, context), to)
    // Trailing slash form is normalised first and resolves the same way.
    assert.equal(resolveInternalPath(`${from}/`, context), to)
  })
}

test('RH-02 two-segment legacy path reaches the alias lookup inside an anchor', () => {
  const html = '<a href="/preconception-counseling/steps-of-preconception-counseling"><span>preconception counselling,</span></a>'
  const { html: out, changed, unresolved } = rewriteInternalLinks(html, context)
  assert.equal(out, '<a href="/services/pre-conception-counseling"><span>preconception counselling,</span></a>')
  assert.equal(changed, 1)
  assert.deepEqual(unresolved, [])
})

test('RH-02 absolute URL to our own origin is rewritten to the aliased path', () => {
  const html = '<a href="https://renewhealthcare.in/landing-page" target="_blank" rel="noopener">Book your appointment</a>'
  const { html: out, changed } = rewriteInternalLinks(html, context)
  assert.equal(out, '<a href="/contact" target="_blank" rel="noopener">Book your appointment</a>')
  assert.equal(changed, 1)
})

test('RH-02 unknown internal path is left alone and reported as unresolved', () => {
  const html = '<a href="/no-such-page">x</a>'
  const { html: out, changed, unresolved } = rewriteInternalLinks(html, context)
  assert.equal(out, html)
  assert.equal(changed, 0)
  assert.deepEqual(unresolved, ['/no-such-page'])
})
