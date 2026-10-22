// POST /api/rebuild — starts a site rebuild after an admin edit, so the change
// goes live in a few minutes without anyone opening Cloudflare.
//
// Only a signed-in admin (valid Supabase session in the Authorization header)
// from the site's own origin can call it. The deploy hook URL is the Worker
// secret DEPLOY_HOOK_URL; without it the endpoint answers 503 and the admin
// panel says the edit will go live at the next deploy.
import { createBuildLimiter, isSignedInAdmin, triggerDeployHook } from '../../../lib/siteRebuild.js'
import { serverSupabaseEnv } from '../../../lib/serverData.js'

const ALLOWED_ORIGINS = new Set(['https://renewhealthcare.in', 'https://www.renewhealthcare.in'])
const allowBuild = createBuildLimiter()

const reply = (status, body) => Response.json(body, { status, headers: { 'cache-control': 'no-store' } })

export async function POST(request) {
  const origin = request.headers.get('origin') || ''
  if (!ALLOWED_ORIGINS.has(origin)) return reply(403, { ok: false, error: 'forbidden' })

  const token = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '')
  const env = serverSupabaseEnv()
  const signedIn = await isSignedInAdmin(token, { url: env.SUPABASE_URL, key: env.SUPABASE_ANON_KEY })
  if (!signedIn) return reply(401, { ok: false, error: 'unauthorized' })

  const hookUrl = process.env.DEPLOY_HOOK_URL
  if (!hookUrl) return reply(503, { ok: false, error: 'not_configured' })

  if (!allowBuild()) return reply(429, { ok: false, error: 'rate_limited' })

  const started = await triggerDeployHook(hookUrl)
  return started ? reply(202, { ok: true }) : reply(502, { ok: false, error: 'hook_failed' })
}
