// Client checklist of 29 Oct 2026: Dr. Rajeev Agarwal's qualifications and
// experience (item 2), a doctor author box under every article (item 3),
// the branch photos (item 4) and the directions section (item 5).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'

import { doctors } from '../src/data/doctors.js'
import { locations } from '../src/data/locations.js'
import { buildDoctorList } from '../src/lib/doctorsModel.js'
import { articleAuthorship, reviewerSlugFor } from '../src/lib/articleAuthorship.js'
import { buildBlogPostingSchema } from '../src/lib/blogSeo.js'

const source = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')
const rajeev = (list) => list.find((doctor) => doctor.slug === 'dr-rajeev-agarwal')

test('item 2: Dr. Agarwal is MBBS, MD (Obstetrics & Gynaecology) with 25+ years, even over a CMS row', () => {
  const fromCode = rajeev(buildDoctorList([]))
  assert.equal(fromCode.qualification, 'MBBS, MD (Obstetrics & Gynaecology)')
  assert.equal(fromCode.experience_years, '25+ years')
  assert.equal(rajeev(doctors).experience_years, '25+ years')

  // A CMS row with the old figure or another qualification cannot win.
  const fromCms = rajeev(buildDoctorList([{ name: 'Dr. Rajeev Agarwal', experience_years: '27 years', qualification: 'MBBS', qualifications: ['MBBS'] }, { name: 'Dr. Neha Yadav', experience_years: '11 years' }]))
  assert.equal(fromCms.experience_years, '25+ years')
  assert.equal(fromCms.qualification, 'MBBS, MD (Obstetrics & Gynaecology)')
  assert.deepEqual(fromCms.qualifications, ['MBBS, MD (Obstetrics & Gynaecology)'])
  // Other doctors keep their CMS values.
  assert.equal(buildDoctorList([{ name: 'Dr. Neha Yadav', experience_years: '11 years' }])[0].experience_years, '11 years')
})

test('item 2: no page still claims 27 years of experience', () => {
  for (const path of [
    '../src/data/doctors.js',
    '../src/views/AboutPage.jsx',
    '../src/views/SuccessStoriesPage.jsx',
    '../src/views/WhyRenewPage.jsx',
    '../src/components/AdShowcase/AdShowcase.js',
    '../src/components/Hero/Hero.js',
  ]) {
    const text = source(path)
    assert.ok(!/'27\+'|'\+27'|value: 27\b|'27 years'/.test(text), path)
  }
})

test('item 3: every article ends with a doctor box: photo, name, qualifications, registration, profile link', () => {
  for (const slug of ['placentrex-injection-uses-benefits-risks-dosage', 'what-is-embryo-glue', 'unexplained-infertility-next-steps']) {
    const box = articleAuthorship({ slug, iso: '2025-01-10', modifiedIso: '2026-10-22' })
    assert.equal(box.name, 'Dr. Rajeev Agarwal', slug)
    assert.equal(box.photo, '/images/renew/uploads/2026/05/Dr-Rajeev-Agarwal.webp', slug)
    assert.equal(box.qualifications, 'MBBS, MD (Obstetrics & Gynaecology)', slug)
    assert.equal(box.registration, 'West Bengal Medical Council Reg. No. WBMC 52540', slug)
    assert.equal(box.url, '/doctor/dr-rajeev-agarwal', slug)
  }
  // Not his own text: he is named as reviewer, Renew Healthcare as publisher.
  const reviewed = articleAuthorship({ slug: 'what-is-embryo-glue' })
  assert.equal(reviewed.heading, 'Medically reviewed by')
  assert.deepEqual(reviewed.publisher, { name: 'Renew Healthcare', url: '/about-us' })
  assert.equal(articleAuthorship({ slug: 'placentrex-injection-uses-benefits-risks-dosage' }).heading, 'Written by')
})

test('item 5: the directions section shows only filled-in lines', () => {
  for (const location of locations) {
    assert.deepEqual(Object.keys(location.directions).sort(), ['landmark', 'parking', 'road', 'transit'], location.slug)
  }
  const page = source('../src/views/LocationPage.jsx')
  assert.match(page, /directions\.length > 0 &&/)
  assert.match(page, /How To Reach Us/)
})

test('item 4: every branch photo exists, has its own alt text, and the new ones are WebP', () => {
  const publicDir = new URL('../public', import.meta.url).pathname
  const counts = {}
  for (const location of locations) {
    counts[location.slug] = location.gallery.length
    for (const photo of location.gallery) {
      assert.ok(existsSync(decodeURIComponent(publicDir) + photo.src), photo.src)
      assert.ok(photo.alt && photo.alt.length > 20, photo.src)
      if (photo.src.includes('/2026/10/')) assert.match(photo.src, /\.webp$/)
    }
  }
  assert.deepEqual(counts, { saltlake: 6, jamshedpur: 4, gariahat: 3 })
  // The generic site banner is no longer passed off as a Gariahat photo.
  assert.ok(!JSON.stringify(locations).includes('Inner-Page-Banner-2'))
})

