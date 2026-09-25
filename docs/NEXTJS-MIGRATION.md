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
| `/` | SSG + ISR 5 min | admin FAQs, latest posts |
| `/doctors`, `/doctor/[slug]` (58) | SSG + ISR 5 min, new slugs on demand | Supabase `doctors` (static fallback) |
| `/locations/[slug]` | SSG + ISR 5 min | clinic doctors from the live list |
| `/success-stories` | SSG + ISR 5 min | Supabase `testimonials` |
| `/blogs`, `/blogs/[slug]` (132) | SSG + ISR 5 min, new slugs on demand | blog directory (Supabase + `public/blog-content`) |
| `/*.xml` sitemaps | route handlers, ISR 5 min | blog directory + doctor list |
| `/admin/*` | client-only (no SSR), separate chunk | Supabase Auth + SDK |

Nothing public is rendered per request except the first hit of a slug that
did not exist at build time.

## Where the old Worker's responsibilities went

| `src/worker.js` (deleted) | Now |
|---|---|
| Per-route `<title>`, description, canonical, robots, OG/Twitter rewritten into `<head>` | Next metadata (`generateMetadata`) from `src/lib/seoRoutes.js` via `src/lib/nextSeo.js` |
| Blog JSON-LD in `<head>` | `<JsonLd>` rendered in the page HTML (`src/components/JsonLd.js`) |
| 404 status + `noindex` for unknown URLs | `notFound()` / `dynamicParams = false` → real 404 with `noindex` |
| 410 for retired WordPress URLs | `src/proxy.js` |
| 301 for retired duplicates (RH-02) and legacy blog paths | `src/proxy.js` (same maps: `seoDuplicates.js`, `seoRoutes.js`) |
| 301 trailing slash | `src/proxy.js` (`skipTrailingSlashRedirect` in `next.config.mjs`) |
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

## Cloudflare deployment (not done)

Nothing was deployed and no Cloudflare configuration was changed. To deploy the
Next.js build to Cloudflare Workers:

1. `npm install -D @opennextjs/cloudflare wrangler`
2. Add `open-next.config.mjs` with an incremental cache (R2 or KV) so ISR works:
   without one, regenerated pages are not persisted between Worker instances.
3. Replace `wrangler.toml` (it still points at the deleted `src/worker.js` and
   `./build`) with the OpenNext config: `main = ".open-next/worker.js"`,
   `[assets] directory = ".open-next/assets"`, `compatibility_flags = ["nodejs_compat"]`.
4. Set `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` (or the
   `VITE_*` names) as build-time variables, and `SUPABASE_URL` /
   `SUPABASE_ANON_KEY` as Worker secrets for runtime revalidation.
5. `npx opennextjs-cloudflare build && npx opennextjs-cloudflare preview` locally,
   re-run the raw-HTML crawler checks, then deploy.
6. Delete `scripts/prepare-cloudflare-worker-build.mjs` (Vite-only).

Note: `/blogs/<slug>` for the WordPress-imported posts reads
`public/blog-content/<slug>.html` from disk. That happens at build time; on ISR
revalidation inside a Worker the read can fail, in which case the page throws
and the last good version keeps being served (by design, `src/lib/serverData.js`).

## Known limitations

- Bengali articles: `<html lang>` is `en` site-wide; the article body carries
  `lang="bn"`. A per-page `<html lang>` needs a separate root layout.
- Admin publishes appear on public pages within 5 minutes (ISR), not instantly.
  On-demand `revalidatePath` from the admin panel would make it immediate.
- Two static blog posts share a title ("genetic-testing-in-ivf",
  "the-power-of-genetics-in-ivf") — a content issue, unchanged.
