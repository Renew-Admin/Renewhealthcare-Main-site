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
import { BRANCH_WHATSAPP, CENTRAL_WHATSAPP, SITE_CONTACT, branchContact, contactForPath, directionsUrl, formatPhone } from '../src/lib/branchContacts.js'
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
  assert.equal(CENTRAL_WHATSAPP, '916292312116')
  assert.equal(BRANCH_WHATSAPP, CENTRAL_WHATSAPP)
  const jamshedpur = contactForPath('/locations/jamshedpur')
  assert.equal(jamshedpur.tel, 'tel:06292269061')
  assert.equal(jamshedpur.phoneDisplay, '062922 69061')
  assert.equal(jamshedpur.whatsapp, BRANCH_WHATSAPP)
  assert.match(jamshedpur.message, /Jamshedpur/)

  const ballygunge = contactForPath('/locations/gariahat/')
  assert.equal(ballygunge.tel, 'tel:06292269060')
  assert.equal(ballygunge.whatsapp, BRANCH_WHATSAPP)
  assert.match(ballygunge.message, /Mandeville Gardens centre/)
  assert.equal(ballygunge.shortName, 'Mandeville Gardens')

  const saltlake = contactForPath('/locations/saltlake')
  assert.equal(saltlake.tel, 'tel:06292269060')
  assert.equal(saltlake.whatsapp, BRANCH_WHATSAPP)
  assert.match(saltlake.message, /Salt Lake centre/)
  assert.equal(saltlake.shortName, 'Salt Lake')

  for (const path of ['/', '/blogs/what-is-embryo-glue', '/locations', '/locations/nowhere']) {
    assert.equal(contactForPath(path), SITE_CONTACT, path)
  }
  assert.equal(SITE_CONTACT.tel, 'tel:06292312076')
  // Owner, 24 Oct 2026: the site-wide button also uses the central line.
  assert.equal(SITE_CONTACT.whatsapp, CENTRAL_WHATSAPP)

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

test('the shared footer shows the Jamshedpur PIN code (task A6, 26 Oct 2026)', async () => {
  const { readFileSync } = await import('node:fs')
  const footer = readFileSync(new URL('../src/components/SiteFooter/SiteFooter.js', import.meta.url), 'utf8')
  assert.match(footer, /address: '1st Floor, Michael John Tower, 6 K Road, Bistupur, Jamshedpur 831001'/)
})

test('every copy of the Jamshedpur address carries PIN 831001 (26 Oct 2026)', async () => {
  const { readFileSync } = await import('node:fs')
  const { finalPages } = await import('../src/data/finalPages.js')
  const source = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')
  const withPin = /Bistupur, Jamshedpur 831001/g
  const withoutPin = /Bistupur, Jamshedpur(?! 831001)/
  for (const path of ['../src/components/SiteFooter/SiteFooter.js', '../src/views/FinalContentPage.jsx', '../src/data/finalPages.js']) {
    assert.doesNotMatch(source(path), withoutPin, path)
  }
  assert.equal(source('../src/views/FinalContentPage.jsx').match(withPin).length, 1)
  // "Locate Your Nearest IVF Center" on /injection-instruction and /mental-health.
  for (const key of ['injection-instruction', 'mental-health']) {
    const section = finalPages[key].sections.find((s) => s.heading === 'Locate Your Nearest IVF Center')
    assert.equal(section.body, '1st Floor, Michael John Tower, 6 K Road, Bistupur, Jamshedpur 831001', key)
  }
})

