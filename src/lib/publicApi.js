// publicApi — the only Supabase calls the public website makes in the browser,
// as plain PostgREST requests with the public anon key.
//
// The public pages used to import @supabase/supabase-js (auth client,
// storage, realtime — ~220 KB) plus the admin CRUD module just to insert a
// lead and read a few rows. Those requests are made directly here instead;
// they are the same endpoints and the same RLS rules the SDK used. The admin
// panel still uses the full SDK (src/lib/supabase.js) in its own chunk.
const URL_BASE = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/+$/, '')
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const isPublicApiConfigured = Boolean(URL_BASE && ANON_KEY)

function headers(extra = {}) {
  return { apikey: ANON_KEY, authorization: `Bearer ${ANON_KEY}`, accept: 'application/json', ...extra }
}

async function errorMessage(response) {
  try {
    const body = await response.json()
    return body?.message || body?.error || `Request failed (${response.status})`
  } catch {
    return `Request failed (${response.status})`
  }
}

async function selectRows(table, query) {
  if (!isPublicApiConfigured) return []
  try {
    const response = await fetch(`${URL_BASE}/rest/v1/${table}?${query}`, { headers: headers() })
    if (!response.ok) throw new Error(await errorMessage(response))
    const rows = await response.json()
    return Array.isArray(rows) ? rows : []
  } catch (error) {
    console.warn(`[publicApi] ${table} read failed:`, error.message)
    return []
  }
}

/** Active rows of doctors / testimonials / faqs, in admin display order. Never throws. */
export function listActiveRows(table) {
  return selectRows(table, 'select=*&active=eq.true&order=display_order.asc,created_at.desc')
}

/** site_settings as a { key: value } map. Never throws. */
export async function fetchPublicSettings() {
  const rows = await selectRows('site_settings', 'select=*')
  return Object.fromEntries(rows.map((row) => [row.key, row.value]))
}

/** Published blog rows, newest first. Never throws. */
export function fetchPublishedPostRows() {
  return selectRows('blogs', 'select=*&published=eq.true&order=published_at.desc')
}

/** Insert one lead (anyone may insert; only admins can read). Throws on failure. */
export async function insertLeadRow(row) {
  if (!isPublicApiConfigured) return
  const response = await fetch(`${URL_BASE}/rest/v1/leads`, {
    method: 'POST',
    headers: headers({ 'content-type': 'application/json', prefer: 'return=minimal' }),
    body: JSON.stringify(row),
  })
  if (!response.ok) throw new Error(await errorMessage(response))
}
