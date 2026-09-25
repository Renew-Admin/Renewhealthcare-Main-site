// OpenNext adapter config for deploying this Next.js app to Cloudflare Workers.
// See docs/NEXTJS-MIGRATION.md#cloudflare-deployment.
import { defineCloudflareConfig } from '@opennextjs/cloudflare'
import staticAssetsIncrementalCache from '@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache'

const config = defineCloudflareConfig({
  // Prerendered pages are served straight from Workers static assets, so the
  // deploy needs no extra Cloudflare resources (no R2 bucket or KV namespace).
  incrementalCache: staticAssetsIncrementalCache,
})

// `npm run build` runs the OpenNext build, which runs the Next.js build via
// this command (running `npm run build` again here would recurse).
config.buildCommand = 'npm run build:next'

export default config
