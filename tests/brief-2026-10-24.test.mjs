// Website brief for renewhealthcare.in, owner's check of 23 Oct 2026,
// executed 24 Oct 2026: removed off-topic articles (410), the injection page
// out of search, branch-specific call/WhatsApp lines, the Jamshedpur PIN,
// council registration on doctor pages, and the article author box.
import { test } from 'node:test'
import assert from 'node:assert/strict'

import { REMOVED_BLOG_SLUGS, isRemovedPath, removedPageResponse } from '../src/lib/seoRemoved.js'
import { getStaticDirectory } from '../src/lib/blogDirectory.js'
import { buildBlogListing } from '../src/lib/blogListing.js'
import { getAllSeoRoutes, getSeoForPath } from '../src/lib/seoRoutes.js'
import { buildSitemapEntries } from '../src/lib/sitemap.js'
import { BRANCH_WHATSAPP, SITE_CONTACT, branchContact, contactForPath, directionsUrl, formatPhone } from '../src/lib/branchContacts.js'
import { OPENING_HOURS, locations } from '../src/data/locations.js'
import { locationClinicSchema } from '../src/lib/nextSeo.js'
import { buildBlogPostingSchema } from '../src/lib/blogSeo.js'
import { buildDoctorList } from '../src/lib/doctorsModel.js'
import { physicianSchema } from '../src/lib/nextSeo.js'
import { articleAuthorship, ARTICLE_REVIEWER } from '../src/lib/articleAuthorship.js'
import { getArticleSeoOverride } from '../src/lib/articleSeoOverrides.js'

const REMOVED = [
  'what-is-nightfall-in-men-causes-myths-health-effects',
  'sperm-cramps-in-men',
  'what-is-usg-full-form',
]

test('the three off-topic articles answer 410 Gone, with or without the trailing slash', () => {
  for (const slug of REMOVED) {
    assert.ok(REMOVED_BLOG_SLUGS.has(slug), slug)
    for (const path of [`/blogs/${slug}`, `/blogs/${slug}/`]) {
      const res = removedPageResponse(new URL(`https://renewhealthcare.in${path}`))
      assert.equal(res.status, 410, path)
      assert.equal(res.headers.get('x-robots-tag'), 'noindex, nofollow')
    }
  }
  assert.equal(removedPageResponse(new URL('https://renewhealthcare.in/blogs/what-is-embryo-glue')), null)
  assert.equal(isRemovedPath('/blogs'), false)
  // Dr. Agarwal's Placentrex article (23 Oct brief) stays live.
  assert.equal(isRemovedPath('/blogs/placentrex-injection-uses-benefits-risks-dosage'), false)
})

test('removed articles are out of the directory, the listing, the route manifest and the sitemaps', () => {
  const directory = getStaticDirectory()
  const listing = buildBlogListing(directory)
  const routes = getAllSeoRoutes().map((route) => route.path)
  const sitemap = buildSitemapEntries(directory).map((entry) => entry.path)
  for (const slug of REMOVED) {
    assert.equal(directory.some((item) => item.slug === slug), false, `directory ${slug}`)
    assert.equal(listing.some((item) => item.slug === slug), false, `listing ${slug}`)
    assert.equal(routes.includes(`/blogs/${slug}`), false, `routes ${slug}`)
    assert.equal(sitemap.includes(`/blogs/${slug}`), false, `sitemap ${slug}`)
  }
})

test('/injection-instruction stays reachable but is noindex and out of the sitemaps', () => {
  assert.equal(getSeoForPath('/injection-instruction').robots, 'noindex, follow')
  const sitemap = buildSitemapEntries(getStaticDirectory()).map((entry) => entry.path)
  assert.equal(sitemap.includes('/injection-instruction'), false)
  // Nothing else in finalPages was touched.
  assert.equal(getSeoForPath('/contact').robots, 'index, follow')
})

test('branch pages reach their own clinic; other pages keep the site-wide pair', () => {
  assert.deepEqual(formatPhone('+91 62922 69061'), { display: '062922 69061', tel: 'tel:06292269061' })
  assert.deepEqual(formatPhone('+91 6292312076'), { display: '062923 12076', tel: 'tel:06292312076' })

  // Owner's confirmation, 24 Oct 2026: each branch's own line for calls, the
  // central WhatsApp (+91 62923 12116) with the branch named in the message.
  assert.equal(BRANCH_WHATSAPP, '916292312116')
  const jamshedpur = contactForPath('/locations/jamshedpur')
  assert.equal(jamshedpur.tel, 'tel:06292269061')
  assert.equal(jamshedpur.phoneDisplay, '062922 69061')
  assert.equal(jamshedpur.whatsapp, BRANCH_WHATSAPP)
  assert.match(jamshedpur.message, /Jamshedpur/)

  const ballygunge = contactForPath('/locations/gariahat/')
  assert.equal(ballygunge.tel, 'tel:06292269060')
  assert.equal(ballygunge.whatsapp, BRANCH_WHATSAPP)
  assert.match(ballygunge.message, /Ballygunge/)

  const saltlake = contactForPath('/locations/saltlake')
  assert.equal(saltlake.tel, 'tel:06292269060')
  assert.equal(saltlake.whatsapp, BRANCH_WHATSAPP)
  assert.match(saltlake.message, /Saltlake/)

  for (const path of ['/', '/blogs/what-is-embryo-glue', '/locations', '/locations/nowhere']) {
    assert.equal(contactForPath(path), SITE_CONTACT, path)
  }
  assert.equal(SITE_CONTACT.tel, 'tel:06292312076')
  assert.equal(SITE_CONTACT.whatsapp, '916292269060')

  for (const location of locations) {
    const contact = branchContact(location)
    assert.ok(contact.tel.startsWith('tel:0'), location.slug)
    assert.match(directionsUrl(location), /^https:\/\/www\.google\.com\/maps\/dir\/\?api=1&destination=/, location.slug)
  }
})

