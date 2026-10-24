import { test } from 'node:test'
import assert from 'node:assert/strict'

import { SECURITY_HEADERS, httpsRedirect, withSecurityHeaders } from '../src/lib/edgeSecurity.js'
import { DUPLICATE_REDIRECTS } from '../src/lib/seoDuplicates.js'

const url = (href) => new URL(href)

test('httpsRedirect: http on production hosts → 301 https, path and query kept', () => {
  for (const host of ['renewhealthcare.in', 'www.renewhealthcare.in']) {
    const res = httpsRedirect(url(`http://${host}/blogs/x?utm_source=a`))
    assert.equal(res.status, 301)
    assert.equal(res.headers.get('location'), `https://${host}/blogs/x?utm_source=a`)
  }
})

test('httpsRedirect: https and local hosts untouched', () => {
  assert.equal(httpsRedirect(url('https://renewhealthcare.in/')), null)
  assert.equal(httpsRedirect(url('http://localhost:8787/')), null)
})

test('withSecurityHeaders: all headers on https production; x-powered-by removed; status kept', () => {
  const res = withSecurityHeaders(new Response('x', { status: 404, headers: { 'x-powered-by': 'Next.js' } }), url('https://renewhealthcare.in/a'))
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) assert.equal(res.headers.get(k), v, k)
  assert.equal(res.headers.get('x-powered-by'), null)
  assert.equal(res.status, 404)
})

test('withSecurityHeaders: no HSTS off production https; existing headers win', () => {
  const res = withSecurityHeaders(new Response('x', { headers: { 'X-Frame-Options': 'DENY' } }), url('http://localhost:8787/'))
  assert.equal(res.headers.get('strict-transport-security'), null)
  assert.equal(res.headers.get('x-frame-options'), 'DENY')
})

test('RH-05: the five duplicate pairs retire the older URL onto the newest one (owner decision 18 Oct)', () => {
  const expected = {
    '/blogs/antagonist-vs-long-protocol-calendar': '/blogs/antagonist-vs-long-agonist-protocol-your-ivf-calendar-day-by-day',
    '/blogs/unused-embryos-india-10-year-rule': '/blogs/what-happens-to-unused-embryos-in-india-the-10-year-rule-and-your-real-choices',
    '/blogs/endometriosis-and-fertility': '/blogs/endometriosis-and-fertility-from-diagnosis-to-ivf',
    // Since 24 Oct 2026 the survivor is retired by the website brief (task 11.27), so this goes straight to its destination.
    '/blogs/can-you-get-pregnant-with-amh-below-1': '/blogs/the-link-between-amh-levels-and-ivf-success-what-the-science-says',
    '/blogs/the-power-of-genetics-in-ivf': '/blogs/genetic-testing-in-ivf',
  }
  for (const [from, to] of Object.entries(expected)) assert.equal(DUPLICATE_REDIRECTS.get(from), to, from)
  // No surviving URL is itself retired (that would create a redirect chain).
  for (const to of DUPLICATE_REDIRECTS.values()) assert.equal(DUPLICATE_REDIRECTS.has(to), false, to)
})

test('doctor-written Placentrex page: exact meta, byline data, Person author, brief FAQ, Bengali page redirected', async () => {
  const { getDoctorArticle, DOCTOR_BYLINE, formatLastUpdated } = await import('../src/lib/doctorArticles.js')
  const { buildArticleSchemas } = await import('../src/lib/blogSeo.js')
  const { DUPLICATE_REDIRECTS, RETIRED_BLOG_SLUGS } = await import('../src/lib/seoDuplicates.js')
  const slug = 'placentrex-injection-uses-benefits-risks-dosage'
  const doc = getDoctorArticle(slug)
  assert.equal(doc.metaTitle, 'Placentrex Injection in Pregnancy & Infertility: Evidence | Dr Rajeev Agarwal')
  assert.equal(DOCTOR_BYLINE, 'Written by Dr. Rajeev Agarwal, MBBS, MD (Obstetrics & Gynaecology)')
  assert.equal(formatLastUpdated(doc.updated), 'October 23, 2026')
  const schemas = buildArticleSchemas({ slug, title: 'T', iso: '2026-03-23' }, '<h2>FAQ</h2><h3>Q?</h3><p>A</p>')
  const posting = schemas.find((x) => x['@type'] === 'BlogPosting')
  assert.equal(posting.author['@type'], 'Person')
  assert.equal(posting.dateModified, '2026-10-23')
  const faq = schemas.find((x) => x['@type'] === 'FAQPage')
  assert.equal(faq.mainEntity.length, 4)
  assert.equal(faq.mainEntity[0].name, 'What is Placentrex injection?')
  assert.equal(DUPLICATE_REDIRECTS.get('/blogs/placentrex-infertility-treatment-bengali'), `/blogs/${slug}`)
  assert.ok(RETIRED_BLOG_SLUGS.has('placentrex-infertility-treatment-bengali'))
  assert.equal(getDoctorArticle('bulky-uterus-symptoms-causes-treatment'), null)
})
