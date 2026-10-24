// Worker entry point: wraps the OpenNext-generated handler (.open-next/worker.js,
// produced by `npm run build`) with the edge hardening in src/lib/edgeSecurity.js.
// wrangler.toml points `main` here. The Durable Object classes are re-exported
// unchanged because wrangler expects them on the entry module.
import { httpsRedirect, withSecurityHeaders } from './src/lib/edgeSecurity.js'
import { removedPageResponse } from './src/lib/seoRemoved.js'
// @ts-ignore — generated at build time
import handler from './.open-next/worker.js'

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    const toHttps = httpsRedirect(url)
    if (toHttps) return withSecurityHeaders(toHttps, url)
    // Deleted pages answer 410 Gone before Next sees the request.
    const gone = removedPageResponse(url)
    if (gone) return withSecurityHeaders(gone, url)
    return withSecurityHeaders(await handler.fetch(request, env, ctx), url)
  },
}

// @ts-ignore — generated at build time
export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from './.open-next/worker.js'
