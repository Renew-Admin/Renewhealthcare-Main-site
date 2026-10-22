// Clears Next's data (fetch) cache before every build.
//
// Article bodies, the blog directory, doctors, FAQs and testimonials are
// fetched from Supabase while pages are prerendered. Next stores those
// responses in .next/cache/fetch-cache with a one-year lifetime, and Cloudflare
// Workers Builds restores .next/cache from the previous build. Without this
// step a rebuild reuses the old responses, so edits made in the admin panel to
// an existing post never reach the live page, even after a redeploy.
//
// Only the fetch cache is removed; the compiler cache (.next/cache/turbopack)
// is kept, so builds stay fast.
import { rmSync } from 'node:fs'

rmSync(new URL('../.next/cache/fetch-cache', import.meta.url), { recursive: true, force: true })
