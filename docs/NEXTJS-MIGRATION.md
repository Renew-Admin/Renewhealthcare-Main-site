# Next.js migration

The site moved from a client-rendered React + Vite SPA (empty
`<div id="root"></div>` until a 1.16 MB bundle ran) to the Next.js App Router
with server-rendered HTML. Every public URL now returns its headings, body
text, internal links, metadata and JSON-LD in the initial HTML response.

## Rendering per route

| Route | Mode | Data |
|---|---|---|
| `/services`, `/services/[slug]` (42) | SSG | `src/data/services.js` |
| `/about-us`, `/why-renew`, `/ivf-success-factors-and-rates`, `/news`, `/locations` | SSG | static data |
| `/[pageKey]` (contact, packages, policies, patient pages), `/course/[courseKey]` | SSG | `src/data/finalPages.js` |
| `/`, `/blogs`, `/doctors`, `/success-stories`, `/locations/[slug]` | SSG at deploy; lists refresh in the browser | Supabase (static fallback) |
| `/doctor/[slug]`, `/blogs/[slug]` | SSG at deploy; slugs added later render on request | Supabase + `public/blog-content` |
| `/*.xml` sitemaps | dynamic (every request) | blog directory + doctor list |
| `/admin/*` | client-only (no SSR), separate chunk | Supabase Auth + SDK |

Pages are rebuilt on every deploy. Between deploys, admin changes reach
visitors through the browser-side refresh in `useBlogs` / `useContent`, new
posts and doctors get a 200 page on their own URL straight away, and the
sitemaps are always live. Crawlers see the content as of the last deploy — so
redeploy after significant content changes (see "Fresher HTML" below).

## Where the old Worker's responsibilities went

| `src/worker.js` (deleted) | Now |
|---|---|
| Per-route `<title>`, description, canonical, robots, OG/Twitter rewritten into `<head>` | Next metadata (`generateMetadata`) from `src/lib/seoRoutes.js` via `src/lib/nextSeo.js` |
| Blog JSON-LD in `<head>` | `<JsonLd>` rendered in the page HTML (`src/components/JsonLd.js`) |
| 404 status + `noindex` for unknown URLs | `notFound()` / `dynamicParams = false` → real 404 with `noindex` |
| 410 for retired WordPress URLs | route handlers `src/app/comment.php`, `content.php`, `products/[id]` |
| 301 for retired duplicates (RH-02) and legacy blog paths | `redirects()` in `next.config.mjs` (same maps: `seoDuplicates.js`, `seoRoutes.js`) |
| 301 trailing slash | `redirects()` in `next.config.mjs` (`skipTrailingSlashRedirect`) |
| Live `sitemap.xml` / `post-sitemap.xml` | `src/app/*.xml/route.js` for all sitemaps |
| `/api/health` | `src/app/api/health/route.js` |
| `lang="bn"` for Bengali articles | `lang="bn"` on the `<article>` element (see limitations) |
| `x-robots-tag` on `/admin` | `headers()` in `next.config.mjs` |

The client-side `<Seo>` component was removed. There is one source for every head tag.

## Environment

`.env` keeps the `VITE_*` names; `next.config.mjs` maps them to `NEXT_PUBLIC_*`.
Only values that were already public in the Vite bundle are mapped (Supabase URL
+ anon key, webhook URLs). Server-side reads use the same anon key
(`src/lib/serverData.js`, `import 'server-only'`). No service-role key is used
anywhere.

`RENEW_OFFLINE=1` (`npm run build:offline` / `start:offline`) blanks the
Supabase config for server and browser: pages render from `src/data`, and lead
forms become a local dry run that sends nothing.

## Cloudflare deployment

The app runs on Cloudflare Workers through the OpenNext adapter
(`@opennextjs/cloudflare`, config in `open-next.config.ts`, Worker config in
`wrangler.toml`). The Workers Builds settings stay as they were:

- Build command: `npm run build` — runs `next build`, converts the output into
  `.open-next/`, then copies the prerendered pages into the static assets
  (`opennextjs-cloudflare populateCache local`, a local file copy).
- Deploy command: `npx wrangler deploy`

Required settings in the Cloudflare dashboard (Worker → Settings):

- **Build variables:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (already
  used by the old build), optionally `META_PIXEL_ID`.
- **Runtime secrets:** `SUPABASE_URL`, `SUPABASE_ANON_KEY` (already set for the
  old Worker; used when a new post/doctor page is rendered on request).

Test the real Worker locally before pushing:

```bash
RENEW_OFFLINE=1 npm run build     # offline: no Supabase calls
npx wrangler dev --local           # http://localhost:8787, local workerd
```

The Worker is ~1.9 MB gzipped (under the 3 MB Workers Free limit).

### Fresher HTML (optional)

Prerendered pages live in Workers static assets, which are read-only, so the
server HTML only changes on deploy. For true incremental regeneration, create
an R2 bucket, switch `open-next.config.ts` to the R2 incremental cache, add the
bucket + `WORKER_SELF_REFERENCE` bindings to `wrangler.toml`
(https://opennext.js.org/cloudflare/caching), and put
`export const revalidate = 300` back on the data-driven pages.

## Known limitations

- Bengali articles: `<html lang>` is `en` site-wide; the article body carries
  `lang="bn"`. A per-page `<html lang>` needs a separate root layout.
- Admin edits to an existing post or doctor reach crawlers on the next deploy
  (visitors see listing updates immediately via the browser refresh).
- Two static blog posts share a title ("genetic-testing-in-ivf",
  "the-power-of-genetics-in-ivf") — a content issue, unchanged.
