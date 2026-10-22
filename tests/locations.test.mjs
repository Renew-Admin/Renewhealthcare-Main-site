import { test } from 'node:test'
import assert from 'node:assert/strict'

import { locations } from '../src/data/locations.js'
import { getSeoForPath } from '../src/lib/seoRoutes.js'
import { locationClinicSchema } from '../src/lib/nextSeo.js'

// Google Business Profile brief, 18 Oct 2026, tasks 30 and 32.
const TITLES = {
  saltlake: 'IVF and Fertility Centre in Salt Lake, Kolkata | Renew Healthcare',
  gariahat: 'IVF and Fertility Centre in Ballygunge, Kolkata | Renew Healthcare',
  jamshedpur: 'IVF and Fertility Centre in Bistupur, Jamshedpur | Renew Healthcare',
}

test('location pages carry the exact titles from the brief', () => {
  for (const [slug, title] of Object.entries(TITLES)) {
    assert.equal(getSeoForPath(`/locations/${slug}`).fullTitle, title, slug)
  }
})

test('location schema is MedicalClinic named "Renew Healthcare" with the profile address and phone', () => {
  for (const location of locations) {
    const schema = locationClinicSchema(location)
    assert.equal(schema['@type'], 'MedicalClinic')
    assert.equal(schema.name, 'Renew Healthcare', location.slug)
    assert.ok(schema.telephone, location.slug)
    assert.ok(location.gbpAddress.startsWith(schema.address.streetAddress), location.slug)
    assert.match(schema.hasMap, /^https:\/\/maps\.google\.com\/\?cid=\d+$/, location.slug)
  }
})

test('Gariahat page leads with the Google profile address', () => {
  assert.equal(locations.find((l) => l.slug === 'gariahat').firstLine, '18 C, Mandeville Gardens, Ballygunge')
})
