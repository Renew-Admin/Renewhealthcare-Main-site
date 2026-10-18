import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { RESPONSIVE_IMAGE_PATHS, srcSetFor } from '../src/lib/responsiveImages.js'

const publicDir = fileURLToPath(new URL('../public', import.meta.url))

test('srcSetFor: every candidate in every srcset exists in public/', () => {
  for (const src of RESPONSIVE_IMAGE_PATHS) {
    const set = srcSetFor(src)
    assert.ok(set, src)
    for (const candidate of set.split(', ')) {
      const [path, width] = candidate.split(' ')
      assert.match(width, /^\d+w$/, candidate)
      assert.ok(existsSync(publicDir + path), `missing ${path}`)
    }
  }
})

test('srcSetFor: unknown paths get no srcset', () => {
  assert.equal(srcSetFor('/images/renew/uploads/2025/03/renew-ivf-saltlake.jpg'), undefined)
  assert.equal(srcSetFor(''), undefined)
})

test('homepage WebP replacements exist next to the PNG originals', () => {
  for (const base of [
    '2025/01/Collage-Banner2', '2024/12/ivf-treatment-near-me', '2024/12/top-5-ivf-centre-in-kolkata',
    '2024/12/best-ivf-treatment-centre-in-kolkata', '2024/12/best-ivf-centre-in-kolkata',
    '2024/12/low-cost-ivf-hospital-in-kolkata', '2024/12/top-ivf-centre-in-kolkata', '2024/07/foter-logo',
  ]) {
    assert.ok(existsSync(`${publicDir}/images/renew/uploads/${base}.webp`), `${base}.webp`)
    assert.ok(existsSync(`${publicDir}/images/renew/uploads/${base}.png`), `${base}.png kept`)
  }
})
