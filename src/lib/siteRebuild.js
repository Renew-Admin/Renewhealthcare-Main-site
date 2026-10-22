// siteRebuild — server-side logic behind POST /api/rebuild.
//
// Pages are prerendered at build time, so an admin edit (a blog post, doctor,
// FAQ or testimonial) only reaches the live site after a new build. After each
// save the admin panel calls /api/rebuild, which checks that the caller is a
// signed-in admin and then calls the Cloudflare Workers Builds deploy hook.
//
// The deploy hook URL is a Worker secret (DEPLOY_HOOK_URL): anyone holding it
// can start builds, so it never reaches the browser.

/**
 * Returns true when `token` is a valid, unexpired Supabase session for this
 * project (the same sign-in the admin panel uses). Supabase checks the token
 * itself via GET /auth/v1/user, so no JWT secret is needed here.
 */
export async function isSignedInAdmin(token, { url, key }, fetchImpl = fetch) {
  if (!token || !url || !key) return false
  try {
    const response = await fetchImpl(`${url.replace(/\/+$/, '')}/auth/v1/user`, {
      headers: { apikey: key, authorization: `Bearer ${token}` },
    })
    if (!response.ok) return false
    const user = await response.json()
    return Boolean(user && user.id)
  } catch {
    return false
  }
}

/** Calls the deploy hook. Resolves to true when Cloudflare accepted the build. */
export async function triggerDeployHook(hookUrl, fetchImpl = fetch) {
  if (!hookUrl) return false
  try {
    const response = await fetchImpl(hookUrl, { method: 'POST' })
    return response.ok
  } catch {
    return false
  }
}

/** Allows at most `limit` builds per `windowMs` within one Worker isolate. */
export function createBuildLimiter({ limit = 12, windowMs = 10 * 60 * 1000, now = () => Date.now() } = {}) {
  let stamps = []
  return () => {
    const t = now()
    stamps = stamps.filter((s) => t - s < windowMs)
    if (stamps.length >= limit) return false
    stamps.push(t)
    return true
  }
}
