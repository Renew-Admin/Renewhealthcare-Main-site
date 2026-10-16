// POST /api/lead — forwards a website enquiry to the Make.com scenario.
//
// The Make.com webhook URL is a Worker secret (MAKE_WEBHOOK_URL), so it is
// never shipped to browsers. Requests are size-limited, schema-validated,
// honeypot-checked, origin-checked, rate-limited and de-duplicated before
// anything is forwarded. Form contents are never logged.
import { MAX_BODY_BYTES, createDuplicateGuard, createRateLimiter, validateLead } from '../../../lib/leadValidation.js'

const ALLOWED_ORIGINS = new Set(['https://renewhealthcare.in', 'https://www.renewhealthcare.in'])
const allow = createRateLimiter()
const isDuplicate = createDuplicateGuard()

const reply = (status, body) => Response.json(body, { status, headers: { 'cache-control': 'no-store' } })

export async function POST(request) {
  const origin = request.headers.get('origin') || ''
  if (!ALLOWED_ORIGINS.has(origin)) return reply(403, { ok: false, error: 'forbidden' })

  const declared = Number(request.headers.get('content-length') || 0)
  if (declared > MAX_BODY_BYTES) return reply(413, { ok: false, error: 'too_large' })
  if (!(request.headers.get('content-type') || '').includes('application/json')) {
    return reply(415, { ok: false, error: 'unsupported' })
  }

  const ip = request.headers.get('cf-connecting-ip') || 'unknown'
  if (!allow(ip)) return reply(429, { ok: false, error: 'rate_limited' })

  let raw
  try {
    raw = await request.text()
  } catch {
    return reply(400, { ok: false, error: 'invalid_body' })
  }
  if (raw.length > MAX_BODY_BYTES) return reply(413, { ok: false, error: 'too_large' })

  let input
  try {
    input = JSON.parse(raw)
  } catch {
    return reply(400, { ok: false, error: 'invalid_body' })
  }

  const result = validateLead(input)
  if (!result.ok) return reply(result.error === 'rejected' ? 200 : 422, { ok: result.error === 'rejected', error: result.error })
  const lead = result.lead

  const phoneKey = (lead.customer_number || lead.phone || '').replace(/\D/g, '')
  if (isDuplicate(`${phoneKey}:${lead.source}`)) return reply(200, { ok: true, duplicate: true })

  const webhook = process.env.MAKE_WEBHOOK_URL
  if (!webhook) {
    console.error('[api/lead] MAKE_WEBHOOK_URL is not configured')
    return reply(503, { ok: false, error: 'not_configured' })
  }

  try {
    const upstream = await fetch(webhook, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...lead, submitted_at: lead.submitted_at || new Date().toISOString() }),
    })
    if (!upstream.ok) {
      console.error('[api/lead] webhook responded', upstream.status)
      return reply(502, { ok: false, error: 'upstream' })
    }
  } catch {
    console.error('[api/lead] webhook unreachable')
    return reply(502, { ok: false, error: 'upstream' })
  }

  return reply(200, { ok: true })
}

export function GET() {
  return reply(405, { ok: false, error: 'method_not_allowed' })
}
