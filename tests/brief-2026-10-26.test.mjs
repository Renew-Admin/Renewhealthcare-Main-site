// Client-confirmed updates of 26 Oct 2026: the Salt Lake number (A4), doctor
// council registrations (B1), branch PIN codes (B2) and the Gariahat map (B4),
// plus the contact page's clinic list, which still had the WordPress-era
// addresses.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { locations } from '../src/data/locations.js'
import { contactPage } from '../src/data/finalPageLookup.js'
import { branchContact, contactForPath } from '../src/lib/branchContacts.js'
import { locationClinicSchema, physicianSchema } from '../src/lib/nextSeo.js'
import { buildDoctorList } from '../src/lib/doctorsModel.js'
import { DOCTOR_REGISTRATIONS, formatRegistration } from '../src/lib/doctorRegistrations.js'

const source = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')
const bySlug = Object.fromEntries(locations.map((location) => [location.slug, location]))

test('A4: Salt Lake uses +91 6292312076 on its page, in its schema and in every clinic list', () => {
  const saltlake = bySlug.saltlake
  assert.equal(saltlake.phone, '+91 6292312076')
  assert.equal(locationClinicSchema(saltlake).telephone, '+91 6292312076')
  const contact = branchContact(saltlake)
  assert.equal(contact.tel, 'tel:06292312076')
  assert.equal(contact.phoneDisplay, '062923 12076')
  assert.equal(contactForPath('/locations/saltlake/').tel, 'tel:06292312076')

  for (const path of ['../src/components/SiteFooter/SiteFooter.js', '../src/views/FinalContentPage.jsx']) {
    assert.ok(source(path).includes("address: 'CB 69, CB Block, Sector 1, Bidhannagar, Kolkata 700064',\n    phone: '+91 6292312076',"), path)
  }
  // The old conflicting value was the Gariahat line; it must not come back
  // on Salt Lake, and Gariahat and Jamshedpur keep their own numbers.
  assert.notEqual(saltlake.phone.replace(/\D/g, ''), '916292269060')
  assert.equal(bySlug.gariahat.phone, '+91 62922 69060')
  assert.equal(bySlug.jamshedpur.phone, '+91 62922 69061')
})

test('B1: council registration numbers exactly as the client supplied them; none for Dr. Sonam Agarwal', () => {
  const expected = {
    'dr-rajeev-agarwal': 'WBMC 52540',
    'dr-dorothy-p-ghosh': 'WBMC 56403',
    'dr-arnab-kundu': 'WBMC 67050',
    'dr-neha-yadav': 'WBMC 85882',
  }
  assert.deepEqual(Object.keys(DOCTOR_REGISTRATIONS).sort(), Object.keys(expected).sort())
  // Same list whether the doctors come from src/data/doctors.js or the CMS.
  for (const list of [buildDoctorList([]), buildDoctorList(Object.keys(expected).map((slug) => ({ name: buildDoctorList([]).find((d) => d.slug === slug).name })))]) {
    for (const [slug, number] of Object.entries(expected)) {
      const doctor = list.find((item) => item.slug === slug)
      assert.equal(doctor.registration.number, number, slug)
      assert.equal(formatRegistration(doctor.registration), `West Bengal Medical Council Reg. No. ${number}`, slug)
      assert.equal(physicianSchema(doctor).identifier.value, number, slug)
    }
  }
  const sonam = buildDoctorList([]).find((doctor) => doctor.slug === 'dr-sonam-agarwal')
  assert.equal(sonam.registration, null)
  assert.equal(formatRegistration(sonam.registration), '')
  assert.equal(physicianSchema(sonam).identifier, undefined)
})

test('B2: each branch carries its own PIN in every address copy and in its schema', () => {
  const pins = { gariahat: '700019', saltlake: '700064', jamshedpur: '831001' }
  for (const [slug, pin] of Object.entries(pins)) {
    const location = bySlug[slug]
    assert.ok(location.address.endsWith(` ${pin}`), slug)
    assert.ok(location.gbpAddress.endsWith(` ${pin}`), slug)
    assert.equal(location.postalAddress.postalCode, pin, slug)
    assert.equal(locationClinicSchema(location).address.postalCode, pin, slug)
    for (const path of ['../src/components/SiteFooter/SiteFooter.js', '../src/views/FinalContentPage.jsx']) {
      assert.ok(source(path).includes(`address: '${location.address}'`), `${path} ${slug}`)
    }
  }
})

test('contact page clinic list uses the current branch addresses and hours', () => {
  const [clinics, timings] = contactPage.sections
  for (const location of locations) assert.ok(clinics.body.includes(location.address), location.slug)
  assert.doesNotMatch(clinics.body, /EN-26|Sector V|Rafi Ahmed Kidwai/)
  assert.match(timings.body, /Monday to Saturday, 9:00 AM – 6:30 PM\. Closed on Sundays and bank holidays\./)
  assert.doesNotMatch(source('../src/views/FinalContentPage.jsx'), /6:00 PM/)
})

test('B4: Gariahat map is the client embed for the branch place, at street-level zoom', () => {
  const embed = new URL(bySlug.gariahat.mapEmbed)
  assert.equal(embed.origin + embed.pathname, 'https://www.google.com/maps/embed')
  const pb = embed.searchParams.get('pb')
  assert.match(pb, /!1s0x3a0277589dea95db:0x62e182948ab063d!2sRenew Healthcare!/)
  assert.ok(Number(pb.match(/!1d([\d.]+)/)[1]) < 5000, 'viewport under 5 km')
  assert.match(pb, /!2d88\.3669942!3d22\.5224052!/)
  // Roadmap, as in the client's embed; the other branches keep their maps.
  assert.match(pb, /!5e0!/)
  assert.match(bySlug.saltlake.mapEmbed, /0x3629f2d77c8e0af1/)
  assert.match(bySlug.jamshedpur.mapEmbed, /0x67728bfba5628131/)
  // Lazy-loaded, titled iframe on the location page.
  assert.match(source('../src/views/LocationPage.jsx'), /<iframe src=\{location\.mapEmbed\} loading="lazy"[^>]*title=/)
})
