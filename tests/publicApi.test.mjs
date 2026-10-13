// Tests for the public blog query (PERF-R4) and the press list (RH-07) —
// run with `npm test` (node:test, no deps).
import { test } from 'node:test'
import assert from 'node:assert/strict'

// publicApi reads its config at import time, so set it before importing.
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
const { POST_LIST_COLUMNS, fetchPublishedPostRows } = await import('../src/lib/publicApi.js')
const { toBlog } = await import('../src/lib/blogRow.js')
const { newsItems } = await import('../src/data/homeFeatures.js')

const FULL_ROW = {
  id: 'b7c1',
  slug: 'what-is-era',
  title: 'What is ERA?',
  excerpt: 'Endometrial receptivity analysis explained.',
  category: 'IVF & IUI',
  content: '<p>Full article HTML that the listing never shows.</p>',
  cover_image: 'https://example.supabase.co/storage/v1/object/public/blog-images/era.webp',
  published: true,
  published_at: '2026-09-01T10:00:00Z',
  created_at: '2026-08-30T10:00:00Z',
  updated_at: '2026-09-02T10:00:00Z',
  read_mins: 7,
  is_featured: true,
}

// Every field the homepage and /blogs cards render (HomeSections, BlogListPage).
const CARD_FIELDS = ['slug', 'title', 'category', 'excerpt', 'image', 'readMins', 'isFeatured', 'iso', 'date']

test('PERF-R4: the browser blog query selects the listing columns, not content', async () => {
  const requested = []
  const realFetch = globalThis.fetch
  globalThis.fetch = async (url) => {
    requested.push(String(url))
    return new Response('[]', { status: 200 })
  }
  try {
    await fetchPublishedPostRows()
  } finally {
    globalThis.fetch = realFetch
  }
  assert.equal(requested.length, 1)
  const select = new URL(requested[0]).searchParams.get('select')
  assert.equal(select, POST_LIST_COLUMNS)
  assert.ok(!select.split(',').includes('content'))
  assert.ok(!select.includes('*'))
})

test('PERF-R4: a row trimmed to the listing columns renders the same card', () => {
  const trimmed = Object.fromEntries(POST_LIST_COLUMNS.split(',').map((column) => [column, FULL_ROW[column]]))
  const full = toBlog(FULL_ROW)
  const slim = toBlog(trimmed)
  CARD_FIELDS.forEach((field) => assert.deepEqual(slim[field], full[field], field))
})

test('RH-07: the press list carries no link to the removed OnlyMyHealth article', () => {
  assert.ok(newsItems.length > 0)
  assert.ok(newsItems.every((item) => !item.link.includes('onlymyhealth.com')))
})
