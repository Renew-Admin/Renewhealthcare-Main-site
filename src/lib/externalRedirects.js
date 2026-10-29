// externalRedirects — articles moving to Dr. Rajeev Agarwal's own site
// (drrajeevagarwal.co.in) that must redirect only once the new article is live.
//
// Checked at build time by redirects() in next.config.mjs: a pair is switched
// on only when its destination answers HTTP 200 without redirecting away. Every
// deploy rebuilds (merge to main, or an admin save via the deploy hook), so the
// redirect starts working with the first deploy after the article goes live,
// and never sends visitors to a missing page before that.
//
// Checklist item 6 (29 Oct 2026). The destination is the URL planned for the
// new article in the website brief (task E1); if it is published under another
// address, change `to` here.
export const PENDING_EXTERNAL_REDIRECTS = [
  {
    from: '/blogs/unexplained-infertility-next-steps',
    to: 'https://drrajeevagarwal.co.in/unexplained-infertility-all-reports-normal-not-pregnant/',
  },
]

const sameUrl = (a, b) => a.replace(/\/+$/, '') === b.replace(/\/+$/, '')

/** True when `url` answers 200 itself (a redirect to another page does not count). */
export async function isLive(url, { fetchImpl = fetch, timeoutMs = 8000 } = {}) {
  try {
    const response = await fetchImpl(url, { redirect: 'follow', signal: AbortSignal.timeout(timeoutMs) })
    return response.status === 200 && (!response.url || sameUrl(response.url, url))
  } catch {
    return false
  }
}

/**
 * The pending redirects whose destination is live now, as [from, to] pairs.
 * Offline builds never contact the network and switch nothing on.
 */
export async function getLiveExternalRedirects({ offline = false, fetchImpl = fetch } = {}) {
  if (offline) return []
  const checks = await Promise.all(
    PENDING_EXTERNAL_REDIRECTS.map(async (pair) => ((await isLive(pair.to, { fetchImpl })) ? [pair.from, pair.to] : null)),
  )
  return checks.filter(Boolean)
}
