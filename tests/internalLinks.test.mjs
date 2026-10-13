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

// RH-03 — tag-archive anchors become plain spans (the site has no tag pages).
test('RH-03 tag anchor becomes a span, nested markup survives, next anchor untouched', () => {
  const html = '<p><a href="/blogs/tag/the-era-test"><b>The ERA test</b></a> is covered in <a href="/blogs/what-is-era">this article</a>.</p>'
  const { html: out, changed, unresolved } = rewriteInternalLinks(html, context)
  assert.equal(out, '<p><span><b>The ERA test</b></span> is covered in <a href="/blogs/what-is-era">this article</a>.</p>')
  assert.equal(changed, 1)
  assert.deepEqual(unresolved, [])
})

test('RH-03 keeps the class attribute and handles absolute, trailing-slash and single-quoted hrefs', () => {
  const html = [
    '<a class="tag-link" href="https://renewhealthcare.in/blogs/tag/egg-freezing/">Egg Freezing</a>',
    ' | ',
    "<a href='/blogs/tag/best-age-to-freeze-eggs' rel=\"tag\">Best Age</a>",
    ' | ',
    '<a href="/services/laparoscopy">Laparoscopy</a>',
  ].join('')
  const { html: out, changed } = rewriteInternalLinks(html, { blogSlugs, routePaths: new Set([...routePaths, '/services/laparoscopy']) })
  assert.equal(out, '<span class="tag-link">Egg Freezing</span> | <span>Best Age</span> | <a href="/services/laparoscopy">Laparoscopy</a>')
  assert.equal(changed, 2)
})

test('RH-03 a tag archive on another site is not touched', () => {
  const html = '<a href="https://example.com/blogs/tag/ivf">external</a>'
  const { html: out, changed } = rewriteInternalLinks(html, context)
  assert.equal(out, html)
  assert.equal(changed, 0)
})

// RH-04 / RH-13 — utm_* parameters are stripped from internal links; the
// chatgpt.com attribution tag is stripped from every link.
test('RH-04 internal link with only utm parameters loses its query string', () => {
  const html = '<a href="/services/tesa-pesa?utm_source=chatgpt.com">TESA</a>'
  const { html: out, changed } = rewriteInternalLinks(html, context)
  assert.equal(out, '<a href="/services/tesa-pesa">TESA</a>')
  assert.equal(changed, 1)
})

test('RH-04 internal link keeps non-utm parameters', () => {
  const html = '<a href="/contact?utm_source=newsletter&amp;ref=blog&amp;utm_medium=email">Contact</a>'
  const { html: out, changed } = rewriteInternalLinks(html, context)
  assert.equal(out, '<a href="/contact?ref=blog">Contact</a>')
  assert.equal(changed, 1)
})

test('RH-04 internal link keeps its hash', () => {
  const html = '<a href="/?utm_source=chatgpt.com#faq">FAQ</a>'
  const { html: out, changed } = rewriteInternalLinks(html, context)
  assert.equal(out, '<a href="/#faq">FAQ</a>')
  assert.equal(changed, 1)
})

test('RH-13 external link loses utm_source=chatgpt.com but keeps its other parameters', () => {
  const html = '<a href="https://academic.oup.com/humrep/article/35/1/1/5696364?login=false&utm_source=chatgpt.com" target="_blank">study</a>'
  const { html: out, changed } = rewriteInternalLinks(html, context)
  assert.equal(out, '<a href="https://academic.oup.com/humrep/article/35/1/1/5696364?login=false" target="_blank">study</a>')
  assert.equal(changed, 1)
})

test('RH-13 external link with a different utm_source is unchanged', () => {
  const html = '<a href="https://www.who.int/news?utm_source=newsletter">WHO</a>'
  const { html: out, changed } = rewriteInternalLinks(html, context)
  assert.equal(out, html)
  assert.equal(changed, 0)
})

// RH-02 follow-up — a path with no live destination is unlinked at render time
// so CMS-served copies of the article lose the dead link too.
test('RH-02 an anchor to /how-can-you-access-ipgc becomes plain text, other anchors untouched', () => {
  const html = '<p>the <a href="/how-can-you-access-ipgc">standard care protocol</a> and <a href="https://renewhealthcare.in/how-can-you-access-ipgc/">again</a>, see <a href="/services/high-risk-pregnancy-management">this</a>.</p>'
  const { html: out, changed } = rewriteInternalLinks(html, { blogSlugs: new Set(), routePaths: new Set(['/services/high-risk-pregnancy-management']) })
  assert.equal(out, '<p>the <span>standard care protocol</span> and <span>again</span>, see <a href="/services/high-risk-pregnancy-management">this</a>.</p>')
  assert.equal(changed, 2)
})

// RH-10/RH-11/RH-12 — moved external citations are rewritten at render time
// so the Supabase-served copies match the corrected static files.
test('RH-10 moved external citations are rewritten, others untouched', () => {
  const html = '<a href="http://my.clevelandclinic.org/health/articles/23439-ovulation">ovulation</a> <a href="https://www.mayoclinic.org/diseases-conditions/ovarian-hyperstimulation-syndrome/symptoms-causes/syc-20354697?utm_source=chatgpt.com">OHSS</a> <a href="https://advancedfertility.com/ivf-in-detail/embryo-transfer/">ET</a> <a href="https://www.mayoclinic.org/diseases-conditions/preeclampsia/symptoms-causes/syc-20355745">keep</a>'
  const { html: out, changed } = rewriteInternalLinks(html, { blogSlugs: new Set(), routePaths: new Set() })
  assert.equal(out, '<a href="https://my.clevelandclinic.org/health/articles/23439-ovulation">ovulation</a> <a href="https://www.mayoclinic.org/diseases-conditions/ovarian-hyperstimulation-syndrome-ohss/symptoms-causes/syc-20354697">OHSS</a> <a href="https://www.advancedfertility.com/ivf-in-detail/embryo-transfer">ET</a> <a href="https://www.mayoclinic.org/diseases-conditions/preeclampsia/symptoms-causes/syc-20355745">keep</a>')
  assert.equal(changed, 3)
})