test('item 3: the reviewer is the doctor the article names; Dr. Agarwal when it names none', () => {
  const arnabHtml = '<p>For personalised IVF planning, you can consult <a href="/doctor/dr-arnab-kundu">Dr. Arnab Kundu</a> at Renew Healthcare.</p>'
  const nehaHtml = '<p>Book a consultation with Dr. Neha Yadav at our Salt Lake clinic. Later: Dr. Arnab Kundu.</p>'
  const bengaliHtml = '<p>Dr. Arnab Kundu-র সঙ্গে পরামর্শ করুন</p>'

  assert.equal(reviewerSlugFor(arnabHtml), 'dr-arnab-kundu')
  assert.equal(reviewerSlugFor(nehaHtml), 'dr-neha-yadav') // named first
  assert.equal(reviewerSlugFor(bengaliHtml), 'dr-arnab-kundu')
  assert.equal(reviewerSlugFor('<p>No doctor named. Dr. Rajeev Agarwal leads the team.</p>'), 'dr-rajeev-agarwal')
  assert.equal(reviewerSlugFor(''), 'dr-rajeev-agarwal')

  const arnab = articleAuthorship({ slug: 'failed-ivf-cycle-what-next', modifiedIso: '2026-10-20' }, arnabHtml)
  assert.equal(arnab.name, 'Dr. Arnab Kundu')
  assert.equal(arnab.qualifications, 'MBBS, DGO, DNB (Obstetrics & Gynaecology)')
  assert.equal(arnab.registration, 'West Bengal Medical Council Reg. No. WBMC 67050')
  assert.equal(arnab.url, '/doctor/dr-arnab-kundu')
  assert.ok(arnab.photo)
  assert.equal(arnab.dateLabel, 'Last updated')
  assert.equal(arnab.dateIso, '2026-10-20')
  assert.equal(`Medically reviewed by ${arnab.reviewer.name}, ${arnab.reviewer.credentials}`, 'Medically reviewed by Dr. Arnab Kundu, MBBS, DGO, DNB (O&G), WBMC 67050')

  const neha = articleAuthorship({ slug: 'embryo-transfer-day-what-happens' }, nehaHtml)
  assert.equal(neha.name, 'Dr. Neha Yadav')
  assert.equal(neha.registration, 'West Bengal Medical Council Reg. No. WBMC 85882')
  assert.equal(neha.url, '/doctor/dr-neha-yadav')
  assert.equal(neha.reviewer.credentials, 'WBMC 85882')

  // Schema agrees with the box; his own pages stay "Written by" him.
  assert.equal(buildBlogPostingSchema({ slug: 'failed-ivf-cycle-what-next', title: 'T' }, { html: arnabHtml }).reviewedBy.name, 'Dr. Arnab Kundu')
  assert.equal(articleAuthorship({ slug: 'placentrex-injection-uses-benefits-risks-dosage' }, arnabHtml).name, 'Dr. Rajeev Agarwal')
})

test('item 6: the unexplained-infertility redirect switches on only once the new article is live', async () => {
  const { PENDING_EXTERNAL_REDIRECTS, getLiveExternalRedirects } = await import('../src/lib/externalRedirects.js')
  const [pair] = PENDING_EXTERNAL_REDIRECTS
  assert.equal(pair.from, '/blogs/unexplained-infertility-next-steps')
  assert.match(pair.to, /^https:\/\/drrajeevagarwal\.co\.in\//)

  const answer = (status, url) => async () => ({ status, url })
  assert.deepEqual(await getLiveExternalRedirects({ fetchImpl: answer(404, pair.to) }), [])
  // Redirected elsewhere (e.g. to the home page) does not count as live.
  assert.deepEqual(await getLiveExternalRedirects({ fetchImpl: answer(200, 'https://drrajeevagarwal.co.in/') }), [])
  assert.deepEqual(await getLiveExternalRedirects({ fetchImpl: async () => { throw new Error('offline') } }), [])
  assert.deepEqual(await getLiveExternalRedirects({ fetchImpl: answer(200, pair.to) }), [[pair.from, pair.to]])
  // Offline builds never check, so never redirect.
  assert.deepEqual(await getLiveExternalRedirects({ offline: true, fetchImpl: answer(200, pair.to) }), [])
})

test('item 5: every branch has landmark, road, transport and parking directions', () => {
  for (const location of locations) {
    for (const field of ['landmark', 'road', 'transit', 'parking']) {
      assert.ok(location.directions[field].length > 20, `${location.slug} ${field}`)
    }
  }
})