test('Salt Lake and Gariahat addresses and phones are unchanged by the Jamshedpur PIN fix', async () => {
  const { readFileSync } = await import('node:fs')
  // Current values, not confirmed ones: the Salt Lake number is still open
  // (task A4). Update these lines when the clinic confirms it.
  const kolkata = [
    ["'Ground Floor, 18 C, Mandeville Gardens, Ballygunge, Kolkata 700019'", "'+91 62922 69060'"],
    ["'CB 69, CB Block, Sector 1, Bidhannagar, Kolkata 700064'", "'+91 6292312076'"],
  ]
  for (const path of ['../src/components/SiteFooter/SiteFooter.js', '../src/views/FinalContentPage.jsx']) {
    const text = readFileSync(new URL(path, import.meta.url), 'utf8')
    for (const [address, phone] of kolkata) {
      assert.ok(text.includes(`address: ${address},\n    phone: ${phone},`), `${path}: ${address}`)
    }
  }
  const bySlug = Object.fromEntries(locations.map((location) => [location.slug, location]))
  assert.equal(bySlug.gariahat.address, 'Ground Floor, 18 C, Mandeville Gardens, Ballygunge, Kolkata 700019')
  assert.equal(bySlug.gariahat.phone, '+91 62922 69060')
  assert.equal(bySlug.saltlake.address, 'CB 69, CB Block, Sector 1, Bidhannagar, Kolkata 700064')
  assert.equal(bySlug.saltlake.phone, '+91 62922 69060')
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

test('consultation days (owner, 24 Oct 2026): per branch and per doctor; Jamshedpur still pending', async () => {
  const { consultationDaysForBranch, consultationDaysForDoctor } = await import('../src/lib/consultationDays.js')
  assert.deepEqual(consultationDaysForBranch('saltlake').map((e) => `${e.doctor}: ${e.days}`), [
    'Dr. Rajeev Agarwal: Wednesday and Friday',
    'Dr. Neha Yadav: Monday to Saturday',
  ])
  assert.deepEqual(consultationDaysForBranch('gariahat').map((e) => e.doctor), ['Dr. Rajeev Agarwal', 'Dr. Arnab Kundu', 'Dr. Sonam Agarwal'])
  assert.deepEqual(consultationDaysForBranch('jamshedpur').map((e) => `${e.doctor}: ${e.days}`), ['Dr. Dorothy P Ghosh: Monday to Saturday'])
  const rajeev = consultationDaysForDoctor('Dr. Rajeev Agarwal')
  assert.deepEqual(rajeev.map((e) => `${e.branch}: ${e.days}`), [
    'Salt Lake: Wednesday and Friday',
    'Mandeville Gardens, Ballygunge: Monday, Tuesday, Thursday and Saturday',
  ])
  assert.deepEqual(consultationDaysForDoctor('Dr. Dorothy P Ghosh').map((e) => `${e.branch}: ${e.days}`), ['Jamshedpur: Monday to Saturday'])
  // Closure rule, same at every branch (owner, 24 Oct 2026).
  const { locations: branches, OPENING_HOURS_SPECIFICATION } = await import('../src/data/locations.js')
  for (const branch of branches) assert.equal(branch.hoursNote, 'Closed on Sundays and bank holidays.', branch.slug)
  assert.ok(OPENING_HOURS_SPECIFICATION.some((spec) => spec.dayOfWeek === 'Sunday' && spec.opens === '00:00' && spec.closes === '00:00'))
  // Experience figure confirmed by the owner, used site-wide and on directories.
  const { doctors } = await import('../src/data/doctors.js')
  assert.equal(doctors.find((d) => d.slug === 'dr-rajeev-agarwal').experience_years, '27 years')
  assert.equal(doctors.find((d) => d.slug === 'dr-neha-yadav').experience_years, '')
})


test('website brief task 11: all 41 redirects are one-hop 301s to live pages; task 16: the seven exact titles', async () => {
  const { DUPLICATE_REDIRECTS, RETIRED_BLOG_SLUGS } = await import('../src/lib/seoDuplicates.js')
  const { ARTICLE_SEO_OVERRIDES } = await import('../src/lib/articleSeoOverrides.js')
  const { rewriteInternalLinks } = await import('../src/lib/internalLinks.js')
  const rows = `11.1	/blogs/cost-of-ivf-treatment-in-kolkata	/blogs/ivf-cost-in-kolkata
11.4	/blogs/complete-guide-to-ivf-treatment	/blogs/the-five-stages-of-ivf-treatment
11.12	/blogs/sperm-health-how-to-improve-motility-and-count-naturally	/blogs/foods-to-increase-sperm-count
11.21	/blogs/male-infertility-common-causes-and-solutions	/male-infertility
11.24	/blogs/sperm-extraction-procedure-in-azoospermia	/services/tesa-pesa
11.26	/blogs/what-is-a-good-amh-level-to-get-pregnant	/blogs/the-link-between-amh-levels-and-ivf-success-what-the-science-says
11.27	/blogs/can-you-get-pregnant-with-amh-below-1-real-answers	/blogs/the-link-between-amh-levels-and-ivf-success-what-the-science-says
11.29	/blogs/polycystic-ovarian-syndrome-pcos	/blogs/pcos-and-fertility-treatment
11.33	/blogs/the-power-of-genetics-in-ivf	/blogs/genetic-testing-in-ivf
11.37	/blogs/top-5-reasons-why-renew-healthcare-is-the-best-ivf-centre-in-kolkata	/blogs/how-to-choose-the-right-ivf-clinic
11.41	/blogs/common-myths-about-preconception-counselling	/blogs/pre-baby-health-plan-3-months-before-pregnancy`
  for (const line of rows.split('\n')) {
    const [num, from, to] = line.split('\t')
    assert.equal(DUPLICATE_REDIRECTS.get(from), to, num)
    assert.ok(RETIRED_BLOG_SLUGS.has(from.slice('/blogs/'.length)), `${num} unpublished`)
  }
  // 41 brief rows + 7 earlier pairs + Bengali Placentrex = 48 one-hop redirects, no chains.
  assert.equal(DUPLICATE_REDIRECTS.size, 48)
  for (const to of DUPLICATE_REDIRECTS.values()) assert.equal(DUPLICATE_REDIRECTS.has(to), false, to)
  // The old AMH survivor now goes straight to the final page (no two-hop chain).
  assert.equal(DUPLICATE_REDIRECTS.get('/blogs/can-you-get-pregnant-with-amh-below-1'), '/blogs/the-link-between-amh-levels-and-ivf-success-what-the-science-says')

  assert.deepEqual(ARTICLE_SEO_OVERRIDES['how-to-choose-the-right-ivf-clinic'], { metaTitle: 'How to Choose the Best IVF Centre in Kolkata | Renew' })
  assert.deepEqual(ARTICLE_SEO_OVERRIDES['egg-retrieval-process-a-complete-guide'], { metaTitle: 'Egg Retrieval in IVF: What to Expect | Renew' })
  assert.equal(Object.keys(ARTICLE_SEO_OVERRIDES).length, 7)

  // Task 8: in-body links to redirected pages follow the redirect; links to deleted pages are unlinked.
  const ctx = { blogSlugs: new Set(['ivf-cost-in-kolkata']), routePaths: new Set(['/blogs/ivf-cost-in-kolkata']) }
  const html = '<p><a href="/blogs/cost-of-ivf-treatment-in-kolkata">cost</a> <a class="x" href="/blogs/sperm-cramps-in-men">gone</a></p>'
  const out = rewriteInternalLinks(html, ctx).html
  assert.match(out, /href="\/blogs\/ivf-cost-in-kolkata"/)
  assert.match(out, /<span class="x">gone<\/span>/)
  assert.doesNotMatch(out, /sperm-cramps-in-men/)
})