test('the Jamshedpur address shows its PIN code and still matches its schema', () => {
  const jamshedpur = locations.find((location) => location.slug === 'jamshedpur')
  assert.match(jamshedpur.gbpAddress, /Jamshedpur 831001$/)
  assert.match(jamshedpur.address, /831001$/)
  assert.equal(jamshedpur.postalAddress.postalCode, '831001')
})

test('every branch page shows the owner-confirmed hours, on the page and in its schema', () => {
  assert.equal(OPENING_HOURS, 'Monday to Saturday, 9:00 AM – 6:30 PM')
  for (const location of locations) {
    assert.equal(location.hours, OPENING_HOURS, location.slug)
    const [spec] = locationClinicSchema(location).openingHoursSpecification
    assert.deepEqual(spec.dayOfWeek, ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
    assert.equal(spec.opens, '09:00')
    assert.equal(spec.closes, '18:30')
  }
  // Phones as confirmed on 24 Oct 2026.
  const phones = Object.fromEntries(locations.map((location) => [location.slug, location.phone]))
  assert.deepEqual(phones, { saltlake: '+91 62922 69060', jamshedpur: '+91 62922 69061', gariahat: '+91 62922 69060' })
})

test('doctor pages carry the council registration number where one is on file', () => {
  const doctors = buildDoctorList([])
  const rajeev = doctors.find((doctor) => doctor.slug === 'dr-rajeev-agarwal')
  assert.deepEqual(rajeev.registration, { council: 'West Bengal Medical Council', number: 'WBMC52540' })
  const schema = physicianSchema(rajeev)
  assert.deepEqual(schema.identifier, {
    '@type': 'PropertyValue',
    propertyID: 'West Bengal Medical Council Registration No.',
    value: 'WBMC52540',
  })
  // Doctors whose number is still pending get no registration, not a placeholder.
  const dorothy = doctors.find((doctor) => doctor.slug === 'dr-dorothy-p-ghosh')
  assert.equal(dorothy.registration, null)
  assert.equal(physicianSchema(dorothy).identifier, undefined)
  // The same holds when the list comes from the CMS.
  const remote = buildDoctorList([{ name: 'Dr. Rajeev Agarwal' }, { name: 'Dr. Dorothy P Ghosh' }])
  assert.equal(remote.find((doctor) => doctor.slug === 'dr-rajeev-agarwal').registration.number, 'WBMC52540')
  assert.equal(remote.find((doctor) => doctor.slug === 'dr-dorothy-p-ghosh').registration, null)
})

test('author box: Dr. Agarwal on his own pages, Renew Healthcare with a last-updated date elsewhere', () => {
  const doctor = articleAuthorship({ slug: 'placentrex-injection-uses-benefits-risks-dosage', iso: '2026-03-23', modifiedIso: '2026-10-23' })
  assert.equal(doctor.kind, 'doctor')
  assert.equal(doctor.name, 'Dr. Rajeev Agarwal')
  assert.equal(doctor.registration, 'West Bengal Medical Council Reg. No. WBMC52540')
  assert.equal(doctor.date, 'October 23, 2026')
  assert.equal(doctor.url, '/doctor/dr-rajeev-agarwal')

  // Owner's confirmation, 24 Oct 2026: every other article is medically
  // reviewed by Dr. Agarwal, worded exactly as the owner asked.
  const team = articleAuthorship({ slug: 'what-is-embryo-glue', iso: '2025-01-10', modifiedIso: '2026-10-22' })
  assert.equal(team.kind, 'team')
  assert.equal(team.name, 'Renew Healthcare')
  assert.equal(team.dateLabel, 'Last reviewed')
  assert.equal(team.dateIso, '2026-10-24')
  assert.equal(team.date, 'October 24, 2026')
  assert.equal(`Medically reviewed by ${team.reviewer.name}, ${team.reviewer.credentials}`, 'Medically reviewed by Dr. Rajeev Agarwal, MBBS, MD (O&G), WBMC52540')
  assert.equal(ARTICLE_REVIEWER.url, '/doctor/dr-rajeev-agarwal')
  const posting = buildBlogPostingSchema({ slug: 'what-is-embryo-glue', title: 'T', iso: '2025-01-10', modifiedIso: '2026-10-22' })
  assert.equal(posting.author['@type'], 'Organization')
  assert.equal(posting.reviewedBy.name, 'Dr. Rajeev Agarwal')
  assert.equal(posting.dateModified, '2026-10-22')
  // His own pages name him as the author, not as a reviewer of himself.
  assert.equal(buildBlogPostingSchema({ slug: 'placentrex-injection-uses-benefits-risks-dosage', title: 'T', iso: '2026-03-23' }).reviewedBy, undefined)
})

test('article title overrides: mechanism in place, list still pending from the brief', () => {
  assert.equal(getArticleSeoOverride('what-is-embryo-glue'), null)
})
